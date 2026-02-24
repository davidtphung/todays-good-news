<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PanelConfig } from '$lib/types/panel.js';
	import type { PanelLayout } from '$lib/types/panel.js';
	import PanelHeader from './PanelHeader.svelte';
	import { panels } from '$lib/stores/panels.svelte.js';

	interface Props {
		config: PanelConfig;
		layout: PanelLayout;
		storyCount?: number;
		children: Snippet;
	}

	let { config, layout, storyCount = 0, children }: Props = $props();

	const widthClass = $derived(
		layout.width === 4
			? 'col-span-full'
			: layout.width === 2
				? 'col-span-full md:col-span-2'
				: 'col-span-full md:col-span-1'
	);

	let dragging = $state(false);

	function handleDragStart(e: DragEvent) {
		dragging = true;
		e.dataTransfer?.setData('text/plain', config.id);
	}

	function handleDragEnd() {
		dragging = false;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const fromId = e.dataTransfer?.getData('text/plain');
		if (!fromId || fromId === config.id) return;
		const visible = panels.visible;
		const fromIndex = visible.findIndex((p) => p.id === fromId);
		const toIndex = visible.findIndex((p) => p.id === config.id);
		if (fromIndex !== -1 && toIndex !== -1) {
			panels.reorder(fromIndex, toIndex);
		}
	}
</script>

<section
	class="{widthClass} flex flex-col overflow-hidden rounded-sm border border-white/10 bg-surface-raised transition-opacity duration-150"
	class:opacity-50={dragging}
	data-panel={config.id}
	draggable="true"
	ondragstart={handleDragStart}
	ondragend={handleDragEnd}
	ondragover={handleDragOver}
	ondrop={handleDrop}
	aria-label="{config.title} panel"
>
	<PanelHeader {config} {storyCount} />
	<div class="h-px w-full bg-white/10"></div>
	<div
		class="flex-1 {config.contentType === 'map' || config.contentType === 'video' ? 'overflow-hidden' : 'overflow-y-auto px-4 py-2'}"
		style={config.contentType === 'map' || config.contentType === 'video' ? '' : 'max-height: 480px;'}
	>
		{@render children()}
	</div>
</section>
