<script lang="ts">
	import type { PanelConfig } from '$lib/types/panel.js';

	interface Props {
		config: PanelConfig;
		storyCount?: number;
	}

	let { config, storyCount = 0 }: Props = $props();
</script>

<div class="flex items-center justify-between px-spacing-16 py-spacing-12">
	<div class="flex items-center gap-spacing-8">
		<span class="text-sm">{config.icon}</span>
		<h2 class="text-sm font-normal text-gray-50">{config.title}</h2>
	</div>
	{#if storyCount > 0}
		<span class="text-xs text-white/30">{storyCount}</span>
	{/if}
</div>
