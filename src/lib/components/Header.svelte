<script lang="ts">
	import { preferences } from '$lib/stores/preferences.svelte.js';
	import { realtime } from '$lib/stores/realtime.svelte.js';

	const now = $derived(
		new Date().toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);
</script>

<header class="border-b border-white/10">
	<div class="flex items-center justify-between px-4 py-3 md:px-6">
		<!-- Left: Brand -->
		<div class="flex items-center gap-4">
			<a href="/" class="group flex items-center gap-2">
				<span
					class="text-md font-normal tracking-tight text-gray-50 transition-opacity duration-150 group-hover:opacity-80"
				>
					Good News
				</span>
			</a>
			<div class="h-3 w-px bg-white/10"></div>
			<span class="text-sm text-white/50">{now}</span>
		</div>

		<!-- Right: Status + Settings -->
		<div class="flex items-center gap-4">
			{#if realtime.connected}
				<div class="flex items-center gap-1">
					<div class="h-1.5 w-1.5 rounded-full bg-positive"></div>
					<span class="text-xs text-white/50">Live</span>
				</div>
			{/if}

			{#if realtime.hasNew}
				<button
					onclick={() => {
						realtime.clear();
						window.location.reload();
					}}
					class="text-xs text-positive transition-opacity duration-150 hover:opacity-80"
				>
					{realtime.count} new {realtime.count === 1 ? 'story' : 'stories'}
				</button>
			{/if}

			<button
				onclick={() => preferences.toggleSettings()}
				class="text-sm text-white/50 transition-all duration-150 hover:text-white/80"
				aria-label="Open settings"
			>
				Settings
			</button>
		</div>
	</div>
</header>
