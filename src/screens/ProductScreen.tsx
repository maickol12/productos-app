import { StackScreenProps } from '@react-navigation/stack'
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View,ScrollView, TextInput, Button, Image } from 'react-native'
import { ProductsStackParams } from '../navigator/ProductsNavigator';
import {Picker} from '@react-native-picker/picker';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/productsContext';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';



interface Props extends StackScreenProps<ProductsStackParams,'ProductScreen'>{};

export const ProductScreen = ({ navigation,route }:Props) => {
  const [tmpUriImg, setTmpUriImg] = useState<string>()
  const { addProducts,updateProduct,loadProductsById,deleteProduct,uploadImage } = useContext(ProductsContext);
  const { id = '',name = '' } = route.params;
  const {isLoading,categories} = useCategories();
  const {  _id,categoriaId,nombre,img,form,onChange,setFormValue } = useForm({
    _id:id,
    categoriaId:'',
    nombre:name,
    img:''
  });


  useEffect(() => {
    navigation.setOptions({
      title:(nombre)?nombre:'Sin nombre de producto'
    })
  }, [nombre]);

  useEffect(() => {
    loadProduct();
  }, []);
  

  const loadProduct = async() => {
    if( id.length === 0 ) return;
    const product = await loadProductsById( id );
    setFormValue({
      _id:id,
      categoriaId: product.categoria._id,
      img: product.img || '',
      nombre
    })

  }

  const saveOrUpdate = async() => {
    if( _id.length > 0 ){
      updateProduct(categoriaId,nombre,_id);
    }else{
      if( categoriaId.length  === 0){
        onChange( categories[0]._id,'categoriaId' );
      }
      const tempCategoriaId = categoriaId || categories[0]._id;
      const newProduct = await addProducts(tempCategoriaId,nombre);
      onChange( newProduct._id,'_id' );
    }
  }

  const deleteProductById = async() => {
    await deleteProduct(_id);
  }
  
  const takePhoto = () => {
    launchCamera({
      mediaType:'photo',
      quality:0.5
    },(resp) => {
      if(resp.didCancel) return;
      if(!resp.assets![0].uri) return;

      setTmpUriImg(resp.assets![0].uri);
      uploadImage(resp,_id).then(saved => {
        if(saved){
          loadProduct();
        }
      });
    });
  }
  const takePicture = () => {
    launchImageLibrary({
      mediaType:'photo',
      quality:0.5
    },(resp) => {
      if(resp.didCancel) return;
      if(!resp.assets![0].uri) return;

      setTmpUriImg(resp.assets![0].uri);
      uploadImage(resp,_id).then(saved => {
        if(saved){
          loadProduct();
        }
      });
    })
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre del producto:</Text>
        <TextInput 
          style={styles.textInput}
          value={nombre}
          onChangeText={(value) => onChange(value,'nombre')} />
        <Text style={styles.label}>Categoría:</Text>
        <Picker
          selectedValue={ categoriaId }
          onValueChange={(value) => onChange( value,'categoriaId' ) }>
            {
              categories.map(el => (
                <Picker.Item color='black' label={el.nombre} value={el._id} key={el._id} />
              ))
            } 
        </Picker>
        <Button
            title='Guardar'
            onPress={ saveOrUpdate }
            color={'#5856D6'} />
        <View style={{height:10}} />
        <Button
          title='Eliminar'
          onPress={ deleteProductById }
          color={'red'} />
            {
              (_id.length > 0) && (
                <View style={{flexDirection:'row',justifyContent:'center',marginTop:10}}>
                  <Button
                    title='Camara'
                    onPress={takePhoto}
                    color={'#5856D6'} />
                  <Button
                    title='Galeria'
                    onPress={takePicture}
                    color={'#5856D6'} />
                </View>
              )
            }
        {
         (img.length > 0) &&
                            <Image 
                              source={{uri: img}}
                              style={{width:'100%',height:300}}
                              />
        }
      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:10,
    marginHorizontal: 20
  },
  label:{
    fontSize:18,
    color:'black'
  },
  textInput:{
    borderWidth:1,
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:20,
    borderColor:'rgba(0,0,0,0.2)',
    height:45,
    marginTop:5,
    marginBottom:10,
    color:'black'
  },
  blackColor:{
    color:'black'
  }
});