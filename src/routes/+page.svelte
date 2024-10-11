<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '@shadcn/ui/button';
	import * as Card from '@shadcn/ui/card';
	import * as dicomjs from 'dicom.ts';
	import { imagesStore, type DicomTag } from './stores';

	// Vars
	let files: FileList;
	let imageUrl: string = '';
	let idCounter: number = 0;

	// Reactivity
	$: onFilesDropped(files);

	//todo:make value array
	let dicomTagList: DicomTag[] = [];

	// Functions
	async function onFilesDropped(files: FileList) {
		if (!files) {
			return;
		}

		let canvas: HTMLCanvasElement = document.createElement('canvas');
		let arrayBuffer = await files[0].arrayBuffer();
		const image = dicomjs.parseImage(arrayBuffer);
		dicomTagList = getDicomTag(image);
		const renderer = new dicomjs.Renderer(canvas);

		// TODO: Decode and render frame 0 on the canvas
		// Eventually let user select frames within the file
		await renderer.render(image, 0);
		imageUrl = canvas.toDataURL();
		$imagesStore = { Path: '', Base64Image: imageUrl, Tags: dicomTagList };
	}

	function getDicomTag(image: any): DicomTag[] {
		let tags = [];
		for (const [key, value] of Object.entries(image.tags)) {
			const tag = getDescriptionName(key, `${value}`, image.tags[key].getConvertedValue());
			if (tag) {
				tags.push(tag);
			}
		}
		return tags;
	}

	function escapeRegex(regex: string) {
		return regex.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	function getDescriptionName(
		dicomId: string,
		displayName: string,
		value: string
	): DicomTag | null {
		const group: string = dicomId.substring(0, 4);
		const element: string = dicomId.substring(4, 8);
		const regexStr: string = `(?<=${escapeRegex(`(${group},${element})`)})(.*)(?=${escapeRegex(`[${value}]`)})`;
		let regex: RegExp = new RegExp(regexStr);
		let match = displayName.match(regex);
		console.log('VALUE:', match?.at(1)?.trim(), match);
		let des = match?.at(1)?.trim();

		if (des) {
			return {
				Id: (idCounter++).toString(),
				Group: group,
				Element: element,
				Description: des,
				Value: value,
				Selected: false
			};
		}
		return null;
	}

	function onDownloadButtonClicked() {
		let element = document.getElementById('frontpage');
		// html2pdf(element);
		var options = {
			jsPDF: {
				format: 'a4'
			},
			html2canvas: { letterRendering: true, useCORS: true, logging: true },
			margin: 5,
			image: { type: 'jpeg', quality: 1 },
			filename: 'myfile.pdf'
		};
		html2pdf().from(element).toCanvas().set(options).save();
	}

	async function onStaticFileClicked(path: string) {
		let arrayBuffer: ArrayBuffer | undefined = undefined;
		fetch(path)
			.then((res) => res.blob()) // Gets the response and returns it as a blob
			.then(async (blob) => {
				console.log('IN HERE');
				arrayBuffer = await blob.arrayBuffer();
				let canvas: HTMLCanvasElement = document.createElement('canvas');
				// arrayBuffer = await files[0].arrayBuffer();
				const image = dicomjs.parseImage(arrayBuffer);
				dicomTagList = getDicomTag(image);
				const renderer = new dicomjs.Renderer(canvas);

				// TODO: Decode and render frame 0 on the canvas
				// Eventually let user select frames within the file
				await renderer.render(image, 0);
				imageUrl = canvas.toDataURL();
				$imagesStore = { Path: '', Base64Image: imageUrl, Tags: dicomTagList };
			});
	}
</script>

<div id="frontpage" class="flex flex-col min-h-screen w-full">
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
							id="input"
							type="file"
							bind:files
							multiple
							accept=".dcm"
							class={'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'}
						/>
						<div class="flex p-2 text-sm bg-yellow-100 rounded-md">
							<div>Use example images instead:</div>
							<!-- svelte-ignore a11y-interactive-supports-focus -->
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div
								class="pl-2 text-blue-500 hover:cursor-pointer"
								role="button"
								on:click={() => {
									onStaticFileClicked('./mrbrain.dcm');
								}}
							>
								mrbrain.dcm
							</div>
						</div>

						{#if imageUrl.length}
							<div class="flex items-center justify-center h-96 bg-pink-100 pt-4 pb-4">
								<img alt="The project logo" class="h-full" src={imageUrl} />
							</div>
						{/if}
					</Card.Content>
					<Card.Footer class=" flex items-center justify-center border-t px-6 py-4">
						<Button
							disabled={imageUrl.length < 1}
							on:click={() => {
								goto('/generate-report');
							}}
						>
							Generate report
						</Button>
					</Card.Footer>
				</Card.Root>
			</div>
		</div>
	</main>
</div>
