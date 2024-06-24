interface messageObject {
  type: string;
  message: number | null;
}

export default class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect(onSetGameState: (gameState: any) => unknown) {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("websocket is open.");
    };

    this.socket.onerror = () => {
      console.log("somehing went very wrong!");
    };

    this.socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
        if (data) {
          onSetGameState(data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  }

  sendMessage(input: messageObject) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(input));
    } else {
      console.error("WebSocket is not open");
    }
  }

  closeSocket() {
    if (this.socket) this.socket.close();
  }
}
