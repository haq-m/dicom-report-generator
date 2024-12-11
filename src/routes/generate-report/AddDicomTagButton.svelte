<script lang="ts">
	import { buttonVariants } from '@shadcn/ui/button';
	import * as Dialog from '@shadcn/ui/dialog';
	import DicomTagTable from './DicomTagTable.svelte';
	import Button from '@shadcn/ui/button/button.svelte';
	import { DicomTagsTableStore, type Image } from '../stores';
	import PlusSvg from '$lib/PlusSvg.svelte';

	// Props
	export let image: Image;

	// Locals
	let dialogOpen = false;
	let dicomTableStore = $DicomTagsTableStore;

	// Functions
	function onSaveButtonClicked() {
		image.Tags.forEach((tag) => {
			if (dicomTableStore.SelectedIds.has(tag.Id)) {
				tag.Selected = true;
				return;
			}
			tag.Selected = false;
		});

		image = image;
		dialogOpen = false;
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger>
		<div class="flex items-center">
			<div class="align-middle self-center bg-[#26A65B] text-white font-extrabold rounded-full">
				<div class="w-5 p-0.5">
					<PlusSvg />
				</div>
			</div>
			<div class="font-sans hover:underline text-[#428bca] pl-2">Add tags</div>
		</div>
	</Dialog.Trigger>
	<Dialog.Content class="max-w-[50%] max-h-[70%]">
		<Dialog.Header>
			<Dialog.Title>DICOM Tags</Dialog.Title>
			<Dialog.Description>
				Add DICOM tags you wish to show in the report. Click save when you are done.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<input
				class="input bg-transparent p-1 border rounded-sm"
				type="text"
				placeholder="Search..."
				bind:value={$DicomTagsTableStore.SearchInput}
			/>
		</div>

		<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
			{#if image !== undefined}
				<DicomTagTable bind:dicomTags={image.Tags} />
			{:else}
				<div>DICOM Tags not available</div>
			{/if}
		</div>

		<Dialog.Footer>
			<Button type="submit" on:click={onSaveButtonClicked}>Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
