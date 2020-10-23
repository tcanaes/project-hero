import Users from './Models/UsersModel.js';
import Game from './Models/GameModel.js';

import express from 'express';
import cors from 'cors';

import http from 'http';
import socketIo from 'socket.io';

/* Connection Routers */
import usersRouter from './routers/usersRouter.js';

/* Create the Server */
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

/*App Setup */
app.use(cors());
app.use(express.json({ limit: '50kb' }));
app.use('/auth', usersRouter);

/* UPON NEW USER CONNECTION */
io.on('connection', (socket) => {
  console.log(socket.handshake.query);

  // // Check user logged in:
  // const username = socket.handshake.query['username'];
  // if (!Users.isLoggedIn(username)) {
  //   socket.close();
  //   return;
  // }
  // Game.playerJoin(username);

  // socket.on('disconnect', () => {
  //   console.log(`Usuário ${socket.id} desconectou...`);
  //   Users.disconnected(username);
  //   Game.playerDisconnect(username);
  // });
});

let testCount = 0;
setInterval(() => {
  testCount += 1;
  io.emit('testMessage', `${testCount}: isso é uma mensagem do servidor!!!`);
}, 1000);

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening to port ${process.env.SERVER_PORT}...`);
});
