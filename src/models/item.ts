export interface Item {
  id: number;
  name: string;
  createdAt: string;
}

export interface CreateItemRequest {
  name: string;
}

const items: Item[] = [];
let nextId = 1;

export function getAllItems(): Item[] {
  return items;
}

export function addItem(request: CreateItemRequest): Item {
  const item: Item = {
    id: nextId++,
    name: request.name,
    createdAt: new Date().toISOString(),
  };
  items.push(item);
  return item;
}
