<script lang="ts">
	import { buttonVariants } from '@shadcn/ui/button';
	import * as Dialog from '@shadcn/ui/dialog';
	import type { DicomTag } from '../stores';
	import DicomTagTable from './DicomTagTable.svelte';
	import Button from '@shadcn/ui/button/button.svelte';
	import { type Image } from '../stores';

	// Props
	export let image: Image;

	// Locals
	let dialogOpen = false;
	let searchInput: string = '';
	let selectedIds: string[] = getAllSelected();

	// Functions
	function getAllSelected(): string[] {
		let list: string[] = [];
		image.Tags.forEach((element) => {
			if (element.Selected) {
				list.push(element.Id);
			}
		});

		return list;
	}

	function onSaveButtonClicked() {
		image.Tags.forEach((element) => {
			var found = selectedIds.findIndex((x) => x === element.Id);
			if (found !== -1) {
				element.Selected = true;
				console.log('FOUND', element);
				return;
			}
			element.Selected = false;
		});

		image = image;
		console.log('HEEY', image);
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
				bind:value={searchInput}
			/>
		</div>

		<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
			{#if image !== undefined}
				<DicomTagTable bind:dicomTags={image.Tags} bind:selectedIds />
			{:else}
				<div>DICOM Tags not available</div>
			{/if}
		</div>

		<Dialog.Footer>
			<Button type="submit" on:click={onSaveButtonClicked}>Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
