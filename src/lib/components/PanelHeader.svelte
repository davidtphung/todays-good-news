<script lang="ts">
	import type { PanelConfig } from '$lib/types/panel.js';

	interface Props {
		config: PanelConfig;
		storyCount?: number;
	}

	let { config, storyCount = 0 }: Props = $props();
</script>

<div class="flex items-center justify-between px-4 py-3">
	<div class="flex items-center gap-2">
		<h2 class="text-xs font-medium uppercase tracking-wider text-white/50">{config.title}</h2>
	</div>
	{#if storyCount > 0}
		<span class="text-xs text-white/30">{storyCount}</span>
	{/if}
</div>
