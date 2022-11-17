import React, { useContext } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { AuthContext } from '../hooks/AuthContext'

export const ProtectedScreen = () => {
  const { user,token,logOut } = useContext( AuthContext );
  return (
    <View style={styles.container}>
        <Text style={styles.title}>ProtectedScreen</Text>
        <Button 
          title='logout'
          color={'#2856D6'}
          onPress={ logOut } />
        <Text style={{color:'black'}}>{JSON.stringify(user,null,5)}</Text>
        <Text style={{color:'black'}}>{JSON.stringify(token,null,5)}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
    container:{
      flex:1,
      justifyContent:'center',
      alignItems:'center'
    },
    title:{
      fontSize:20,
      marginBottom:20,
      color:'black'
    }
});