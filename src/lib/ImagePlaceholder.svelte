<script lang="ts">
	import CrossSvg from '$lib/CrossSvg.svelte';
	import Button from '@shadcn/ui/button/button.svelte';
	import * as Popover from '@shadcn/ui/popover';

	// Props
	export let src: string;

	// Local
	let hover: boolean = false;
</script>

<Popover.Root>
	<!-- svelte-ignore a11y-mouse-events-have-key-events -->
	<Popover.Trigger>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<div
			class="relative border p-3"
			on:mouseover={() => {
				hover = true;
			}}
			on:mouseout={() => {
				hover = false;
			}}
		>
			<div class="absolute top-0 right-0 border">
				<div class="w-5 p-0.5" hidden={!hover}>
					<CrossSvg />
				</div>
			</div>
			<img alt="The project logo" {src} height="90" width="90" />
		</div>
	</Popover.Trigger>
	<Popover.Content>Place content for the popover here.</Popover.Content>
</Popover.Root>
