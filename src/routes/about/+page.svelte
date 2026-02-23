<script lang="ts">
	import { PANELS, CATEGORIES } from '$lib/config.js';
</script>

<svelte:head>
	<title>About — Good News Today</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-8 md:px-6">
	<!-- Back link -->
	<a
		href="/"
		class="mb-8 inline-flex items-center gap-1 text-sm text-white/40 transition-opacity duration-150 hover:text-white/60"
	>
		← Dashboard
	</a>

	<!-- Hero -->
	<header class="mb-10">
		<h1 class="text-2xl font-normal tracking-tight text-gray-50 md:text-3xl">
			Good News Today
		</h1>
		<p class="mt-3 text-sm leading-relaxed text-white/50">
			A real-time positive news aggregation dashboard. Because the world is better than the headlines suggest.
		</p>
	</header>

	<!-- Mission -->
	<section class="mb-10">
		<h2 class="mb-4 text-xs uppercase tracking-wider text-white/30">Mission</h2>
		<div class="space-y-3 text-sm leading-relaxed text-white/60">
			<p>
				Every day, incredible things happen around the world. Scientists make breakthroughs, communities come together, ecosystems recover, and ordinary people do extraordinary things. But most news focuses on what went wrong.
			</p>
			<p>
				Good News Today curates the stories that matter — real, verified positive developments from trusted sources across science, health, environment, technology, and more. Our goal is to inform without overwhelming, and to inspire without trivializing.
			</p>
		</div>
	</section>

	<div class="mb-10 h-px w-full bg-white/10"></div>

	<!-- How It Works -->
	<section class="mb-10">
		<h2 class="mb-4 text-xs uppercase tracking-wider text-white/30">How It Works</h2>
		<div class="space-y-4">
			<div class="rounded-sm border border-white/5 bg-white/[0.02] p-4">
				<div class="flex items-start gap-3">
					<span class="text-lg">1</span>
					<div>
						<h3 class="text-sm font-normal text-gray-50">Aggregate</h3>
						<p class="mt-1 text-xs text-white/40">
							Stories are gathered from trusted news outlets worldwide — Reuters, BBC, Nature, NASA, WHO, and dozens more.
						</p>
					</div>
				</div>
			</div>
			<div class="rounded-sm border border-white/5 bg-white/[0.02] p-4">
				<div class="flex items-start gap-3">
					<span class="text-lg">2</span>
					<div>
						<h3 class="text-sm font-normal text-gray-50">Classify</h3>
						<p class="mt-1 text-xs text-white/40">
							An AI pipeline powered by Claude classifies, scores, and summarizes each story based on its positivity, verifiability, and impact.
						</p>
					</div>
				</div>
			</div>
			<div class="rounded-sm border border-white/5 bg-white/[0.02] p-4">
				<div class="flex items-start gap-3">
					<span class="text-lg">3</span>
					<div>
						<h3 class="text-sm font-normal text-gray-50">Display</h3>
						<p class="mt-1 text-xs text-white/40">
							Stories are organized into {CATEGORIES.length} categories on an interactive dashboard with a live ticker, 3D globe, daily digest, and more.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<div class="mb-10 h-px w-full bg-white/10"></div>

	<!-- Categories -->
	<section class="mb-10">
		<h2 class="mb-4 text-xs uppercase tracking-wider text-white/30">Categories</h2>
		<div class="grid grid-cols-2 gap-2 md:grid-cols-3">
			{#each CATEGORIES as cat}
				<div class="rounded-sm border border-white/5 bg-white/[0.02] px-3 py-2">
					<span class="mr-1 text-sm">{cat.icon}</span>
					<span class="text-xs text-white/50">{cat.title}</span>
				</div>
			{/each}
		</div>
	</section>

	<div class="mb-10 h-px w-full bg-white/10"></div>

	<!-- Features -->
	<section class="mb-10">
		<h2 class="mb-4 text-xs uppercase tracking-wider text-white/30">Features</h2>
		<div class="space-y-3">
			{#each [
				{ icon: '📡', title: 'Live Ticker', desc: 'ESPN-style scrolling headlines of the top positive stories' },
				{ icon: '🌐', title: '3D Globe', desc: 'Interactive rotating globe showing story locations worldwide' },
				{ icon: '☀️', title: 'Daily Digest', desc: 'AI-generated summary of the day\'s best positive developments' },
				{ icon: '🎬', title: 'Daily Video', desc: 'A new uplifting video each day about humanity and good news' },
				{ icon: '✦', title: 'Daily Quote', desc: 'Rotating inspirational quotes to start your day right' },
				{ icon: '📅', title: 'Today in History', desc: 'Positive historical events that happened on this day' },
				{ icon: '📊', title: 'Trending Topics', desc: 'Word cloud of the most mentioned positive themes' },
				{ icon: '⚙️', title: 'Customizable Panels', desc: 'Toggle panels on/off to build your perfect dashboard' }
			] as feature}
				<div class="flex items-start gap-3 -mx-2 rounded-sm px-2 py-2 transition-all duration-150 hover:bg-white/5">
					<span class="mt-0.5 text-sm">{feature.icon}</span>
					<div>
						<h3 class="text-sm font-normal text-gray-50">{feature.title}</h3>
						<p class="mt-0.5 text-xs text-white/40">{feature.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<div class="mb-10 h-px w-full bg-white/10"></div>

	<!-- Tech Stack -->
	<section class="mb-10">
		<h2 class="mb-4 text-xs uppercase tracking-wider text-white/30">Built With</h2>
		<div class="flex flex-wrap gap-2">
			{#each ['SvelteKit', 'Svelte 5', 'TypeScript', 'Tailwind CSS v4', 'Claude AI', 'Vercel', 'Canvas API'] as tech}
				<span class="rounded-sm border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-white/40">{tech}</span>
			{/each}
		</div>
	</section>

	<div class="mb-10 h-px w-full bg-white/10"></div>

	<!-- Sources -->
	<section class="mb-10">
		<h2 class="mb-4 text-xs uppercase tracking-wider text-white/30">Trusted Sources</h2>
		<p class="mb-3 text-xs text-white/40">
			Every story links directly to its original source. We aggregate from organizations including:
		</p>
		<div class="flex flex-wrap gap-2">
			{#each ['Reuters', 'BBC', 'Nature', 'NASA', 'WHO', 'UNESCO', 'NIH', 'WWF', 'AP News', 'NPR', 'National Geographic', 'The Guardian', 'MIT Tech Review', 'Good News Network'] as source}
				<span class="text-xs text-white/30">{source}</span>
				{#if source !== 'Good News Network'}
					<span class="text-white/10">·</span>
				{/if}
			{/each}
		</div>
	</section>

	<div class="mb-10 h-px w-full bg-white/10"></div>

	<!-- Creator -->
	<section class="mb-10">
		<h2 class="mb-4 text-xs uppercase tracking-wider text-white/30">Creator</h2>
		<div class="rounded-sm border border-white/5 bg-white/[0.02] p-5">
			<h3 class="text-sm font-normal text-gray-50">David T Phung</h3>
			<p class="mt-2 text-xs leading-relaxed text-white/40">
				Builder, optimist, and believer that technology can amplify the good in the world. Good News Today was created to provide a counterbalance to negativity bias in media and to highlight the progress humanity is making every day.
			</p>
			<div class="mt-4 flex items-center gap-4">
				<a
					href="https://x.com/davidtphung"
					target="_blank"
					rel="noopener noreferrer"
					class="text-xs text-white/30 transition-all duration-150 hover:text-white/50"
				>
					@davidtphung on X →
				</a>
			</div>
		</div>
	</section>

	<!-- Back to dashboard -->
	<div class="border-t border-white/5 pt-6">
		<a
			href="/"
			class="text-sm text-white/40 transition-opacity duration-150 hover:text-white/60"
		>
			← Back to dashboard
		</a>
	</div>
</div>
