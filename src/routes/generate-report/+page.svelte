<script lang="ts">
	import Button from '@shadcn/ui/button/button.svelte';
	import { imagesStore } from '../stores';
	import { goto } from '$app/navigation';
	import EditableLineEdit from '../EditableLineEdit.svelte';
	import EditableTextComponent from './EditableTextComponent.svelte';
	import { createRender, createTable } from 'svelte-headless-table';
	import { addSelectedRows, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { readable } from 'svelte/store';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import AddDicomTagButton from './AddDicomTagButton.svelte';

	const imageUrl = $imagesStore?.Base64Image
		? $imagesStore?.Base64Image
		: 'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg';

	$: console.log($imagesStore?.Tags, 'CHANGED IN MAIN');

	let properties: PropertyView[] = [];
	properties.push({ displayName: 'Comments', value: '' });

	function onDownloadButtonClicked() {
		let element = document.getElementById('page-to-print');
		let clonedElement = element?.cloneNode(true) as HTMLElement;
		let forms = clonedElement!.querySelectorAll('input');
		forms.forEach((form) => {
			if (form.value != null || form.value === '') {
				form.placeholder = '';
			}
		});

		// html2pdf(element);
		var options = {
			jsPDF: {
				format: 'a4'
			},
			html2canvas: { letterRendering: true, useCORS: true, logging: false, scale: 2 },
			margin: 5, // Set appropriate margins
			autoPaging: 'text', // Crucial for handling text flow across pages
			image: { type: 'jpeg', quality: 1 },
			filename: 'myfile.pdf'
		};
		html2pdf().from(clonedElement).toCanvas().set(options).save();
	}
</script>

<svelte:head>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
	></script>
</svelte:head>

<div class="flex justify-between p-4 bg-white sticky top-0">
	<Button
		on:click={() => {
			goto('/');
		}}
	>
		Back
	</Button>
	<Button on:click={onDownloadButtonClicked}>Download PDF</Button>
</div>
<div class="flex flex-col w-full bg-gray-100 overflow-scroll rounded-md pt-10 pb-10">
	<div id="page-to-print" class="mx-auto w-full max-w-[50rem] items-start gap-6 border bg-white">
		<div class="flex flex-col bg-white shadow-sm">
			<div class="w-full p-8 grid grid-cols-3">
				<div class="border flex flex-col gap-y-1">
					<div>LOGO</div>
					<EditableLineEdit placeholder="Company Name" />
					<EditableLineEdit placeholder="Your Name" />
					<EditableLineEdit placeholder="City, State Zip" />
					<EditableLineEdit placeholder="Country" />
				</div>
				<div class="grow"></div>
				<div class="flex justify-center border font-medium">Report</div>
			</div>

			<!-- IMAGES SECTION -->
			<div class="flex bg-black text-white pl-2">
				<div>Images</div>
			</div>
			<div class="flex items-center justify-center bg-pink-100 pt-4 pb-4">
				<img alt="The project logo" src={imageUrl} height="90" width="90" />
			</div>

			<!-- DICOM METADATA SECTION -->
			<div class="flex bg-black text-white pl-2">
				<div>DICOM Metadata</div>
				<div class="pl-2 pr-2"></div>
				{#if $imagesStore !== null && $imagesStore.Tags !== undefined}
					<AddDicomTagButton bind:image={$imagesStore} />
				{/if}
			</div>
			<div class="p-4 flex flex-col bg-white pt-4 pb-4">
				{#if $imagesStore !== null && $imagesStore.Tags !== undefined}
					{#each $imagesStore.Tags as tag (`${tag.Id}-${tag.Selected}`)}
						{#if tag.Selected}
							<div class="p-2">
								<div class="pb-1 font-bold">
									{`(${tag.Group},${tag.Element}) ${tag.Description}`}
								</div>
								<div>{`${tag.Value}`}</div>
							</div>
						{/if}
					{/each}
				{/if}
			</div>

			<!-- CUSTOM PROPERTY SECTION / REPORT NOTES SECTION -->
			<div class="bg-black text-white pl-2">NOTES</div>
			<div class="p-4 bg-white pt-4 pb-4">
				{#each properties as property, index}
					<EditableTextComponent
						bind:property
						deleteFunc={() => {
							properties.splice(index, 1);
							properties = properties;
						}}
					/>
				{/each}
				<Button
					on:click={() => {
						properties.push({ displayName: 'Test Displayname', value: 'test value' });
						properties = properties;
					}}
				>
					<div class="flex align-middle items-center gap-x-2">+ Add line item</div>
				</Button>
			</div>
		</div>
	</div>
</div>
