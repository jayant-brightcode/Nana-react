import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal, TouchableWithoutFeedback } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions

import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';


import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker'



const ContractScreen = () => {

    const navigation = useNavigation();
 
    const [get_request, set_request] = useState([])
    const [loading, setLoading] = useState(false);
    const [get_id, set_id] = useState('')
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [user_details, set_user_details] = useState({});
    const [chosenDate, setChosenDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [desc, set_desc] = useState("");
    const [address, set_address] = useState("");
    const [name, set_name] = useState("");
    const [phone, set_phone] = useState("");
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
        } else {
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


        send_request()
    };

    useEffect(() => {
        get_contract();
    }, []);







    const renderJobItem = ({ item }) => {









        return (
            <TouchableOpacity onPress={() => {

            }}>

                <View style={{ marginTop: 13, flexDirection: 'row', alignItems: 'center', marginEnd: 10, backgroundColor: Colors.grayview, borderRadius: 10, padding: 10 }}>
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
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                        <Text style={{ color: Colors.textcolor, fontSize: 12 }}>Description</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 12 }}>{item.contract_details}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>Phone - {item.mobile_number}</Text>

                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>Address</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 12 }}>{item.full_address}</Text>

                        <TouchableOpacity style={styles.button1} onPress={() => {
                           
                        }


                        }>
                          
                        </TouchableOpacity>









                    </View>




                </View>
            </TouchableOpacity>


        )
    };


  


    const get_contract = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_contract"

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();
                  set_request(data.contract);
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



    const send_request = async () => {


        if (!desc.trim()) {
            Toast.show({
                type: 'success',
                text1: `Please enter contract details`,
            });
            return;
        }


        if (!name.trim()) {
            Toast.show({
                type: 'success',
                text1: `Please enter your name`,
            });
            return;
        }

        if (!address.trim()) {
            Toast.show({
                type: 'success',
                text1: `Please enter your full address`,
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





        try {

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/send_contract_request";



            const userData = {
                phone: phone,
                name: name,
                full_address: address,
                contract_details: desc


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
                get_contract

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
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Contract Job</Text>

                    </View>

                    <TouchableOpacity onPress={()=>{

                        openDialog()

                    }}>
                        <Text style={{ borderRadius: 10, borderWidth: 1, borderColor: Colors.white, padding: 10, color: Colors.white, marginEnd: 10 }}>Send Request</Text>

                    </TouchableOpacity>



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
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Enter Details here</Text>

                        <TextInput multiline= {true} style={styles.input} placeholder="Enter Contract details here .." value={desc} onChangeText={(text) => set_desc(text)} />

                        <View>
                            <Text style={styles.labelText}>Full Address</Text>
                            <TextInput style={styles.input} placeholder='Enter full address here ' value={address} onChangeText={(text) => set_address(text)}></TextInput>
                        </View>

                        <View>
                            <Text style={styles.labelText}>Your Name</Text>
                            <TextInput style={{ backgroundColor: Colors.grayview, borderRadius: 10, padding: 10, marginTop: 10, marginBottom: 10 }} placeholder='Enter Name here ' value={name} onChangeText={(text) => set_name(text)}></TextInput>
                        </View>

                        <View>
                            <Text style={styles.labelText}>Your Phone Number</Text>
                            <TextInput style={{ backgroundColor: Colors.grayview, borderRadius: 10, padding: 10, marginTop: 10 }} placeholder='Enter Phone number here ' value={phone} onChangeText={(text) => set_phone(text)}></TextInput>
                        </View>

                     



                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white }}>send request</Text>
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



export default ContractScreen



function isValidPhone(value) {
    const phonePattern = /^\d{10}$/; // Assumes a 10-digit phone number
    return phonePattern.test(value)
}
