import type { PanelLayout, PanelId } from '$lib/types/panel.js';
import { PANELS } from '$lib/config.js';

const STORAGE_KEY = 'good-news-panels';

function loadSavedLayout(): PanelLayout[] | null {
	if (typeof window === 'undefined') return null;
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (!saved) return null;
		return JSON.parse(saved) as PanelLayout[];
	} catch {
		return null;
	}
}

function defaultLayout(): PanelLayout[] {
	return PANELS.map((p) => ({
		id: p.id,
		visible: p.visible,
		order: p.order,
		width: p.defaultWidth
	}));
}

const state = $state<{ layouts: PanelLayout[] }>({
	layouts: defaultLayout()
});

export const panels = {
	get layouts() {
		return [...state.layouts].sort((a, b) => a.order - b.order);
	},

	get visible() {
		return [...state.layouts].sort((a, b) => a.order - b.order).filter((l) => l.visible);
	},

	init() {
		const saved = loadSavedLayout();
		if (saved) {
			// Merge saved layout with any new panels from config
			const savedIds = new Set(saved.map((s) => s.id));
			const merged = [...saved];
			for (const panel of PANELS) {
				if (!savedIds.has(panel.id)) {
					merged.push({
						id: panel.id,
						visible: panel.visible,
						order: merged.length,
						width: panel.defaultWidth
					});
				}
			}
			state.layouts = merged;
		}
	},

	toggle(id: PanelId) {
		const layout = state.layouts.find((l) => l.id === id);
		if (layout) {
			layout.visible = !layout.visible;
			this.save();
		}
	},

	reorder(fromIndex: number, toIndex: number) {
		const visible = this.visible;
		const item = visible[fromIndex];
		if (!item) return;

		const reordered = [...visible];
		reordered.splice(fromIndex, 1);
		reordered.splice(toIndex, 0, item);

		reordered.forEach((layout, i) => {
			const target = state.layouts.find((l) => l.id === layout.id);
			if (target) target.order = i;
		});
		this.save();
	},

	setWidth(id: PanelId, width: 1 | 2 | 4) {
		const layout = state.layouts.find((l) => l.id === id);
		if (layout) {
			layout.width = width;
			this.save();
		}
	},

	reset() {
		state.layouts = defaultLayout();
		this.save();
	},

	save() {
		if (typeof window === 'undefined') return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state.layouts));
	}
};
