import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions

import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import { Rating, AirbnbRating } from 'react-native-ratings';





const JobRequestScreen = () => {
    const navigation = useNavigation()

    const [get_request, set_request] = useState([])
    const [loading, setLoading] = useState(false);
    const [get_id, set_id] = useState('')
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [isDialogVisible1, setDialogVisible1] = useState(false);

    const [user_details, set_user_details] = useState({});
    const [userRating, setUserRating] = useState(0);
    const [submit_review_id,set_submit_review_id] = useState('')
    const [review,set_review] = useState('')

    useEffect(() => {
        getProfile();
    }, []);
    useEffect(() => {
        get_job_request();
    }, []);

    const openDialog = () => {
        console.log(user_details)
        setDialogVisible(true);
    };

    const openDialog1 = () => {
   
        setDialogVisible1(true);
    };
    const closeDialog = () => {
        setDialogVisible(false);
    };
    const closeDialog1 = () => {
        setDialogVisible1(false);
    };

    const handleButtonPress = () => {


        closeDialog();
    };

    const handleButtonPress1 = () => {


        add_review(submit_review_id)





        closeDialog1();
    };

    const handleRating = (rating) => {
        setUserRating(rating);
    
        // You can also perform any additional actions with the rating value here
      };

    const renderJobItem = ({ item }) => {

        const skillsString = item.skills.map(skill => skill.name).join(', ');






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
                        <Image style={{ width: 50, height: 50, resizeMode: 'center' }} source={{ uri: Remote.BASE_URL + item.profile }} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 14, marginTop: 10 }}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>{item.from_user_id.name}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>For Skills - {skillsString}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>Job Preference - {item.job_pref.name}</Text>
                        <Text style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 12 }}>For date - {new Date(item.date).toDateString()}</Text>

                        <Text style={{ color: Colors.dark_gray, fontWeight: 'bold', fontSize: 12 }}>Request status - {item.application_status}</Text>



                        <View style={{ flexDirection: 'row' }}>

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "accepted by user" &&  item.job_pref.name=="Daily Service" &&(

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    { pay_platform_fee(item._id) }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white }}>Pay Platform fee</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}



                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "accepted by user" && item.job_pref.name == "Monthly Job"  && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    { get_employee_details_after_payment(item._id) }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white }}>view detail</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}    

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    { get_employee_details_after_payment(item._id) }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white }}>view detail</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}    

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "accepted by user" && item.job_pref.name == "Monthly Job"  && item.is_joined == false && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    { start_work(item._id) }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.navcolor, marginStart: 10, padding: 10, color: Colors.white }}>start work</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "payment done" && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    { get_employee_details_after_payment(item._id) }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white }}>view details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job" && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    { get_employee_details_after_payment(item._id) }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white }}>view details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer" && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    { get_employee_details_after_payment(item._id) }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white }}>view details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}



                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "payment done" && item.is_joined == false && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    { start_work(item._id) }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.navcolor, marginStart: 10, padding: 10, color: Colors.white }}>start work</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.job_pref.name == "Daily Service"  && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    { complete_work(item._id) }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white }}>complete work</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10,marginStart:10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white }}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginStart: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white }}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginStart: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white }}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginStart: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white }}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginStart: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white }}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer" && item.is_joined == true && item.job_pref.name == "Monthly Job" && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    navigation.navigate("MonthlyWorkDetailScreen", { detail: item })
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginStart: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white }}>view work details</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}

                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "request sent" && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    { cancel_job_request(item._id) }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white }}>Cancel</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}




                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "request sent" && (

                                <TouchableOpacity onPress={() => {
                                    { accept_job_request(item._id) }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white }}>Accept</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "request sent" && (

                                <TouchableOpacity style={{ marginStart: 20 }} onPress={() => {
                                    { cancel_job_request(item._id) }
                                }


                                }>
                                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white }}>Cancel</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}




                        </View>

                        {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.is_quit == false && item.job_pref.name == "Monthly Job"&& (

                            <TouchableOpacity  onPress={() => {
                                { remove_or_leave_job(item._id) }
                            }


                            }>
                                <View style={{ width: '90%', marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ borderColor: Colors.orange, borderWidth: 2,padding:10,textAlign:'center' }}>Remove from job</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>)}


                        {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "user joined" && item.is_joined == true && item.is_quit == false && item.job_pref.name == "Monthly Job" && (

                            <TouchableOpacity onPress={() => {
                                { remove_or_leave_job(item._id) }
                            }


                            }>
                                <View style={{ width: '90%', marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ borderColor: Colors.orange, borderWidth: 2, padding: 10, textAlign: 'center' }}>Quit job</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>)}




                            {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job"   && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    set_submit_review_id(item.to_user_id._id)

                                    openDialog1()

                                }


                                }>
                                    <View style={{ width: '90%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ borderColor: Colors.orange,borderWidth:1, padding: 10, color: Colors.orange,textAlign:'center' }}>Add Review</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                                {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer"   && (

                                <TouchableOpacity style={styles.button1} onPress={() => {
                                    set_submit_review_id(item.to_user_id._id)

                                    openDialog1()

                                }


                                }>
                                    <View style={{ width: '90%', marginTop: 10, marginBottom: 10 }}>
                                        <Text style={{ borderColor: Colors.orange,borderWidth:1, padding: 10, color: Colors.orange,textAlign:'center' }}>Add Review</Text>
                                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                    </View>
                                </TouchableOpacity>)}


                                {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "employee removed by employer"   && (

                                    <TouchableOpacity style={styles.button1} onPress={() => {
                                        set_submit_review_id(item.from_user_id._id)

                                        openDialog1()

                                    }


                                    }>
                                        <View style={{ width: '90%', marginTop: 10, marginBottom: 10 }}>
                                            <Text style={{ borderColor: Colors.orange,borderWidth:1, padding: 10, color: Colors.orange,textAlign:'center' }}>Add Review</Text>
                                            {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                        </View>
                                    </TouchableOpacity>)}


                                         {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "employee left the job"   && (

                                            <TouchableOpacity style={styles.button1} onPress={() => {
                                                set_submit_review_id(item.from_user_id._id)

                                                openDialog1()

                                            }


                                            }>
                                                <View style={{ width: '90%', marginTop: 10, marginBottom: 10 }}>
                                                    <Text style={{ borderColor: Colors.orange,borderWidth:1, padding: 10, color: Colors.orange,textAlign:'center' }}>Add Review</Text>
                                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                                </View>
                                            </TouchableOpacity>)}


                                            {item.to_user_id._id.toString() == get_id.toString() && item.application_status == "work completed"   && (

                                                    <TouchableOpacity style={styles.button1} onPress={() => {
                                                        set_submit_review_id(item.from_user_id._id)

                                                        openDialog1()

                                                    }


                                                    }>
                                                        <View style={{ width: '90%', marginTop: 10, marginBottom: 10 }}>
                                                            <Text style={{ borderColor: Colors.orange,borderWidth:1, padding: 10, color: Colors.orange,textAlign:'center' }}>Add Review</Text>
                                                            {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                                        </View>
                                                    </TouchableOpacity>)}


                                                    {item.from_user_id._id.toString() == get_id.toString() && item.application_status == "work completed"   && (

                                                            <TouchableOpacity style={styles.button1} onPress={() => {
                                                                    set_submit_review_id(item.to_user_id._id)
                                                                    openDialog1()
                                                            }


                                                            }>
                                                                <View style={{ width: '90%', marginTop: 10, marginBottom: 10 }}>
                                                                    <Text style={{ borderColor: Colors.orange,borderWidth:1, padding: 10, color: Colors.orange,textAlign:'center' }}>Add Review</Text>
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
                                <View style={{ width: '90%', marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ borderColor: Colors.orange, borderWidth: 1, padding: 10, color: Colors.orange, textAlign: 'center' }}>Add Like</Text>
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
                                <View style={{ width: '90%', marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ borderColor: Colors.orange, borderWidth: 1, padding: 10, color: Colors.orange, textAlign: 'center' }}>Add Like</Text>
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
                                <View style={{ width: '90%', marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ borderColor: Colors.orange, borderWidth: 1, padding: 10, color: Colors.orange, textAlign: 'center' }}>Add Like</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>)}

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
                console.error('Error:', response.status, response.statusText);
                setLoading(false)
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
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>User Details</Text>
                        <Text style={{ color: Colors.orange, marginBottom: 10, fontWeight: 'bold' }}>{user_details.name}</Text>

                        <Text>Address</Text>

                        <Text multiline={true} style={styles.input}>{user_details.present_address}</Text>



                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white }}>Call Now</Text>
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



export default JobRequestScreen