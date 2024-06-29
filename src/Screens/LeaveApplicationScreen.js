import React, { useState, useEffect } from 'react'

import { RefreshControl,View,Alert, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal, SafeAreaView } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions

import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import CommentDialog from '../component/MemberShipDialog';
import EmptyState from '../component/NoData';
import { useTranslation } from 'react-i18next';




const LeaveApplicationScreen = () => {
    const navigation = useNavigation()

    const [get_request, set_request] = useState([])
    const [loading, setLoading] = useState(false);
    const [get_id, set_id] = useState('')
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [user_details, set_user_details] = useState({});
    const [isDialogVisible_member, setDialogVisible_member] = useState(false);

    useEffect(() => {
        getProfile();
        fetchLanguage()
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


    const handleButtonPress = () => {


        closeDialog();
    };

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true)
        get_leave_applications()
        setRefreshing(false);
        
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

    const renderJobItem = ({ item }) => {

     






        return (
            <TouchableOpacity onPress={() => {

            }}>

                <View style={{borderWidth:1,borderColor:Colors.orange, marginTop: 13, flexDirection: 'row', marginStart: 10, marginEnd: 10, borderRadius: 10, padding: 10,borderBottomWidth:1,borderBottomColor:Colors.dark_gray }}>
                   
                    <View style={{ flex: 1, marginTop: 10 }}>






{item.from_user_id._id.toString()==get_id.toString() && (
                            <View>

                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                        <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t('To')}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.to_user_id.name}</Text>


                        </View>  



                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                        <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t('From')}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.from_user_id.name}</Text>

                        </View>      




                                </View>

                        )}

                {item.to_user_id._id.toString()==get_id.toString() && (
                            <View>



                           <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                            <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t('From')}</Text>
                            <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.from_user_id.name}</Text>
    
                            </View>    

                            <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                            <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t('To')}</Text>
                            <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.to_user_id.name}</Text>
    
    
                            </View>  
    
    
    
                              
    
    
    
    
                                    </View>

                        )}


<View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                            <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t('Application Status')}</Text>
                            <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 14 }}>{item.application_status}</Text>
    
                            </View>  

                            <View style={{height:2,backgroundColor:Colors.gray,width:'100%',marginTop:10}}>

</View>
                
                        <Text style={{ color: Colors.black, fontWeight: 'medium', fontSize: 14,marginTop:10 }}>{t('Leave application reason')}</Text>
                        <Text style={{ color: Colors.black, fontWeight: 'medium', fontSize: 14,marginTop:10,backgroundColor:Colors.gray,padding:10 }}>{item.desc}</Text>
                        <View style={{height:2,backgroundColor:Colors.gray,width:'100%',marginTop:10}}>

</View>
    
                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                            <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t('From Date')}</Text>
                            <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{new Date(item.from_date).toDateString()}</Text>
    
                            </View>  


                            <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                            <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t('To Date')}</Text>
                            <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{new Date(item.to_date).toDateString()}</Text>
    
                            </View>  

                            <View style={{height:2,backgroundColor:Colors.gray,width:'100%',marginTop:10}}>

</View>
                      
                      
             

                       {get_id.toString()==item.to_user_id._id.toString() && item.application_status=="leave application sent" && (

                                <View style={{flexDirection:'row',marginTop:10,width:'100%',justifyContent:'space-between'}}>

                                <TouchableOpacity onPress={()=>{

                                        Alert.alert(
                                            'Confirmation',
                                            'Are you sure you want to accept employee leave request?',
                                            [
                                            {
                                                text: 'Cancel',
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'Yes',
                                                onPress: () => {
                                                // Handle "Yes" button press
                                                accept_or_reject_leave_application(true,item._id)
                                                },
                                            },
                                            ],
                                            { cancelable: false }
                                        );
                                   
                
                                }} >


                                    <Text style={{padding:10,backgroundColor:Colors.orange,width:150,textAlign:'center',color:Colors.white,borderRadius:10,overflow:'hidden'}}>Accept</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={()=>{
                                  

                                    Alert.alert(
                                        'Confirmation',
                                        'Are you sure you want to reject employee leave request?',
                                        [
                                          {
                                            text: 'Cancel',
                                            style: 'cancel',
                                          },
                                          {
                                            text: 'Yes',
                                            onPress: () => {
                                              // Handle "Yes" button press
                                              accept_or_reject_leave_application(false,item._id)
                                            },
                                          },
                                        ],
                                        { cancelable: false }
                                      );

                                    }} >


                                    <Text style={{marginStart:10,padding:10,backgroundColor:Colors.red,width:150,textAlign:'center',color:Colors.white,borderRadius:10,overflow:'hidden'}}>{t('Reject')}</Text>
                                    </TouchableOpacity>

                                </View>
                       )}
                       

                      

                      

                  
                    </View>
                    <TouchableOpacity>


                        
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
                if(response.status==401){
                    setLoading(false)
                 
                    openDialog_member()
                }
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

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={styles.container}>



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: 10, padding: 10, alignItems: 'center' }}>
                <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                    }}>
                                            <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>  
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>{t('Requests')}</Text>

                    </View>


                </View>

            </View>


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View style={{marginBottom:'20%'}}>

                <FlatList

                    data={get_request}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            </View>



            <CommentDialog
        isVisible={isDialogVisible_member}
        onClose={closeDialog_member}
        onButtonPress={handleButtonPress_member}
      />
          

          {get_request.length==0 && (
                 <EmptyState
                 title="No Data Found"
                 description="Item added in cart will show here"
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