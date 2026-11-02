import * as http from 'http';
import { Item, CreateItemRequest, getAllItems, addItem } from '../models/item';

export function handleItems(req: http.IncomingMessage, res: http.ServerResponse): void {
  if (req.method === 'GET') {
    const items: Item[] = getAllItems();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(items));
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(body);
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        return;
      }

      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        typeof (parsed as Record<string, unknown>).name !== 'string' ||
        !(parsed as Record<string, unknown>).name
      ) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'name is required' }));
        return;
      }

      const request: CreateItemRequest = { name: (parsed as Record<string, unknown>).name as string };
      const item = addItem(request);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(item));
    });
    return;
  }

  res.writeHead(405, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Method Not Allowed' }));
}
