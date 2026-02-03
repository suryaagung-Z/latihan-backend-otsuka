import WebSocket from "ws";

const WS_URL = "ws://localhost:3003";

let socket: WebSocket | null = null;

export function connectWebSocket() {
    socket = new WebSocket(WS_URL);

    socket.on("open", () => {
        console.log("Backend connected to WebSocket server");
    });

    socket.on("close", () => {
        console.log("WebSocket closed. Reconnecting...");
        setTimeout(connectWebSocket, 3000);
    });

    socket.on("error", (err) => {
        console.error("WebSocket error", err);
    });
}

export function emit(event: any) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(event));
    }
}