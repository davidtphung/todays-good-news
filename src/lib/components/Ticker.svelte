<script lang="ts">
	import type { Story } from '$lib/types/story.js';

	interface Props {
		stories: Story[];
	}

	let { stories }: Props = $props();

	const tickerStories = $derived(
		[...stories]
			.sort((a, b) => b.positivity_score - a.positivity_score)
			.slice(0, 20)
	);

	// Duplicate for seamless loop
	const doubled = $derived([...tickerStories, ...tickerStories]);
</script>

<div class="relative overflow-hidden border-b border-white/10 bg-surface-raised">
	<div class="flex items-center">
		<!-- Label -->
		<div
			class="relative z-10 flex-shrink-0 border-r border-white/10 bg-positive/10 px-3 py-2"
		>
			<span class="text-[10px] font-medium uppercase tracking-widest text-positive">Top Stories</span>
		</div>

		<!-- Scrolling track -->
		<div class="relative flex-1 overflow-hidden">
			<div class="ticker-track flex items-center gap-6 whitespace-nowrap py-2 pl-4">
				{#each doubled as story, i (story.id + '-' + i)}
					<a
						href={story.source_url}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex flex-shrink-0 items-center gap-2 transition-opacity duration-150 hover:opacity-70"
					>
						<span class="text-[10px] tabular-nums text-positive/60">{story.positivity_score}</span>
						<span class="text-xs text-white/60">{story.title}</span>
						<span class="text-[10px] text-white/20">{story.source_name}</span>
					</a>
					<span class="text-white/10">|</span>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.ticker-track {
		animation: ticker-scroll 90s linear infinite;
	}
	.ticker-track:hover {
		animation-play-state: paused;
	}
	@keyframes ticker-scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ticker-track {
			animation: none;
			overflow-x: auto;
		}
	}
</style>
