export interface Message {
    status: "success" | "error" | "warning" | "info",
    text: string,
}
