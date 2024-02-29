import io from 'socket.io-client';

// Define your socket handling function
const socketHandler = () => {
  // Connect to your socket server
    const socket = io(import.meta.env.VITE_BACKEND_SERVER_URL);

  // Define your socket event listeners
    socket.on('connect', () => {
        console.log('Connected to socket server');
    });

    socket.on('pong', (data) => {
        console.log('Received message:', data);
    });

  // Return the socket instance
    return socket;
};

// Export the socket handling function
export default socketHandler;