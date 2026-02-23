<script lang="ts">
	import type { DailyDigest as DigestType } from '$lib/types/story.js';
	import type { Story } from '$lib/types/story.js';
	import { formatDate } from '$lib/utils/time.js';
	import SentimentGauge from './SentimentGauge.svelte';

	interface Props {
		digest: DigestType | null;
		topStories?: Story[];
	}

	let { digest, topStories = [] }: Props = $props();
</script>

{#if digest}
	<div class="space-y-spacing-16">
		<!-- Date -->
		<div class="flex items-center justify-between">
			<span class="text-xs text-white/30">{formatDate(digest.date)}</span>
			<SentimentGauge score={Math.round(digest.avg_positivity)} size="md" />
		</div>

		<!-- Summary -->
		<p class="text-sm leading-relaxed text-white/70">
			{digest.summary}
		</p>

		<!-- Top stories -->
		{#if topStories.length > 0}
			<div>
				<h3 class="mb-spacing-8 text-xs uppercase tracking-wider text-white/30">
					Top Stories
				</h3>
				<div class="space-y-spacing-8">
					{#each topStories.slice(0, 5) as story, i}
						<a
							href="/story/{story.id}"
							class="group flex items-start gap-spacing-8 -mx-spacing-8 px-spacing-8 py-spacing-4 transition-all duration-150 hover:bg-white/5 rounded-sm"
						>
							<span class="text-[10px] text-white/20 mt-0.5 tabular-nums">{i + 1}</span>
							<span
								class="text-sm text-white/60 transition-opacity duration-150 group-hover:text-white/80 line-clamp-1"
							>
								{story.title}
							</span>
						</a>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Category counts -->
		{#if digest.category_counts}
			<div class="flex flex-wrap gap-spacing-8 pt-spacing-8 border-t border-white/5">
				{#each Object.entries(digest.category_counts) as [category, count]}
					<div class="text-xs text-white/30">
						<span class="capitalize">{category}</span>
						<span class="ml-1 text-white/20">{count}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<div class="flex flex-col items-center justify-center py-spacing-32 text-center">
		<span class="text-lg mb-spacing-8">☀️</span>
		<p class="text-sm text-white/30">Today's digest is being prepared</p>
		<p class="text-xs text-white/20 mt-spacing-4">Check back soon</p>
	</div>
{/if}
