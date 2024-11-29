<script lang="ts">
	import * as dicomjs from 'dicom.ts';

	let files: FileList;
	let imageUrl: string[] = [];
	$: onFilesDropped(files);
	async function onFilesDropped(files: FileList) {
		if (!files) {
			return;
		}
		imageUrl = [];
		for (const file of files) {
			let canvas: HTMLCanvasElement = document.createElement('canvas');

			let arrayBuffer = await file.arrayBuffer();
			// console.log('onFilesDropped', arrayBuffer);
			const image = dicomjs.parseImage(arrayBuffer);
			// access any tags needed, common ones have parameters
			// console.log('PatientID:', image.patientID);
			// or use the DICOM tag group, element id pairs
			// console.log('PatientName:', image.getTagValue([0x0010, 0x0010]));

			const renderer = new dicomjs.Renderer(canvas);

			// decode, and display frame 0 on the canvas
			await renderer.render(image, 0);
			imageUrl.push(canvas.toDataURL());
		}

		imageUrl = imageUrl;
	}
</script>

<h1 class="text-2xl font-bold underline">
	<input type="file" bind:files multiple />
	Hello world!
</h1>
{#if files && files[0]}
	{#each files as file}
		<p>{file.name}</p>
	{/each}
{/if}

<div class="w-96 h-96">
	<!-- <canvas class="hidden" bind:this={canvas} /> -->
	<div>HELLO 1</div>
	{#each imageUrl as url}
		<div>HELLO 2</div>
		<img alt="The project logo" src={url} />
	{/each}
</div>
