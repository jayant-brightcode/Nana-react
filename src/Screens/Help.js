import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal, TouchableWithoutFeedback, SafeAreaView } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions

import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';


import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker'



const HelpScreen = () => {

    const navigation = useNavigation();

    const [query, set_query] = useState("");
    const [phone, set_phone] = useState("");
    const [email, set_email] = useState("");
    const [loading, setLoading] = useState(false);

   

  

    const handleButtonPress = () => {


        send_request()
    };

    const send_request = async () => {
        if (!query.trim()) {
            Toast.show({
                type: 'success',
                text1: `Please enter your query`,
            });
            return;
        }

        if (!email.trim()) {
            Toast.show({
                type: 'success',
                text1: `Please enter your email`,
            });
            return;
        }
      

        if (!isValidPhone(phone)) {
            Toast.show({
                type: 'success',
                text1: `Please enter correct phone number`,
            });
            return;
        }

        if (!isValidEmail(email)) {
            Toast.show({
                type: 'success',
                text1: `Please enter valid email address`,
            });
            return;
        }




        try {

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/send_help_message";



            const userData = {
                phone: phone,
                query: query,
                email:email
       


            };

            const token = await getToken()

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });


            const responsedata = await response.json();



            if (response.ok) {
                // Handle success
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)
             


            } else {
                // Handle error
                Toast.show({
                    type: 'success',
                    text1: responsedata.error,
                });
                setLoading(false)

            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false)

        }

    }












    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={styles.container}>



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: Platform.OS=="android"?10:0, padding: 10, alignItems: 'center' }}>
                <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                    }}>
                  <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>  
                    
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Help Desk</Text>

                    </View>




                </View>

            </View>


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}


            <View style={{margin:10}}>

       

            <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Enter Details here</Text>

            <TextInput multiline= {true} style={styles.input} placeholder="Enter you query here .." value={query} onChangeText={(text) => set_query(text)} />

           
            <View>
                <Text style={styles.labelText}>Your Phone Number</Text>
                <TextInput inputMode='numeric' style={{ backgroundColor: Colors.grayview, borderRadius: 10, padding: 10, marginTop: 10,borderColor:Colors.orange,borderWidth:1 }} placeholder='Enter Phone number here ' value={phone} onChangeText={(text) => {
                    if(text.length<=10){
                        set_phone(text)
                    }
                }}></TextInput>
            </View>


            <View style={{marginTop:10}}>
                <Text style={styles.labelText}>Your Email Address</Text>
                <TextInput style={{ backgroundColor: Colors.grayview, borderRadius: 10, padding: 10, marginTop: 10,borderColor:Colors.orange,borderWidth:1 }} placeholder='Enter Your Email here ' value={email} onChangeText={(text) => set_email(text)}></TextInput>
            </View>

            <TouchableOpacity onPress={()=>{
                 handleButtonPress()
            }}>
                <Text style={{marginTop:20,borderRadius:10,backgroundColor:Colors.orange,color:Colors.white,padding:10,textAlign:'center'}}>Submit</Text>
            </TouchableOpacity>

            </View>






        </View>

        </SafeAreaView>

    )

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Colors.white
    },
    topbar: {
        backgroundColor: Colors.blue,
        height: 70,

    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',

    },
    dialogContainer: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        marginStart: 10,
        marginEnd: 10,
        borderRadius: 10,

    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    input: {
        width: '100%',
        height: 80,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,
        marginTop: 10,
        color: Colors.black,
        borderColor:Colors.orange,
        borderWidth:1



    },
    rowinput: {
        width: '100%',
        height: 45,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,
        borderColor:Colors.orange,
        borderWidth:1


    },




})



export default HelpScreen



function isValidPhone(value) {
    const phonePattern = /^\d{10}$/; // Assumes a 10-digit phone number
    return phonePattern.test(value)
}




  
  function isValidEmail(email) {
    // Regular expression for a basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Test the email against the regular expression
    return emailRegex.test(email);
  }