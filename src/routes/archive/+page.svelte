<script lang="ts">
	import type { Story } from '$lib/types/story.js';
	import StoryCard from '$lib/components/StoryCard.svelte';
	import { PANELS } from '$lib/config.js';

	let { data } = $props();

	const categories = PANELS.filter((p) => p.category).map((p) => ({
		id: p.category!,
		title: p.title
	}));
</script>

<svelte:head>
	<title>{data.selectedDate ? `Archive — ${data.selectedDateLabel}` : 'Archive'} — Good News Today</title>
</svelte:head>

<div class="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-lg font-bold uppercase tracking-tight text-gray-50">Archive</h1>
			<p class="mt-1 text-xs text-white/40">Browse past days of good news</p>
		</div>
		<a
			href="/"
			class="text-xs text-white/40 transition-all duration-150 hover:text-white/70"
		>
			Back to Today
		</a>
	</div>

	{#if data.selectedDate && data.selectedStories}
		<!-- Selected day detail view -->
		<div class="mb-6">
			<div class="flex items-center gap-3">
				<a
					href="/archive"
					class="text-xs text-white/40 transition-all duration-150 hover:text-white/70"
				>
					All Dates
				</a>
				<span class="text-white/10">/</span>
				<span class="text-sm text-gray-50">{data.selectedDateLabel}</span>
				{#if data.selectedDate === data.today}
					<span class="rounded-sm bg-positive/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-positive">Today</span>
				{/if}
			</div>
		</div>

		<!-- Stories grid for selected day -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each categories as cat}
				{@const stories = data.selectedStories[cat.id] ?? []}
				{#if stories.length > 0}
					<div class="rounded-sm border border-white/10 bg-surface-raised">
						<div class="border-b border-white/10 px-4 py-2">
							<h3 class="text-xs font-medium uppercase tracking-wider text-white/50">{cat.title}</h3>
						</div>
						<div class="divide-y divide-white/5 px-4 py-1">
							{#each stories as story (story.id)}
								<StoryCard {story} />
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		</div>

	{:else}
		<!-- Archive index: list of past days -->
		<div class="space-y-1">
			{#each data.archive as day (day.date)}
				<a
					href="/archive?date={day.date}"
					class="group flex items-start gap-4 rounded-sm border border-white/5 bg-surface-raised px-4 py-3 transition-all duration-150 hover:border-white/10 hover:bg-surface-overlay"
				>
					<!-- Date -->
					<div class="flex-shrink-0 w-40">
						<div class="text-sm text-gray-50 group-hover:text-white transition-colors duration-150">
							{day.dateLabel}
						</div>
						{#if day.date === data.today}
							<span class="mt-1 inline-block rounded-sm bg-positive/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-positive">Today</span>
						{/if}
					</div>

					<!-- Story count -->
					<div class="flex-shrink-0 w-16 text-right">
						<span class="text-xs tabular-nums text-white/40">{day.storyCount} stories</span>
					</div>

					<!-- Top stories preview -->
					<div class="flex-1 min-w-0">
						<div class="flex flex-wrap gap-x-3 gap-y-1">
							{#each day.topStories.slice(0, 3) as story}
								<span class="text-xs text-white/30 truncate max-w-[300px]">{story.title}</span>
							{/each}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
