<script lang="ts">
	import CrossSvg from '$lib/CrossSvg.svelte';
	import ScalingSvg from '$lib/ScalingSvg.svelte';
	import * as Popover from '@shadcn/ui/popover';
	import { Slider } from '@shadcn/ui/slider';

	interface EnableButtons {
		resize: boolean;
		remove: boolean;
	}

	// Props
	export let src: string;
	export let buttons: EnableButtons = { resize: true, remove: true };
	export let opacity: string = '';

	// Local
	let hover: boolean = false;
	let resizeOpen: boolean = false;
	let imageSize: number[] = [90];

	// Function
	function hideResize(hover: boolean, buttonEnabled: boolean, isPopUpOpen: boolean): boolean {
		if (buttonEnabled === false) {
			return true;
		}

		if (isPopUpOpen) {
			return false;
		}
		return !hover;
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
	class="relative p-3 h-full w-full flex justify-center items-center"
	on:mouseover={() => {
		hover = true;
	}}
	on:mouseout={() => {
		hover = false;
	}}
>
	<div class="absolute top-0 right-0">
		<!-- svelte-ignore a11y-interactive-supports-focus -->
		<div class="flex space-x-1 w-full h-full">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="w-5 p-0.5" hidden={hideResize(hover, buttons.resize, resizeOpen)}>
				<Popover.Root bind:open={resizeOpen}>
					<Popover.Trigger>
						<ScalingSvg />
					</Popover.Trigger>
					<Popover.Content side="top" strategy="fixed">
						<Slider bind:value={imageSize} max={350} step={1} class="w-full" />
					</Popover.Content>
				</Popover.Root>
			</div>

			<!-- svelte-ignore a11y-interactive-supports-focus -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="w-5 p-0.5"
				role="button"
				hidden={!hover || !buttons.remove}
				on:click={() => {
					src = '';
				}}
			>
				<CrossSvg />
			</div>
		</div>
	</div>
	<div class="">
		<img alt="The project logo" class={opacity} {src} height={imageSize[0]} width={imageSize[0]} />
	</div>
</div>
