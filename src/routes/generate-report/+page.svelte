<script lang="ts">
	import Button from '@shadcn/ui/button/button.svelte';
	import { DicomTagsTableStore, imagesStore } from '../stores';
	import { goto } from '$app/navigation';
	import EditableLineEdit from '../EditableLineEdit.svelte';
	import EditableTextComponent from './EditableTextComponent.svelte';
	import AddDicomTagButton from './AddDicomTagButton.svelte';
	import PlusSvg from '$lib/PlusSvg.svelte';

	// Vars
	const imageUrl = $imagesStore?.Base64Image
		? $imagesStore?.Base64Image
		: 'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg';

	let properties: PropertyView[] = [];
	properties.push({ displayName: 'Comments', value: '' });
	properties.push({ displayName: 'Terms & Conditions', value: '' });

	// Functions
	function onDownloadButtonClicked() {
		let element = document.getElementById('page-to-print');
		let clonedElement = element?.cloneNode(true) as HTMLElement;
		let forms = clonedElement!.querySelectorAll('input');
		forms.forEach((form) => {
			if (form.value != null || form.value === '') {
				form.placeholder = '';
			}
		});

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
	<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js">
	</script>
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
<div class="flex flex-col w-full bg-[#F2F3F5] overflow-scroll rounded-md pt-10 pb-10">
	<div
		id="page-to-print"
		class="mx-auto w-full max-w-[50rem] items-start gap-6 border bg-white shadow-2xl drop-shadow-xl"
	>
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
			<div class="flex mx-4 bg-[#666666] text-white font-sans font-semibold pl-2">
				<div>Images</div>
			</div>
			<div class="flex items-center justify-center pt-4 pb-4">
				<img alt="The project logo" src={imageUrl} height="90" width="90" />
			</div>

			<!-- DICOM METADATA SECTION -->
			<div class="flex mx-4 bg-[#666666] text-white font-sans font-semibold pl-2">
				<div>DICOM Metadata</div>
				<div class="pl-2 pr-2"></div>
				{#if $imagesStore !== null && $imagesStore.Tags !== undefined}
					<!-- <AddDicomTagButton bind:image={$imagesStore} /> -->
				{/if}
			</div>
			<div class="p-4 flex flex-col bg-white pt-4 pb-4">
				{#if $imagesStore !== null && $imagesStore.Tags !== undefined}
					{#if $DicomTagsTableStore.SelectedIds.size === 0}
						<!-- <div class="flex justify-center items-center text-gray-500 italic">
							No DICOM tags selected
						</div> -->
						<!-- <AddDicomTagButton bind:image={$imagesStore} /> -->
					{:else}
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
						<div class="flex justify-center items-center">
							<AddDicomTagButton bind:image={$imagesStore} />
						</div>
					{/if}
				{/if}
			</div>

			<!-- CUSTOM PROPERTY SECTION / REPORT NOTES SECTION -->
			<div class="mx-4 bg-[#666666] text-white font-sans font-semibold pl-2">NOTES</div>
			<div class="p-4 bg-white pt-4 pb-4">
				{#each properties as property, index}
					<EditableTextComponent
						bind:property
						deleteFunc={() => {
							properties.splice(index, 1);
							properties = properties;
						}}
					/>
					<div class="border-b my-2 mx-4"></div>
				{/each}

				<div class="flex justify-center items-center">
					<div class="align-middle self-center bg-[#26A65B] text-white font-extrabold rounded-full">
						<div class="w-5 p-0.5">
							<PlusSvg />
						</div>
					</div>
					<button
						class="font-sans hover:underline text-[#428bca] pl-2"
						on:click={() => {
							properties.push({ displayName: 'Test Displayname', value: 'test value' });
							properties = properties;
						}}
					>
						Add line item
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
