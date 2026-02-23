<script lang="ts">
	import type { Story } from '$lib/types/story.js';
	import { timeAgo } from '$lib/utils/time.js';
	import CategoryBadge from './CategoryBadge.svelte';
	import SentimentGauge from './SentimentGauge.svelte';

	interface Props {
		story: Story;
		compact?: boolean;
	}

	let { story, compact = false }: Props = $props();
</script>

<div
	class="group relative transition-all duration-150 hover:bg-white/5 -mx-spacing-16 px-spacing-16 py-spacing-12"
	data-story-id={story.id}
>
	<!-- Full-card link (sits behind content, provides the click target) -->
	<a href="/story/{story.id}" class="absolute inset-0 z-0" aria-label={story.title}></a>

	<div class="relative z-10 flex gap-spacing-12">
		<!-- Content -->
		<div class="min-w-0 flex-1">
			<div class="flex items-start gap-spacing-8">
				<div class="flex-1 min-w-0">
					<h3
						class="text-sm font-normal leading-[20px] text-gray-50 transition-opacity duration-150 group-hover:opacity-80"
					>
						{story.title}
					</h3>
					{#if !compact}
						<p class="mt-spacing-4 text-sm leading-[20px] text-white/50 line-clamp-2">
							{story.summary}
						</p>
					{/if}
				</div>
			</div>

			<!-- Meta row -->
			<div class="mt-spacing-8 flex items-center gap-spacing-8">
				<a
					href={story.source_url}
					target="_blank"
					rel="noopener noreferrer"
					class="relative z-20 text-xs text-white/30 underline decoration-white/10 underline-offset-2 transition-all duration-150 hover:text-white/50 hover:decoration-white/30"
				>
					{story.source_name}
				</a>
				<span class="text-xs text-white/20">·</span>
				<span class="text-xs text-white/30">{timeAgo(story.published_at)}</span>
				{#if story.location_name}
					<span class="text-xs text-white/20">·</span>
					<span class="text-xs text-white/30">{story.location_name}</span>
				{/if}
				<div class="ml-auto flex items-center gap-spacing-8">
					<SentimentGauge score={story.positivity_score} size="sm" />
					<CategoryBadge category={story.category} />
				</div>
			</div>
		</div>

		<!-- Thumbnail -->
		{#if story.image_url && !compact}
			<div class="hidden sm:block flex-shrink-0">
				<div class="h-16 w-24 overflow-hidden rounded-sm bg-white/5">
					<img
						src={story.image_url}
						alt=""
						class="h-full w-full object-cover"
						loading="lazy"
					/>
				</div>
			</div>
		{/if}
	</div>
</div>
