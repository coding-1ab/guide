
# 명령어 핸들링

봇이 어느 정도 커지면, 파일 하나에 모든 명령어를 엄청 많은 `if`/`else if`로 처리하는 것은 좋지 않아요. 봇에 새 기능을 적용하고 개발을 훨씬 쉽게 하려면 명령어 핸들러를 적용해야 해요. 그럼 지금 해 봐요!

다음 파일과 코드를 기본으로 시작합니다:

:::: code-group
::: code-group-item index.js

```js
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('준비 완료!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'beep') {
		await interaction.reply('Boop!');
	}
});

client.login(token);
```

:::
::: code-group-item deploy-commands.js

```sh:no-line-numbers
npm i --save @discordjs/rest discord-api-types
```

```js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [];

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('성공적으로 /명령어를 등록했어요.');
	} catch (error) {
		console.error(error);
	}
})();
```

:::
::: code-group-item config.json

```json
{
	"clientId": "123456789012345678",
	"guildId": "876543210987654321",
	"token": "여기에 토큰 입력"
}
```

:::
::::

## 각 명령어별 파일

프로젝트 폴더는 이렇게 되어 있을 거에요:

```:no-line-numbers
discord-bot/
├── node_modules
├── config.json
├── deploy-commands.js
├── index.js
├── package-lock.json
└── package.json
```

모든 명령어를 저장할 `commands` 폴더를 만드세요.

/명령어 데이터를 빌드하기 위해 [`@discordjs/builders`](https://github.com/discordjs/builders) 패키지를 사용할 것이기 때문에 터미널을 열고 설치합니다:

```sh:no-line-numbers
npm i --save @discordjs/builders
```

다음으로, ping 명령어에 대한 `commands/ping.js` 파일을 만드세요:

```js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong!으로 대답'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
```

나머지 명령어도 똑같이 할 수 있어요. 각 명령어별로 실행할 코드를 `execute()` 부분에 넣으면 돼요.

::: tip
[`module.exports`](https://nodejs.org/api/modules.html#modules_module_exports) 는 Node.js에서 데이터를 내보내고 다른 파일에서 [`require()`](https://nodejs.org/api/modules.html#modules_require_id)할 수 있는 방법이에요.

명령어 파일 안에서 client에 접근해야 한다면 `interaction.client`를 이용하면 돼요. 외부 파일이나 패키지 등을 사용하려면 `require()`를 파일 맨 위에 넣어주세요.
:::

## 명령어 파일 읽기

`index.js` 파일에서 아래 내용을 추가해주세요:

```js {1-2,7}
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
```

::: tip
[`fs`](https://nodejs.org/api/fs.html)는 Node.js의 기본 파일 시스템 모듈입니다. <DocsLink section="collection" path="class/Collection" /> 은 JavaScript의 기본 [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 클래스를 확장하며, 유용한 추가 기능을 포함합니다.
:::

다음 단계는 동적으로 명령어 파일을 가져오는 것입니다. [`fs.readdirSync()`](https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options) 함수는 특정 폴더 안에 있는 모든 파일의 이름으로 이루어진 배열을 리턴합니다. (예시: `['ping.js', 'beep.js']`) 명령어 파일만 리턴되도록 하기 위해 `Array.filter()` 함수를 사용해서 JavaScript 파일을 제외한 모든 파일을 배열에서 제거합니다. 이 배열 안에서 반복하여 `client.commands`에 명령어를 동적으로 추가합니다.

```js {2,4-9}
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Collection에 새 항목을 추가합니다.
	// 이때 키는 명령어 이름이고 값은 export한 모듈입니다.
	client.commands.set(command.data.name, command);
}
```

 `deploy-commands.js` 파일에서도 비슷하게 하되, 대신 `commands` 배열에 각 명령어에 대한 JSON 데이터를 `.push()`합니다. 
```js {1,7,9-12}
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}
```

## 동적으로 명령어 실행하기

이제 `client.commands` Collection에서 명령어를 가져와서 실행할 수 있어요! `interactionCreate` 이벤트 안에서 `if`/`else if`를 지우고 아래 코드로 바꿔주세요:

```js {4-13}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: '명령어를 실행하는 동안 에러가 발생했어요.', ephemeral: true });
	}
});

```

먼저 Collection에서 입력한 명령어의 이름에 해당하는 명령어를 가져와서 `command` 변수에 할당합니다. 명령어가 없으면 `undefined`를 리턴하기 때문에, 이 경우 `return`을 통해 나머지 코드를 실행하지 않습니다. 명령어가 존재한다면 그 명령어의 `.execute()` 함수를 실행하면서 `interaction` 변수를 파라미터로 넘깁니다. 뭔가가 잘못되면 에러를 로그하고 명령어를 실행한 멤버에게 그 사실을 알립니다.

그러면 끝이에요! 새 명령어를 추가하려면 `commands` 폴더 안에 새 파일을 만들고, 이름을 /명령어랑 똑같이 정하고, 나머지는 다른 명령어에서 했던 것처럼 하면 돼요. 명령어를 등록하기 위해 `node deploy-commands.js` 를 실행하는 것을 잊지 마세요!

## 결과 코드

<ResultingCode />
