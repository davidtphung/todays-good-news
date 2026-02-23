<script lang="ts">
	import type { Story } from '$lib/types/story.js';

	interface Props {
		stories: Story[];
	}

	let { stories }: Props = $props();

	const geoStories = $derived(
		stories.filter((s) => s.location_lat != null && s.location_lon != null)
	);

	// Simple equirectangular projection for the map
	function project(lat: number, lon: number): { x: number; y: number } {
		return {
			x: ((lon + 180) / 360) * 100,
			y: ((90 - lat) / 180) * 100
		};
	}
</script>

<div class="relative w-full overflow-hidden" style="aspect-ratio: 2/1;">
	<!-- Map background grid -->
	<svg viewBox="0 0 100 50" class="h-full w-full" preserveAspectRatio="xMidYMid meet">
		<!-- Grid lines -->
		{#each Array(7) as _, i}
			<line
				x1="0"
				y1={i * (50 / 6)}
				x2="100"
				y2={i * (50 / 6)}
				stroke="rgba(255,255,255,0.05)"
				stroke-width="0.1"
			/>
		{/each}
		{#each Array(13) as _, i}
			<line
				x1={i * (100 / 12)}
				y1="0"
				x2={i * (100 / 12)}
				y2="50"
				stroke="rgba(255,255,255,0.05)"
				stroke-width="0.1"
			/>
		{/each}

		<!-- Continental outlines (simplified) -->
		<ellipse cx="25" cy="22" rx="12" ry="8" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.15" />
		<ellipse cx="52" cy="20" rx="14" ry="10" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.15" />
		<ellipse cx="75" cy="25" rx="10" ry="8" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.15" />
		<ellipse cx="55" cy="35" rx="6" ry="5" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.15" />
		<ellipse cx="82" cy="38" rx="5" ry="4" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.15" />

		<!-- Story markers -->
		{#each geoStories as story}
			{@const pos = project(story.location_lat!, story.location_lon!)}
			<g>
				<!-- Pulse ring -->
				<circle
					cx={pos.x}
					cy={pos.y}
					r="1.2"
					fill="none"
					stroke="rgba(16, 185, 129, 0.3)"
					stroke-width="0.15"
				>
					<animate
						attributeName="r"
						values="0.8;1.5;0.8"
						dur="3s"
						repeatCount="indefinite"
					/>
					<animate
						attributeName="opacity"
						values="0.5;0;0.5"
						dur="3s"
						repeatCount="indefinite"
					/>
				</circle>
				<!-- Core dot -->
				<circle cx={pos.x} cy={pos.y} r="0.4" fill="#10b981" opacity="0.8">
					<title>{story.title} — {story.location_name}</title>
				</circle>
			</g>
		{/each}
	</svg>

	<!-- Legend -->
	{#if geoStories.length > 0}
		<div class="absolute bottom-spacing-8 left-spacing-12 flex items-center gap-spacing-4">
			<div class="h-1.5 w-1.5 rounded-full bg-positive"></div>
			<span class="text-[10px] text-white/30">{geoStories.length} stories mapped</span>
		</div>
	{:else}
		<div class="absolute inset-0 flex items-center justify-center">
			<span class="text-xs text-white/20">No geolocated stories yet</span>
		</div>
	{/if}
</div>
