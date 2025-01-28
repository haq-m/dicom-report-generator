<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '@shadcn/ui/button';
	import * as Card from '@shadcn/ui/card';
	import * as dicomjs from 'dicom.ts';
	import { imagesStore, type DicomTag } from './stores';
	import Pulse from '$lib/components/Pulse.svelte';

	// Vars
	let files: FileList;
	let imageUrl: string = '';
	let idCounter: number = 0;
	let loading: boolean = false;

	// Reactivity
	$: onFilesDropped(files);

	let dicomTagList: DicomTag[] = [];

	// Functions
	async function onFilesDropped(files: FileList) {
		if (!files) {
			return;
		}
		loading = true;
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
		loading = false;
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
		let des = match?.at(1)?.trim();

		if (des) {
			let sanitizedValue = '';
			const objectType = Object.prototype.toString.call(value);
			if (objectType === '[object Array]') {
				sanitizedValue = value.toString();
			} else {
				sanitizedValue = JSON.stringify(value);
			}
			return {
				Id: (idCounter++).toString(),
				Group: group,
				Element: element,
				Description: des,
				Value: sanitizedValue,
				Selected: false
			};
		}
		return null;
	}

	async function onStaticFileClicked(path: string) {
		loading = true;
		let arrayBuffer: ArrayBuffer | undefined = undefined;
		fetch(path)
			.then((res) => res.blob()) // Gets the response and returns it as a blob
			.then(async (blob) => {
				loading = true;
				arrayBuffer = await blob.arrayBuffer();
				let canvas: HTMLCanvasElement = document.createElement('canvas');
				const image = dicomjs.parseImage(arrayBuffer);
				dicomTagList = getDicomTag(image);
				const renderer = new dicomjs.Renderer(canvas);

				// TODO: Decode and render frame 0 on the canvas
				// Eventually let user select frames within the file
				await renderer.render(image, 0);
				imageUrl = canvas.toDataURL();
				$imagesStore = { Path: '', Base64Image: imageUrl, Tags: dicomTagList };
				loading = false;
			});
	}
</script>

<div id="frontpage" class="flex flex-col min-h-screen w-full">
	<main
		class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10"
	>
		<div class="mx-auto w-full max-w-[50rem] items-start gap-6">
			<div class="grid gap-6">
				<Card.Root>
					<Card.Header>
						<Card.Title class="flex justify-center p-4 text-xl">DICOM Report Generator</Card.Title>
						<Card.Description class="flex justify-center text-base">
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
						<div class="space-y-2">
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
							{#if loading}
								<div class="h-96 w-full flex items-center justify-center">
									<Pulse size={'60'} color={'#666666'} />
								</div>
							{/if}

							{#if imageUrl.length && !loading}
								<div class="flex items-center justify-center h-96 bg-gray-300 pt-4 pb-4">
									<img alt="The project logo" class="h-full" src={imageUrl} />
								</div>
							{/if}
						</div>
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
