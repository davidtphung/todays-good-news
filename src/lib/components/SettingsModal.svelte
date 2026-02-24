<script lang="ts">
	import { preferences } from '$lib/stores/preferences.svelte.js';
	import { panels } from '$lib/stores/panels.svelte.js';
	import { PANELS } from '$lib/config.js';

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') preferences.closeSettings();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) preferences.closeSettings();
	}
</script>

{#if preferences.settingsOpen}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
		onkeydown={handleKeydown}
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-label="Settings"
		tabindex="-1"
	>
		<div class="mx-4 w-full max-w-lg rounded-sm border border-white/10 bg-surface-raised">
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-white/10 px-6 py-4">
				<h2 class="text-base font-normal text-gray-50">Settings</h2>
				<button
					onclick={() => preferences.closeSettings()}
					class="text-sm text-white/40 transition-opacity duration-150 hover:text-white/70"
					aria-label="Close settings"
				>
					Close
				</button>
			</div>

			<div class="max-h-[70vh] overflow-y-auto px-6 py-4">
				<!-- Theme -->
				<div class="space-y-3">
					<h3 class="text-xs uppercase tracking-wider text-white/30">Theme</h3>
					<div class="flex gap-2">
						{#each [
							{ value: 'dark', label: 'Dark' },
							{ value: 'light', label: 'Light' },
							{ value: 'system', label: 'System' }
						] as option}
							<button
								onclick={() => preferences.setTheme(option.value as 'dark' | 'light' | 'system')}
								class="flex-1 rounded-sm border px-3 py-2 text-xs transition-all duration-150 {preferences.theme === option.value ? 'border-positive/50 bg-positive/10 text-positive' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'}"
							>
								{option.label}
							</button>
						{/each}
					</div>
				</div>

				<!-- Preferences -->
				<div class="mt-6 space-y-3">
					<h3 class="text-xs uppercase tracking-wider text-white/30">Preferences</h3>

					<label class="flex items-center justify-between py-1">
						<span class="text-sm text-white/60">Show toast notifications</span>
						<input
							type="checkbox"
							checked={preferences.showToasts}
							onchange={() =>
								preferences.update({ showToasts: !preferences.showToasts })}
							class="h-4 w-4 accent-positive"
						/>
					</label>

					<label class="flex items-center justify-between py-1">
						<span class="text-sm text-white/60">Auto-refresh stories</span>
						<input
							type="checkbox"
							checked={preferences.autoRefresh}
							onchange={() =>
								preferences.update({ autoRefresh: !preferences.autoRefresh })}
							class="h-4 w-4 accent-positive"
						/>
					</label>
				</div>

				<!-- Panel visibility -->
				<div class="mt-6 space-y-2">
					<div class="flex items-center justify-between">
						<h3 class="text-xs uppercase tracking-wider text-white/30">Panels</h3>
						<button
							onclick={() => panels.reset()}
							class="text-xs text-white/30 transition-opacity duration-150 hover:text-white/50"
						>
							Reset
						</button>
					</div>

					{#each PANELS as panelConfig}
						{@const layout = panels.layouts.find((l) => l.id === panelConfig.id)}
						<label
							class="flex items-center justify-between -mx-2 rounded-sm px-2 py-2 transition-all duration-150 hover:bg-white/5"
						>
							<span class="text-sm text-white/60">{panelConfig.title}</span>
							<input
								type="checkbox"
								checked={layout?.visible ?? true}
								onchange={() => panels.toggle(panelConfig.id)}
								class="h-4 w-4 accent-positive"
							/>
						</label>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
