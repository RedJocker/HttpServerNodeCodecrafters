import { createServer } from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = createServer((socket) => {
    socket.on("close", () => {
	socket.end();
    });

    socket.on('error', (err) => {
	console.log(`socket on error: ${err}`);
    });

 
});

console.log("Logs from your program will appear here!");

server.listen(4221, "localhost");
