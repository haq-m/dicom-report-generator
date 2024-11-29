<script lang="ts">
	import { onMount } from 'svelte';
	import { type DicomTag, DicomTagsTableStore } from '../stores';

	// Props
	export let tag: DicomTag;

	// Locals
	let checked: boolean = tag.Selected;
	let mounted: boolean = false;

	// Reactivity
	$: onCheckedChanged(checked);
	$: onSelectedIdsChanged($DicomTagsTableStore.SelectedIds);

	// Functions
	function onCheckedChanged(value: boolean): void {
		if (!mounted) {
			return;
		}

		if (value) {
			$DicomTagsTableStore.SelectedIds.add(tag.Id);
			$DicomTagsTableStore.SelectedIds = $DicomTagsTableStore.SelectedIds;
			return;
		}

		$DicomTagsTableStore.SelectedIds.forEach((x) => {
			if (x === tag.Id) {
				$DicomTagsTableStore.SelectedIds.delete(x);
			}
		});

		$DicomTagsTableStore.SelectedIds = $DicomTagsTableStore.SelectedIds;
	}

	function onSelectedIdsChanged(list: Set<string>) {
		checked = list.has(tag.Id);
	}

	// Lifecycles
	onMount(() => {
		mounted = true;
	});
</script>

<input
	id="checkbox-all-search"
	type="checkbox"
	class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
	bind:checked
/>
<label for="checkbox-all-search" class="sr-only">checkbox</label>
