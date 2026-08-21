import { RESEND_API_KEY } from '$env/static/private';
import type { Actions, PageServerLoad } from './$types';
import { Resend } from 'resend';
import { fail } from '@sveltejs/kit';
import { topicMap } from './contact-topics';
import { constants } from 'http2';
import { isValidEmail, isValidName, isValidPhoneOrEmpty } from './validation.utils';

export const prerender = false;

export const load: PageServerLoad = async ({ url }) => {
	return {
		topic: url.searchParams.get('topic'),
		topics: Object.entries(topicMap).map(([key, { label }]) => ({
			key,
			label
		}))
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const phone = formData.get('phone') as string;
		const topic = formData.get('topic') as string;
		const message = formData.get('message') as string;
		const { subject, recipient } = topicMap[topic] || topicMap['general'];

		const validations: [string, string | false][] = [
			['name', !isValidName(name) && 'Please enter a valid name'],
			['email', !isValidEmail(email) && 'Please enter a valid email'],
			['phone', !isValidPhoneOrEmpty(phone) && 'Please enter a valid phone number'],
			['message', message.trim() === '' && 'Please enter a message']
		];

		const isInvalid = ([, value]: [string, string | false]) => value;

		if (validations.some(isInvalid)) {
			return fail(constants.HTTP_STATUS_BAD_REQUEST, {
				name,
				email,
				phone,
				topic,
				message,
				invalid: Object.fromEntries(validations.filter(isInvalid))
			});
		}

		const resend = new Resend(RESEND_API_KEY);

		const { error } = await resend.emails.send({
			from: `[Contact Form] ${name} <no-reply@essencia.life>`,
			replyTo: `${name} <${email}>`,
			to: `${recipient}@essencia.life`,
			subject,
			text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}`
		});

		if (error) {
			console.log(error);

			// TODO log it in service like Sentry or similar

			return fail(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, {
				name,
				email,
				phone,
				topic,
				message,
				error: true
			});
		}

		return { success: true };
	}
};
