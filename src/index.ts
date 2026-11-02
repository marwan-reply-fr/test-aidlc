import * as http from 'http';
import { handleItems } from './routes/items';

export function startServer(port: number): http.Server {
  const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url === '/items') {
      handleItems(req, res);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  });

  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

  return server;
}

const port = Number(process.env.PORT) || 3000;
const server = startServer(port);

process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
