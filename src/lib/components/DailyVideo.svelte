<script lang="ts">
	import type { DailyVideo as VideoType } from '$lib/utils/videos.js';

	interface Props {
		video: VideoType;
	}

	let { video }: Props = $props();
</script>

<div class="space-y-3">
	<!-- Video embed -->
	<div class="relative w-full overflow-hidden rounded-sm bg-black" style="aspect-ratio: 16/9;">
		<iframe
			src="https://www.youtube.com/embed/{video.youtubeId}?rel=0&modestbranding=1"
			title={video.title}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			loading="lazy"
			class="absolute inset-0 h-full w-full border-0"
		></iframe>
	</div>

	<!-- Video info -->
	<div>
		<h4 class="text-sm font-normal text-gray-50 line-clamp-1">
			{video.title}
		</h4>
		<p class="mt-1 text-xs leading-relaxed text-white/40 line-clamp-2">
			{video.description}
		</p>
	</div>

	<div class="flex items-center gap-1 text-[10px] text-white/20">
		<span>▶</span>
		<span>New video daily</span>
	</div>
</div>
