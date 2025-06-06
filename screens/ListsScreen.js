import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ListItem from '../components/ListItem';
import { ShoppingListContext } from '../context/ShoppingListContext';

export default function ListsScreen() {
  const { lists, addList, updateList, deleteList } = useContext(ShoppingListContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editList, setEditList] = useState(null);
  const [listName, setListName] = useState('');
  const navigation = useNavigation();

  const handleAddList = () => {
    if (listName.trim()) {
      addList(listName);
      setListName('');
      setModalVisible(false);
    }
  };

  const handleEditList = (list) => {
    setEditList(list);
    setListName(list.name);
    setModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (listName.trim()) {
      updateList(editList.id, listName);
      setListName('');
      setModalVisible(false);
      setEditList(null);
    }
  };

  const handleDeleteList = (id) => {
    Alert.alert('Підтвердження', 'Ви впевнені, що хочете видалити список?', [
      { text: 'Ні', style: 'cancel' },
      { text: 'Так', onPress: () => deleteList(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        renderItem={({ item }) => (
          <ListItem
            list={item}
            onPress={() => navigation.navigate('ListDetail', { listId: item.id })}
            onEdit={() => handleEditList(item)}
            onDelete={() => handleDeleteList(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Немає списків</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Додати список</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>{editList ? 'Редагувати список' : 'Додати список'}</Text>
            <TextInput
              style={styles.input}
              value={listName}
              onChangeText={setListName}
              placeholder="Введіть назву списку"
            />
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => { setModalVisible(false); setEditList(null); setListName(''); }}>
                <Text style={styles.buttonText}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={editList ? handleSaveEdit : handleAddList}>
                <Text style={styles.buttonText}>Зберегти</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
});