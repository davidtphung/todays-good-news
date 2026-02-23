<script lang="ts">
	import type { Story } from '$lib/types/story.js';

	interface Props {
		stories: Story[];
	}

	let { stories }: Props = $props();

	// Extract trending topics from story titles
	const topics = $derived(() => {
		const wordCount = new Map<string, number>();
		const stopWords = new Set([
			'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
			'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'has', 'have',
			'been', 'that', 'this', 'will', 'can', 'its', 'not', 'new', 'after',
			'more', 'than', 'their', 'over', 'how', 'who', 'what', 'when', 'where'
		]);

		for (const story of stories) {
			const words = story.title
				.toLowerCase()
				.replace(/[^\w\s]/g, '')
				.split(/\s+/)
				.filter((w) => w.length > 3 && !stopWords.has(w));

			for (const word of words) {
				wordCount.set(word, (wordCount.get(word) ?? 0) + 1);
			}
		}

		return [...wordCount.entries()]
			.filter(([, count]) => count >= 2)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 20)
			.map(([word, count]) => ({ word, count }));
	});

	// Category distribution
	const categoryDist = $derived(() => {
		const counts = new Map<string, number>();
		for (const story of stories) {
			counts.set(story.category, (counts.get(story.category) ?? 0) + 1);
		}
		return [...counts.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([category, count]) => ({ category, count }));
	});

	const maxCount = $derived(
		Math.max(...(topics().map((t) => t.count)), 1)
	);
</script>

<div class="space-y-spacing-16">
	<!-- Topic cloud -->
	<div>
		<h3 class="mb-spacing-8 text-xs uppercase tracking-wider text-white/30">Trending Words</h3>
		<div class="flex flex-wrap gap-spacing-4">
			{#each topics() as topic}
				{@const opacity = 0.2 + (topic.count / maxCount) * 0.8}
				<span
					class="rounded-full bg-white/5 px-2.5 py-1 text-xs transition-opacity duration-150 hover:bg-white/10"
					style="opacity: {opacity}"
				>
					{topic.word}
					<span class="ml-1 text-white/30">{topic.count}</span>
				</span>
			{/each}
			{#if topics().length === 0}
				<span class="text-xs text-white/20">Not enough data yet</span>
			{/if}
		</div>
	</div>

	<!-- Category bars -->
	<div>
		<h3 class="mb-spacing-8 text-xs uppercase tracking-wider text-white/30">By Category</h3>
		<div class="space-y-spacing-4">
			{#each categoryDist() as { category, count }}
				{@const maxCat = categoryDist()[0]?.count ?? 1}
				<div class="flex items-center gap-spacing-8">
					<span class="w-20 text-xs text-white/40 truncate capitalize">{category}</span>
					<div class="flex-1 h-1 overflow-hidden rounded-full bg-white/5">
						<div
							class="h-full rounded-full bg-positive/60 transition-all duration-300"
							style="width: {(count / maxCat) * 100}%"
						></div>
					</div>
					<span class="text-[10px] text-white/30 tabular-nums w-4 text-right">{count}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
