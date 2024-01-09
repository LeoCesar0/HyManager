export const decodeText = (text: string) => {
    return decodeURIComponent(text || "").trim()
}