export const useWebsocketConnection = (wsUrl: string, messageHandler: (ev: MessageEvent<any>) => any, errorHandler: (ev: Event) => any) => {
  let ws: WebSocket;
  function connect() {
    ws = new WebSocket(wsUrl);

    ws.onmessage = (ev: MessageEvent) => {
      messageHandler(ev);
    };

    ws.onerror = (ev: Event) => {
      errorHandler(ev);
    };
  }

  function disconnect() {
    ws.close();
  }

  return {
    connect,
    disconnect
  };
};
