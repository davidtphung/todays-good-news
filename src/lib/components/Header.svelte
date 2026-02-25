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
		<div class="flex items-center gap-2 md:gap-4">
			<a href="/" class="group flex items-center gap-2">
				<span
					class="text-sm md:text-base font-bold tracking-tight text-gray-50 transition-opacity duration-150 group-hover:opacity-80 uppercase"
				>
					Good News Today
				</span>
			</a>
			<div class="hidden md:block h-3 w-px bg-white/10"></div>
			<span class="hidden md:inline text-xs text-white/40">{now}</span>
		</div>

		<!-- Right: Status + Theme + Settings -->
		<div class="flex items-center gap-3 md:gap-4">
			{#if realtime.connected}
				<div class="flex items-center gap-1">
					<div class="h-1.5 w-1.5 rounded-full bg-positive"></div>
					<span class="text-xs text-white/50 hidden md:inline">Live</span>
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
					{realtime.count} new
				</button>
			{/if}

			<!-- Theme toggle -->
			<button
				onclick={() => preferences.toggleTheme()}
				class="text-xs text-white/40 transition-all duration-150 hover:text-white/70"
				aria-label="Toggle theme"
				title={preferences.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
			>
				{preferences.theme === 'dark' ? 'Light' : 'Dark'}
			</button>

			<a
				href="/archive"
				class="text-xs text-white/40 transition-all duration-150 hover:text-white/70"
			>
				Archive
			</a>

			<a
				href="/about"
				class="text-xs text-white/40 transition-all duration-150 hover:text-white/70"
			>
				<span class="hidden md:inline">About & Mission</span>
				<span class="md:hidden">About</span>
			</a>

			<button
				onclick={() => preferences.toggleSettings()}
				class="text-xs text-white/40 transition-all duration-150 hover:text-white/70"
				aria-label="Open settings"
			>
				Settings
			</button>
		</div>
	</div>
</header>
