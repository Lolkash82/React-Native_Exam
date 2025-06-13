import { openDatabaseAsync } from 'expo-sqlite';

let db;

export async function initDb() {
  try {
    db = await openDatabaseAsync('shoppinglist.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      );
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        list_id INTEGER,
        name TEXT,
        quantity INTEGER,
        bought INTEGER,
        FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
      );
    `);
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function getLists() {
  try {
    const lists = await db.getAllAsync(`
      SELECT l.id, l.name, (SELECT COUNT(*) FROM products p WHERE p.list_id = l.id) as item_count, 
             (SELECT COUNT(*) FROM products p WHERE p.list_id = l.id AND p.bought = 1) as bought_count 
      FROM lists l
    `);
    const detailedLists = await Promise.all(lists.map(async (list) => {
      const items = await db.getAllAsync('SELECT * FROM products WHERE list_id = ?', [ list.id ]);
      return { ...list, items };
    }));
    return detailedLists;
  } catch (error) {
    console.error('Error fetching lists:', error);
    return [];
  }
}

export async function addList(name) {
  try {
    await db.runAsync('INSERT INTO lists (name) VALUES (?)', [name]);
  } catch (error) {
    console.error('Error adding list:', error);
    throw error;
  }
}

export async function updateList(id, name) {
  try {
    await db.runAsync('UPDATE lists SET name = ? WHERE id = ?', [name, id]);
  } catch (error) {
    console.error('Error updating list:', error);
    throw error;
  }
}

export async function deleteList(id) {
  try {
    await db.runAsync('DELETE FROM lists WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting list:', error);
    throw error;
  }
}

export async function addProduct(listId, name, quantity, bought) {
  try {
    await db.runAsync('INSERT INTO products (list_id, name, quantity, bought) VALUES (?, ?, ?, ?)', [listId, name, quantity, bought ? 1 : 0]);
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export async function updateProduct(id, name, quantity, bought) {
  try {
    await db.runAsync('UPDATE products SET name = ?, quantity = ?, bought = ? WHERE id = ?', [name, quantity, bought ? 1 : 0, id]);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}