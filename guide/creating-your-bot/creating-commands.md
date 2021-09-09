# 명령어 만들기

::: tip
이 페이지에서 다루는 내용은 [이전 페이지](/creating-your-bot/)와 이어집니다.
:::

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

Discord는 개발자들에게 [슬래쉬 명령어](https://discord.com/developers/docs/interactions/application-commands)라고 불리는, 여러분의 어플리케이션과 유저가 직접 상호작용 할 수 있는 가장 효과적인 방법을 등록하고 사용할 수 있는 기능을 제공합니다. 명령어에 응답하기 전에, 먼저 명령어를 등록해야겠죠?

## 명령어 등록하기

이 단락은 시작하기 위해 필요한 가장 최소한의 부분만 다룹니다, 하지만 나중에 더 자세한 정보를 위해 [슬래쉬 명령어 등록에 대한 깊은 설명](/interactions/registering-slash-commands.md) 문서가 준비되어 있답니다. 저 문서는 서버 명령어, 전역 명령어, 선택적 기능, 선택적 타입, 그리고 선택 기능 등을 다룹니다.

### 명령어 배포 스크립트

여러분의 프로젝트 폴더 안에 `deploy-commands.js` 파일을 만드세요. 이 파일은 여러분의 슬래쉬 명령어들을 등록하고 수정하는 데 사용됩니다.

또, [`@discordjs/builders`](https://github.com/discordjs/builders), [`@discordjs/rest`](https://github.com/discordjs/discord.js-modules/blob/main/packages/rest/), and [`discord-api-types`](https://github.com/discordjs/discord-api-types/) 패키지들을 설치해 주세요.

```sh:no-line-numbers
npm install @discordjs/builders @discordjs/rest discord-api-types
```

아래는 여러분이 사용할 수 있는 배포 스크립트들 입니다. 각 변수들에 주목해 보세요:

-   `clientId`: 여러분의 클라이언트 ID
-   `guildId`: 배포 서버 ID
-   `commands`: 등록할 명령어들의 배열입니다. `@discordjs/builders`의 [슬래쉬 명령어 빌더](/popular-topics/builders.md#slash-command-builders)는 이 데이터들을 명령어로 빌드하는 데 사용됩니다.

::: tip
클라이언트와 서버의 ID를 얻으려면, Discord앱을 열고 설정 화면으로 가세요. "고급" 탭에서, "개발자 모드"를 켜세요. 이 옵션을 켜면 이제 서버 아이콘, 유저 프로필 등을 우클릭 했을 때 "ID 복사하기" 버튼이 표시될 거에요
:::

:::: code-group
::: code-group-item deploy-commands.js
```js{4,6-11}
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('명령어 등록을 성공적으로 완료했습니다.');
	} catch (error) {
		console.error(error);
	}
})();
```
:::
::: code-group-item config.json
```json {2-3}
{
	"clientId": "123456789012345678",
	"guildId": "876543210987654321",
	"token": "여러분의 토큰을 입력하세요"
}
```
:::
::::

이 값들을 모두 채웠다면, 명령어들을 서버에 등록하기 위해 `node deploy-commands.js` 를 실행해 주세요. 또는 [명령어를 전역으로 등록하기](/interactions/registering-slash-commands.md#global-commands)도 가능하답니다!

::: tip
`node deploy-commands.js` 명령어는 딱 한 번만 실행하면 됩니다. 이 명령어는 여러분이 명령어를 추가하거나 수정할 때 한번씩만 실행해 주면 된답니다!
:::

## 명령어에 응답하기

명령어 등록을 끝냈다면, `index.js` 파일에서 <DocsLink path="class/Client?scrollTo=e-interactionCreate" /> 를 통해 명령어를 수신할 수 있습니다.

여러분은 먼저 수신된 반응이 명령어인지 <DocsLink path="class/Interaction?scrollTo=isCommand" type="method">`.isCommand()`</DocsLink>를 사용해 확인해야 합니다. 그리고 어떤 명령어가 불려진 것인지 확인하기 위해 <DocsLink path="class/CommandInteraction?scrollTo=commandName">`.commandName`</DocsLink> 속성을 사용하세요. 마지막으로, <DocsLink path="class/CommandInteraction?scrollTo=reply">`.reply()`</DocsLink>를 사용해 답장을 보낼 수 있습니다.

```js {5-17}
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply('서버 정보.');
	} else if (commandName === 'user') {
		await interaction.reply('유저 정보.');
	}
});

client.login(token);
```

### 서버 정보 명령어

Discord API 및 discord.js 에서는 서버가 "guilds" 라고 불려진다는 점을 주의하세요. `interaction.guild` 속성은 메세지가 보내진 서버 객체(<DocsLink path="class/Guild" />)를 나타내는데, 이 객체는 `.name` 이나 `.memberCount` 같이 서버에 대한 유용한 속성을 가지고 있습니다.

```js {9}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`서버 이름: ${interaction.guild.name}\n총 멤버수: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply('유저 정보.');
	}
});
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">server</DiscordInteraction>
		</template>
		서버 이름: Discord.js Guide
		<br />
		총 멤버수: 2
	</DiscordMessage>
</DiscordMessages>

또한 여러분은 서버가 생성된 날짜를 표시하거나, 서버의 인증 수준을 보여 줄 수도 있습니다. 필요한 데이터는 각각 `interaction.guild.createdAt` 나 `interaction.guild.verificationLevel` 등과 같은 방식으로 얻을 수 있습니다.

::: tip
<DocsLink path="class/Guild" /> 문서에서 사용 가능한 더 많은 속성과 메서드 목록을 찾아 보세요!
:::

### 유저 정보 명령어

"user"는 Discord의 사용자 계정을 말합니다. `interaction.user`(<DocsLink path="class/User" />) 는 이 메세지가 어느 유저에게서 보내졌는지를 표시합니다. 이 유저 객체는 `.tag` 또는 `.id` 등의 속성을 가지고 있지요.

```js {11}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`서버 이름: ${interaction.guild.name}\n총 멤버수: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`당신의 태그: ${interaction.user.tag}\n당신의 id: ${interaction.user.id}`);
	}
});
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">user</DiscordInteraction>
		</template>
		당신의 태그: User#0001
		<br />
		당신의 id: 123456789012345678
	</DiscordMessage>
</DiscordMessages>

::: tip
<DocsLink path="class/User" /> 문서에서 유저 객체에 대한 사용 가능한 더 많은 속성과 메서드 목록을 찾아 보세요!
:::

...이제 여러분이 마음껏 수정해 보세요!

## `if`/`else if` 를 사용할 때의 문제

만약 여러분이 더이상 또 다른 명령어들을 추가할 계획이 없다면, `if`/`else if` 만 사용해도 문제는 없습니다; 하지만, 항상 그런 것은 아닙니다. 길게 이어진 `if`/`else if` 문을 사용하는 것은 장기적으로 볼 때 여러분의 개발 과정을 위해 결코 좋지 않습니다.

왜 여러분이 아까처럼 if/else를 그대로 사용하면 안 될까요:

* 코드에서 여러분이 원하는 부분을 찾기 힘들어 집니다;
* [스파게티 코드](https://en.wikipedia.org/wiki/Spaghetti_code)의 희생양이 될 수 있습니다;
* 코드가 커질수록 유지보수하기 힘들어 집니다;
* 디버깅하기 힘들어 집니다;
* 정리하기 힘들어 집니다;
* 안 좋은 습관을 들일 수 있습니다.

다음으로, 우리는 "command handler" 라고 불리는, 명령어 핸들링을 쉽고 효과적으로 만들어 주는 기능에 대해 알아 볼 겁니다. 이 기능은 여러분의 명령어 코드를 여러 파일로 나누는 데 도움을 줄 겁니다.

## 결과 코드

<ResultingCode />
