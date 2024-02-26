export const useWebsocketConnection = (wsUrl: string, messageHandler: (this: WebSocket, ev: MessageEvent<any>) => any) => {
  let ws: WebSocket;
  function connect() {
    ws = new WebSocket(wsUrl);

    ws.onmessage = messageHandler;
  }

  function disconnect() {
    ws.close();
  }

  return {
    connect,
    disconnect
  };
};
