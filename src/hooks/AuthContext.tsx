import { createContext, useEffect, useReducer } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import cafeApi from "../api/cafeApi";
import { authReducer, AuthState } from "../context/authReducer";
import { LoginData, LoginResponse, RegisterData, Usuario } from "../interfaces/appInterfaces";
import { Alert } from "react-native";

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated',
    signUp: (data: RegisterData) => void;
    signIn: (data: LoginData) => void;
    removeError: () => void;
    logOut: () => void;
}

const AuthInitialState: AuthState = {
    status:'checking',
    token:null,
    user:null,
    errorMessage:''
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(authReducer, AuthInitialState);    
    useEffect(() => {
      checkToken();
    }, []);
    
    const checkToken = async() => {
        const token = await AsyncStorage.getItem('token');
        if(!token) return dispatch({type:'notAuthenticated'});

        const resp = await cafeApi.get('/auth');

        if( resp.status !== 200 ){
            return dispatch({type:'notAuthenticated'});
        }

        await AsyncStorage.setItem('token',resp.data.token);

        dispatch({ 
            type:'signUp',
            payload:{
                token: resp.data.token,
                user: resp.data.usuario
            }
        });
    }

    const signIn = async({ correo,password}: LoginData) => {
        try{
            const resp = await cafeApi
                .post<LoginResponse>('/auth/login',{
                    correo,
                    password
                });
            dispatch({ 
                type:'signUp',
                payload:{
                    token: resp.data.token,
                    user: resp.data.usuario
                }
            });

            await AsyncStorage.setItem('token',resp.data.token);
        }catch( error ){
            dispatch({
                type:'addError',
                payload: 'Información incorrecta'
            })
        }
    }
    const signUp = async(obj: RegisterData) => {
        try{
            const resp = await cafeApi.post('/usuarios',obj);
            if( resp.status === 200 ){
                Alert.alert(
                    "Registro",
                    "Has sido registrado de manera exitosa",
                    [
                        {
                            text:'Aceptar',
                            onPress:()=>{ 
                                dispatch({ 
                                    type:'signUp',
                                    payload:{
                                        token: resp.data.token,
                                        user: resp.data.usuario
                                    }
                                });
                            }
                        }
                    ]
                )
            }else{
                Alert.alert(
                    "Registro",
                    "Ha ocurrido un error",
                )
            }
        }catch(error){
            dispatch({
                type:'addError',
                payload:error.response.data.errors.map(el => el.msg)
            });
            
        }
    }
    const removeError = () => {
        dispatch({
            type:'removeError'
        });
    }
    const logOut = async() => {
        await AsyncStorage.removeItem('token');
        dispatch({
            type:'logOut'
        })
    }
    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            removeError,
            logOut
        }}>
            { children }
        </AuthContext.Provider>
    )
}