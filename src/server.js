'use strict';
let path = require('path');//to use in the socket.io
let http = require('http');//to use in the socket.io
let socketIO = require('socket.io');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');//
let { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
let formatMessage = require('./utils/messages.js');
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');
const authRoutes = require('./routes/routes.js');
const v2Routes = require('./routes/V2.js');
const CRUDRoutes = require('./routes/CRUDRoutes.js');

const { messages } = require('./models');
const messagesModel = require('./models/messagesTable/messages');
const { Op } = require('sequelize');
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// tables for the new chat system 
const { users } = require('./models/index.js');
const { messagesModal, roomsModal } = require('./models/index.js');//to use in the socket.io
const {privateMessagesModal}=require('./models/index.js');//to use in the socket.io

const app = express();
// const server = http.createServer(app);

// let io = socketIO(server);
// allowed devices outside of the server to connect to the server
// let io = socketIO(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });
// // set static folder
// app.use(express.static(path.join(__dirname, 'public')))
// let botName = '🔌 Bot';
// let peerTOpeer = io.of('/peer-to-peer');
// // =======================================================================================================================
//rooms socket.io
// io.on('connection', socket => {

//   socket.on('joinRoom', ({ username, room }) => {

//     const user = userJoin(socket.id, username, room);//userJoin is a function that we imported from the users.js file

//     socket.join(user.room);

//     //welcome current user
//     socket.emit('message', formatMessage(botName, 'Welcome to PlugTalk!'));

//     // broadcast when a user connects
//     socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

//     // send users and room info
//     io.to(user.room).emit('roomUsers', {
//       room: user.room,
//       users: getRoomUsers(user.room)
//     });

//     socket.on('disconnect', () => {
//       const user = userLeave(socket.id);

//       if (user) {

//         io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

//         // send users and room info
//         io.to(user.room).emit('roomUsers', {
//           room: user.room,
//           users: getRoomUsers(user.room)
//         });
//       }
//     });

//     // listen for chatMessage
//     socket.on('chatMessage', (msg) => {
//       const user = getCurrentUser(socket.id);
//       let storeMessage = messagesModal.create({
//         message: msg,
//         room_name: user.room,
//         username: user.username,

//       });
//       io.to(user.room).emit('message', formatMessage(user.username, msg));
//     });


//     // listen for chatMessage
//     socket.on('getMessages', (room) => {
//       let messages = messagesModal.findAll({ where: { room_name: room } });
//       messages.then((messages) => {
//         console.log('============>', messages);
//         socket.emit('perviousMessages', messages);
//       });
//     });


//   });
// });
// =======================================================================================================================
//peer to peer socket.io
// const connectedClients = {};
// peerTOpeer.on('connection', socket => {

//   socket.on('send-message', (message) => {
//     console.log('>>>>>>>>>>message', message);
//   })

//   socket.on('checkin user', name => {
//     connectedClients[name] = socket
//     // console.log('connectedClients', connectedClients);
//     // console log the keys only
//     console.log('connectedClients', Object.keys(connectedClients));
//   });


//   socket.on('checkout users a vailabilty', plugOwner => {
//     if (connectedClients[plugOwner]) {
//       socket.emit('plugOwner online', plugOwner);
//     } else {
//       console.log('user not found')
//       socket.emit('plugOwner offline', 'user is currently offline')
//     }

//   })


//   socket.on('private message', ({ plugOwner, msg, username }) => {
//     console.log('PrivateMessage', msg);
//     console.log('plugOwner', plugOwner);

//     const privateMessage = privateMessagesModal.create({
//       message: msg,
//       sender: username,
//       receiver: plugOwner,
//     });

//     if (connectedClients[plugOwner]) {
//       connectedClients[plugOwner].emit('private message', { plugOwner, msg, username });
//     } else {
//       console.log('user not found')
//       socket.emit('disconnected user', 'user is currently offline')
//     }

//   }
//   );

//   //get the messages history between two users
//   socket.on('getpreviousPrivateMessages', ({ plugOwner, username }) => {
//     console.log('===================plugOwner', plugOwner);
//     console.log('===================username', username);

//     const messagesPromise = privateMessagesModal.findAll({
//       where: {
//         [Op.or]: [
//           { sender: plugOwner, receiver: username },
//           { sender: username, receiver: plugOwner }
//         ]
//       },
//       order: [['createdAt', 'ASC']]
//     });

//     messagesPromise.then((messages) => {
//       console.log('this is the messages ============>', messages);
//       socket.emit('perviousPrivateMessages', messages);
//     }).catch((error) => {
//       console.error('Error fetching previous private messages:', error);
//     });
//   });

//   //handle client disconnect

//   socket.on('disconnect', () => {
//     //delete the user from connectedClients
//     console.log('user disconnected');
//     delete connectedClients[socket.id];

//   })
// });
// =======================================================================================================================

// App Level MW

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);

// Routes
//home route
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page');
});
app.use(authRoutes);
// app.use('/api/v2', v2Routes);
app.use('/api/Kassel', CRUDRoutes);

// Catchalls
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
