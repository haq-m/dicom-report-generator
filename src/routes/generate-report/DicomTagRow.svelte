<script lang="ts">
	import { type DicomTag } from '../stores';
	import DicomTagTableCheckbox from './DicomTagTableCheckbox.svelte';

	// Consts
	const emptyString = '[Empty]';

	// Props
	export let dicomItem: DicomTag;
	export let searchInput: string;
	// export let scrollArea: HTMLElement;
	$: searchInput, console.log('SEARCHINPUT CHANGED', searchInput);

	// Locals
	type DivInputs = {
		contentText: string;
		searchInput: string;
	};

	function marker(txt: string, rex: RegExp): string {
		return txt.replace(rex, (term) => `<mark>${term}</mark>`);
	}

	function escapeRegex(regex: string) {
		return regex.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	function highlight(node: HTMLElement, divInputs: DivInputs) {
		function action() {
			console.log('highlight');
			if (searchInput) {
				node.innerHTML = marker(divInputs.contentText, new RegExp(escapeRegex(searchInput), 'ig'));
				return;
			}
			node.innerHTML = divInputs.contentText;
		}
		action();
		return {
			update() {
				action();
			}
		};
	}

	function isDisplayTextAndSearchTextAMatch(searchText: string) {
		// 	Group: string;
		// Element: string;
		// Description: string;
		// Value
		return (
			dicomItem.Group.toLowerCase().includes(searchText.toLowerCase()) ||
			dicomItem.Element.toLowerCase().includes(searchText.toLowerCase()) ||
			dicomItem.Description.toLowerCase().includes(searchText.toLowerCase())
		);
	}
</script>

{#if isDisplayTextAndSearchTextAMatch(searchInput)}
	<tr
		class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
	>
		<td class="w-4 p-4">
			<div class="flex items-center">
				<DicomTagTableCheckbox tag={dicomItem} />
				<label for="checkbox-table-search-3" class="sr-only">checkbox</label>
			</div>
		</td>
		<td
			class="px-6 py-4"
			use:highlight={{
				searchInput: searchInput,
				contentText: dicomItem.Group
			}}
		>
			{dicomItem.Group}
		</td>
		<td
			class="px-6 py-4"
			use:highlight={{
				searchInput: searchInput,
				contentText: dicomItem.Element
			}}
		>
			{dicomItem.Element}
		</td>
		<td
			class="px-6 py-4"
			use:highlight={{
				searchInput: searchInput,
				contentText: dicomItem.Description
			}}
		>
			{dicomItem.Description}
		</td>
		<td
			class="px-6 py-4"
			use:highlight={{
				searchInput: searchInput,
				contentText: dicomItem.Value
			}}
		>
			{dicomItem.Value}
		</td>
	</tr>
{/if}
