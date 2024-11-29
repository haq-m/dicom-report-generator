<script lang="ts">
	import { onMount } from 'svelte';
	import { DicomTagsTableStore, type DicomTag } from '../stores';
	import DicomTagTableCheckbox from './DicomTagTableCheckbox.svelte';

	// Props
	export let dicomTags: DicomTag[];

	// Vars
	let mounted: boolean = false;
	let checked: boolean = false;

	// Reactivity
	$: onSelectAllStateChanged(checked);
	$: onSelectedIdsChanged($DicomTagsTableStore.SelectedIds);

	// Functions
	function onSelectAllStateChanged(value: boolean): void {
		if (!mounted) {
			return;
		}

		if (value) {
			dicomTags.forEach((tag) => {
				$DicomTagsTableStore.SelectedIds.add(tag.Id);
			});
			$DicomTagsTableStore.SelectedIds = $DicomTagsTableStore.SelectedIds;
			return;
		}

		$DicomTagsTableStore.SelectedIds = new Set<string>();
	}

	function isAllSelected(): boolean {
		let foundNonSelected = false;
		dicomTags.forEach((tag) => {
			if (tag.Selected === false) {
				foundNonSelected = true;
				return;
			}
		});
		return !foundNonSelected;
	}

	function onSelectedIdsChanged(list: Set<string>) {
		checked = $DicomTagsTableStore.SelectedIds.size === dicomTags.length;
	}

	// Lifecycles
	onMount(() => {
		mounted = true;
		checked = isAllSelected();
	});
</script>

<div class="w-full h-96">
	<table
		class="w-full h-96 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-y-auto"
	>
		<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
			<tr>
				<th scope="col" class="p-4">
					<div class="flex items-center">
						<input
							bind:checked
							id="checkbox-all-search"
							type="checkbox"
							class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
						/>
						<label for="checkbox-all-search" class="sr-only">checkbox</label>
					</div>
				</th>
				<th scope="col" class="px-6 py-3"> ID </th>
				<th scope="col" class="px-6 py-3"> Group </th>
				<th scope="col" class="px-6 py-3"> Element </th>
				<th scope="col" class="px-6 py-3"> Description </th>
				<th scope="col" class="px-6 py-3"> Value </th>
			</tr>
		</thead>

		<tbody>
			{#each dicomTags as item (`${item.Id}${item.Value}`)}
				<tr
					class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
				>
					<td class="w-4 p-4">
						<div class="flex items-center">
							<DicomTagTableCheckbox tag={item} />
							<label for="checkbox-table-search-3" class="sr-only">checkbox</label>
						</div>
					</td>
					<th
						scope="row"
						class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
					>
						{item.Id}
					</th>
					<td class="px-6 py-4"> {item.Group} </td>
					<td class="px-6 py-4"> {item.Element} </td>
					<td class="px-6 py-4"> {item.Description} </td>
					<td class="px-6 py-4"> {item.Value} </td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
