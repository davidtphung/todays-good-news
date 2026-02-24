<script lang="ts">
	import type { Story } from '$lib/types/story.js';
	import { preferences } from '$lib/stores/preferences.svelte.js';
	import { onMount } from 'svelte';

	interface Props {
		stories: Story[];
	}

	let { stories }: Props = $props();

	const geoStories = $derived(
		stories.filter((s) => s.location_lat != null && s.location_lon != null)
	);

	let containerEl: HTMLDivElement | undefined = $state();
	let canvasEl: HTMLCanvasElement | undefined = $state();
	let mounted = $state(false);
	let rotation = $state(0);
	let hoveredStory: Story | null = $state(null);
	let isDragging = $state(false);
	let lastMouseX = $state(0);
	let animationId: number | undefined;

	const GLOBE_RADIUS = 0.38;
	const DOT_RADIUS = 0.012;

	function toRadians(deg: number): number {
		return (deg * Math.PI) / 180;
	}

	function project3D(
		lat: number,
		lon: number,
		cx: number,
		cy: number,
		radius: number
	): { x: number; y: number; z: number; visible: boolean } {
		const phi = toRadians(90 - lat);
		const theta = toRadians(lon + rotation);

		const x = Math.sin(phi) * Math.cos(theta);
		const y = Math.cos(phi);
		const z = Math.sin(phi) * Math.sin(theta);

		return {
			x: cx + x * radius,
			y: cy - y * radius,
			z,
			visible: z > -0.1
		};
	}

	// Simplified continent outlines as lat/lon polylines
	const continents: number[][][] = [
		// North America
		[[-10, -80], [5, -77], [15, -85], [20, -105], [30, -115], [48, -125], [60, -140], [70, -160], [72, -95], [62, -75], [50, -55], [45, -65], [30, -80], [25, -80], [20, -87], [15, -85], [5, -77], [-10, -80]],
		// South America
		[[10, -70], [5, -52], [-5, -35], [-15, -40], [-25, -48], [-35, -55], [-45, -65], [-55, -68], [-50, -75], [-40, -73], [-30, -70], [-20, -70], [-10, -78], [0, -80], [10, -70]],
		// Europe
		[[36, -10], [38, 0], [43, 5], [45, 12], [40, 25], [45, 30], [50, 30], [55, 22], [55, 10], [58, 5], [60, 5], [62, 10], [65, 15], [70, 28], [60, 35], [55, 40], [50, 40], [48, 30], [46, 15], [44, 10], [40, 0], [36, -10]],
		// Africa
		[[35, -5], [32, 32], [20, 38], [12, 42], [10, 50], [0, 42], [-10, 40], [-20, 35], [-30, 30], [-35, 20], [-33, 18], [-30, 28], [-20, 35], [-10, 15], [0, 10], [5, -5], [15, -17], [30, -10], [35, -5]],
		// Asia
		[[45, 30], [50, 45], [50, 60], [55, 70], [60, 80], [65, 100], [70, 140], [65, 170], [55, 135], [50, 130], [45, 135], [40, 130], [35, 120], [30, 120], [25, 105], [22, 100], [10, 105], [5, 100], [0, 105], [-8, 115], [-5, 120], [-5, 130], [-8, 140], [0, 110], [5, 100], [10, 100], [15, 100], [20, 92], [25, 90], [25, 70], [28, 65], [35, 50], [40, 40], [45, 30]],
		// Australia
		[[-15, 130], [-12, 135], [-15, 140], [-25, 150], [-35, 148], [-38, 145], [-35, 137], [-30, 132], [-25, 115], [-20, 115], [-15, 125], [-15, 130]]
	];

	// Theme-aware colors
	const isLight = $derived(preferences.theme === 'light');
	const globeColors = $derived(isLight ? {
		bgGradient0: 'rgba(0, 0, 0, 0.04)',
		bgGradient07: 'rgba(0, 0, 0, 0.02)',
		bgGradient1: 'rgba(0, 0, 0, 0)',
		edge: 'rgba(0, 0, 0, 0.1)',
		grid: 'rgba(0, 0, 0, 0.05)',
		continentStroke: 'rgba(0, 0, 0, 0.15)',
		continentFill: 'rgba(0, 0, 0, 0.04)',
	} : {
		bgGradient0: 'rgba(255, 255, 255, 0.04)',
		bgGradient07: 'rgba(255, 255, 255, 0.02)',
		bgGradient1: 'rgba(255, 255, 255, 0)',
		edge: 'rgba(255, 255, 255, 0.08)',
		grid: 'rgba(255, 255, 255, 0.03)',
		continentStroke: 'rgba(255, 255, 255, 0.12)',
		continentFill: 'rgba(255, 255, 255, 0.04)',
	});

	function drawGlobe(ctx: CanvasRenderingContext2D, width: number, height: number) {
		const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
		ctx.clearRect(0, 0, width * dpr, height * dpr);
		ctx.save();
		ctx.scale(dpr, dpr);

		const cx = width / 2;
		const cy = height / 2;
		const radius = Math.min(width, height) * GLOBE_RADIUS;

		// Globe background
		const gradient = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
		gradient.addColorStop(0, globeColors.bgGradient0);
		gradient.addColorStop(0.7, globeColors.bgGradient07);
		gradient.addColorStop(1, globeColors.bgGradient1);

		ctx.beginPath();
		ctx.arc(cx, cy, radius, 0, Math.PI * 2);
		ctx.fillStyle = gradient;
		ctx.fill();

		// Globe edge
		ctx.beginPath();
		ctx.arc(cx, cy, radius, 0, Math.PI * 2);
		ctx.strokeStyle = globeColors.edge;
		ctx.lineWidth = 0.5;
		ctx.stroke();

		// Grid lines (latitude)
		ctx.strokeStyle = globeColors.grid;
		ctx.lineWidth = 0.3;
		for (let lat = -60; lat <= 60; lat += 30) {
			ctx.beginPath();
			let started = false;
			for (let lon = -180; lon <= 180; lon += 2) {
				const p = project3D(lat, lon, cx, cy, radius);
				if (p.visible) {
					if (!started) {
						ctx.moveTo(p.x, p.y);
						started = true;
					} else {
						ctx.lineTo(p.x, p.y);
					}
				} else {
					started = false;
				}
			}
			ctx.stroke();
		}

		// Grid lines (longitude)
		for (let lon = -180; lon < 180; lon += 30) {
			ctx.beginPath();
			let started = false;
			for (let lat = -90; lat <= 90; lat += 2) {
				const p = project3D(lat, lon, cx, cy, radius);
				if (p.visible) {
					if (!started) {
						ctx.moveTo(p.x, p.y);
						started = true;
					} else {
						ctx.lineTo(p.x, p.y);
					}
				} else {
					started = false;
				}
			}
			ctx.stroke();
		}

		// Draw continents
		ctx.strokeStyle = globeColors.continentStroke;
		ctx.fillStyle = globeColors.continentFill;
		ctx.lineWidth = 0.6;

		for (const continent of continents) {
			ctx.beginPath();
			let started = false;
			const points: { x: number; y: number }[] = [];

			for (const [lat, lon] of continent) {
				const p = project3D(lat, lon, cx, cy, radius);
				if (p.visible) {
					if (!started) {
						ctx.moveTo(p.x, p.y);
						started = true;
					} else {
						ctx.lineTo(p.x, p.y);
					}
					points.push({ x: p.x, y: p.y });
				} else {
					started = false;
				}
			}

			if (points.length > 2) {
				ctx.fill();
			}
			ctx.stroke();
		}

		// Draw story markers
		for (const story of geoStories) {
			const p = project3D(story.location_lat!, story.location_lon!, cx, cy, radius);
			if (!p.visible) continue;

			const dotR = Math.min(width, height) * DOT_RADIUS;
			const alpha = 0.3 + 0.7 * ((p.z + 0.1) / 1.1);
			const isHovered = hoveredStory?.id === story.id;

			// Pulse ring
			const pulsePhase = (Date.now() / 1500 + geoStories.indexOf(story) * 0.5) % 1;
			const pulseR = dotR * (1.5 + pulsePhase * 2);
			const pulseAlpha = (1 - pulsePhase) * 0.3 * alpha;
			ctx.beginPath();
			ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
			ctx.strokeStyle = `rgba(16, 185, 129, ${pulseAlpha})`;
			ctx.lineWidth = 0.5;
			ctx.stroke();

			// Glow
			if (isHovered) {
				const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, dotR * 4);
				glowGradient.addColorStop(0, `rgba(16, 185, 129, ${0.3 * alpha})`);
				glowGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
				ctx.beginPath();
				ctx.arc(p.x, p.y, dotR * 4, 0, Math.PI * 2);
				ctx.fillStyle = glowGradient;
				ctx.fill();
			}

			// Core dot
			ctx.beginPath();
			ctx.arc(p.x, p.y, isHovered ? dotR * 1.5 : dotR, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(16, 185, 129, ${alpha * (isHovered ? 1 : 0.8)})`;
			ctx.fill();
		}

		ctx.restore();
	}

	function animate() {
		if (!canvasEl) return;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		const rect = canvasEl.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) {
			// Canvas not laid out yet, try again
			animationId = requestAnimationFrame(animate);
			return;
		}

		drawGlobe(ctx, rect.width, rect.height);

		if (!isDragging) {
			rotation += 0.15;
		}

		animationId = requestAnimationFrame(animate);
	}

	function handleResize() {
		if (!canvasEl) return;
		const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
		const rect = canvasEl.getBoundingClientRect();
		if (rect.width > 0 && rect.height > 0) {
			canvasEl.width = rect.width * dpr;
			canvasEl.height = rect.height * dpr;
		}
	}

	function handleMouseDown(e: MouseEvent) {
		isDragging = true;
		lastMouseX = e.clientX;
	}

	function handleMouseMove(e: MouseEvent) {
		if (isDragging) {
			const dx = e.clientX - lastMouseX;
			rotation += dx * 0.3;
			lastMouseX = e.clientX;
		}

		// Hit test for hover
		if (!canvasEl) return;
		const rect = canvasEl.getBoundingClientRect();
		const mx = e.clientX - rect.left;
		const my = e.clientY - rect.top;
		const cx = rect.width / 2;
		const cy = rect.height / 2;
		const radius = Math.min(rect.width, rect.height) * GLOBE_RADIUS;

		let closest: Story | null = null;
		let closestDist = Infinity;

		for (const story of geoStories) {
			const p = project3D(story.location_lat!, story.location_lon!, cx, cy, radius);
			if (!p.visible) continue;
			const dist = Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2);
			if (dist < 15 && dist < closestDist) {
				closest = story;
				closestDist = dist;
			}
		}
		hoveredStory = closest;
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleTouchStart(e: TouchEvent) {
		isDragging = true;
		lastMouseX = e.touches[0].clientX;
	}

	function handleTouchMove(e: TouchEvent) {
		if (isDragging && e.touches.length === 1) {
			const dx = e.touches[0].clientX - lastMouseX;
			rotation += dx * 0.3;
			lastMouseX = e.touches[0].clientX;
		}
	}

	function handleTouchEnd() {
		isDragging = false;
	}

	onMount(() => {
		mounted = true;

		// Delay initial resize to ensure layout is complete
		requestAnimationFrame(() => {
			handleResize();
			animationId = requestAnimationFrame(animate);
		});

		const observer = new ResizeObserver(() => handleResize());
		if (containerEl) observer.observe(containerEl);

		return () => {
			if (animationId) cancelAnimationFrame(animationId);
			observer.disconnect();
		};
	});
</script>

<div bind:this={containerEl} class="relative w-full overflow-hidden" style="min-height: 300px; aspect-ratio: 2/1;">
	{#if mounted}
		<canvas
			bind:this={canvasEl}
			class="h-full w-full cursor-grab active:cursor-grabbing"
			onmousedown={handleMouseDown}
			onmousemove={handleMouseMove}
			onmouseup={handleMouseUp}
			onmouseleave={handleMouseUp}
			ontouchstart={handleTouchStart}
			ontouchmove={handleTouchMove}
			ontouchend={handleTouchEnd}
		></canvas>

		<!-- Tooltip -->
		{#if hoveredStory}
			<div class="pointer-events-none absolute bottom-3 left-3 right-3 rounded-sm bg-surface-overlay/90 px-3 py-2 backdrop-blur-sm">
				<p class="text-xs font-normal text-gray-50 line-clamp-1">{hoveredStory.title}</p>
				<p class="text-[10px] text-white/40">{hoveredStory.location_name}</p>
			</div>
		{/if}
	{:else}
		<!-- SSR fallback -->
		<div class="flex h-full w-full items-center justify-center">
			<span class="text-xs text-white/20">Loading globe</span>
		</div>
	{/if}

	<!-- Legend -->
	{#if geoStories.length > 0}
		<div class="absolute top-2 right-3 flex items-center gap-1">
			<div class="h-1.5 w-1.5 rounded-full bg-positive"></div>
			<span class="text-[10px] text-white/30">{geoStories.length} stories</span>
		</div>
	{/if}
</div>
