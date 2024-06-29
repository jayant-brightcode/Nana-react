import React, { useState, useEffect } from 'react'

import { RefreshControl,View, Text, StyleSheet, Image, Alert,FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal, Linking } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions

import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import { Rating, AirbnbRating } from 'react-native-ratings';
import CommentDialog from '../component/MemberShipDialog';





const JobRequestScreen = () => {
    const navigation = useNavigation()
    const [refreshing, setRefreshing] = useState(false);

    const [get_request, set_request] = useState([])
    const [loading, setLoading] = useState(false);
    const [get_id, set_id] = useState('')
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [isDialogVisible1, setDialogVisible1] = useState(false);
    const [isDialogVisible2, setDialogVisible2] = useState(false);
    const [user_details, set_user_details] = useState({});
    const [userRating, setUserRating] = useState(0);
    const [submit_review_id,set_submit_review_id] = useState('')
    const [review,set_review] = useState('')
    const [job_desc,set_job_desc] = useState('')
    const [is_price_DialogVisible, set_price_DialogVisible] = useState(false);
    const [price,set_price] = useState('')
    const [job_id,set_job_id] = useState('')

    const [selectedItem, setSelectedItem] = useState(null);
    const [isDialogVisible_member, setDialogVisible_member] = useState(false);

    const [mylat,set_my_lat] = useState('')
    const [mylong,set_my_long] =useState('')


    useEffect(() => {
        getProfile();
    }, []);
    useEffect(() => {
        get_job_request();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        getProfile()
        get_job_request()
       
        setRefreshing(false);
      
        
      };

    const openDialog = () => {
        console.log(user_details)
        setDialogVisible(true);
    };

    const openDialog1 = () => {
   
        setDialogVisible1(true);
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

    const open_price_dialog = () => {
   
        set_price_DialogVisible(true);
    };

    const openDialog2 = (item) => {

        set_job_desc(item.desc)
   
        setDialogVisible2(true);
    };
    const closeDialog = () => {
        setDialogVisible(false);
    };
    const closePriceDialog = () => {
        set_price_DialogVisible(false);
    };
    const closeDialog1 = () => {
        setDialogVisible1(false);
    };
    const closeDialog2 = () => {
        setDialogVisible2(false);
    };

    const handleButtonPress = () => {


        closeDialog();
    };

    const chatHandler = () => {

        console.log("jayant",selectedItem)

        EnterChat(selectedItem._id, selectedItem.to_user_id._id)


        closeDialog();
    };

    const handleSetPrice = (id) => {

        accept_job_request(id)
     

    
    };

    const handleButtonPress1 = () => {


        add_review(submit_review_id)





        closeDialog1();
    };

    const handleRating = (rating) => {
        setUserRating(rating);
    
        // You can also perform any additional actions with the rating value here
      };


    const handleCallNow = () => {

        if(user_details.phone==null){
            openDialer(user_details.alternate_phone)
        }else{
            openDialer(user_details.phone)
        }
        
       
        // You can also perform any additional actions with the rating value here
    };



    const handleDirection = () => {
       openGoogleMaps()

        // You can also perform any additional actions with the rating value here
    };


    const openDialer = (mobile) => {
        console.log(mobile)

        const dialerUrl = Platform.OS === 'android' ? `tel:${mobile}` : `telprompt:${mobile}`;

        Linking.canOpenURL(dialerUrl).then((supported) => {
            if (supported) {
                return Linking.openURL(dialerUrl);
            } else {
                console.error('Phone dialer not supported');
            }
        });
    };

    const openGoogleMaps = () => {
        console.log("kumar",user_details)
        const directionUrl = Platform.select({
            ios: `http://maps.apple.com/?saddr=${mylat},${mylong}&daddr=${user_details.latitude},${user_details.longitude}`,
            android: `https://www.google.com/maps/dir/?api=1&origin=${mylat},${mylong}&destination=${user_details.latitude},${user_details.longitude}`,
        });

        Linking.canOpenURL(directionUrl).then((supported) => {
            if (supported) {
                return Linking.openURL(directionUrl);
            } else {
                console.error('Google Maps not supported');
            }
        });
    };

    const renderJobItem = ({ item }) => {

        const skillsString = item.skills.map(skill => skill.name).join(', ');






        return (
            <TouchableOpacity onPress={() => {

                console.log(item.to_user_id)

            }}>

                <View style={{ marginTop: 13, flexDirection: 'row', marginStart: 10, marginEnd: 10, borderRadius: 10, padding: 10,borderBottomColor:Colors.dark_gray,borderBottomWidth:1 }}>
                    <View
                        style={{
                            width: 50,
                            height: 80,
                            marginTop:10,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            backgroundColor: item.grayview,
                          
                           
                        }}
                    >
                        <Image style={{ width: 50, height: 50,borderRadius:50 }} source={{ uri: item.from_user_id._id==get_id.toString() ? Remote.BASE_URL +item.to_user_id.profile : Remote.BASE_URL +item.from_user_id.profile}} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 14, marginTop: 10 }}>


                        {item.from_user_id._id.toString()==get_id.toString() && (
                            <View>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>To - {item.to_user_id.name}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>From - {item.from_user_id.name}</Text>



                                </View>

                        )}

                       {item.to_user_id._id.toString()==get_id.toString() && (
                            <View>
                     <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>From - {item.from_user_id.name}</Text>

                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>To - {item.to_user_id.name}</Text>



                                </View>

                        )}

             
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>Profession Name- {item.to_user_id.profession_name}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>Profession Skill- {skillsString}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 12 }}>Job Preference - {item.job_pref.name}</Text>

                        <Text style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 12 }}>Working Date - {new Date(item.date).toDateString()}</Text>
                        <Text style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 12 }}>Job Request Sent Date - {new Date(item.createdAt).toDateString()}</Text>

                        <Text style={{ color: Colors.dark_gray, fontWeight: 'bold', fontSize: 12 }}>Request status - {item.application_status}</Text>

                        {item.job_pref.name == "Monthly Job" && (
                        <Text style={{ color: Colors.red, fontWeight: 'bold', fontSize: 12 }}>Gross Monthly Salary - Rs.{item.amount_set}</Text>

                        )}

                        {item.job_pref.name == "Daily Service" && (
                        <Text style={{ color: Colors.red, fontWeight: 'bold', fontSize: 12 }}>Profession Service Charge - Rs.{item.amount_set}</Text>

                        )}

                        <TouchableOpacity onPress={()=>{
                             openDialog2(item)
                        }}>
                            <Text style={{borderRadius:10,borderWidth:1,borderColor:Colors.orange,padding:8,textAlign:'center',marginTop:10}}>View Job Description</Text>
                        </TouchableOpacity>


                        <View style={{ flexDirection: 'row' }}>

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "accepted by user" &&  item.job_pref.name=="Daily Service" &&(

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {

                                    Alert.alert(
                                        'Confirmation',
                                        'Are you sure you want to pay platfrom fee?',
                                        [
                                          {
                                            text: 'Cancel',
                                            style: 'cancel',
                                          },
                                          {
                                            text: 'Yes',
                                            onPress: () => {
                                              // Handle "Yes" button press
                                              pay_platform_fee(item._id)
                                            },
                                          },
                                        ],
                                        { cancelable: false }
                                      );
                            
                                }


                                }>
                                    {/* <Text style={{fontSize:11,color:Colors.textcolor,marginTop:8}}>Per/day price set - {item.to_user_id.average_price} </Text> */}
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10,borderRadius:10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10}}>Pay Platform fee Rs.{item.job_pref.platform_charge}</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}



                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "accepted by user" && item.job_pref.name == "Monthly Job"  && (

                                <TouchableOpacity style={{width:'48%'}} onPress={() => {
                                    {setSelectedItem(item)}
                                    { get_employee_details_after_payment(item._id) }
                                
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden'}}>view detail</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}    

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={{width:'48%'}} onPress={() => {

                                    { setSelectedItem(item) }
                                    { get_employee_details_after_payment(item._id) }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10 }}>view detail</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}    

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "accepted by user" && item.job_pref.name == "Monthly Job"  && item.is_joined == false && (

                                <TouchableOpacity style={{width:'48%',marginStart:10}} onPress={() => {
                                    { 
                                    
                                        Alert.alert(
                                            'Confirmation',
                                            'Are you sure you want to start work today?',
                                            [
                                              {
                                                text: 'Cancel',
                                                style: 'cancel',
                                              },
                                              {
                                                text: 'Yes',
                                                onPress: () => {
                                                  // Handle "Yes" button press
                                                  start_work(item._id) 
                                                },
                                              },
                                            ],
                                            { cancelable: false }
                                          );
                                    
                                    
                                    }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: Colors.navcolor, marginStart: 10, padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden' }}>start work</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "payment done" && (

                                <TouchableOpacity style={{width:'48%'}} onPress={() => {
                                     setSelectedItem(item) 
                                     get_employee_details_after_payment(item._id) 
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden' }}>view details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {/* {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job" && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                     setSelectedItem(item) 
                                     get_employee_details_after_payment(item._id) 
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden' }}>view details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    {/* </View> */}
                                {/* </TouchableOpacity>)} */}

                            {/* {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer" && ( */}

                                {/* // <TouchableOpacity style={styles.button1} onPress={() => { */}
                                {/* //      setSelectedItem(item)  */}
                                {/* //      get_employee_details_after_payment(item._id)  */}
                                {/* // } */}


                                {/* // }> */}
                                {/* //     <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}> */}
                                {/* //         <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden' }}>view details</Text> */}
                                {/* //         <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                {/* //     </View> */}
                                {/* // </TouchableOpacity> */}
                                {/* //)} */}



                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "payment done" && item.is_joined == false && (

                                <TouchableOpacity style={{width:'48%',marginStart:10}} onPress={() => {
                                    { 

                                        Alert.alert(
                                            'Confirmation',
                                            'Are you sure you want to start work today?',
                                            [
                                              {
                                                text: 'Cancel',
                                                style: 'cancel',
                                              },
                                              {
                                                text: 'Yes',
                                                onPress: () => {
                                                  // Handle "Yes" button press
                                                  start_work(item._id) 
                                                },
                                              },
                                            ],
                                            { cancelable: false }
                                          );
                                    
                                     }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: Colors.navcolor, marginStart: 10, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden'}}>start work</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.job_pref.name == "Daily Service"  && (

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {
                                   
                                    Alert.alert(
                                        'Confirmation',
                                        'Are you sure you want to start work today?',
                                        [
                                          {
                                            text: 'Cancel',
                                            style: 'cancel',
                                          },
                                          {
                                            text: 'Yes',
                                            onPress: () => {
                                              // Handle "Yes" button press
                                               complete_work(item._id) 
                                            },
                                          },
                                        ],
                                        { cancelable: false }
                                      );
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: '#68BBE3', padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden'}}>complete work</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={{width:'48%'}} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10,marginStart:10, marginBottom: 10 }}>
                                        <Text style={{ textAlign:'center',backgroundColor: Colors.navcolor, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden'}}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ textAlign:'center',backgroundColor: Colors.navcolor, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden'}}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginStart: 10, marginBottom: 10 }}>
                                    <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden',textAlign:'center'}}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden',textAlign:'center'}}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginStart: 10, marginBottom: 10 }}>
                                    <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden'}}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white ,borderRadius:10,overflow:'hidden',textAlign:'center'}}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "request sent" && (

                                <TouchableOpacity style={{width:'100%'}} onPress={() => {
                                    { 

                                        Alert.alert(
                                            'Confirmation',
                                            'Are you sure you want to cancel this job request?',
                                            [
                                              {
                                                text: 'Cancel',
                                                style: 'cancel',
                                              },
                                              {
                                                text: 'Yes',
                                                onPress: () => {
                                                  // Handle "Yes" button press
                                                  cancel_job_request(item._id) 
                                                },
                                              },
                                            ],
                                            { cancelable: false }
                                          );
                                        
                                      
                                    
                                    
                                    }
                                }


                                }>
                                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.red,textAlign:'center', padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden'}}>Cancel</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}




                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "request sent" && (

                                <TouchableOpacity style={{width:'48%'}} onPress={() => {

                                    {
                                        Alert.alert(
                                            'Confirmation',
                                            'Are you sure you want to accept this job request?',
                                            [
                                              {
                                                text: 'Cancel',
                                                style: 'cancel',
                                              },
                                              {
                                                text: 'Yes',
                                                onPress: () => {
                                                  // Handle "Yes" button press
                                                   set_job_id(item._id)  
                                                   handleSetPrice(item._id)
                                    
                                   
                                                 // open_price_dialog()
                                                },
                                              },
                                            ],
                                            { cancelable: false }
                                          );
                                    }

                                   

                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white ,borderRadius:10,textAlign:'center'}}>Accept</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "request sent" && (

                                <TouchableOpacity style={{width:'48%' ,marginStart:10}} onPress={() => {
                                    { 

                                        Alert.alert(
                                            'Confirmation',
                                            'Are you sure you want to cancel this job request?',
                                            [
                                              {
                                                text: 'Cancel',
                                                style: 'cancel',
                                              },
                                              {
                                                text: 'Yes',
                                                onPress: () => {
                                                  // Handle "Yes" button press
                                                  cancel_job_request(item._id) 
                                                },
                                              },
                                            ],
                                            { cancelable: false }
                                          );
                                    }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.red, padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden',textAlign:'center' }}>Cancel</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}




                        </View>

                        {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.is_quit == false && item.job_pref.name == "Monthly Job"&& (

                            <TouchableOpacity  onPress={() => {

                                {
                                    Alert.alert(
                                        'Confirmation',
                                        'Are you sure you want to remove employee from job?',
                                        [
                                          {
                                            text: 'Cancel',
                                            style: 'cancel',
                                          },
                                          {
                                            text: 'Yes',
                                            onPress: () => {
                                              // Handle "Yes" button press
                                              remove_or_leave_job(item._id)
                                            },
                                          },
                                        ],
                                        { cancelable: false }
                                      );
                                }
                              
                            }


                            }>
                                <View style={{  marginBottom: 10 }}>
                                    <Text style={{ padding:10,textAlign:'center',backgroundColor:Colors.red,borderRadius:10,overflow:'hidden' ,color:Colors.white}}>Remove from job</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>)}


                        {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.is_quit == false && item.job_pref.name == "Monthly Job" && (

                            <TouchableOpacity onPress={() => {

                                {
                                    Alert.alert(
                                        'Confirmation',
                                        'Are you sure you want to quit from job?',
                                        [
                                          {
                                            text: 'Cancel',
                                            style: 'cancel',
                                          },
                                          {
                                            text: 'Yes',
                                            onPress: () => {
                                              // Handle "Yes" button press
                                              remove_or_leave_job(item._id)
                                            },
                                          },
                                        ],
                                        { cancelable: false }
                                      );
                                }
                               
                            }


                            }>
                                <View style={{ width: '100%', marginBottom: 10 }}>
                                    <Text style={{ overflow:'hidden',backgroundColor:Colors.red,borderRadius:10,color:Colors.white, padding: 10, textAlign: 'center' }}>Quit job</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>)}




                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job"   && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    set_submit_review_id(item.to_user_id._id)

                                    openDialog1()

                                }


                                }>
                                    <View style={{  marginBottom: 10 }}>
                                    <Text style={{  padding: 10, color: Colors.white,textAlign:'center' ,borderRadius:10,overflow:'hidden',backgroundColor:'#68BBE3'}}>Write a Review</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                                {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer"   && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    set_submit_review_id(item.to_user_id._id)

                                    openDialog1()

                                }


                                }>
                                    <View style={{   marginBottom: 10 }}>
                                    <Text style={{  padding: 10, color: Colors.white,textAlign:'center' ,borderRadius:10,overflow:'hidden',backgroundColor:'#68BBE3'}}>Write a Review</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                                {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer"   && (

                                    <TouchableOpacity style={styles.button1} onPress={() => {
                                        set_submit_review_id(item.from_user_id._id)

                                        openDialog1()

                                    }


                                    }>
                                        <View style={{   marginBottom: 10 }}>
                                        <Text style={{  padding: 10, color: Colors.white,textAlign:'center' ,borderRadius:10,overflow:'hidden',backgroundColor:'#68BBE3'}}>Write a Review</Text>
                                            {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                        </View>
                                    </TouchableOpacity>)}


                                         {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job"   && (

                                            <TouchableOpacity style={styles.button1} onPress={() => {
                                                set_submit_review_id(item.from_user_id._id)

                                                openDialog1()

                                            }


                                            }>
                                                <View style={{   marginBottom: 10 }}>
                                                <Text style={{  padding: 10, color: Colors.white,textAlign:'center' ,borderRadius:10,overflow:'hidden',backgroundColor:'#68BBE3'}}>Write a Review</Text>
                                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                                </View>
                                            </TouchableOpacity>)}


                                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "work completed"   && (

                                                    <TouchableOpacity style={styles.button1} onPress={() => {
                                                        set_submit_review_id(item.from_user_id._id)

                                                        openDialog1()

                                                    }


                                                    }>
                                                        <View style={{ marginTop:10, marginBottom: 10 }}>
                                                        <Text style={{  padding: 10, color: Colors.white,textAlign:'center' ,borderRadius:10,overflow:'hidden',backgroundColor:'#68BBE3'}}>Write a Review</Text>
                                                            {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                                        </View>
                                                    </TouchableOpacity>)}


                                                    {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "work completed"   && (

                                                            <TouchableOpacity style={styles.button1} onPress={() => {
                                                                    set_submit_review_id(item.to_user_id._id)
                                                                    openDialog1()
                                                            }


                                                            }>
                                                                <View style={{ marginBottom: 10,marginTop:10 }}>
                                                                    <Text style={{  padding: 10, color: Colors.white,textAlign:'center' ,borderRadius:10,overflow:'hidden',backgroundColor:'#68BBE3'}}>Write a Review</Text>
                                                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                                                </View>
                                                            </TouchableOpacity>)}


                        { item.application_status == "work completed" && (

                            <TouchableOpacity style={styles.button1} onPress={() => {

                                if (item.from_user_id._id.toString() == get_id.toString()) {
                                    add_like(item.to_user_id._id)
                                }

                                if (item.to_user_id._id.toString() == get_id.toString()) {
                                    add_like(item.from_user_id._id)

                                }


                              
                            }


                            }>
                                <View style={{  marginBottom: 10 }}>
                                    <Text style={{  padding: 10, color: Colors.white, textAlign: 'center',borderRadius:10,overflow:'hidden',backgroundColor:'#000000' }}>Add Like</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>)}

                        {item.application_status == "employee left the job" && (

                            <TouchableOpacity style={styles.button1} onPress={() => {

                                if (item.from_user_id._id.toString() == get_id.toString()) {
                                    add_like(item.to_user_id._id)
                                }

                                if (item.to_user_id._id.toString() == get_id.toString()) {
                                    add_like(item.from_user_id._id)

                                }
                            }


                            }>
                                <View style={{  marginBottom: 10 }}>
                                <Text style={{  padding: 10, color: Colors.white, textAlign: 'center',borderRadius:10,overflow:'hidden',backgroundColor:'#000000' }}>Add Like</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>)}


                        {item.application_status == "employee removed by employer" && (

                            <TouchableOpacity style={styles.button1} onPress={() => {


                                if(item.from_user_id._id.toString()==get_id.toString()){
                                      add_like(item.to_user_id._id)
                                }

                                if (item.to_user_id._id.toString() == get_id.toString()) {
                                    add_like(item.from_user_id._id)

                                }
                              
                            }


                            }>
                                <View style={{  marginBottom: 10 }}>
                                <Text style={{  padding: 10, color: Colors.white, textAlign: 'center',borderRadius:10,overflow:'hidden',backgroundColor:'#000000' }}>Add Like</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>)}

                    </View>
                    {/* <TouchableOpacity onPress={()=>{
                        openDialog2(item)
                    }}>


                        <View style={{ flex: 0, justifyContent: 'flex-end', marginRight: 10 }}>
                            <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/next.png')} />
                        </View>
                    </TouchableOpacity> */}

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
                set_my_lat(data.profile_details.latitude)
                set_my_long(data.profile_details.longitude)

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
            let apiUrl = Remote.BASE_URL + "user/get_job_request"







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


                set_request(data.request);

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

    const cancel_job_request = async (id) => {



        try {

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/cancel_job_request";

            const userData = {
                job_request_id: id,

            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
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
                get_job_request()



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





    };

    const accept_job_request = async (id) => {



        try {


            // if(!price || price==''){
            //     Toast.show({
            //         type: 'success',
            //         text1: 'please select price',
            //     });

            // }
            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/accept_job_request";

            const userData = {
                job_request_id: id,
                
         

            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
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
                closePriceDialog()
                get_job_request()



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





    };

    const pay_platform_fee = async (id) => {



        try {

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/make_platform_fee_payment";

            const userData = {
                job_request_id: id,
                payment_mode: "upi",
                payment_status: "success",
                transaction_id: "asdsadsadasds"

            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
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
                get_job_request()



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





    };

    const get_employee_details_after_payment = async (id) => {

        


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_employee_details_after_payment"

            const queryParams = {
                job_request_id: id,

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

                console.log("lll",data)




                set_user_details(data.details);

                setLoading(false)
                openDialog()





            } else {
                console.error('Errorss:', response.status, response.statusText);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };


    const start_work = async (id) => {



        try {

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/start_work";

            const userData = {
                job_request_id: id,


            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
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
                get_job_request()



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





    };

    const complete_work = async (id) => {



        try {

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/complete_work";

            const userData = {
                job_request_id: id,


            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
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
                get_job_request()



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





    };


    const remove_or_leave_job = async (id) => {



        try {



            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/remove_or_left_job";

            const userData = {
                job_request_id: id,
              

            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
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
                get_job_request()




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





    };

    const add_review = async (id) => {



        try {



            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/add_rating";

            const userData = {
                to_user_id: id,
                rating:userRating,
                review:review
              

            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
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





    };

    const add_like = async (id) => {



        try {



            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/add_like";

            const userData = {
                to_user_id: id,
            


            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
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





    };


    const EnterChat = async (job_req_id, reciever_id) => {



        try {

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/enter_chat";

            const userData = {
                job_req_id: job_req_id,
                reciever_id: reciever_id,
           


            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
                body: JSON.stringify(userData),
            });


            const responsedata = await response.json();


            if (response.ok) {
                // Handle success

              
                 
                setLoading(false)
                const data = {
                    chat_room_id: responsedata.chat_room_id
                }

                navigation.navigate("ChatScreen", { data: data })



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
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Requests</Text>

                    </View>


                </View>

            </View>


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View style={{marginBottom:60}}>

                <FlatList
                 
                    data={get_request}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                      }
                />
            </View>

            <Modal visible={isDialogVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>User Details</Text>
                        <Text style={{ color: Colors.textcolor, marginBottom: 3, fontWeight: 'light' }}>Name</Text>
                        <Text style={{ color: Colors.orange, marginBottom: 10, fontWeight: 'bold' }}>{user_details.name}</Text>

                        <Text>Address</Text>

                        <Text multiline={true} style={styles.input}>{user_details.present_address}</Text>



                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleCallNow}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white, borderRadius: 10,borderRadius:10,shadowColor:Colors.black,overflow:'hidden' }}>Call Now</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={chatHandler}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white, borderRadius: 10,overflow:'hidden'  }}>Chat</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={handleDirection}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10,overflow:'hidden'  }}>Direction</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={closeDialog}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>


            <Modal visible={isDialogVisible1} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Add Rating and review</Text>

                    

                        <TextInput style={styles.input} placeholder='Enter your review here' value={review} onChangeText={(text) => set_review(text)}></TextInput>


                        <Text style={{ color: Colors.textcolor,alignSelf:'center' }}>Rating</Text>
                    <AirbnbRating
                        count={5} // Number of rating items
                        reviews={['Terrible', 'Bad', 'Good', 'Great', 'Excellent']} // Optional review text
                        defaultRating={3} // The rating to display (adjust as needed)
                        size={40} // Size of the rating items
                        showRating={true} // Set to false to hide the rating value
                        onFinishRating={handleRating}
                    />


                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleButtonPress1}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white }}>submit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={closeDialog1}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>



            <Modal visible={isDialogVisible2} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Job description</Text>

                    

                       

                        <Text style={{ color: Colors.textcolor,alignSelf:'center' }}>{job_desc}</Text>
                   


                        <View style={styles.buttonContainer}>
                           

                            <TouchableOpacity style={styles.button} onPress={closeDialog2}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>

            <Modal visible={is_price_DialogVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Are you sure ?</Text>

                    

                       

                        {/* <TextInput style={{ color: Colors.textcolor,alignSelf:'center',borderRadius:10 }} placeholder='Enter Price' keyboardType='numeric' value={price} onChangeText={(text) => set_price(text)}></TextInput>
                    */}


                      
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleSetPrice}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10 }}>Yes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={closePriceDialog}>
                                <Text style={styles.buttonText}>Close</Text>
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


        </View>

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



export default JobRequestScreen