import React, { useState, useEffect } from 'react'

import {RefreshControl, View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal, TouchableWithoutFeedback, SafeAreaView } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions

import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';


import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker'
import CommentDialog from '../component/MemberShipDialog';
import EmptyState from '../component/NoData';

import { useTranslation } from 'react-i18next';


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
    const [email, set_email] = useState("");

    const [chosenDate1, setChosenDate1] = useState(new Date());
    const [showDatePicker1, setShowDatePicker1] = useState(false);
    const [payment_service_id, set_payment_service_id] = useState('');
    const [isDialogVisible_member, setDialogVisible_member] = useState(false);
    const openDialog = () => {
        setDialogVisible(true);
    };


    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true)
        get_contract()
        fetchLanguage()
        setRefreshing(false);
        
      };




    const { t, i18n } = useTranslation();

    const changeLanguage = (language) => {
     i18n.changeLanguage(language);
   };



   const fetchLanguage = async () => {
    const lang = await getSavedLanguage();

    switch (lang) {
        case "English":
            changeLanguage("en");
            break;
        case "Hindi":
            changeLanguage("hi");
            break;
        case "Tamil":
            changeLanguage("ta");
            break;
        case "Gujrati":
            changeLanguage("gu");
            break;
        case "Assamese":
            changeLanguage("as");
            break;
        case "Kannada":
            changeLanguage("kn");
            break;
        case "Malayalam":
            changeLanguage("ml");
            break;
        case "Oriya":
            changeLanguage("or");
            break;
        case "Telugu":
            changeLanguage("te");
            break;
        case "Panjabi":
            changeLanguage("pa");
            break;
        case "Bengali":
            changeLanguage("ba");
            break;
        case "Marathi":
            changeLanguage("mr");
            break;
        default:
            // Handle default case, maybe fallback to English
            changeLanguage("en");
            break;
    }
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

    const handleButtonPress_member = () => {
        // Handle button press action
        closeDialog_member();
        navigation.navigate("ChoosePlanScreen")
     
      };

    const openDialog_member = () => {
        setDialogVisible_member(true);
      };
    
      const closeDialog_member = () => {
        setDialogVisible_member(false);
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

               <View>

             
                <View style={{ marginTop: 13, flexDirection: 'row',marginStart:10, marginEnd: 10, backgroundColor: Colors.white, borderRadius: 10, padding: 10,borderColor:Colors.orange,borderWidth:1 }}>
                
                    <View style={{ flex: 1 ,marginStart:10}}>
                         <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                          <Text>{t('Name')}</Text>
                          <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 13 }}>{item.name}</Text>

                         </View>

                         <View style={{flexDirection:'row',marginTop:10,justifyContent:'space-between'}}>
                         <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>{t("Phone")}</Text>
                         <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 12 }}>{item.mobile_number}</Text>

                         </View>

                         <View style={{flexDirection:'row',marginTop:10,justifyContent:'space-between'}}>
                         <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>{t("Email")}</Text>
                         <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 12 }}>{item.email}</Text>

                         </View>

                         <View style={{flexDirection:'row',marginTop:10,justifyContent:'space-between'}}>
                         <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>{t("Date")}</Text>
                         <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 12 }}>{new Date(item.createdAt).toDateString()}</Text>

                         </View>

                         <View style={{width:'100%',height:1,backgroundColor:Colors.gray,marginTop:20}}>

</View>
                        <Text style={{ color: Colors.textcolor, fontSize: 12,marginTop:10 }}>{t("Contract Job Description")}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: '400', fontSize: 12,backgroundColor:Colors.gray,padding:10,marginTop:10 }}>{item.contract_details}</Text>

                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12,marginTop:10 }}>{t("My Address")}</Text>
                        <Text style={{marginTop:5, color: Colors.textcolor, fontWeight: 'bold', fontSize: 12 ,backgroundColor:Colors.gray,padding:10}}>{item.full_address}</Text>










                    </View>




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
                openDialog_member()
               // setDialogVisible_member(true)
               // console.error('Error:', response.status, response.statusText);
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

        if (!email.trim()) {
            Toast.show({
                type: 'success',
                text1: `Please enter your email`,
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

        if(!isValidEmail(email)){
            Toast.show({
                type: 'success',
                text1: `Please enter correct email address`,
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
                contract_details: desc,
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
            console.log(responsedata)


            if (response.ok) {
                // Handle success
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)
                get_contract()

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
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>{t("Contract Job")}</Text>

                    </View>

                    <TouchableOpacity onPress={()=>{

                        openDialog()

                    }}>
                        <Text style={{ borderRadius: 10, borderWidth: 1, borderColor: Colors.white, padding: 10, color: Colors.white, marginEnd: 10,height:40 }}>{t("Send Request")}</Text>

                    </TouchableOpacity>



                </View>

            </View>


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View style={{flex:1,marginBottom:10}}>

                <FlatList

                    data={get_request}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                    contentContainerStyle={{flexGrow:1}}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            </View>


            <Modal visible={isDialogVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>{t("Enter Details here")}</Text>

                        <TextInput multiline= {true} style={styles.input} placeholder={t('Enter Contract detail here')} value={desc} onChangeText={(text) => set_desc(text)} />

                        <View>
                            <Text style={styles.labelText}>{t('Full Address')}</Text>
                            <TextInput style={styles.input} placeholder={t('Enter full address here')} value={address} onChangeText={(text) => set_address(text)}></TextInput>
                        </View>

                        <View>
                            <Text style={styles.labelText}>{t("Your Name")}</Text>
                            <TextInput style={{ backgroundColor: Colors.grayview, borderRadius: 10, padding: 10, marginTop: 10, marginBottom: 10,borderColor:Colors.orange,borderWidth:1 }} placeholder={t('Enter Name here')} value={name} onChangeText={(text) => set_name(text)}></TextInput>
                        </View>

                        <View>
                            <Text style={styles.labelText}>{t('Your Phone Number')}</Text>
                            <TextInput inputMode='numeric' style={{ backgroundColor: Colors.grayview, borderRadius: 10, padding: 10, marginTop: 10,borderColor:Colors.orange,borderWidth:1 }} placeholder={t("Enter Phone number here")} value={phone} onChangeText={(text) => {
                                if(text.length<=10){
                                    set_phone(text)
                                }
                            }}></TextInput>
                        </View>

                        <View style={{marginTop:10}}>
                            <Text style={styles.labelText}>{t("Enter Email address here")}</Text>
                            <TextInput style={{ backgroundColor: Colors.grayview, borderRadius: 10, padding: 10, marginTop: 10,borderColor:Colors.orange,borderWidth:1 }} placeholder={t("Enter Email address here")} value={email} onChangeText={(text) => set_email(text)}></TextInput>
                        </View>

                     



                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white ,borderRadius:10}}>{t("Send Request")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={closeDialog}>
                                <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10}}>{t("Close")}</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>

            <CommentDialog
           isVisible={isDialogVisible_member}
        onClose={closeDialog_member}
        onButtonPress={handleButtonPress_member}
         />





{get_request.length==0 && (
                 <EmptyState
                 title="No Data Found"
                 description="Contract request will be display here"
               />
            )}

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
        height: Platform.OS=="android"?70:80,

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



export default ContractScreen



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
  