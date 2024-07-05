<script lang="ts">
	import { imagesStore } from '../stores';

	let imageTags = $imagesStore?.Tags;

	let imageUrl = $imagesStore?.Base64Image
		? $imagesStore?.Base64Image
		: 'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg';
	console.log(imageTags);
</script>

<div class="flex flex-col h-screen w-full bg-gray-100 overflow-scroll">
	<div class="mx-auto w-full max-w-[50rem] items-start gap-6 pt-10">
		<div class="flex flex-col bg-white h-96 shadow-sm rounded-md">
			<div class="w-full p-8 grid grid-cols-3">
				<div class="border flex flex-col">
					<div>LOGO</div>
					<div>Your Company</div>
					<div>Your Name</div>
					<div>Company Name</div>
					<div>City, State Zip</div>
					<div>Country</div>
				</div>
				<div class="grow"></div>
				<div class="flex justify-center border font-medium">Report</div>
			</div>
			<div class="bg-black text-white">Images</div>
			<div class="flex items-center justify-center h-96 bg-pink-100 pt-4 pb-4">
				<img alt="The project logo" class="h-full" src={imageUrl} />
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
