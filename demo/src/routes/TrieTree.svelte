<script lang="ts">
	import { createTrieDisplayTree, type TrieDisplayNode, type TrieNode } from 'trie-search';
	import mermaid from 'mermaid';
	import { afterUpdate } from 'svelte';

	// ---- Mermaid Helpers  ----- //
	const mermaidHeader = `---
config:
  theme: neutral
---
stateDiagram-v2`;

	const nodeToMermaid = (
		node: TrieDisplayNode<string>,
		mermaidId: string,
		states: string[],
		transitions: string[],
		classes: string[]
	) => {
		if (mermaidId !== '[*]') {
			states.push(`${mermaidId}:${node.value.replace(' ', '&nbsp')}`);
			node.searchIndices?.forEach((si) => classes.push(`class ${mermaidId} search-index-${si}`));
		}

		node.children?.forEach((child) => {
			const childValue = child.value.replace(' ', '_');
			const childId = mermaidId !== '[*]' ? `${mermaidId}_${childValue}` : `${childValue}`;
			transitions.push(`${mermaidId} --> ${childId}`);
			nodeToMermaid(child, childId, states, transitions, classes);
		});
	};

	// ---- Search Colors  ----- //
	const addSearchColors = () => {
		const nodes = rootRef?.querySelectorAll('.node') || [];
		nodes.forEach((node) => {
			const rect = node.querySelector('rect');
			if (rect) {
				const height = Number.parseFloat(rect.getAttribute('height') || '0');
				const width = Number.parseFloat(rect.getAttribute('width') || '0');
				let cx = (-width / 2.5) - 5;
				let cy = (-height / 2.0) - 2;
				for (let i = 0; i < 5; i++) {
					if (node.classList.contains(`search-index-${i}`)) {
						const dotRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
						dotRect.setAttribute('x', cx.toString());
						dotRect.setAttribute('y', cy.toString());
						dotRect.setAttribute('width', '5');
						dotRect.setAttribute('height', '5');
						dotRect.classList.add(`search-dot-${i}`);
						node.appendChild(dotRect);
						cy += 8;
					}
				}
			}
		});
	};

	// ---- Props ----- //
	export let node: TrieNode<string>;

	// ---- State ----- //
	let diagram: string = mermaidHeader;
	let rootRef: HTMLDivElement;
	let container: HTMLSpanElement;

	$: treeNode = createTrieDisplayTree('[*]', node);

	$: {
		const states: string[] = [];
		const transitions: string[] = [];
		const classes: string[] = [];
		nodeToMermaid(treeNode, '[*]', states, transitions, classes);
		diagram = [mermaidHeader, ...states, ...transitions, ...classes].join('\n');
	}

	async function renderDiagram() {
		const { svg } = await mermaid.render('mermaid', diagram);
		container.innerHTML = svg;
	}

	$: diagram && renderDiagram();

	afterUpdate(() => {
		addSearchColors();
	});
</script>

<div class="root" bind:this={rootRef}>
	<span bind:this={container}> </span>
</div>

<style>
	.root :global(svg) {
		padding: 0.5em;
		overflow: visible;
	}

	:global(.search-dot-0) {
		stroke-width: 0 !important;
		fill: steelblue !important;
	}

	:global(.search-dot-1) {
		stroke-width: 0 !important;
		fill: indianred !important;
	}

	:global(.search-dot-2) {
		stroke-width: 0 !important;
		fill: green !important;
	}
	:global(.search-dot-3) {
		stroke-width: 0 !important;
		fill: goldenrod !important;
	}
	:global(.search-dot-4) {
		stroke-width: 0 !important;
		fill: mediumpurple !important;
	}
</style>
