import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { useRoute } from '@react-navigation/native';
import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';


const jobs_list = [
    { id: 1, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Web Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 2, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'IOS Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.pink },
    { id: 3, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Android Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 4, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Blockchain Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.pink },
    { id: 5, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Web Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 6, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'IOS Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.pink },
    { id: 7, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Android Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.fadeOrange },
    { id: 8, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Blockchain Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.pink },
    { id: 9, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Web Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 10, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'IOS Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.pink },
    { id: 11, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Android Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 12, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Blockchain Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.pink },

]


const AttendanceScreen = () => {
    const route = useRoute();
    const { detail } = route.params

    const [attendance, set_attendance] = useState([])
    const [loading, setLoading] = useState(false);

    const [get_monthly_payment,set_monthly_payment] = useState({})
    const [get_id, set_id] = useState('')


    useEffect(() => {
        get_attendance();
    }, []);

    useEffect(() => {
        check_monthly_payment();
    }, []);

    useEffect(() => {
        getProfile()
    }, []);


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

   
    const renderJobItem = ({ item }) => {


  



        return (
            <TouchableOpacity onPress={() => {
                  
            }}>

                <View style={{ marginTop: 13, flexDirection: 'row', marginStart: 10, marginEnd: 10, backgroundColor: Colors.grayview, borderRadius: 10,padding:10 }}>
                    <View >
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>Date</Text>
                        <Text>{new Date(item.createdAt).toDateString()}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 14 }}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>Prsent/Absent</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>{item.attendance_status}</Text>
            

                    </View>
                   
                </View>
            </TouchableOpacity>


        )
    };



    const make_attendance = async (status) => {



        try {

           

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/make_attendance";

            const userData = {
                payment_service_id: detail._id,
                attendance_status: status

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

                get_attendance()
              



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

    const get_attendance = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_attendance"

            const queryParams = {
                payment_service_id: detail._id,

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


                set_attendance(data.attendance);

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



    const check_monthly_payment = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/check_monthly_payment"

            const queryParams = {
                payment_service_id: detail._id,

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

                const result = {
                    amount : data.amount_to_pay,
                    payment_open:data.payment_open,
                    payment:data.payment

                }


                set_monthly_payment(result);

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


    const pay_monthly_payment = async () => {



        try {



            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/pay_monthly_payment";

            const userData = {
                payment_service_id: detail._id,
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
                check_monthly_payment()




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


    const extend_job = async () => {



        try {



            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/extend_monthly_job";

            const userData = {
                payment_service_id: detail._id,
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

            console.log(responsedata)


            if (response.ok) {
                // Handle success
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)
                check_monthly_payment()




            } else {
                // Handle error
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
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
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Attendance</Text>

                    </View>

                    {detail.job_request_id.from_user_id.toString() == get_id.toString() && get_monthly_payment.payment == "payment done" && detail.job_request_id.is_quit==false&& (
                        <TouchableOpacity style={styles.button1} onPress={() => {
                            extend_job()
                        }


                        }>
                            <View style={{}}>
                                <Text style={{ backgroundColor: Colors.white, padding: 10, color: Colors.black }}>Extend Job</Text>
                                {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                            </View>
                        </TouchableOpacity>
                    )}


                </View>

            </View>


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
          
                <View style={{ marginTop: 10, marginBottom: 10 }}>

                    {detail.job_request_id.from_user_id.toString()==get_id.toString() && (
                    <Text style={{ color: Colors.black, textAlign: 'center', marginStart: 10, marginEnd: 10 }}>Make Attendace for today</Text>
                    )}

              

                {detail.job_request_id.to_user_id.toString() == get_id.toString() && (

                  <View style={{alignItems:'center'}}>

                <Text style={{ fontWeight: 'bold', fontSize: 16, color: Colors.black }}>Payment Status - {get_monthly_payment.payment} </Text>
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 2 }}>Amount to Get - Rs. {get_monthly_payment.amount}</Text></View>
                )}

                
                  
                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                </View>
        
            {detail.job_request_id.from_user_id.toString() == get_id.toString() && (
             <View style={{flexDirection:'row',alignSelf:'center',justifyContent:'space-between'}}>

                <TouchableOpacity style={styles.button1} onPress={() => {

                    if (detail.job_request_id.is_quit==false){
                        make_attendance("present")
                    }else{
                        Toast.show({
                            type: 'success',
                            text1: "Employee has been left the job",
                        });
                    }
              
                }


                }>
                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white, textAlign: 'center', }}>Present</Text>
                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                    </View>
                </TouchableOpacity>


                <TouchableOpacity style={styles.button1} onPress={() => {

                    if (detail.job_request_id.is_quit == false) {
                        make_attendance("absent")
                    }else{
                        Toast.show({
                            type: 'success',
                            text1: "Employee has been left the job",
                        });
                    }
                    
                }


                }>
                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                        <Text style={{ backgroundColor: Colors.navcolor, padding: 10, color: Colors.white, textAlign: 'center',marginStart:8}}>Absent</Text>
                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                    </View>
                </TouchableOpacity>
             </View> )}


            <View>

                <FlatList

                    data={attendance}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                />
            </View>


            {detail.job_request_id.from_user_id.toString() == get_id.toString() && (
            <View style={{ backgroundColor: Colors.grayview, position: 'absolute', height: '10%', bottom: 0, width: '100%', padding: 10 ,flexDirection:'row'}}>

                <View style={{flex:4}}>

                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: Colors.black }}>Payment Status - {get_monthly_payment.payment} </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, marginTop: 2 }}>Amount to pay - Rs. {get_monthly_payment.amount}</Text>

                </View>




                {get_monthly_payment.payment_open==true && (
                <TouchableOpacity style={styles.button1} onPress={() => {
                  pay_monthly_payment()
                }


                }>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white, textAlign: 'center', marginStart: 8 }}>Pay Now</Text>
                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                    </View>
                </TouchableOpacity>
                )}

                {get_monthly_payment.payment_open == false && (
                    <TouchableOpacity  onPress={() => {
                      
                    }


                    }>
                        <View style={{  marginBottom: 10 }}>
                            <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white, textAlign: 'center', marginStart: 8}}>Payment Closed</Text>
                            {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                        </View>
                    </TouchableOpacity>
                )}

                   

             
           </View>)}
          

         


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

    }




})



export default AttendanceScreen