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

export interface DicomTagsTable {
	SelectedIds: Set<string>;
	SearchInput: string;
}

export const DicomTagsTableStore = createDicomTagsTableStore();

export function createDicomTagsTableStore() {
	const { subscribe, set, update } = writable<DicomTagsTable>({
		SelectedIds: new Set<string>(),
		SearchInput: ''
	});

	return {
		subscribe,
		set,
		update
	};
}
