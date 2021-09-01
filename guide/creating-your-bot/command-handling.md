# 명령어 만들기

::: 팁
이 페이지는 [이전 페이지](/creating-your-bot/)의 코드를 기반으로 합니다.
:::

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping!</DiscordInteraction>
		</template>
		pong!
	</DiscordMessage>
</DiscordMessages>

Discord를 통해 개발자는 [슬래시 커맨드](https://discord.com/developers/docs/interactions/application-commands)을 등록할 수 있으며, 이는 사용자에게 애플리케이션과 직접 상호작용할 수 있는 최고 수준의 방법을 제공합니다. 명령에 응답하게 만드려면 먼저 명령을 등록해야 합니다.

## 명령어 등록

이 섹션에서는 시작하는 데 필요한 최소한의 내용만 다루지만 자세한 내용은 [슬래시 명령 등록에 대한 자세한 페이지](/interactions/registering-slash-commands.md)를 참조하세요. 길드 명령, 전역 명령, 옵션, 옵션 유형 및 선택 사항을 다룹니다.

### Command deployment script

프로젝트 디렉토리에 `deploy-commands.js` 파일을 만듭니다. 이 파일은 봇 애플리케이션에 대한 슬래시 명령을 등록하고 업데이트하는 데 사용됩니다.

먼저, [`@discordjs/builders`](https://github.com/discordjs/builders), [`@discordjs/rest`](https://github.com/discordjs/discord.js-modules/blob/main/packages/rest/), 그리고 [`discord-api-types`](https://github.com/discordjs/discord-api-types/)를 설치해야 합니다.

```sh:no-line-numbers
npm install @discordjs/builders @discordjs/rest discord-api-types
```
다음은 사용할 수 있는 배포 스크립트입니다. 다음 변수에 중점을 둡니다.

- `clientId`: 클라이언트의 id
- `guildId`: 개발하고 테스트 할 서버의 id
- `commands`: 등록할 명령의 리스트. `@discordjs/builders` 의 [슬래시 명령 빌더](/popular-topics/builders.md#slash-command-builders)는 명령에 대한 데이터를 빌드하는 데 사용됩니다.

::: 팁
클라이언트 및 서버 ID를 얻으려면 Discord를 열고 설정으로 이동하십시오. "고급" 페이지에서 "개발자 모드"를 켭니다. 이렇게 하면 서버 아이콘, 사용자 프로필 등을 마우스 오른쪽 버튼으로 클릭할 때 우클릭 메뉴에서 "ID 복사" 버튼이 활성화됩니다.
:::

:::: 코드 모음
::: code-group-item deploy-commands.js
```js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('pong! 이라고 대답합니다'),
	new SlashCommandBuilder().setName('server').setDescription('유저의 정보와 함께 대답합니다'),
	new SlashCommandBuilder().setName('user').setDescription('서버의 정보와 함께 대답합니다'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('애플리케이션 커맨드를 정상적으로 등록했습니다');
	} catch (error) {
		console.error(error);
	}
})();
```
:::
::: code-group-item config.json
```json {2-3}
{
	"clientId": "클라이언트 id",
	"guildId": "서버 id",
	"token": "토큰-붙여넣기"
}
```
:::
::::

이 값을 채우고 나면 프로젝트 디렉토리에서 `node deploy-commands.js` 를 실행하여 단일 서버에 명령을 등록합니다. [전역적으로 명령 등록](/interactions/registering-slash-commands.md#global-commands)도 가능합니다.

::: 팁
`node deploy-commands.js`는 한 번만 실행하면 됩니다. 기존 명령을 추가하거나 편집하는 경우에만 다시 실행해야 합니다.
:::

## Replying to commands

Once you've registered your commands, you can listen for interactions via <DocsLink path="class/Client?scrollTo=e-interactionCreate" /> in your `index.js` file.

You should first check if an interation is a command via <DocsLink path="class/Interaction?scrollTo=isCommand" type="method">`.isCommand()`</DocsLink>, and then check the <DocsLink path="class/CommandInteraction?scrollTo=commandName">`.commandName`</DocsLink> property to know which command it is. You can respond to interactions with <DocsLink path="class/CommandInteraction?scrollTo=reply">`.reply()`</DocsLink>.

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
		await interaction.reply('Server info.');
	} else if (commandName === 'user') {
		await interaction.reply('User info.');
	}
});

client.login(token);
```

### Server info command

Note that servers are referred to as "guilds" in the Discord API and discord.js library. `interaction.guild` refers to the guild the interaction was sent in (a <DocsLink path="class/Guild" /> instance), which exposes properties such as `.name` or `.memberCount`.

```js {9}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply('User info.');
	}
});
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">server</DiscordInteraction>
		</template>
		Server name: Discord.js Guide
		<br />
		Total members: 2
	</DiscordMessage>
</DiscordMessages>

You could also display the date the server was created, or the server's verification level. You would do those in the same manner–use `interaction.guild.createdAt` or `interaction.guild.verificationLevel`, respectively.

::: tip
Refer to the <DocsLink path="class/Guild" /> documentation for a list of all the available properties and methods!
:::

### User info command

A "user" refers to a Discord user. `interaction.user` refers to the user the interaction was sent by (a <DocsLink path="class/User" /> instance), which exposes properties such as `.tag` or `.id`.

```js {11}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
});
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">user</DiscordInteraction>
		</template>
		Your tag: User#0001
		<br />
		Your id: 123456789012345678
	</DiscordMessage>
</DiscordMessages>

::: tip
Refer to the <DocsLink path="class/User" /> documentation for a list of all the available properties and methods!
:::

And there you have it!

## The problem with `if`/`else if`

If you don't plan on making more than a couple commands, then using an `if`/`else if` chain is fine; however, this isn't always the case. Using a giant `if`/`else if` chain will only hinder your development process in the long run.

Here's a small list of reasons why you shouldn't do so:

* Takes longer to find a piece of code you want;
* Easier to fall victim to [spaghetti code](https://en.wikipedia.org/wiki/Spaghetti_code);
* Difficult to maintain as it grows;
* Difficult to debug;
* Difficult to organize;
* General bad practice.

Next, we'll be diving into something called a "command handler"–code that makes handling commands easier and much more efficient. This allows you to move your commands into individual files.

## Resulting code

<ResultingCode />
