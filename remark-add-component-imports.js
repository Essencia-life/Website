export default function remarkAddComponentImports() {
	return (tree) => {
		const scriptNode = {
			type: 'html',
			value: `
			<script>
				import EventCalendar from '$lib/components/organisms/EventCalendar.svelte';
				import ImageAndContent from '$lib/components/organisms/ImageAndContent.svelte';
			</script>`
		};

		tree.children.unshift(scriptNode);
	};
}
