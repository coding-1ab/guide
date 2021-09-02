# 서버에 봇 초대하기

[봇 애플리케이션](/preparations/setting-up-a-bot-application.md)을 만들었다면, 여러분은 곧 봇이 어느 서버에도 없다는 것을 깨달았을 겁니다. 그럼 봇 초대는 어떻게 하는 걸까요?

봇이 여러분의(또는 다른 사람의) 서버에서 활동하는 것을 보기 전에, 봇 애플리케이션의 클라이언트 id를 사용한 고유한 초대 링크를 생성하고, 그 링크를 사용해 봇을 초대해야 합니다.

## 봇 초대 링크

초대 링크는 기본적으로 이렇게 생겼습니다:

```:no-line-numbers
https://discord.com/api/oauth2/authorize?client_id=123456789012345678&permissions=0&scope=bot%20applications.commands
```

이 URL의 구조는 아주 간단합니다:

* `https://discord.com/api/oauth2/authorize` Discord에서 OAuth2 애플리케이션(예를 들면 여러분의 봇)을 서버에 들일 때 인증을 하기 위해 사용되는 기본 형식입니다.
* `client_id=...` 부분은 여러분이 _어떤_ 애플리케이션을 인증하려고 하는지 나타냅니다. 여러분의 봇을 위한 링크로 만들려면 이 부분을 여러분 봇 애플리케이션의 id로 바꿔야겠죠?
* `permissions=...` 은 여러분의 봇이 서버에서 어떤 권한을 가지게 될 것인지 설명합니다.
* `scope=bot%20applications.commands` 는 애플리케이션을 슬래쉬 명령 생성이 가능한 Discord 봇으로써 서버에 추가하겠다는 의미입니다.

::: 경고
만약 "Bot requires a code grant" 라는 에러 메세지를 보게 된다면, 애플리케이션 설정 화면으로 돌아가서 "Require OAuth2 Code Grant" 옵션을 해제하세요. 이 옵션이 뭔지 잘 모르겠다면 가급적 켜지 마세요.
:::

## 초대 링크 만들고 사용하기

초대 링크를 생성하기 위해, "Applications" 단락 아래에 있는 [My Apps](https://discord.com/developers/applications/me) 페이지로 돌아가고, 여러분의 애플리케이션을 클릭해 들어가고, OAuth2 페이지를 여세요.

페이지 하단에서 Discord의 OAuth2 URL 생성기를 찾으세요. `bot`과 `applications.commands`를 선택하세요. `bot` 옵션을 선택하면, 권한 목록이 펼쳐지고, 이 중에서 여러분의 봇이 필요한 권한들을 선택하세요.

선택이 끝났다면 "Copy" 버튼을 눌러 링크를 복사하고 브라우저에서 복사된 링크를 타고 들어가세요. 아마 이런 페이지가 보일 겁니다 (실제로는 여러분의 이름과 아바타가 나올 겁니다):

![봇 인증 페이지](./images/bot-auth-page.png)

여러분이 봇을 추가하고 싶은 서버를 선택하고 "승인"을 누르세요. 봇이 서버를 관리하려면 '서버 관리하기' 권한이 필요합니다. 그리고 나면 멋진 확인 메세지가 표시될 겁니다:

![봇 초대 완료](./images/bot-authorized.png)

축하합니다! 여러분의 첫 봇을 Discord 서버에 초대했습니다! 아마 이렇게 서버의 멤버 목록에서 볼 수 있을 겁니다:

![서버의 멤버 리스트 안에 있는 봇](./images/bot-in-memberlist.png)
