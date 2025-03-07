import path from 'path';
import { defineUserConfig } from 'vuepress-vite';
import type { DefaultThemeOptions, ViteBundlerOptions } from 'vuepress-vite';
import sidebar from './sidebar';

const config = defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
	bundler: '@vuepress/vite',
	templateDev: path.join(__dirname, 'templates', 'index.dev.html'),
	templateSSR: path.join(__dirname, 'templates', 'index.ssr.html'),
	lang: 'ko-KR',
	title: 'Discord.js 가이드',
	description: '여러분의 discord.js 봇을 위해 무한한 가능성을 펼칠 수 있는 가이드를 만나보세요',
	head: [
		['meta', { charset: 'utf-8' }],
		['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
		['link', { rel: 'icon', href: '/favicon.png' }],
		['meta', { name: 'theme-color', content: '#3eaf7c' }],
		['meta', { name: 'twitter:card', content: 'summary' }],
		['meta', { property: 'og:title', content: 'Discord.js 한국어 가이드' }],
		['meta', { property: 'og:description', content: '여러분의 discord.js 봇을 위해 무한한 가능성을 펼칠 수 있는 가이드를 만나보세요' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:url', content: 'discordjs-korean-guide.netlify.app/' }],
		['meta', { property: 'og:locale', content: 'ko_KR' }],
		['meta', { property: 'og:image', content: '/meta-image.png' }],
	],
	theme: path.join(__dirname, 'theme', 'index.ts'),
	themeConfig: {
		contributors: false,
		sidebar,
		repo: 'coding-1ab/korean-guide',
		docsDir: 'guide',
		sidebarDepth: 3,
		editLinks: true,
		lastUpdated: true,
		navbar: [
			{
				text: 'Voice',
				link: '/voice/',
			},
			{
				text: '문서',
				link: 'https://discord.js.org/#/docs/main/stable/general/welcome',
			},
		],
		themePlugins: {
			mediumZoom: false,
		},
	},
	plugins: [],
});

const { ALGOLIA_DOCSEARCH_API_KEY, GOOGLE_ANALYTICS_ID, NODE_ENV } = process.env;

if (NODE_ENV === 'production' && ALGOLIA_DOCSEARCH_API_KEY && GOOGLE_ANALYTICS_ID) {
	config.plugins.push(
		[
			'@vuepress/plugin-docsearch',
			{
				apiKey: ALGOLIA_DOCSEARCH_API_KEY,
				indexName: 'discordjs',
				placeholder: 'Search guide',
			},
		],
		[
			'@vuepress/plugin-google-analytics',
			{ id: GOOGLE_ANALYTICS_ID },
		],
	);
}

export default config;
