export function setImagePreviewFromInput(sourceInput: HTMLInputElement, targetImage: HTMLImageElement) {
    if (!sourceInput.files || !sourceInput.files[0]) return;
    const file = sourceInput.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
        const image = e.target?.result as string;
        targetImage.src = image;
    };

    reader.readAsDataURL(file);
}