import io from "socket.io-client"

const socketInstace = io("http://localhost:3001/");

export default socketInstace;