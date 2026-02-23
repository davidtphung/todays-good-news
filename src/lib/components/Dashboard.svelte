<script lang="ts">
	import type { Story, DailyDigest as DigestType, StoryCategory } from '$lib/types/story.js';
	import type { HistoryEvent } from '$lib/utils/history.js';
	import { PANELS } from '$lib/config.js';
	import { panels } from '$lib/stores/panels.svelte.js';
	import { stories } from '$lib/stores/stories.svelte.js';
	import Panel from './Panel.svelte';
	import StoryCard from './StoryCard.svelte';
	import GlobeMap from './GlobeMap.svelte';
	import TrendingTopics from './TrendingTopics.svelte';
	import DailyDigest from './DailyDigest.svelte';
	import Ticker from './Ticker.svelte';
	import TodayInHistory from './TodayInHistory.svelte';

	interface Props {
		initialStories: Record<string, Story[]>;
		digest: DigestType | null;
		geoStories: Story[];
		history: { events: HistoryEvent[]; dateLabel: string };
	}

	let { initialStories, digest, geoStories, history }: Props = $props();

	// Initialize stores
	$effect(() => {
		stories.setStories(initialStories);
		panels.init();
	});

	const allStories = $derived(Object.values(initialStories).flat());

	// Panels excluding digest and history (rendered in the top-right section)
	const gridPanels = $derived(
		panels.visible.filter((l) => l.id !== 'digest' && l.id !== 'history')
	);

	const showDigest = $derived(panels.visible.some((l) => l.id === 'digest'));
	const showHistory = $derived(panels.visible.some((l) => l.id === 'history'));
</script>

<!-- ESPN-style ticker at the top -->
<Ticker stories={allStories} />

<!-- Top-right digest + history section -->
{#if showDigest || showHistory}
	<div class="border-b border-white/10 bg-surface-raised/50">
		<div class="mx-auto grid max-w-[1800px] grid-cols-1 gap-spacing-4 p-spacing-8 md:grid-cols-2 md:p-spacing-16">
			{#if showDigest}
				{@const digestConfig = PANELS.find((p) => p.id === 'digest')}
				{@const digestLayout = panels.visible.find((l) => l.id === 'digest')}
				{#if digestConfig && digestLayout}
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
				{@const historyConfig = PANELS.find((p) => p.id === 'history')}
				{@const historyLayout = panels.visible.find((l) => l.id === 'history')}
				{#if historyConfig && historyLayout}
					<Panel config={historyConfig} layout={{ ...historyLayout, width: 2 }} storyCount={0}>
						<TodayInHistory events={history.events} dateLabel={history.dateLabel} />
					</Panel>
				{/if}
			{/if}
		</div>
	</div>
{/if}

<!-- Main panel grid -->
<div class="grid grid-cols-1 gap-spacing-4 p-spacing-8 md:grid-cols-2 lg:grid-cols-4 md:p-spacing-16">
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
						<div class="flex items-center justify-center py-spacing-32">
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
