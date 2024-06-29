import React, { useState, useEffect, useRef } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity,TextInput,TouchableWithoutFeedback,Modal,ActivityIndicator,ScrollView,SafeAreaView, Dimensions } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions

import { Remote } from '../Utils/Remote';

import { getToken } from '../Utils/LocalStorage';

import HTML from 'react-native-render-html';

import  WebView from 'react-native-webview';
const { height } = Dimensions.get('window');




const CancellationPolicyScreen = () => {

    const navigation = useNavigation()
  
  
     const [terms,set_terms] = useState('')
     const [loading, setLoading] = useState(false);

     const htmlContent = `<html><head><style>body { font-size: 44px; }</style></head><body>${terms}</body></html>`;


    useEffect(() => {
       get_terms();
    }, []);
    const tagsStyles = {
        h1: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
        p: { fontSize: 16, marginBottom: 10 },
      };

   


  

    const get_terms = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "cancellation_policy"


            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();

                console.log(data)


                set_terms(data.data.cancellation);

                setLoading(false)






            } else {
                console.error('Error:', response.status, response.statusText);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };

    const handleItemPress = (item) => {
        setSelectedItem(item);
        set_job_pref_id(item._id)
        Toast.show({
            type: 'success',
            text1: `Selected Category: ${item.name}`,
        });


    





    };


    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={{ flex: 1,backgroundColor:Colors.white }}>


        
        

           <View style={styles.topbar}>
            <View style={{ flexDirection: 'row', marginTop: Platform.OS=="android"?10:0, padding: 10, alignItems: 'center' }}>
                <TouchableOpacity onPress={()=>{
                    navigation.goBack()
                }}>
                <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>

                </TouchableOpacity>
                <View style={{ marginStart: 15, flex: 1 }}>
                    <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Cancellation And Refund Policy</Text>

                </View>


            </View>

        </View>

    

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}


        {/* <HTML source={{ html: terms }} tagsStyles={tagsStyles} contentWidth={200}/>   */}
        <ScrollView  contentContainerStyle={{flexGrow:1}} style={{ flex:1,height:height, width: '95%', alignSelf: 'center' ,backgroundColor:Colors.white}}>
            <WebView

                source={{ html: htmlContent }}
                style={{ flex:1,height:600}}
            />
        </ScrollView>
     
            
   
         

          




        </View>

        </SafeAreaView>
    )

}


const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    
       },
    container2: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        margin: 4,
        alignSelf: 'flex-start'




    },
    dialogContainer: {
        width:'90%',
        backgroundColor: 'white',
        padding: 20,
        marginStart: 10,
        marginEnd: 10,
        borderRadius: 10,
        
    },
    buttonContainer: {
        width:'100%',
        flexDirection: 'row',
         justifyContent:'space-between',
        marginTop: 20,
    },

    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    button: {
        backgroundColor: Colors.blue,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
       
    },
    button1: {
        backgroundColor: Colors.blue,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginStart:40,
        marginEnd:40

    },
 
    contentContainer: {
        flex: 1,
        top: 100,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    backgroundImage: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 200,     // Set the image width
        height: 120, // Ensure the image takes up the full height
    },
    logoImage: {


        width: 200,     // Set the image width
        height: 140, // Ensure the image takes up the full height
    },
    text: {
        color: Colors.red,
        fontWeight: 'bold',
        fontSize: 23
    },
    spacer: {
        width: 190,
        height: 5,
        backgroundColor: Colors.gray
    },



    input: {
        width: '100%',
        height:100,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        paddingLeft: 10,
        


    },
    subTextContainer: {
        width: '80%',
        marginBottom: 10,
        top: 30


    },
    textviews: {
        width: '100%',

        marginBottom: 10,
        top: 30,






    },
    buttonContent: {
        flexDirection: 'row', // Align text and icon horizontally
        alignItems: 'center',
        justifyContent: 'center',
      
    },
    buttonText: {
        color: 'white',
        
        fontSize: 16,
        marginRight: 5, // Adjust the spacing between text and icon
    },
    icon: {
        width: 20,
        height: 20,
        // Change the icon color
    },
 
    rowinput: {
        width: '100%',
        height: 45,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,


    },


    rowstyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
 
    selectedItem: {
        backgroundColor: Colors.white, // Highlight the selected item
    },
    itemContainer: {
        flex: 1,
        margin: 10,
        padding: 10,
        borderColor: Colors.dark_gray,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: '12%', // Adjust the height of each item
    },
    topbar: {
        backgroundColor: Colors.blue,
        height: 80,

    },

    
 

 
  



    icon: {
        width: 40,
        height: 40,
        // Change the icon color
    },

});


export default CancellationPolicyScreen