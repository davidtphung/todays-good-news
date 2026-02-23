<script lang="ts">
	import type { DailyQuote } from '$lib/utils/quotes.js';

	interface Props {
		quote: DailyQuote;
	}

	let { quote }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-4 text-center">
	<div class="mb-3 text-lg text-positive/40">✦</div>
	<blockquote class="max-w-md">
		<p class="text-sm leading-relaxed text-white/60 italic">
			"{quote.text}"
		</p>
		<footer class="mt-3">
			<span class="text-xs text-white/30">— {quote.author}</span>
		</footer>
	</blockquote>
</div>
