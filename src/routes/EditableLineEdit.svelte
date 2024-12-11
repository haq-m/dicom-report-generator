<script lang="ts">
	// Props
	export let editMode: boolean = false;
	export let placeholder: string = '';
	export let value: string = '';
</script>

<div class="w-full">
	<input
		class="w-full p-1 hover:bg-[#FDF4DB] focus:hover:bg-transparent"
		readonly={!editMode}
		type="text"
		{value}
		{placeholder}
		on:focus={() => {
			editMode = true;
		}}
	/>
</div>
