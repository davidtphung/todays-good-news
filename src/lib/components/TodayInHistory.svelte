<script lang="ts">
	import type { HistoryEvent } from '$lib/utils/history.js';
	import { getCategoryIcon } from '$lib/utils/history.js';

	interface Props {
		events: HistoryEvent[];
		dateLabel: string;
	}

	let { events, dateLabel }: Props = $props();
</script>

<div class="space-y-3">
	<div class="flex items-center justify-between">
		<span class="text-xs uppercase tracking-wider text-white/30">On This Day</span>
		<span class="text-xs text-white/20">{dateLabel}</span>
	</div>

	<div class="space-y-1">
		{#each events as event}
			<div
				class="-mx-2 rounded-sm px-2 py-2 transition-all duration-150 hover:bg-white/5"
			>
				<div class="flex items-start gap-2">
					<span class="mt-0.5 text-sm">{getCategoryIcon(event.category)}</span>
					<div class="min-w-0 flex-1">
						<div class="flex items-baseline gap-2">
							<span class="text-xs tabular-nums text-positive/70">{event.year}</span>
							<h4 class="text-sm font-normal text-gray-50 line-clamp-1">
								{event.title}
							</h4>
						</div>
						<p class="mt-1 text-xs leading-relaxed text-white/40 line-clamp-2">
							{event.description}
						</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
