export function isValidName(str: string) {
	const trimmed = str.trim();
	if (trimmed.length < 3 || trimmed.length > 100) return false;
	const regex = /^\p{L}[\p{L}'\- ]*\p{L}$|^\p{L}$/u;
	return regex.test(trimmed);
}

export function isValidEmail(str: string) {
	const trimmed = str.trim();
	if (trimmed.length < 6 || trimmed.length > 254) return false;
	const regex = /^[\p{L}\p{N}._%+-]+@[\p{L}\p{N}.-]+\.\p{L}{2,}$/u;
	return regex.test(trimmed);
}

export function isValidPhoneOrEmpty(value: string | null | undefined) {
	console.log(value);
	if (value == null) return true;

	const trimmed = value.trim();
	if (trimmed === '') return true;

	const phoneRegex = /^\+?[\d\s()./-]{6,20}$/;

	if (!phoneRegex.test(trimmed)) return false;

	const digitCount = (trimmed.match(/\d/g) || []).length;
	return digitCount >= 6 && digitCount <= 15;
}
