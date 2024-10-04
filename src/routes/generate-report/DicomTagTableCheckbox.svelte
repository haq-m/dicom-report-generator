<script lang="ts">
	import type { DicomTag } from '../stores';

	// Props
	export let tag: DicomTag;
	export let selectedIds: string[];

	// Locals
	let checked: boolean = tag.Selected;

	// Reactivity
	$: onCheckedChanged(checked);

	function onCheckedChanged(value: boolean) {
		// console.log('ON checkbox', index, tag.Id, selectedIds);
		if (value) {
			selectedIds.push(tag.Id);
			return;
		}
		const index = selectedIds.indexOf(tag.Id, 0);
		if (index > -1) {
			selectedIds.splice(index, 1);
			console.log('REMOVED', index, tag.Id, selectedIds);
		}

		selectedIds = selectedIds;
	}
</script>

<input
	id="checkbox-all-search"
	type="checkbox"
	class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
	bind:checked
/>
<label for="checkbox-all-search" class="sr-only">checkbox</label>
