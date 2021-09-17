# 이벤트 핸들링

Node.js는 이벤트 기반 설계를 통해 특정 이벤트가 일어나면 특정 코드를 실행할 수 있게 합니다. discord.js 라이브러리는 이를 완전히 활용합니다. <DocsLink path="class/Client" /> docs에서 모든 이벤트의 리스트를 볼 수 있어요.

아래 코드를 기본으로 시작합니다:

```js
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', c => {
	console.log(`준비 완료!${c.user.tag}로 로그인했어요.`);
});

client.on('interactionCreate', interaction => {
	console.log(`${interaction.user.tag} in #${interaction.channel.name} 가 상호작용을 실행했어요.`);
});

client.login(token);
```

지금 모든 이벤트 리스너는 `index.js` 파일에 있어요. `Client`를 사용할 준비가 되었을 때 (로그인되었을 때) <DocsLink path="class/Client?scrollTo=e-ready" />가 실행되고, 상호작용을 받으면 <DocsLink path="class/Client?scrollTo=e-interactionCreate" />가 실행돼요. 이벤트 리스너를 각각의 파일로 옮기는 것은 쉽고, [명령어 핸들링](/creating-your-bot/command-handling.md)과 비슷한 방법을 사용할 거에요.

## 각 이벤트별 파일

프로젝트 폴더는 이런식으로 되어 있을 거에요:

```:no-line-numbers
discord-bot/
├── node_modules
├── config.json
├── index.js
├── package-lock.json
└── package.json
```

`events` 폴더를 같은 폴더에 만드세요. 그러면 `index.js`에 있는 이벤트 리스너를 `events/ready.js`와 `events/interactionCreate.js` 파일로 옮길 수 있어요.

:::: code-group
::: code-group-item events/ready.js
```js
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`준비 완료! ${client.user.tag}로 로그인했어요.`);
	},
};
```
:::
::: code-group-item events/interactionCreate.js
```js
module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`${interaction.user.tag} 가 #${interaction.channel.name}에서 상호작용을 실행했어요.`);
	},
};
```
:::
::::

`name` 속성은 이 파일이 어떤 이벤트에 대한 것인지를 나타내고,`once` 속성은 이 코드를 한 번만 실행할 지 나타내요. `execute` 함수는 해당 이벤트가 일어날 때마다 실행할 코드에요.

## 이벤트 파일 읽기

다음으로, `events` 폴더에서 파일을 동적으로 가져오는 코드를 작성합니다. [명령어 핸들링](/creating-your-bot/command-handling.md)과 비슷한 방법을 사용합니다.

`fs.readdirSync().filter()` 는 지정한 폴더 안에 있는 모든 파일 이름으로 이루어진 배열을 리턴하고 `.js` 파일만 남깁니다. (예시: `['ready.js', 'interactionCreate.js']`)

```js {3,5-12}
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
```

discord.js의 <DocsLink path="class/Client" /> 클래스는 [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) 클래스를 확장합니다. 그러므로 `client` 객체는 이벤트 리스너를 등록하는 데 사용할 수 있는  [`.on()`](https://nodejs.org/api/events.html#events_emitter_on_eventname_listener)과 [`.once()`](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener) 함수를 노출합니다. 이 두 함수는 2개의 파라미터를 갖는데, 첫 번째는 이벤트 이름, 두 번째는 실행할 코드의 콜백 함수입니다.

콜백 함수는 해당 이벤트에서 주어진 파라미터를 가져와서, `...` [rest parameter syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)로 `args`에 모은 다음, `event.execute()`를 실행하며, 이때 `...` [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)를 통해 `args` 배열을 파라미터로 넘깁니다. discord.js의 서로 다른 이벤트가 서로 다른 개수의 파라미터를 가지고 있기 때문에 rest parameter syntax와 spread syntax를 사용합니다. rest parameter는 정해지지 않은 개수의 모든 파라미터를 배열 하나로 모으며 spread syntax는 이 배열의 각 항목을 따로따로 `execute` 함수에 넘깁니다.

이제 다른 이벤트에 대한 리스너를 만드는 것은 `events` 폴더에 새 파일을 만들기만 하면 돼요. 이벤트 핸들러는 봇을 시작할 때마다 자동으로 새 파일을 가져와서 실행하게 돼요.

::: tip
대부분의 경우 다른 파일에서 `client`를 다른 discord.js 객체에서 가져올 수 있어요. (예시: `interactionCreate` 이벤트의 경우 `interaction.client`)
:::

## 결과 코드

<ResultingCode />
