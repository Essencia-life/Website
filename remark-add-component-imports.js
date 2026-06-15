export default function remarkAddComponentImports() {
	return (tree) => {
		const scriptNode = {
			type: 'html',
			value: `
			<script>
				import EventCalendar from '$lib/components/organisms/EventCalendar.svelte';
				import ImageAndContent from '$lib/components/organisms/ImageAndContent.svelte';
				import Button from '$lib/components/atoms/Button.svelte';
				import Instagram from '$lib/components/organisms/Instagram.svelte';
				import JoinSections from '$lib/components/templates/JoinSections.svelte';
				import JoinVolunteer from '$lib/components/templates/JoinVolunteer.svelte';
			</script>`
		};

		tree.children.unshift(scriptNode);
	};
}
