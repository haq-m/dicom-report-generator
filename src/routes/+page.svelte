<script lang="ts">
	import { Button } from '@shadcn/ui/button';
	import * as Card from '@shadcn/ui/card';
	import * as dicomjs from 'dicom.ts';

	// Vars
	let files: FileList;
	let imageUrl: string = '';

	// Reactivity
	$: onFilesDropped(files);

	// Functions
	async function onFilesDropped(files: FileList) {
		if (!files) {
			return;
		}

		let canvas: HTMLCanvasElement = document.createElement('canvas');
		let arrayBuffer = await files[0].arrayBuffer();
		const image = dicomjs.parseImage(arrayBuffer);
		const renderer = new dicomjs.Renderer(canvas);
		// TODO: Decode and render frame 0 on the canvas
		// Eventually let user to select frames within the file
		await renderer.render(image, 0);
		imageUrl = canvas.toDataURL();
	}
</script>

<div class="flex flex-col min-h-screen w-full">
	<header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
		<div class="flex w-full justify-center items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
			TITLE
		</div>
	</header>
	<main
		class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10"
	>
		<div class="mx-auto w-full max-w-[50rem] items-start gap-6">
			<div class="grid gap-6">
				<Card.Root>
					<Card.Header>
						<Card.Title class="flex justify-center">DICOM Report Generator</Card.Title>
						<Card.Description class="flex justify-center">
							Start selecting DICOM file you wish to generate a report for
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<input
							type="file"
							bind:files
							multiple
							accept=".dcm"
							class={'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'}
						/>
						{#if imageUrl.length}
							<div class="flex items-center justify-center h-96 bg-pink-100 pt-4 pb-4">
								<img alt="The project logo" class="h-full" src={imageUrl} />
							</div>
						{/if}
					</Card.Content>
					<Card.Footer class=" flex items-center justify-center border-t px-6 py-4">
						<Button>Generate report</Button>
					</Card.Footer>
				</Card.Root>
			</div>
		</div>
	</main>
</div>
