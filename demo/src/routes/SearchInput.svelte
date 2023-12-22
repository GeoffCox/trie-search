<script lang="ts">
    import { Input } from "@geoffcox/sterling-svelte";
	import type { ChangeEventHandler } from "svelte/elements";
    export let value : string = '';

    let timer : number | undefined = undefined;

	const debounce = (v : string) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			value = v;
            console.log('onChange', v);
		}, 750);
	}

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newValue = e.currentTarget.value;
        debounce(newValue);
    }
</script>


<Input value={value} on:input={e => onChange(e)} />