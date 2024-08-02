<script lang="ts">
	import Button from '@shadcn/ui/button/button.svelte';
	import { imagesStore } from '../stores';
	import { goto } from '$app/navigation';
	import EditableLineEdit from '../EditableLineEdit.svelte';

	let imageTags = $imagesStore?.Tags;

	let imageUrl = $imagesStore?.Base64Image
		? $imagesStore?.Base64Image
		: 'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg';

	function onDownloadButtonClicked() {
		let element = document.getElementById('page-to-print');
		// html2pdf(element);
		var options = {
			jsPDF: {
				format: 'a4'
			},
			html2canvas: { letterRendering: true, useCORS: true, logging: false },
			margin: 5, // Set appropriate margins
			autoPaging: 'text', // Crucial for handling text flow across pages
			image: { type: 'jpeg', quality: 1 },
			filename: 'myfile.pdf'
		};
		html2pdf().from(element).toCanvas().set(options).save();
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
<div class="flex flex-col w-full bg-gray-100 overflow-scroll">
	<div id="page-to-print" class="mx-auto w-full max-w-[50rem] items-start gap-6 pt-10">
		<div class="flex flex-col bg-white shadow-sm rounded-md">
			<div class="w-full p-8 grid grid-cols-3">
				<div class="border flex flex-col">
					<div>LOGO</div>
					<EditableLineEdit placeholder="Company Name" />
					<EditableLineEdit placeholder="Your Name" />
					<EditableLineEdit placeholder="City, State Zip" />
					<EditableLineEdit placeholder="Country" />
				</div>
				<div class="grow"></div>
				<div class="flex justify-center border font-medium">Report</div>
			</div>
			<div class="bg-black text-white">Images</div>
			<div class="flex items-center justify-center bg-pink-100 pt-4 pb-4">
				<img alt="The project logo" src={imageUrl} height="90" width="90" />
			</div>

			<div class="bg-black text-white">DICOM Metadata</div>
			<div class="p-4 flex flex-col bg-white pt-4 pb-4">
				{#if imageTags}
					{#each imageTags as tag}
						<div>{`(${tag.Group},${tag.Element}) ${tag.Group}`}</div>
						<div>{`${tag.Value}`}</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
