<script lang="ts">
	import { Button } from '@shadcn/ui/button';
	import * as Card from '@shadcn/ui/card';
	import { Input } from '@shadcn/ui/input';
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
						<!-- <Label for="picture">Picture</Label> -->
						<Input id="picture" type="file" accept=".dcm" />
					</Card.Content>
					<Card.Footer class=" flex items-center justify-center border-t px-6 py-4">
						<Button>Generate report</Button>
					</Card.Footer>
				</Card.Root>
			</div>
		</div>
	</main>
</div>
