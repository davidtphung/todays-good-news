<script lang="ts">
	import type { StoryCategory } from '$lib/types/story.js';

	interface Props {
		category: StoryCategory;
	}

	let { category }: Props = $props();

	const labels: Record<StoryCategory, string> = {
		science: 'Science',
		health: 'Health',
		environment: 'Environment',
		technology: 'Tech',
		community: 'Community',
		education: 'Education',
		arts: 'Arts',
		animals: 'Animals',
		economy: 'Economy',
		space: 'Space',
		sports: 'Sports'
	};
</script>

<span
	class="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/40"
>
	{labels[category] ?? category}
</span>
