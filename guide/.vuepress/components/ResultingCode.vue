<template>
	<p>
		지금까지 만들어온 코드를 비교해보고 싶으시다면,
		<a :href="githubLink" target="_blank" rel="noopener noreferrer">이 깃헙 리포지토리 <OutboundLink /></a>
		에서 확인하실 수 있습니다.
	</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePageData } from '@vuepress/client';

const codeSamplesURL = 'https://github.com/discordjs/guide/tree/main/code-samples/';

const props = defineProps({
	path: String,
});

const githubLink = ref(codeSamplesURL);
const page = usePageData();

onMounted(() => {
	githubLink.value += props.path || page?.value.path.slice(1).replace('.html', '');
});
</script>
