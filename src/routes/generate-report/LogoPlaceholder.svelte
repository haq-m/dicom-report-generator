<script lang="ts">
	import ImagePlaceholder from './ImagePlaceholder.svelte';

	export let accept: string;

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
		// var fileInput = document.getElementById("fileInput");
		var file = files[0];
		if (file) {
			src = window.URL.createObjectURL(file);
		}
	}

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
	name="files"
	bind:files
	bind:this={fileInput}
	type="file"
	{accept}
	hidden={true}
	on:change={onFilesAdded}
/>

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
