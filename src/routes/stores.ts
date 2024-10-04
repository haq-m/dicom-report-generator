import { writable } from 'svelte/store';

export interface DicomTag {
	Id: string;
	Group: string;
	Element: string;
	Description: string;
	Value: string;
	Selected: boolean;
}

export interface Image {
	Path: string;
	Base64Image: string;
	Tags: DicomTag[];
}

export const imagesStore = writable<Image | null>(null);
