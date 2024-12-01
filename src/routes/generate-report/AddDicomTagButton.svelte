<script lang="ts">
	import { buttonVariants } from '@shadcn/ui/button';
	import * as Dialog from '@shadcn/ui/dialog';
	import DicomTagTable from './DicomTagTable.svelte';
	import Button from '@shadcn/ui/button/button.svelte';
	import { DicomTagsTableStore, type Image } from '../stores';

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
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Edit</Dialog.Trigger>
	<Dialog.Content class="max-w-[50%] max-h-[70%]">
		<Dialog.Header>
			<Dialog.Title>Edit profile</Dialog.Title>
			<Dialog.Description>
				Make changes to your profile here. Click save when you're done.
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
