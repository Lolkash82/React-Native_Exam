import React, { createContext, useState, useEffect } from 'react';
import { initDb, getLists, addList, updateList, deleteList, addProduct, updateProduct, deleteProduct } from '../storage/storage';

const ShoppingListContext = createContext();

export const ShoppingListProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    initDb()
      .then(() => {
        setIsDbReady(true);
        return getLists();
      })
      .then(data => setLists(data))
      .catch(error => console.error('Initialization failed:', error));
  }, []);

  const refreshLists = async () => {
    if (!isDbReady) return;
    try {
      const updatedLists = await getLists();
      setLists(updatedLists);
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  const contextValue = {
    lists,
    addList: async (name) => {
      if (!isDbReady) return;
      await addList(name);
      await refreshLists();
    },
    updateList: async (id, name) => {
      if (!isDbReady) return;
      await updateList(id, name);
      await refreshLists();
    },
    deleteList: async (id) => {
      if (!isDbReady) return;
      await deleteList(id);
      await refreshLists();
    },
    addProduct: async (listId, name, quantity, bought) => {
      if (!isDbReady) return;
      await addProduct(listId, name, quantity, bought);
      await refreshLists();
    },
    updateProduct: async (listId, productId, updates) => {
      if (!isDbReady) return;
      const product = lists.find(l => l.id === listId)?.items.find( p => p.id === productId );
      if (!product) return;
      await updateProduct(
        productId,
        updates.name || product.name,
        updates.quantity || product.quantity,
        updates.bought !== undefined ? updates.bought : product.bought
      );
      await refreshLists();
    },
    deleteProduct: async (listId, productId) => {
      if (!isDbReady) return;
      await deleteProduct(productId);
      await refreshLists();
    },
  };

  return (
    <ShoppingListContext.Provider value={contextValue}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export { ShoppingListContext };