<form>
	<!-- TODO: newsletter form action -->
	<input class="input" type="email" placeholder="Enter your email address" />
	<button class="button button-primary">Subscribe</button>
</form>

<style>
	.input {
		padding: 0.625rem 0.75rem;
		appearance: none;
		background: transparent;
		border: 2px solid rgba(var(--brand-earthterracotta-rgb) / 80%);
		border-radius: 0.375rem;
		font: inherit;
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: 0.5px;
	}

	.input::placeholder {
		color: rgba(var(--brand-accent-rgb) / 60%);
	}

	.input:hover,
	.input:focus {
		outline: 0 none;
		background: rgba(var(--brand-border-rgb) / 20%);
	}

	.input:hover {
		border-color: var(--brand-accent-color);
	}

	.input:focus {
		border-color: var(--brand-primary-color);
	}

</style>