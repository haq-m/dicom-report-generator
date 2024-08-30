<script lang="ts">
	import CrossSvg from '$lib/CrossSvg.svelte';
	import EditableLineEdit from '../EditableLineEdit.svelte';

	// Props
	export let property: PropertyView;
	export let deleteFunc: () => void;

	// Locals
	let hover: boolean = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
	class="flex p-2 gap-x-2"
	on:mouseover={() => {
		hover = true;
	}}
	on:mouseout={() => {
		hover = false;
	}}
>
	<div class="w-full">
		<div class="font-semibold pb-1">
			<EditableLineEdit placeholder="Title" value={property.displayName} />
		</div>
		<EditableLineEdit placeholder="Enter text here..." value={property.value} />
	</div>
	<button
		class="align-middle self-center bg-teal-400 rounded-full"
		on:click={() => {
			deleteFunc();
		}}
	>
		<div class="w-5" hidden={!hover}>
			<CrossSvg />
		</div>
	</button>
</div>
