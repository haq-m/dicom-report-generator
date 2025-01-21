<script lang="ts">
	import { imagesStore } from '../stores';
	import ImagePlaceholder from './ImagePlaceholder.svelte';

	// Props
	export let accept: string;

	// Locals
	let src: string | null = null;
	let hover: boolean = false;
	let files: FileList;
	let fileInput: HTMLInputElement | undefined;

	// Functions
	function onButtonClicked(e: Event) {
		fileInput?.click();
		onFileInputClick(e);
	}

	function onFileInputClick(e: Event): void {
		// WORKAROUND: HA: 22.11.2023: Chrome requires this reset to allow selecting
		// same file to trigger changed event
		(e.target as HTMLInputElement).value = '';
	}

	async function onFilesAdded(e: Event): Promise<void> {
		onFileInputClick(e);
		if (!files) {
			return;
		}
		var file = files[0];
		if (file) {
			const base64String = await toBase64(file);
			if (typeof base64String === 'string') {
				src = base64String;
			}
		}
	}
	const toBase64 = (file: File) =>
		new Promise<string | ArrayBuffer | null>((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
		});

	function styleOnHover(isHover: boolean, imageSrc: string | null): string {
		return isHover || imageSrc ? 'h-32' : 'h-7';
	}

	function styleOnImageValue(isHover: boolean, imageSrc: string | null): string {
		return imageSrc && !isHover
			? 'bg-transparent'
			: 'bg-[#E3E3E3] border-dashed border-2 border-spacing-2 border-[#AAAAAA] ';
	}
</script>

<input
	data-skip="true"
	name="files"
	bind:files
	bind:this={fileInput}
	type="file"
	{accept}
	hidden={true}
	on:change={onFilesAdded}
/>

<!-- <img alt="The project logo" src={imageUrl} />	 -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
	class="relative cursor-pointer
	transition-height duration-500 ease-in-out
	{styleOnHover(hover, src)} 
	{styleOnImageValue(hover, src)}
	flex justify-center items-center"
	on:mouseover={() => {
		hover = true;
	}}
	on:mouseout={() => {
		hover = false;
	}}
>
	{#if src === null || src.length === 0}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<span
			data-skip="true"
			class="font-sans font-semibold text-[#AAAAAA] w-full h-full flex justify-center items-center"
			on:click={onButtonClicked}>Your Logo</span
		>
	{:else}
		<div class="w-full h-full z-50">
			<ImagePlaceholder bind:src opacity={hover ? 'opacity-10' : ''} />
		</div>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<span
			class="absolute font-sans font-semibold text-[#AAAAAA] w-full h-full flex justify-center items-center
			{hover ? 'opacity-100' : 'opacity-0'}"
			on:click={onButtonClicked}
		>
			Change Image
		</span>
	{/if}
</div>
