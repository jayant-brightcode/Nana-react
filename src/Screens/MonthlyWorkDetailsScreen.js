import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal,TouchableWithoutFeedback } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions

import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';


import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker'



const MonthlyWorkDetailScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { detail } = route.params
    const [get_request, set_request] = useState([])
    const [loading, setLoading] = useState(false);
    const [get_id, set_id] = useState('')
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [user_details, set_user_details] = useState({});
    const [chosenDate, setChosenDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [desc, set_desc] = useState("");

    const [chosenDate1, setChosenDate1] = useState(new Date());
    const [showDatePicker1, setShowDatePicker1] = useState(false);
    const [payment_service_id, set_payment_service_id] = useState('');

    const openDialog = () => {
        setDialogVisible(true);
    };


    const onDateChange = (event, selectedDate) => {
        if (event.type === 'set') {
            setChosenDate(selectedDate);
            setShowDatePicker(false);
        } else{
            setShowDatePicker(false);

        }
    };


    const onDateChange1 = (event, selectedDate) => {
        if (event.type === 'set') {
            setChosenDate1(selectedDate);
            setShowDatePicker1(false);
        } else {
            setShowDatePicker1(false);

        }
    };

    const openDatePicker = () => {
 
        setShowDatePicker(true);
    };

    const openDatePicker1 = () => {

        setShowDatePicker1(true);
    };
    const closeDialog = () => {
        setDialogVisible(false);
    };

    const handleButtonPress = () => {
      
  
       send_leave_request()
    };

    useEffect(() => {
        getProfile();
    }, []);
    useEffect(() => {
        get_job_request();
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
                    <View style={{ flex: 1}}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>Details</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>Start Date - {item.start_date}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>End Date - {item.end_date}</Text>
                  
                        <TouchableOpacity style={styles.button1} onPress={() => {
                            navigation.navigate("AttendaceScreen",{detail:item})
                        }


                        }>
                            <View style={{ marginTop: 10, marginBottom: 10 }}>
                                <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white ,textAlign:'center'}}>View or Make Attendance</Text>
                                {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                            </View>
                        </TouchableOpacity>

                        {get_id.toString() == detail.to_user_id._id.toString() && detail.is_joined==true && detail.is_quit==false && (
                            <TouchableOpacity style={styles.button1} onPress={() => {

                                set_payment_service_id(item._id)
                                openDialog()
                            }


                            }>
                                <View style={{ marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white, textAlign: 'center' }}>Request Leave</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>


                        )}

                    


                        


                   

                    </View>

                 
                    

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



    const get_job_request = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_work_details"


            const queryParams = {
                job_request_id: detail._id,

            };

            // Construct the URL with query parameters
            const urlWithParams = `${apiUrl}?${new URLSearchParams(queryParams)}`;





            const response = await fetch(urlWithParams, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();

            


                set_request(data.work_details);

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

   

    const send_leave_request = async () => {


        if (!desc.trim()) {
            Toast.show({
                type: 'success',
                text1: `Please enter leave description`,
            });
            return;
        }





        try {

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/send_leave_application";

     

            const userData = {
                payment_service_id: payment_service_id,
                from_date: chosenDate,
                to_date: chosenDate1,
                desc: desc


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

                 closeDialog()


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


            <Modal visible={isDialogVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Enter leave description</Text>

                        <TextInput multiline={true} style={styles.input} placeholder="Enter description here .." value={desc} onChangeText={(text) => set_desc(text)} />

                        <View>
                            <Text style={styles.labelText}>From Date</Text>
                            <TouchableWithoutFeedback onPress={openDatePicker} >
                                <Text style={styles.rowinput}>{chosenDate.toDateString()}</Text>
                            </TouchableWithoutFeedback>
                            {showDatePicker && (
                                <DateTimePicker

                                    value={chosenDate}
                                    mode="date"
                                    is24Hour={false}
                                    display="default"
                                    onChange={onDateChange}
                                />
                            )}
                        </View>

                        <View>
                            <Text style={styles.labelText}>To Date</Text>
                            <TouchableWithoutFeedback onPress={openDatePicker1} >
                                <Text style={styles.rowinput}>{chosenDate1.toDateString()}</Text>
                            </TouchableWithoutFeedback>
                            {showDatePicker1 && (
                                <DateTimePicker

                                    value={chosenDate1}
                                    mode="date"
                                    is24Hour={false}
                                    display="default"
                                    onChange={onDateChange1}
                                />


                            )}
                        </View>



                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white }}>send leave request</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={closeDialog}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>

          


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



export default MonthlyWorkDetailScreen