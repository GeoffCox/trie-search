<script lang="ts">
	import { searchColors } from "./searchColors";

    export let count : number = -1;
    export let searchIndex : number = -1;

    $: searchColor = searchColors[searchIndex] || 'transparent';
</script>

<div class="root" style={`--search-color: ${searchColor}`}>
    <div class="badge">
        {count >= 0 ? count : ''}
    </div>
</div>

<style>
    .badge {
        background-color: var(--search-color);
        border-radius: 10000px;
        aspect-ratio: 1/1;
        padding: 0.5em;
        display: grid;
        place-content: center;
        place-items: center;
    }
</style>