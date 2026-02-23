<script lang="ts">
	import type { Story, DailyDigest as DigestType, StoryCategory } from '$lib/types/story.js';
	import type { HistoryEvent } from '$lib/utils/history.js';
	import type { DailyQuote as QuoteType } from '$lib/utils/quotes.js';
	import type { DailyVideo as VideoType } from '$lib/utils/videos.js';
	import { PANELS } from '$lib/config.js';
	import { panels } from '$lib/stores/panels.svelte.js';
	import { stories } from '$lib/stores/stories.svelte.js';
	import { onMount } from 'svelte';
	import Panel from './Panel.svelte';
	import StoryCard from './StoryCard.svelte';
	import GlobeMap from './GlobeMap.svelte';
	import TrendingTopics from './TrendingTopics.svelte';
	import DailyDigest from './DailyDigest.svelte';
	import Ticker from './Ticker.svelte';
	import TodayInHistory from './TodayInHistory.svelte';
	import DailyVideo from './DailyVideo.svelte';
	import DailyQuote from './DailyQuote.svelte';

	interface Props {
		initialStories: Record<string, Story[]>;
		digest: DigestType | null;
		geoStories: Story[];
		history: { events: HistoryEvent[]; dateLabel: string };
		quote: QuoteType;
		video: VideoType;
	}

	let { initialStories, digest, geoStories, history, quote, video }: Props = $props();

	let mounted = $state(false);

	onMount(() => {
		stories.setStories(initialStories);
		panels.init();
		mounted = true;
	});

	const allStories = $derived(Object.values(initialStories).flat());

	// Use the static config for SSR, switch to reactive store after mount
	const visiblePanels = $derived(
		mounted
			? panels.visible
			: PANELS.filter((p) => p.visible).map((p) => ({
					id: p.id,
					visible: p.visible,
					order: p.order,
					width: p.defaultWidth as 1 | 2 | 4
				}))
	);

	// Top section panels: digest, history, video, quote
	const topPanelIds = ['digest', 'history', 'video', 'quote'] as const;

	const gridPanels = $derived(
		visiblePanels.filter((l) => !topPanelIds.includes(l.id as typeof topPanelIds[number]))
	);

	const showDigest = $derived(visiblePanels.some((l) => l.id === 'digest'));
	const showHistory = $derived(visiblePanels.some((l) => l.id === 'history'));
	const showVideo = $derived(visiblePanels.some((l) => l.id === 'video'));
	const showQuote = $derived(visiblePanels.some((l) => l.id === 'quote'));

	const hasTopSection = $derived(showDigest || showHistory || showVideo || showQuote);

	const digestConfig = PANELS.find((p) => p.id === 'digest')!;
	const historyConfig = PANELS.find((p) => p.id === 'history')!;
	const videoConfig = PANELS.find((p) => p.id === 'video')!;
	const quoteConfig = PANELS.find((p) => p.id === 'quote')!;
</script>

<!-- ESPN-style ticker at the top -->
<Ticker stories={allStories} />

<!-- Top section: Digest + History + Video + Quote -->
{#if hasTopSection}
	<div class="border-b border-white/10 bg-surface-raised/50">
		<div class="mx-auto grid max-w-[1800px] grid-cols-1 gap-1 p-2 md:grid-cols-2 md:p-4">
			{#if showDigest}
				{@const digestLayout = visiblePanels.find((l) => l.id === 'digest')}
				{#if digestLayout}
					<Panel config={digestConfig} layout={{ ...digestLayout, width: 2 }} storyCount={0}>
						<DailyDigest
							{digest}
							topStories={allStories
								.filter((s) => s.is_featured)
								.sort((a, b) => b.positivity_score - a.positivity_score)
								.slice(0, 5)}
						/>
					</Panel>
				{/if}
			{/if}
			{#if showHistory}
				{@const historyLayout = visiblePanels.find((l) => l.id === 'history')}
				{#if historyLayout}
					<Panel config={historyConfig} layout={{ ...historyLayout, width: 2 }} storyCount={0}>
						<TodayInHistory events={history.events} dateLabel={history.dateLabel} />
					</Panel>
				{/if}
			{/if}
			{#if showVideo}
				{@const videoLayout = visiblePanels.find((l) => l.id === 'video')}
				{#if videoLayout}
					<Panel config={videoConfig} layout={{ ...videoLayout, width: 2 }} storyCount={0}>
						<DailyVideo {video} />
					</Panel>
				{/if}
			{/if}
			{#if showQuote}
				{@const quoteLayout = visiblePanels.find((l) => l.id === 'quote')}
				{#if quoteLayout}
					<Panel config={quoteConfig} layout={{ ...quoteLayout, width: 2 }} storyCount={0}>
						<DailyQuote {quote} />
					</Panel>
				{/if}
			{/if}
		</div>
	</div>
{/if}

<!-- Main panel grid -->
<div class="grid grid-cols-1 gap-1 p-2 md:grid-cols-2 lg:grid-cols-4 md:p-4">
	{#each gridPanels as layout (layout.id)}
		{@const config = PANELS.find((p) => p.id === layout.id)}
		{#if config}
			<Panel {config} {layout} storyCount={config.category ? (initialStories[config.category]?.length ?? 0) : 0}>
				{#if config.contentType === 'stories' && config.category}
					{@const categoryStories = initialStories[config.category] ?? []}
					{#if categoryStories.length > 0}
						<div class="divide-y divide-white/5">
							{#each categoryStories.slice(0, 20) as story (story.id)}
								<StoryCard {story} />
							{/each}
						</div>
					{:else}
						<div class="flex items-center justify-center py-8">
							<span class="text-xs text-white/20">No stories yet</span>
						</div>
					{/if}
				{:else if config.contentType === 'map'}
					<GlobeMap stories={geoStories} />
				{:else if config.contentType === 'trending'}
					<TrendingTopics stories={allStories} />
				{/if}
			</Panel>
		{/if}
	{/each}
</div>
