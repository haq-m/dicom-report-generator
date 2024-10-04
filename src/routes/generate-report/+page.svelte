<script lang="ts">
	import Button from '@shadcn/ui/button/button.svelte';
	import { imagesStore } from '../stores';
	import { goto } from '$app/navigation';
	import EditableLineEdit from '../EditableLineEdit.svelte';
	import EditableTextComponent from './EditableTextComponent.svelte';
	import * as Dialog from '@shadcn/ui/dialog';
	import { buttonVariants } from '@shadcn/ui/button';
	import { Label } from '@shadcn/ui/label';
	import { Input } from '@shadcn/ui/input';
	import { Render, Subscribe, createRender, createTable } from 'svelte-headless-table';
	import {
		addHiddenColumns,
		addPagination,
		addSelectedRows,
		addSortBy,
		addTableFilter
	} from 'svelte-headless-table/plugins';
	import { readable } from 'svelte/store';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	// import Actions from './data-table-actions.svelte';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import * as Table from '@shadcn/ui/table/index.js';
	import { cn } from '@shadcn/utils.js';

	const imageTags = $imagesStore?.Tags;
	const imageUrl = $imagesStore?.Base64Image
		? $imagesStore?.Base64Image
		: 'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg';

	let properties: PropertyView[] = [];
	properties.push({ displayName: 'Comments', value: '' });
	let searchInput: string = '';

	function onDownloadButtonClicked() {
		let element = document.getElementById('page-to-print');
		let clonedElement = element?.cloneNode(true) as HTMLElement;
		let forms = clonedElement!.querySelectorAll('input');
		forms.forEach((form) => {
			if (form.value != null || form.value === '') {
				form.placeholder = '';
			}
		});

		// html2pdf(element);
		var options = {
			jsPDF: {
				format: 'a4'
			},
			html2canvas: { letterRendering: true, useCORS: true, logging: false, scale: 2 },
			margin: 5, // Set appropriate margins
			autoPaging: 'text', // Crucial for handling text flow across pages
			image: { type: 'jpeg', quality: 1 },
			filename: 'myfile.pdf'
		};
		html2pdf().from(clonedElement).toCanvas().set(options).save();
	}

	const table = createTable(readable(imageTags), {
		sort: addSortBy({ disableMultiSort: true }),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.includes(filterValue)
		}),
		select: addSelectedRows()
	});

	const columns = table.createColumns([
		table.column({
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			accessor: 'Id',
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			header: 'Tags',
			accessor: 'Group',
			plugins: { sort: { disable: true }, filter: { exclude: true } }
		}),
		table.column({
			header: 'Name',
			accessor: 'Description',
			plugins: {
				filter: {
					getFilterValue(value) {
						return value.toLowerCase();
					}
				}
			}
		}),
		table.column({
			header: 'Value',
			accessor: 'Value',
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { sortKeys } = pluginStates.sort;

	// const { hiddenColumnIds } = pluginStates.hide;
	// const ids = flatColumns.map((c) => c.id);
	// let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

	// $: $hiddenColumnIds = Object.entries(hideForId)
	// 	.filter(([, hide]) => !hide)
	// 	.map(([id]) => id);

	const { filterValue } = pluginStates.filter;
	const { selectedDataIds } = pluginStates.select;
</script>

<svelte:head>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
	></script>
</svelte:head>

<div class="flex justify-between p-4 bg-white sticky top-0">
	<Button
		on:click={() => {
			goto('/');
		}}
	>
		Back
	</Button>
	<Button on:click={onDownloadButtonClicked}>Download PDF</Button>
</div>
<div class="flex flex-col w-full bg-gray-100 overflow-scroll rounded-md pt-10 pb-10">
	<div id="page-to-print" class="mx-auto w-full max-w-[50rem] items-start gap-6 border bg-white">
		<div class="flex flex-col bg-white shadow-sm">
			<div class="w-full p-8 grid grid-cols-3">
				<div class="border flex flex-col gap-y-1">
					<div>LOGO</div>
					<EditableLineEdit placeholder="Company Name" />
					<EditableLineEdit placeholder="Your Name" />
					<EditableLineEdit placeholder="City, State Zip" />
					<EditableLineEdit placeholder="Country" />
				</div>
				<div class="grow"></div>
				<div class="flex justify-center border font-medium">Report</div>
			</div>

			<!-- IMAGES SECTION -->
			<div class="flex bg-black text-white pl-2">
				<div>Images</div>
			</div>
			<div class="flex items-center justify-center bg-pink-100 pt-4 pb-4">
				<img alt="The project logo" src={imageUrl} height="90" width="90" />
			</div>

			<!-- DICOM METADATA SECTION -->
			<div class="flex bg-black text-white pl-2">
				<div>DICOM Metadata</div>

				<!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- <Button class="cursor-pointer border border-red-200 pl-2 pr-2 h-full" on:click={() => {}}>
					+
				</Button> -->
				<div class="pl-2 pr-2">
					<Dialog.Root>
						<Dialog.Trigger class="pl-2 pr-2">+</Dialog.Trigger>
						<Dialog.Content
							class="fixed h-96 left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg border bg-background p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full"
						>
							<Dialog.Header>
								<Dialog.Title>Add/Remove DICOM Metadata</Dialog.Title>
								<Dialog.Description>
									Choose DICOM metadata you wish to add in the report.
								</Dialog.Description>
							</Dialog.Header>
							<Input
								class="max-w-sm"
								placeholder="Filter emails..."
								type="text"
								bind:value={$filterValue}
							/>
							<Table.Root {...$tableAttrs}>
								<Table.Header>
									{#each $headerRows as headerRow}
										<Subscribe rowAttrs={headerRow.attrs()}>
											<Table.Row>
												{#each headerRow.cells as cell (cell.id)}
													<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
														<Table.Head {...attrs} class={cn('[&:has([role=checkbox])]:pl-3')}>
															{#if cell.id === 'amount'}
																<div class="text-right font-medium">
																	<Render of={cell.render()} />
																</div>
															{:else if cell.id === 'email'}
																<Button variant="ghost" on:click={props.sort.toggle}>
																	<Render of={cell.render()} />
																	<ArrowUpDown
																		class={cn(
																			$sortKeys[0]?.id === cell.id && 'text-foreground',
																			'ml-2 h-4 w-4'
																		)}
																	/>
																</Button>
															{:else}
																<Render of={cell.render()} />
															{/if}
														</Table.Head>
													</Subscribe>
												{/each}
											</Table.Row>
										</Subscribe>
									{/each}
								</Table.Header>
								<Table.Body {...$tableBodyAttrs}>
									{#each $pageRows as row (row.id)}
										<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
											<Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && 'selected'}>
												{#each row.cells as cell (cell.id)}
													<Subscribe attrs={cell.attrs()} let:attrs>
														<Table.Cell class="[&:has([role=checkbox])]:pl-3" {...attrs}>
															{#if cell.id === 'amount'}
																<div class="text-right font-medium">
																	<Render of={cell.render()} />
																</div>
															{:else if cell.id === 'status'}
																<div class="capitalize">
																	<Render of={cell.render()} />
																</div>
															{:else}
																<Render of={cell.render()} />
															{/if}
														</Table.Cell>
													</Subscribe>
												{/each}
											</Table.Row>
										</Subscribe>
									{/each}
								</Table.Body>
							</Table.Root>
							<Dialog.Footer>
								<Button type="submit">Save changes</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>
					<Dialog.Root>
						<Dialog.Trigger class="pl-2 pr-2">+-=</Dialog.Trigger>
						<Dialog.Content
							class="fixed h-[70%] rounded-card-lg border bg-background p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full"
						>
							<Dialog.Header class="bg-rose-200 h-14">
								<Dialog.Title class="bg-blue-200 h-full">Add/Remove DICOM Metadata</Dialog.Title>
								<Dialog.Description class="bg-green-200 h-full">
									Choose DICOM metadata you wish to add in the report.
								</Dialog.Description>
							</Dialog.Header>
							<div class="flex flex-col bg-yellow-200 w-full h-full">
								HELLo
								<input
									class="input rounded-none bg-transparent p-1"
									type="text"
									placeholder="Search..."
									bind:value={searchInput}
								/>
							</div>

							<Dialog.Footer class="bottom-0">
								<Button type="submit">Save changes</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>
				</div>
			</div>
			<div class="p-4 flex flex-col bg-white pt-4 pb-4">
				{#if imageTags}
					{#each imageTags as tag}
						<div class="p-2">
							<div class="pb-1 font-bold">{`(${tag.Group},${tag.Element}) ${tag.Description}`}</div>
							<div>{`${tag.Value}`}</div>
						</div>
					{/each}
				{/if}
			</div>

			<!-- CUSTOM PROPERTY SECTION / REPORT NOTES SECTION -->
			<div class="bg-black text-white pl-2">NOTES</div>
			<div class="p-4 bg-white pt-4 pb-4">
				{#each properties as property, index}
					<EditableTextComponent
						bind:property
						deleteFunc={() => {
							properties.splice(index, 1);
							properties = properties;
						}}
					/>
				{/each}
				<Button
					on:click={() => {
						properties.push({ displayName: 'Test Displayname', value: 'test value' });
						properties = properties;
					}}
				>
					<div class="flex align-middle items-center gap-x-2">+ Add line item</div>
				</Button>
			</div>
		</div>
	</div>
</div>
