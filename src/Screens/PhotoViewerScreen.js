import React, { useState, useEffect,useRef } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { useRoute } from '@react-navigation/native';
import { Remote } from '../Utils/Remote';



const PhotoViewerScreen = () => {

    const navigation = useNavigation()


    const route = useRoute();
    const { data } = route.params

    console.log("SDSD",data.photo)

    const images = data.photo.map(item => ({
        uri: Remote.BASE_URL+item.photo
      }));

  
  
    
    

    // const images = [
    //     {
    //       uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
    //     },
    //     {
    //       uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34",
    //     },
    //     {
    //       uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
    //     },
    //   ];
      
      const [visible, setIsVisible] = useState(true);



    //   const images = [
    //     'http://192.168.1.107:1034/profession_images/1702386431846-image_0.jpg',
    //     // Add more image URLs as needed
    //   ];
    
     
    
      return (
        <View >
       
            <ImageView
                images={images}
                imageIndex={data.index}
                visible={visible}
                onRequestClose={() => {
                    navigation.goBack()
                    setIsVisible(false)
                }}
                />
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      padding: 8,
    },
    thumbnail: {
      width: 100,
      height: 100,
      marginBottom: 8,
    },
  });

export default PhotoViewerScreen;
