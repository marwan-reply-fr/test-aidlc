import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import * as http from 'http';
import { EventEmitter } from 'node:events';
import { handleItems } from './items';

// Minimal mock for IncomingMessage and ServerResponse
function makeReq(method: string, body?: string): http.IncomingMessage {
  const emitter = new EventEmitter() as http.IncomingMessage;
  (emitter as unknown as Record<string, unknown>).method = method;
  if (body !== undefined) {
    process.nextTick(() => {
      emitter.emit('data', Buffer.from(body));
      emitter.emit('end');
    });
  }
  return emitter;
}

function makeRes(): http.ServerResponse & { statusCode: number; body: string; headers: Record<string, string> } {
  const res = {
    statusCode: 0,
    body: '',
    headers: {} as Record<string, string>,
    writeHead(code: number, hdrs?: Record<string, string>) {
      this.statusCode = code;
      if (hdrs) Object.assign(this.headers, hdrs);
    },
    end(data?: string) {
      this.body = data ?? '';
    },
  };
  return res as unknown as http.ServerResponse & { statusCode: number; body: string; headers: Record<string, string> };
}

test('GET /items returns 200 with JSON array', () => {
  const req = makeReq('GET');
  const res = makeRes();
  handleItems(req, res);
  assert.equal(res.statusCode, 200);
  const parsed = JSON.parse(res.body);
  assert.ok(Array.isArray(parsed));
});

test('POST /items with valid body returns 201 with created item', (_, done) => {
  const req = makeReq('POST', JSON.stringify({ name: 'test-item' }));
  const res = makeRes();
  handleItems(req, res);
  setImmediate(() => {
    assert.equal(res.statusCode, 201);
    const item = JSON.parse(res.body);
    assert.equal(item.name, 'test-item');
    assert.ok(typeof item.id === 'number');
    assert.ok(typeof item.createdAt === 'string');
    done();
  });
});

test('POST /items with malformed JSON returns 400', (_, done) => {
  const req = makeReq('POST', 'not-json');
  const res = makeRes();
  handleItems(req, res);
  setImmediate(() => {
    assert.equal(res.statusCode, 400);
    const parsed = JSON.parse(res.body);
    assert.ok(parsed.error);
    done();
  });
});

test('POST /items with missing name returns 400', (_, done) => {
  const req = makeReq('POST', JSON.stringify({}));
  const res = makeRes();
  handleItems(req, res);
  setImmediate(() => {
    assert.equal(res.statusCode, 400);
    const parsed = JSON.parse(res.body);
    assert.equal(parsed.error, 'name is required');
    done();
  });
});

test('DELETE /items returns 405', () => {
  const req = makeReq('DELETE');
  const res = makeRes();
  handleItems(req, res);
  assert.equal(res.statusCode, 405);
  const parsed = JSON.parse(res.body);
  assert.equal(parsed.error, 'Method Not Allowed');
});
