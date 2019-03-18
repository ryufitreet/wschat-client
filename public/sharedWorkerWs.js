let WS_PROXY = null;

const connections = [];

class WSSharedWorkerProxy {
  constructor(source, wsUrl, authToken) {
    console.log(source, wsUrl, authToken);
    this.wsUrl = wsUrl;
    this.authToken = authToken;
    this.close = false;
    this.websocket = null;
    console.log('создаем ws коннекшн');
    this.init(this.wsUrl, this.authToken);
  }

  setPorts(ports) {
    this.sources = ports;
  }

  init(wsUrl, authToken) {
    this.websocket = new WebSocket(wsUrl);
    this.setOnOpenHandler(authToken);
  }

  setOnOpenHandler(authToken) {
    this.websocket.onopen = (e) => {
      connections.forEach(source => source.postMessage({e: 'START_AUTH'}));
      const payload = {
        type: 'AUTH',
        payload: {
          token: authToken,
        }
      };
      console.log('Отправляем на авторизацию');
      console.log(payload);
      this.connected = true;
      this.websocket.send(JSON.stringify(payload));  
      this.wsSetHandlers();
    }    
  }

  wsSetHandlers() {
    console.log('заряжаем хендлеры');
    this.websocket.onmessage = (e) => {
      let { data } = e;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      connections.forEach(source => source.postMessage({
        e: 'MESSAGE',
        d: data,
      }));

    }

    this.websocket.onclose = (e) => {
      connections.forEach(source => source.postMessage({
        e: 'CLOSE_WS',
        d: JSON.stringify(e),
      }));

      this.closed = false;

      const interval = setInterval(() => {
        if (this.connected) {
          clearInterval(interval);
          return;
        }
        this.init();
      }, 2000);

    }
  }

  sendMessage(data) {
    let d;
    if (typeof data !== 'string') d = JSON.stringify(data);
    else d = data;
    this.websocket.send(d);
  }

}

self.onconnect = (connect) => {
  const source = connect.ports[0];
  connections.push(source);
  
  connections.forEach(port => port.postMessage({
    e: 'DEBUG',
    data: {
      wsProxyExist: !!WS_PROXY,
      countOfPorts: connect.ports.length,
    }
  }));

  source.addEventListener('message', (event) => {
    const { data } = event;
    const { e, d } = data;
    if (e === 'START') {
      const { wsUrl, authToken } = d;
      // Если соединения не было еще создано или 
      if (!WS_PROXY || (WS_PROXY && WS_PROXY.authToken !== authToken)) {
        WS_PROXY = new WSSharedWorkerProxy(source, wsUrl, authToken);
      } else if (WS_PROXY.connected) {
        source.postMessage({e: 'WS_CONNECTED'});
      }
      WS_PROXY.setPorts(connections);
    } else if (e === 'MESSAGE') {
      WS_PROXY.sendMessage(d);
    } else if (e === 'CLOSE_CONNECTION') {
      WS_PROXY.websocket.close();
      connections.forEach(port => port.postMessage({
        e: 'SIGN_OUT',
      }));
    }
  });
  source.start();

};