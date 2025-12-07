export default function remarkAddComponentImports() {
	return (tree) => {
		const scriptNode = {
			type: 'html',
			value: `
			<script>
				import EventCalendar from '$lib/components/organisms/EventCalendar.svelte';
			</script>`
		};

		tree.children.unshift(scriptNode);
	};
}
