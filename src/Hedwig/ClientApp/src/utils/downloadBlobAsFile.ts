export const downloadBlobAsFile = (data: Blob, filename: string) => {
	if(typeof window.navigator.msSaveOrOpenBlob !== 'undefined') {
		window.navigator.msSaveOrOpenBlob(data, filename);
		return;
	}

	const dataUrl = window.URL.createObjectURL(data);
	setTimeout(() => { window.URL.revokeObjectURL(dataUrl) }, 100);

	const tempAnchor = document.createElement('a');
	tempAnchor.href = dataUrl;
	tempAnchor.download = filename;
	tempAnchor.click();
}
