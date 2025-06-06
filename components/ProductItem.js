import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProductItem({ product, onToggle, onEdit, onDelete }) {
  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.details} onPress={onToggle}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.quantity}>Кількість: {product.quantity}</Text>
        <Text style={[styles.status, { color: product.bought ? '#28a745' : '#dc3545' }]}>{product.bought ? 'Куплено' : 'Не куплено'}</Text>
      </TouchableOpacity>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.buttonText}>Редагувати</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.buttonText}>Видалити</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontSize: 14,
  },
  buttons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});