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

export const LoginScreen = ({ navigation }: Props) => {
    const { signIn,removeError,errorMessage } = useContext( AuthContext );
    const { email,password,form,onChange } = useForm({
        email:'',
        password:''
    });

    useEffect(() => {
      if(errorMessage.length === 0) return;

      Alert.alert(
            'Login incorrecto',
            errorMessage,
            [
                {
                    'text':'Ok',
                    onPress:removeError
                }
            ]
        );
    }, [errorMessage])
    

    const onLogin = () => {
        console.log({email,password});
        Keyboard.dismiss();

        signIn({correo:email,password})
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

                        <Text style={ loginTheme.label }>Correo:</Text>
                        <TextInput
                            value={email}
                            placeholder='Ingrese su email:'
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            keyboardType="email-address"
                            style={ loginTheme.inputField }
                            selectionColor='white'

                            onChangeText={(value) => onChange(value,'email') }
                            onSubmitEditing={onLogin}

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
                            onSubmitEditing={onLogin}

                            autoCapitalize='none'
                            autoCorrect={false} />

                        {/* Boton login  */}
                        <View style={loginTheme.buttonContainer}>
                            <TouchableOpacity
                                onPress={ onLogin }
                                activeOpacity={0.8}
                                style={ loginTheme.button }>
                                <Text style={loginTheme.buttonText}>Login</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Crear una nueva cuenta */}
                        <View style={ loginTheme.newUserContainer}>
                            <TouchableOpacity
                                onPress={() => navigation.replace('RegisterScreen')}
                                activeOpacity={0.8}>
                                    <Text style={loginTheme.buttonText}>Nueva cuenta</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}
