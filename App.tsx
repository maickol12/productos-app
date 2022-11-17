import React from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './src/navigator/Navigator';
import { AuthProvider } from './src/hooks/AuthContext';
import { ProductsProvider } from './src/context/productsContext';

const AppState = ({ children }: any) => {
  return(
    <AuthProvider>
      <ProductsProvider>
        {children}
      </ProductsProvider>
    </AuthProvider>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
      </AppState>
    </NavigationContainer>
  )
}
export default App;