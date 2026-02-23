<script lang="ts">
	import type { PageData } from './$types.js';
	import Dashboard from '$lib/components/Dashboard.svelte';

	let { data }: { data: PageData } = $props();
</script>

<Dashboard
	initialStories={data.stories}
	digest={data.digest}
	geoStories={data.geoStories}
	history={data.history}
/>
