import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListsScreen from './screens/ListsScreen';
import ListDetailScreen from './screens/ListDetailScreen';
import { ShoppingListProvider } from './context/ShoppingListContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ShoppingListProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Lists"
            component={ListsScreen}
            options={{ title: 'Мої списки покупок' }}
          />
          <Stack.Screen
            name="ListDetail"
            component={ListDetailScreen}
            options={{ title: 'Деталі списку' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ShoppingListProvider>
  );
}