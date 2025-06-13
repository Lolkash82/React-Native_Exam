import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ProductItem from '../components/ProductItem';
import AddProductModal from '../components/AddProductModal';
import { ShoppingListContext } from '../context/ShoppingListContext';

export default function ListDetailScreen() {
  const { lists, addProduct, updateProduct, deleteProduct } = useContext(ShoppingListContext);
  const { params } = useRoute();
  const listId = params.listId;
  const list = lists.find(l => l.id === listId) || { name: '', items: [] };
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleToggleProduct = (productId) => {
    updateProduct(listId, productId, { bought: !list.items.find( p => p.id === productId ).bought });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert('Підтвердження', 'Ви впевнені, що хочете видалити товар?', [
      { text: 'Ні', style: 'cancel' },
      { text: 'Так', onPress: () => deleteProduct(listId, productId) },
    ]);
  };

  const handleSaveProduct = (product) => {
    if (editingProduct) {
      updateProduct(listId, editingProduct.id, { name: product.name, quantity: product.quantity, bought: product.bought });
      setEditingProduct(null);
    } else {
      addProduct(listId, product.name, product.quantity, product.bought);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.listName}>{list.name}</Text>
      <Text style={styles.summary}>Всього: {list.items.length}, Куплено: {list.items.filter(i => i.bought).length}</Text>
      <FlatList
        data={list.items}
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            onToggle={() => handleToggleProduct(item.id)}
            onEdit={() => handleEditProduct(item)}
            onDelete={() => handleDeleteProduct(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Немає товарів</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Додати товар</Text>
      </TouchableOpacity>
      <AddProductModal
        visible={modalVisible}
        onClose={() => { setModalVisible(false); setEditingProduct(null); }}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  listName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summary: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});