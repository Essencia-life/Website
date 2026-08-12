<script>
	import Mail from "@lucide/svelte/icons/mail";
	import MessageSquare from "@lucide/svelte/icons/message-square";
	import Close from "@lucide/svelte/icons/x";
	import SiWhatsapp from '@icons-pack/svelte-simple-icons/icons/SiWhatsapp';
	import { page } from "$app/state";
	import { resolve } from "$app/paths";
	import { goto } from "$app/navigation";

    function supportsPopover() {
        return Object.hasOwn(HTMLElement.prototype, "popover") &&  Object.hasOwn(HTMLButtonElement.prototype, "popoverTargetElement") && CSS.supports('position-area: top');
    }

    function onclick() {
        if (!supportsPopover()) {
            void goto(resolve('/contact'));
        }
    }
</script>

{#if !page.url.pathname.startsWith('/contact')}
<aside class="fixed bottom-4 right-4">
    <div popover="hint" id="contact-options" class="p-2 flex flex-col gap-2">
        <a href="/contact#form" class="fab small no-link text-teal-700">
            <Mail size={20} />
        </a>
        <a href="https://wa.me/351911514554" target="_blank" class="fab small no-link text-lime-600">
            <SiWhatsapp size={20} />
        </a>
    </div>
    <button class="fab" popovertarget="contact-options" {onclick}>
        <span class="closed-icon"><MessageSquare size={24} /></span>
        <span class="opened-icon"><Close size={24} /></span>
    </button>
</aside>
{/if}

<style>
    #contact-options {
        inset: auto;
        position-area: top;
        background: transparent;
        transform-origin: bottom;
        transition:
        opacity 0.3s,
        transform 0.3s,
        overlay 0.3s allow-discrete,
        display 0.3s allow-discrete;
    }

    #contact-options:not(:popover-open) {
        opacity: 0;
        transform: translateY(50%);
    }

    #contact-options:popover-open {
        opacity: 1;
        transform: translateY(0);
    }

    @starting-style {
        #contact-options:popover-open {
            opacity: 0;
            transform: translateY(50%);
        }
    }

    .closed-icon,
    .opened-icon {
        grid-column: 1 / -1;
        grid-row: 1 / -1;
        transition:
            opacity 0.3s,
            transform 0.3s,
            overlay 0.3s allow-discrete,
            display 0.3s allow-discrete;
    }

    aside:has(#contact-options:popover-open) .closed-icon,
    aside:has(#contact-options:not(:popover-open)) .opened-icon {
        opacity: 0;
        transform: rotate(180deg);
    }
</style>