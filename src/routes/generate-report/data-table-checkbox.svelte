<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Checkbox } from '@shadcn/ui/checkbox/index.js';

	export let checked: Writable<boolean>;
</script>

<Checkbox bind:checked={$checked} />
