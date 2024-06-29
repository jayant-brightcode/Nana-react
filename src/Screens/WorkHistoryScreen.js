import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal, TouchableWithoutFeedback } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions

import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';


import { useRoute } from '@react-navigation/native';




const WorkHistoryScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    // const { detail } = route.params
    const [get_request, set_request] = useState([])
    const [loading, setLoading] = useState(false);


 




    useEffect(() => {
        get_work_history();
    }, []);
   







    const renderJobItem = ({ item }) => {









        return (
            <TouchableOpacity onPress={() => {

            }}>

                <View style={{ marginTop: 13, flexDirection: 'row', alignItems: 'center', marginStart: 10, marginEnd: 10, backgroundColor: Colors.grayview, borderRadius: 10, padding: 10 }}>
                    <View
                        style={{
                            width: 50,
                            height: 80,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            backgroundColor: item.grayview,
                            alignItems: 'center',
                            justifyContent: 'center', // Center the content vertically
                        }}
                    >

                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>Details</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>Start Date - {item.start_date}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>End Date - {item.end_date}</Text>

                    

                      








                    </View>




                </View>
            </TouchableOpacity>


        )
    };




    const get_work_history = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_work_history"


          

        



            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();

                console.log("dsfdsf",data)




                set_request(data.history);

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



    











    return (
        <View style={styles.container}>



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: 10, padding: 10, alignItems: 'center' }}>
              
                <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                    }}>
                     <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>  
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Work History</Text>

                    </View>


                </View>

            </View>


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View>

                <FlatList

                    data={get_request}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                />
            </View>





        </View>

    )

}



const styles = StyleSheet.create({
    container: {
        flex: 1
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
        color: Colors.dark_gray



    },
    rowinput: {
        width: '100%',
        height: 45,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,


    },




})



export default WorkHistoryScreen