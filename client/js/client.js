const startClient = (authInfo) => {
  const query = `username=${authInfo.username}&token=${authInfo.token}`;
  const socket = io('http://localhost:3000', { query });

  socket.on('testMessage', (dado) => {
    console.log(dado);
  });
};
