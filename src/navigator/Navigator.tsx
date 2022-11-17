import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import { LoadingScreen } from '../screens/LoadingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProtectedScreen } from '../screens/ProtectedScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ProductsNavigator } from './ProductsNavigator';

const Stack = createStackNavigator();

const Navigator = () => {

  const { status } = useContext( AuthContext );

  if( status === 'checking' ) return <LoadingScreen />

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown:false,
        cardStyle:{
          backgroundColor: 'white'
        }
      }}>
        { 
          ( status !== 'authenticated' )
            ? (
                <>
                   <Stack.Screen name="LoginScreen" component={ LoginScreen } />
                  <Stack.Screen name="RegisterScreen" component={ RegisterScreen } />
                </>
            )
            : (
              <>
                <Stack.Screen name="ProductsNavigator"  component={ ProductsNavigator } />
                <Stack.Screen name="ProtectedScreen"    component={ ProtectedScreen } />
              </>
            )
        }
     
    </Stack.Navigator>
  );
}

export default Navigator;