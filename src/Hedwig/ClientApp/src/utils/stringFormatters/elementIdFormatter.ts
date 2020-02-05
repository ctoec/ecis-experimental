export function elementIdFormatter(inputText: string) {
	return inputText.replace(/\W/g, '-');
}
