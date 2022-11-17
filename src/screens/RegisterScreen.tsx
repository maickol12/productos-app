import { StackScreenProps } from '@react-navigation/stack'
import React, { useContext, useEffect } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Background } from '../components/Background'
import { WhiteLogo } from '../components/WhiteLogo'
import { AuthContext } from '../hooks/AuthContext'
import { useForm } from '../hooks/useForm'
import loginTheme from '../theme/loginTheme'

interface Props extends StackScreenProps<any,any>{};


export const RegisterScreen = ({ navigation }:Props) => {
  const { signUp,removeError,errorMessage } = useContext( AuthContext );
  const { name,email,password,form,onChange } = useForm({
    name:'',
    email:'',
    password:''
  });
  useEffect(() => {
    if( errorMessage.length === 0 ) return;
    Alert.alert(
        "Registro",
        JSON.stringify(errorMessage,null,1),
    );
    removeError();
  }, [errorMessage])
  
  const onRegister = () => {
    Keyboard.dismiss();
    signUp({correo:email,password,nombre:name});
  }
  return (
    <>
      <SafeAreaView>
          {/* Background   */}
          <Background />

          <KeyboardAvoidingView
              behavior={ (Platform.OS === 'ios')? 'padding':'height' }>
              <View style={loginTheme.formContainer}>
                  {/* Keyboard avoid view */}
                  <WhiteLogo />

                  <Text style={ loginTheme.title }>Login</Text>

                  <Text style={ loginTheme.label }>Nombre:</Text>
                  <TextInput
                      value={name}
                      placeholder='Ingrese su nombre:'
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      style={ loginTheme.inputField }
                      selectionColor='white'

                      onChangeText={(value) => onChange(value,'name') }
                      onSubmitEditing={onRegister}

                      autoCapitalize='none'
                      autoCorrect={false} />

                  <Text style={ loginTheme.label }>Correo:</Text>
                  <TextInput
                      value={email}
                      placeholder='Ingrese su email:'
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      keyboardType="email-address"
                      style={ loginTheme.inputField }
                      selectionColor='white'

                      onChangeText={(value) => onChange(value,'email') }
                      onSubmitEditing={onRegister}

                      autoCapitalize='none'
                      autoCorrect={false} />

                  <Text style={ loginTheme.label }>Contraseña:</Text>
                  <TextInput
                      value={password}
                      placeholder='*****'
                      secureTextEntry={true}
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      style={ loginTheme.inputField }
                      selectionColor='white'
                      
                      onChangeText={(value) => onChange(value,'password')}
                      onSubmitEditing={onRegister}

                      autoCapitalize='none'
                      autoCorrect={false} />

                  {/* Boton login  */}
                  <View style={loginTheme.buttonContainer}>
                      <TouchableOpacity
                          onPress={ onRegister }
                          activeOpacity={0.8}
                          style={ loginTheme.button }>
                          <Text style={loginTheme.buttonText}>Crear cuenta</Text>
                      </TouchableOpacity>
                  </View>

                  {/* Crear una nueva cuenta */}
                  <TouchableOpacity
                    onPress={() => navigation.replace('LoginScreen')}
                    activeOpacity={0.8}
                    style={ loginTheme.buttonReturn }>
                      <Text style={loginTheme.buttonText}>Login</Text>
                  </TouchableOpacity>
              </View>
          </KeyboardAvoidingView>
      </SafeAreaView>
  </>
  )
}
