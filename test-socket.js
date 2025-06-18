const { io } = require('socket.io-client');

const userId = '680e62535466830eba276622'; // thay bằng _id user của mày

const socket = io('http://localhost:5000', {
  query: { userId }, // đây chính là room mà server join vào
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('✅ Connected as', userId);
});

socket.on('notification:new', (data) => {
  console.log('📩 Received notification:', data);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected');
});
