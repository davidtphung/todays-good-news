<script lang="ts">
	import type { PageData } from './$types.js';
	import { timeAgo, formatDate } from '$lib/utils/time.js';
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import SentimentGauge from '$lib/components/SentimentGauge.svelte';

	let { data }: { data: PageData } = $props();
	const story = $derived(data.story);
</script>

<svelte:head>
	<title>{story?.title ?? 'Story'} — Good News</title>
</svelte:head>

{#if story}
	<article class="mx-auto max-w-2xl px-spacing-16 py-spacing-32 md:px-spacing-24">
		<!-- Back link -->
		<a
			href="/"
			class="mb-spacing-24 inline-flex items-center gap-spacing-4 text-sm text-white/40 transition-opacity duration-150 hover:text-white/60"
		>
			← Dashboard
		</a>

		<!-- Header -->
		<header class="mb-spacing-24">
			<div class="mb-spacing-12 flex items-center gap-spacing-8">
				<CategoryBadge category={story.category} />
				<SentimentGauge score={story.positivity_score} size="md" />
			</div>

			<h1 class="text-xl font-normal leading-tight text-gray-50 md:text-2xl">
				{story.title}
			</h1>

			<div class="mt-spacing-12 flex items-center gap-spacing-8 text-xs text-white/30">
				<a
					href={story.source_url}
					target="_blank"
					rel="noopener noreferrer"
					class="underline decoration-white/10 underline-offset-2 transition-all duration-150 hover:text-white/50 hover:decoration-white/30"
				>
					{story.source_name}
				</a>
				<span class="text-white/20">·</span>
				<span>{timeAgo(story.published_at)}</span>
				{#if story.location_name}
					<span class="text-white/20">·</span>
					<span>{story.location_name}</span>
				{/if}
			</div>
		</header>

		<!-- Divider -->
		<div class="mb-spacing-24 h-px w-full bg-white/10"></div>

		<!-- Summary -->
		<div class="prose prose-invert max-w-none">
			<p class="text-md leading-relaxed text-white/70">
				{story.summary}
			</p>
		</div>

		<!-- Source link -->
		<div class="mt-spacing-32 border-t border-white/10 pt-spacing-16">
			<a
				href={story.source_url}
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm text-white/40 transition-opacity duration-150 hover:text-white/60"
			>
				Read full article at {story.source_name} →
			</a>
		</div>

		<!-- Meta -->
		<div class="mt-spacing-24 rounded-sm border border-white/5 bg-white/[0.02] p-spacing-16">
			<h3 class="mb-spacing-8 text-xs uppercase tracking-wider text-white/20">Story Details</h3>
			<div class="grid grid-cols-2 gap-spacing-8 text-xs">
				<div>
					<span class="text-white/30">Published</span>
					<p class="text-white/50">{formatDate(story.published_at)}</p>
				</div>
				<div>
					<span class="text-white/30">Positivity Score</span>
					<p class="text-white/50">{story.positivity_score}/100</p>
				</div>
				<div>
					<span class="text-white/30">Category</span>
					<p class="capitalize text-white/50">{story.category}</p>
				</div>
				{#if story.location_name}
					<div>
						<span class="text-white/30">Location</span>
						<p class="text-white/50">{story.location_name}</p>
					</div>
				{/if}
			</div>
		</div>
	</article>
{:else}
	<div class="flex min-h-[50vh] items-center justify-center">
		<div class="text-center">
			<p class="text-lg text-white/30">Story not found</p>
			<a
				href="/"
				class="mt-spacing-8 inline-block text-sm text-white/40 transition-opacity duration-150 hover:text-white/60"
			>
				← Back to dashboard
			</a>
		</div>
	</div>
{/if}
