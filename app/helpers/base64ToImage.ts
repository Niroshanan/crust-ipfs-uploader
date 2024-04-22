export const base64ToFile = (base64String: string, fileName: string) => {
    let arr: any = base64String.split(','),
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: 'image' });
};