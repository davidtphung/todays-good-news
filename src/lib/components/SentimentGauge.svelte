<script lang="ts">
	interface Props {
		score: number;
		size?: 'sm' | 'md';
	}

	let { score, size = 'sm' }: Props = $props();

	const color = $derived(
		score >= 85 ? 'text-positive-warm' : score >= 65 ? 'text-positive' : 'text-white/40'
	);
</script>

{#if size === 'sm'}
	<span class="text-[10px] tabular-nums {color}">{score}</span>
{:else}
	<div class="flex items-center gap-spacing-4">
		<div class="h-1 w-12 overflow-hidden rounded-full bg-white/10">
			<div
				class="h-full rounded-full transition-all duration-300 {score >= 85 ? 'bg-positive-warm' : score >= 65 ? 'bg-positive' : 'bg-white/30'}"
				style="width: {score}%"
			></div>
		</div>
		<span class="text-xs tabular-nums {color}">{score}</span>
	</div>
{/if}
