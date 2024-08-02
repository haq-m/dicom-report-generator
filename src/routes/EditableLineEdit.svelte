<script lang="ts">
	export let editMode: boolean = false;
	export let placeholder: string = '';

	let value: string = '';
</script>

<div class="p-2">
	<input
		readonly={!editMode}
		type="text"
		{value}
		{placeholder}
		on:focus={() => {
			editMode = true;
		}}
	/>
</div>
