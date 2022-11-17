import { createContext, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import cafeApi from "../api/cafeApi";
import { Producto, ProductsResponse } from "../interfaces/appInterfaces";
import {ImagePickerResponse} from 'react-native-image-picker';

type ProductsContextProps = {
    products: Producto[],
    loadProducts: () => Promise<void>;
    addProducts: (categoriaId: string,productName: string) => Promise<Producto>;
    updateProduct:(categoriaId: string, productName:string, productId: string) => Promise<void>;
    deleteProduct:(productId: string) => Promise<void>;
    loadProductsById:( id: string) => Promise<Producto>;
    uploadImage: (data:any,idProduct: string) => Promise<number>; //TODO cambiar any
}

export const ProductsContext =  createContext({} as ProductsContextProps);


export const ProductsProvider = ({ children }: any) => {
    const [products, setProducts] = useState<Producto[]>([]);

    useEffect(() => {
      loadProducts();
    }, []);
    

    const loadProducts = async() => {
        const resp = await cafeApi.get<ProductsResponse>('/productos?limite=50');
        // setProducts([...products,...resp.data.productos]);
        setProducts([...resp.data.productos]);
    }
    const addProducts = async(categoriaId: string,productName: string): Promise<Producto> => {
        const resp = await cafeApi.post<Producto>('/productos',{
            nombre:productName,
            categoria:categoriaId
        });
        setProducts([...products,resp.data]);
        return resp.data;
    }
    const updateProduct = async(categoriaId: string, productName:string, productId: string) => {
        try{
            const resp = await cafeApi.put<Producto>(`/productos/${ productId }`,{
                nombre:productName,
                categoria:categoriaId
            });
            setProducts(products.map(el => {
                return (el._id === productId)
                        ? resp.data
                        : el
            }));

            Alert.alert('Actualizado','Actualizado con éxito');
        }catch(error){
            console.log({error});
        }
    }
    const deleteProduct = async(productId: string) => {
        try{
            const resp = await cafeApi.delete<Producto>(`/productos/${ productId }`);
            setProducts(products.filter(el =>  (el._id !== productId) ));
            Alert.alert('Eliminar','Eliminado con éxito');
        }catch(error){
            Alert.alert('Error','Ocurrio un error al eliminar');
        }
    }
    const loadProductsById = async( id: string): Promise<Producto> => {
        const resp = await cafeApi.get<Producto>(`/productos/${ id }`);
        return resp.data;
    }
    const uploadImage = async(data:ImagePickerResponse,idProduct: string): Promise<number> => {
        const params = {
            uri: Platform.OS === 'ios' ? data.assets![0].uri!.replace('file://', '') : data.assets![0].uri!,
            type: data.assets![0].type,
            name: data.assets![0].fileName
        };
        const fileToUpload = JSON.parse(JSON.stringify(params));

        const formData = new FormData();
        formData.append('archivo',fileToUpload);

        try{
            const resp = await cafeApi.put(
                `/uploads/productos/${idProduct}`,
                formData,
                {
                    headers: {
                    'Content-Type': 'multipart/form-data',
                    },
                });
            return resp.status === 200;
        }catch(error){
            return false;
        }
    }   
    return (
        <ProductsContext.Provider value={{
            products,
            loadProducts,
            addProducts,
            updateProduct,
            deleteProduct,
            loadProductsById,
            uploadImage,
        }}>
            { children }
        </ProductsContext.Provider>
    )
}