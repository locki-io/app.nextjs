export const useWebsocketConnection = (wsUrl: string, messageHandler: (this: WebSocket, ev: MessageEvent<any>) => any, errorHandler: (this: WebSocket, ev: Event) => any) => {
  let ws: WebSocket;
  function connect() {
    ws = new WebSocket(wsUrl);

    ws.onmessage = messageHandler;

    ws.onerror = errorHandler;
  }

  function disconnect() {
    ws.close();
  }

  return {
    connect,
    disconnect
  };
};
