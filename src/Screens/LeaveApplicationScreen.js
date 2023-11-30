import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions

import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';





const LeaveApplicationScreen = () => {
    const navigation = useNavigation()

    const [get_request, set_request] = useState([])
    const [loading, setLoading] = useState(false);
    const [get_id, set_id] = useState('')
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [user_details, set_user_details] = useState({});

    useEffect(() => {
        getProfile();
    }, []);
    useEffect(() => {
        get_leave_applications();
    }, []);

    const openDialog = () => {
        console.log(user_details)
        setDialogVisible(true);
    };
    const closeDialog = () => {
        setDialogVisible(false);
    };

    const handleButtonPress = () => {


        closeDialog();
    };

    const renderJobItem = ({ item }) => {

     






        return (
            <TouchableOpacity onPress={() => {

            }}>

                <View style={{ marginTop: 13, flexDirection: 'row', alignItems: 'center', marginStart: 10, marginEnd: 10, borderRadius: 10, padding: 10,borderBottomWidth:1,borderBottomColor:Colors.dark_gray }}>
                   
                    <View style={{ flex: 1, marginTop: 10 }}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>From - {item.from_user_id.name}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>To - {item.to_user_id.name}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>Application Status - {item.application_status}</Text>
                        <Text style={{ color: Colors.orange, fontWeight: 'medium', fontSize: 14,marginTop:10 }}>Reason - {item.desc}</Text>

                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 14,marginTop:10 }}>From Date - {new Date(item.from_date).toDateString()}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 14,marginTop:2 }}>To Date - {new Date(item.to_date).toDateString()}</Text>


                       {get_id.toString()==item.to_user_id._id.toString() && item.application_status=="leave application sent" && (

                                <View style={{flexDirection:'row',marginTop:10}}>

                                <TouchableOpacity onPress={()=>{
                                    accept_or_reject_leave_application(true,item._id)
                
                                }} >


                                    <Text style={{padding:10,backgroundColor:Colors.orange,width:80,textAlign:'center',color:Colors.white,borderRadius:10,overflow:'hidden'}}>Accept</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={()=>{
                                    accept_or_reject_leave_application(false,item._id)

                                    }} >


                                    <Text style={{marginStart:10,padding:10,backgroundColor:Colors.red,width:80,textAlign:'center',color:Colors.white,borderRadius:10,overflow:'hidden'}}>Reject</Text>
                                    </TouchableOpacity>

                                </View>
                       )}
                       

                      

                      

                  
                    </View>
                    <TouchableOpacity>


                        <View style={{ flex: 0, justifyContent: 'flex-end', marginRight: 10 }}>
                            <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/next.png')} />
                        </View>
                    </TouchableOpacity>

                </View>
            </TouchableOpacity>


        )
    };


    const getProfile = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_profile"



            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();


                set_id(data.profile_details._id)

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



    const get_leave_applications = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_leave_application"






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


                set_request(data.leave_applications);

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


    const accept_or_reject_leave_application = async (status,id) => {


       
        try {

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/accept_or_reject_leave_application";

     

            const userData = {
                leave_application_id: id,
                action: status,
               


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
            console.log(responsedata)


            if (response.ok) {
                // Handle success
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)
                get_leave_applications()

        


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
        <View style={styles.container}>



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: 10, padding: 10, alignItems: 'center' }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Requests</Text>

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



    }




})



export default LeaveApplicationScreen