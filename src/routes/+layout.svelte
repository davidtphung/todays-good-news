<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import { preferences } from '$lib/stores/preferences.svelte.js';
	import { onMount } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	onMount(() => {
		preferences.init();
	});
</script>

<svelte:head>
	<title>Good News — The best things happening in the world</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-surface">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="border-t border-white/5 px-4 py-3 md:px-6">
		<div class="flex items-center justify-between">
			<span class="text-xs uppercase tracking-wider text-white/20">
				Good News Dashboard
			</span>
			<span class="text-xs text-white/20">
				Updated every 4 hours
			</span>
		</div>
	</footer>

	<SettingsModal />
</div>
