export const formatLineNumber = (
	number: number,
	total: number,
	padding: string
): string => {
	const maxLength = `${total}`.length;
	return Array(`${total}`.length)
		.fill(padding)
		.concat(String(number + 1))
		.slice(-maxLength)
		.join("");
};
