<script lang="ts">
	import { searchColors } from './searchColors';

	export let count: number = -1;
	export let searchIndex: number = -1;

	$: searchColor = searchColors[searchIndex] || 'transparent';
</script>

<div class="root" style={`--search-color: ${searchColor}`}>
	<div class="badge">
		<div class="count">
			{count >= 0 ? count : ''}
		</div>
	</div>
</div>

<style>
	.badge {
		background-color: var(--search-color);
		border-radius: 10000px;
        box-sizing: border-box;
		aspect-ratio: 1/1;
		padding: 0.5em;
		display: grid;
        grid-template-columns: auto;
        grid-template-rows: auto;
		place-content: center;
		place-items: center;
        text-align: center;
        vertical-align: middle;
        width: 3em;
        height: 3em;
	}
</style>
