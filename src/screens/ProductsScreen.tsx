import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react'
import { RefreshControl, StyleSheet, Text, TouchableOpacity, View,FlatList } from 'react-native'
import { ProductsContext } from '../context/productsContext';
import { ProductsStackParams } from '../navigator/ProductsNavigator';

interface Props extends StackScreenProps<ProductsStackParams,'ProductsScreen'>{};

export const ProductsScreen = ({navigation}: Props) => {
  const [isRefreshing, setisRefreshing] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerRight:() => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ProductScreen',{})}>
            <Text style={[{...styles.blackColor,marginRight:10 }]}>Agregar</Text>
        </TouchableOpacity>
      )
    })
  }, [])

  const { products,loadProducts } = useContext( ProductsContext );

  const loadProductsFromBackend = async() => {
    setisRefreshing(true);
    await loadProducts();
    setisRefreshing(false);
  }

  return (
    <View style={{ flex:1,marginHorizontal:10 }}>
        <FlatList 
          data={ products }
          keyExtractor={(p) => p._id}
          renderItem={({item}) => (
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ProductScreen',{
                id:item._id,
                name: item.nombre
                })
              }
            >
              <Text style={styles.productName}>{item.nombre}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View style={styles.itemSeparator}/>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={loadProductsFromBackend} />
          }
        />
    </View>
  )
}

const styles = StyleSheet.create({
    productName:{
      color:'black',
      fontSize:20
    },
    itemSeparator:{
      borderBottomWidth:2,
      marginTop:5,
      borderBottomColor:'rgba(0,0,0,0.1)'
    },
    blackColor:{
      color:'black'
    }
});
