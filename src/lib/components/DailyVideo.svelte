<script lang="ts">
	import type { DailyVideo as VideoType } from '$lib/utils/videos.js';

	interface Props {
		video: VideoType;
	}

	let { video }: Props = $props();
</script>

<div class="flex flex-col">
	<!-- Video embed — true 16:9 ratio container -->
	<div class="relative w-full overflow-hidden bg-black" style="padding-bottom: 56.25%;">
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
	<div class="px-4 py-3">
		<h4 class="text-sm font-normal text-gray-50 line-clamp-1">
			{video.title}
		</h4>
		<p class="mt-1 text-xs leading-relaxed text-white/40 line-clamp-2">
			{video.description}
		</p>
		<div class="mt-2 flex items-center gap-1 text-[10px] text-white/20">
			<span>New video daily</span>
		</div>
	</div>
</div>
