import { Hono } from "hono"
import { serveStatic } from 'hono/bun'

const app = new Hono()

// Serve static files (for client.html)
app.use('/static/*', serveStatic({ root: './' }))

// Serve our client HTML
app.get('/', (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>WebSocket Client</title>
      </head>
      <body>
        <h1>WebSocket Test</h1>
        <input id="message" type="text" placeholder="Type message here...">
        <button id="send">Send</button>
        <button id="connect">Connect</button>
        <button id="disconnect">Disconnect</button>
        <div id="output"></div>

        <script>
          let socket;
          
          document.getElementById('connect').addEventListener('click', () => {
            // Create WebSocket connection
            socket = new WebSocket('ws://localhost:3000/ws');
            
            // Connection opened
            socket.addEventListener('open', (event) => {
              document.getElementById('output').innerHTML += '<p>Connected to server</p>';
            });
            
            // Listen for messages
            socket.addEventListener('message', (event) => {
              document.getElementById('output').innerHTML += \`<p>Message from server: \${event.data}</p>\`;
            });
            
            // Connection closed
            socket.addEventListener('close', (event) => {
              document.getElementById('output').innerHTML += '<p>Disconnected from server</p>';
            });
            
            // Connection error
            socket.addEventListener('error', (event) => {
              document.getElementById('output').innerHTML += '<p>Error: Connection failed</p>';
            });
          });
          
          document.getElementById('send').addEventListener('click', () => {
            const message = document.getElementById('message').value;
            if (socket && socket.readyState === WebSocket.OPEN) {
              socket.send(message);
              document.getElementById('output').innerHTML += \`<p>Message sent: \${message}</p>\`;
              document.getElementById('message').value = '';
            } else {
              document.getElementById('output').innerHTML += '<p>Error: Not connected</p>';
            }
          });
          
          document.getElementById('disconnect').addEventListener('click', () => {
            if (socket) {
              socket.close();
            }
          });
        </script>
      </body>
    </html>
  `);
});

// Create a Bun WebSocket server
const server = Bun.serve({
    port: 3000,
    fetch: app.fetch,
    websocket: {
        message(ws, message) {
            console.log(`Message from client: ${message}`);
            ws.send('Hello from server!');
        },
        open(ws) {
            console.log('Connection opened');
        },
        close(ws) {
            console.log('Connection closed');
        }
    }
});

// Replace the original route with a WebSocket endpoint
app.get('/ws', (c) => {
    const success = server.upgrade(c.req.raw);
    if (!success) {
        return c.text('WebSocket upgrade failed', 400);
    }
    return new Response(null);
});

console.log(`Server is running on http://localhost:${server.port}`);