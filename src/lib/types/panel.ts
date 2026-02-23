import type { StoryCategory } from './story.js';

export interface PanelConfig {
	id: PanelId;
	title: string;
	icon: string;
	contentType: 'stories' | 'map' | 'trending' | 'digest' | 'history' | 'video' | 'quote';
	category?: StoryCategory;
	defaultWidth: 1 | 2 | 4;
	visible: boolean;
	order: number;
}

export type PanelId =
	| StoryCategory
	| 'globe'
	| 'trending'
	| 'digest'
	| 'history'
	| 'video'
	| 'quote';

export interface PanelLayout {
	id: PanelId;
	visible: boolean;
	order: number;
	width: 1 | 2 | 4;
}
