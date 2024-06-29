import React, { useState, useEffect } from 'react'

import {Modal,TextInput,RefreshControl, Alert,View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, TouchableWithoutFeedback, SafeAreaView } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { useRoute } from '@react-navigation/native';
import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import { all } from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker'
import { useTranslation } from 'react-i18next';

import RazorpayCheckout from 'react-native-razorpay'
import {Buffer} from 'buffer'
import axios from 'axios';

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
    const navigation = useNavigation()
    const route = useRoute();
    const { detail } = route.params

    const [attendance, set_attendance] = useState([])
    const [loading, setLoading] = useState(false);

    const [get_monthly_payment,set_monthly_payment] = useState({})
    const [get_id, set_id] = useState('')
    const [c_type, set_c_type] = useState('')

    const [start_date,set_start_date] = useState('')
    const [end_date,set_end_date] = useState('')
    const [chosenDate, setChosenDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isDialogVisible, setDialogVisible] = useState(false);

    const [missed_attandance,set_missed_attandacne] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [cancel_reason,set_cancel_reason] =useState('')
    const [cancel_dialog,set_cancel_dialog] =useState(false)

    const [attendacnce_item,set_attendance_item] = useState(null)
    const [show_missed_attendance,set_show_missed_attendance] = useState(false)


    const [referal_code, set_referal_code] = useState("");

    const [isDialogVisibleref, setDialogVisibleref] = useState(false);

    const [isDialogVisiblepayment, setDialogVisiblepayment] = useState(false);

    const [phone_number, set_phone_number] = useState('');
    const [email_address, set_email_address] = useState('');

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


    useEffect(() => {
        get_attendance();
    }, []);

    useEffect(() => {
        check_monthly_payment();
    }, []);

    const openDialog = () => {
        setDialogVisible(true);
    };
    useEffect(() => {
        getProfile()
        fetchLanguage()
    }, []);

    const openDatePicker = () => {
 
        setShowDatePicker(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
    };

    const onRefresh = () => {
        setRefreshing(true)
        get_attendance()
        check_monthly_payment();
        setRefreshing(false);
        
      };
   

      const onDateChange = (event, selectedDate) => {
        if (event.type === 'set') {
            setChosenDate(selectedDate);
            setShowDatePicker(false);
        } else{
            setShowDatePicker(false);

        }
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
                set_c_type(data.profile_details.customer_type)
                set_phone_number(data.profile_details.phone)
                set_email_address(data.profile_details.email)

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

     


        let skillsString="";

        if(item.job_request_id.skills!=null){
             skillsString = item.job_request_id.skills.map(skill => skill.name).join(', ');
        }



        return (
            <View>

          

            

              

            <View style={{borderRadius:10,borderWidth:1,borderColor:Colors.orange, marginTop: 13, marginStart: 10, marginEnd: 10, backgroundColor: Colors.white, borderRadius: 10,padding:10 }}>
               
            <View style={{flexDirection:'row',justifyContent:'space-between',marginStart:10,marginEnd:10}}>
   
      
   <Text style={{fontWeight:'400',fontSize:14,color:Colors.black}}>{t("Attendance By")}</Text>
   <Text style={{fontWeight:'400',fontSize:14,color:Colors.black}}>{item.from_user_id.name}</Text>
   
</View> 



<View style={{flexDirection:'row',justifyContent:'space-between',marginTop:4,marginStart:10,marginEnd:10}}>


<Text style={{fontWeight:'400',fontSize:14,color:Colors.black}}>{t("Attendance To")}</Text>
<Text style={{fontWeight:'400',fontSize:14,color:Colors.black}}>{item.to_user_id.name}</Text>

</View> 

<View style={{height:1,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10,marginTop:10,marginBottom:10}}>

</View>

<Text style={{marginStart:10,fontSize:13,fontWeight:'bold'}}>{t("Job Description")}</Text>
<Text style={{marginStart:10,fontSize:15,color:Colors.textcolor}}>{item.job_request_id.desc}</Text>
<View style={{height:1,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10,marginTop:10}}>

</View>
<Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>{t("Working for skill")}</Text>
<Text style={{marginStart:10,fontSize:15,color:Colors.orange}}>{skillsString}</Text> 

<View style={{height:1,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10,marginTop:10}}>

</View>


<View style={{flexDirection:'row',justifyContent:'space-between'}}>
<Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>{t("Attendance Date")}</Text>
<Text style={{marginEnd:10,marginTop:10}}>{new Date(item.date).toDateString()}</Text>


</View>

<View style={{height:1,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10,marginTop:10}}>

</View>

<View style={{flexDirection:'row',justifyContent:'space-between'}}>
<Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>{t("Added Amount")}</Text>
<Text style={{marginEnd:10,marginTop:10,fontWeight:'bold'}}>Rs. {item.amount}</Text>


</View>

<View style={{height:1,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10,marginTop:10}}>

</View>


<View style={{flexDirection:'row',justifyContent:'space-between'}}>
<Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>{t("Attendance Status")}</Text>
<Text style={{marginEnd:10,marginTop:10,color:'green'}}>{item.attendance_status}</Text>


</View>

{item.attendance_status=="absent" && (
    <View>
<Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>{t("Rejected Reason")}</Text>
<Text style={{marginStart:10,marginEnd:10,marginTop:10,color:'green'}}>{item.reject_reason}</Text>

</View>
)}

<View style={{height:1,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10,marginTop:10}}>

</View>




{item.from_user_id._id.toString()==get_id.toString() && (
 <View>


 <Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10,color:Colors.red}}>{t("Options")}</Text>
 
 <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
 <Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>{t("Approve Attendance")}</Text>
 <TouchableOpacity onPress={()=>{
 make_attendance("present",item._id,item.payment_service_id._id,item.date.slice(0,10))
 }}>
 <Text style={{marginEnd:10,marginTop:10,color:'green',borderRadius:10,padding:8,borderColor:'green',borderWidth:1,width:80,textAlign:'center'}}>{t("Approve")}</Text>
 
 </TouchableOpacity>
 
 
 </View>
 
 <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
 <Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>{t("Reject Attendance")}</Text>
 
 <TouchableOpacity onPress={()=>{

        set_attendance_item(item)
        set_cancel_dialog(true)
    

 }}>
 <Text style={{marginEnd:10,marginTop:10,color:'red',borderRadius:10,padding:8,borderColor:'red',borderWidth:1,width:80,textAlign:'center'}}>{t("Reject")}</Text>
 
 </TouchableOpacity>
 
 
 </View>
 
 </View>
)}




               
               
                
                
            </View>
            </View>


        )
    };




    const make_attendance = async (status,attendance_id,payment_service_id,date) => {



        try {

            console.log("dddddd",date)

           

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/make_attendance";

            let userData;

            if(status=="present"){
                userData = {
                    attendance_id: attendance_id,
                    attendance_status: status,
                    payment_service_id: payment_service_id,
                    type:"submit",
                    date:date
    
                };
    
            }else{
                userData = {
                    attendance_id: attendance_id,
                    attendance_status: status,
                    payment_service_id: payment_service_id,
                    type:"submit",
                    date:date,
                    reason:cancel_reason
    
                };
    
            }
      
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
           
                check_monthly_payment();
              



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



    const send_attendance_request = async (date) => {



        try {

           

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/make_attendance";

            const userData = {
                payment_service_id: detail._id,
                date:date,
                type: "request"

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
                    text1: "attendance request sent",
                });

            
                setLoading(false)
                set_show_missed_attendance(false)

                get_attendance()
              



            } else {
                // Handle error
                Alert.alert("Alert",responsedata.error);
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

                //console.log("nmnmnmnmnm"+data.attendance[0].payment_service_id.start_date)
              // if(data.attendance.length>0 ){
              //  set_start_date(data.attendance[0].payment_service_id.start_date)
             //   set_start_date(data.attendance[0].payment_service_id.end_date)

                

                const allDates = getDatesBetween(new Date(detail.start_date), new Date(detail.end_date));
                const sentDates = data.attendance.map(data => data.date.slice(0,10));
                
            
 
                // Filter out the dates that are present in sentAttendanceDate
                const notSentDates = allDates.filter(date => !sentDates.includes(date) && new Date(date) < new Date());
                
                set_missed_attandacne(notSentDates)
             //  }

            
              
             

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

    const getDatesBetween = (start, end) => {
        const dates = [];
        let currentDate = new Date(start);
    
        while (currentDate <= end) {
            dates.push(new Date(currentDate).toISOString().slice(0,10));
            currentDate.setDate(currentDate.getDate() + 1);
        }
    
        return dates;
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

                console.log("mnbvcxz",data.platform_fee)
    

                const result = {
                    amount : data.amount_to_pay,
                    payment_open:data.payment_open,
                    payment:data.payment,
                    platform_fee:data.platform_fee


                    
                }

                console.log("pppppp",result)


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


    const pay_monthly_payment = async (details) => {



        try {



            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/pay_monthly_payment";

            const userData = {
                payment_service_id: detail._id,
                amount:get_monthly_payment.amount,
                payment_id:details.id,
                referal_code:referal_code
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
                setDialogVisiblepayment(false)
                check_monthly_payment()




            } else {
                // Handle error
                Toast.show({
                    type: 'success',
                    text1: responsedata.error,
                });
                setDialogVisiblepayment(false)

                setLoading(false)

            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false)
            setDialogVisiblepayment(false)


        }





    };


    const handlePaymentSuccess = async (razorpay_payment_id) => {
        try {
            const razorpayKeyId = 'rzp_live_YCbbttwTGEwnOk';
            const razorpayKeySecret = 'MjUZUm0CUQDRB0ollk4xBECe';

            const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
      
            const razorpayResponse = await axios.get(
              `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
              {
                headers: {
                  Authorization: `Basic ${auth}`
                }
              }
            );
      
            const paymentDetails = razorpayResponse.data;

          //  make_payment(selectedItem._id,paymentDetails)

          pay_monthly_payment(paymentDetails)
      
           
      
          
          } catch (error) {
            Alert.alert('Error', `Failed to fetch or save payment details: ${error.message}`);
            setDialogVisiblepayment(false)

          }


    }

    const doPayment =  () => {


        try {
            setLoading(true)
            setDialogVisiblepayment(true)

          
            var options = {
                description: 'NANA HELPS',
                image: 'https://i.imgur.com/3g7nmJC.png',
                currency: 'INR',
                key: 'rzp_live_YCbbttwTGEwnOk', // Your api key
                amount: (get_monthly_payment.platform_fee * 100).toFixed(),
                name: 'NANA HELPS',
                prefill: {
                  email: email_address,
                  contact: phone_number,
                  name: 'Razorpay Software'
                },
                theme: {color: '#F37254'},
                order_id:Date.now
              }
              RazorpayCheckout.open(options).then((data) => {
                // handle success
              console.log(`Success: ${JSON.stringify(data)}`); // Convert the object to a JSON string

              handlePaymentSuccess(data.razorpay_payment_id)
               




            }).catch((error) => {
                // handle failure
                console.log(`Error: ${error.code} | ${error.description}`);
                setDialogVisiblepayment(false)


              });




           
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
            setDialogVisiblepayment(false)

        }





    };




    const extend_job = async (date) => {



        try {



            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/extend_monthly_job";

            const userData = {
                payment_service_id: detail._id,
                start_date:date
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
                setDialogVisible(false)
                check_monthly_payment()




            } else {
                // Handle error
                Alert.alert('success',responsedata.error)
                setLoading(false)
                setDialogVisible(false)

            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false)
            setDialogVisible(false)

        }





    };

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={styles.container}>



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: Platform.OS=='android' ? 10 :0, padding: 10, alignItems: 'center' }}>
                  
                <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                    }}>
                         <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>  
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>{t("Attendance")}</Text>

                    </View>

                    {detail.job_request_id.from_user_id._id.toString() == get_id.toString() && get_monthly_payment.payment == "payment done" && (
                        <TouchableOpacity style={styles.button1} onPress={() => {
                            setDialogVisible(true)
                        }


                        }>
                            <View style={{}}>
                                <Text style={{ backgroundColor: Colors.white, padding: 10, color: Colors.black }}>{t("Extend Job")}</Text>
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

                    {/* {detail.job_request_id.from_user_id.toString()==get_id.toString() && (
                    <Text style={{ color: Colors.black, textAlign: 'center', marginStart: 10, marginEnd: 10 }}>Make Attendace for today</Text>
                    )} */}

              


                   {c_type=="employee" && (
                    <View style={{ marginTop: 10, marginBottom: 10 }}>

                    {/* {detail.job_request_id.from_user_id.toString()==get_id.toString() && (
                    <Text style={{ color: Colors.black, textAlign: 'center', marginStart: 10, marginEnd: 10 }}>Make Attendace for today</Text>
                    )} */}

              


                  <View style={{alignItems:'center'}}>

           


                <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',padding:10}}>
                <Text style={{ fontWeight: 'bold', fontSize: 14, color: Colors.black }}>{t("Payment Status")}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'green' }}>{get_monthly_payment.payment} </Text>

                </View>

                <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',padding:10}}>
                <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 2,color: Colors.black  }}>{t("Total Salary This Month")}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 2 ,color: Colors.black }}>{get_monthly_payment.amount}</Text>

                </View>

                <View style={{height:1,backgroundColor:Colors.gray,marginTop:4,width:'95%'}}/>


                 <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                 <TouchableOpacity  style={{width:'45%'}} onPress={()=>{

Alert.alert(
    'Confirmation',
    'Are you sure you want to send attendace request?',
    [
    {
        text: 'Cancel',
        style: 'cancel',
    },
    {
        text: 'Yes',
        onPress: () => {
        // Handle "Yes" button press
        send_attendance_request(new Date().toISOString().slice(0,10))
        },
    },
    ],
    { cancelable: false }
);

}}>
<Text style={{fontSize:11,textAlign:'center',marginTop:10,padding:10,borderColor:Colors.orange,borderWidth:2,borderRadius:10}}>{t("Send Attendance Request")}</Text>
</TouchableOpacity>

<TouchableOpacity  style={{width:'45%',marginStart:3}} onPress={()=>{
   
    set_show_missed_attendance(!show_missed_attendance)

}}>
<Text style={{fontSize:11,textAlign:'center',marginTop:10,padding:10,borderColor:Colors.orange,borderWidth:2,borderRadius:10}}>{show_missed_attendance==true?"Hide Missed Attendance" :"Show Missed Attendance"}</Text>
</TouchableOpacity>
                    </View>

          




               <View style={{height:1,backgroundColor:Colors.gray,marginTop:10,width:'95%'}}/>

                 </View>


                  {missed_attandance.length>0 && show_missed_attendance && (
                       <View>

<Text style={{marginStart:10,marginTop:20}}>Missed Attendance</Text>
                 <Text style={{marginStart:10,fontSize:10}}>{t("Note - you can sent attandace request by selecting missed dates")}</Text>

                        </View>
                  )}
                {missed_attandance.length>0 && show_missed_attendance && (
                
                 <View style={{height:'65%',marginTop:'3%'}}>
                  
                <FlatList
                 

                       
                    

                        data={missed_attandance}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                           <View style={{marginStart:10,marginTop:10,marginEnd:10}}>
                            <TouchableOpacity onPress={()=>{
                                    Alert.alert(
                                        'Confirmation',
                                        'Are you sure you want to send attendace request for missed date?',
                                        [
                                        {
                                            text: 'Cancel',
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Yes',
                                            onPress: () => {
                                            // Handle "Yes" button press
                                            send_attendance_request(item)
                                            },
                                        },
                                        ],
                                        { cancelable: false }
                                    );
                            }}>
                                <Text style={{textAlign:'center',color:Colors.black,backgroundColor:Colors.white,padding:10,borderRadius:10,borderColor:Colors.orange,borderWidth:1}}>{item}</Text>
                            </TouchableOpacity>
                            </View>

                        )}
                        /> 
                        
                         </View>

                
               

                        )}
                  
                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                </View>
                   )}
                
               

                
                  
                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                </View>


{/* 
                {attendance.length>0 && (
                <Text style={{marginStart:10}}>Atteandance Details</Text>)}
              {attendance.length>0 && (

               
                  <View style={{borderRadius:10,borderWidth:1,borderColor:Colors.orange, marginTop: 13, marginStart: 10, marginEnd: 10, backgroundColor: Colors.white, borderRadius: 10,padding:10 }}>
               


                  <View style={{flexDirection:'row',justifyContent:'space-between',marginStart:10,marginEnd:10}}>
   
      
          <Text style={{fontWeight:'400',fontSize:14,color:Colors.black}}>Attendance By</Text>
          <Text style={{fontWeight:'400',fontSize:14,color:Colors.black}}>{attendance[0].from_user_id.name}</Text>
          
      </View> 



      <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:4,marginStart:10,marginEnd:10}}>
   
      
   <Text style={{fontWeight:'400',fontSize:14,color:Colors.black}}>Attendance To</Text>
   <Text style={{fontWeight:'400',fontSize:14,color:Colors.black}}>{attendance[0].to_user_id.name}</Text>
   
</View> 

   <View style={{width:'95%',height:1,backgroundColor:Colors.gray,marginTop:6}}></View>
   
     
      
      <Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:5}}>Job Description</Text> 
      <Text style={{marginStart:10,fontSize:15,color:Colors.textcolor}}>{attendance[0].job_request_id.desc}</Text>
      <View style={{height:1,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10,marginTop:10}}>
      
      </View> 
      <Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>Working for skill</Text>
      <Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10,color:Colors.orange}}>{attendance[0].job_request_id.skills.map(skill => skill.name).join(', ')}</Text>
      
                  </View> 
              )} */}
           

           { show_missed_attendance==false && (
           <View style={{flex:1,marginBottom:c_type=="employer"?"2%":"2%"}}>

                <FlatList

                 

                    data={attendance}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                      }

                />
           </View> )}


            {detail.job_request_id.from_user_id._id.toString() == get_id.toString() && (
            <View style={{ backgroundColor: Colors.grayview, position: 'absolute', height: '10%', bottom: 0, width: '100%', padding: 10 ,flexDirection:'row'}}>

                <View style={{flex:4}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
           

                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: Colors.black }}>{t("Payment Status")}</Text>
          

                        </View>

                    <Text style={{ fontWeight: 'bold', fontSize: 13, marginTop: 2 }}>{t("Amount  pay to employee")} - Rs. {Number(get_monthly_payment.amount).toFixed(2)}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, marginTop: 2 }}>{t("Convenience Fees")} - Rs. {Number(get_monthly_payment.platform_fee).toFixed(2)}</Text>

                </View>




                {get_monthly_payment.payment_open==true && (
                <TouchableOpacity style={{alignSelf:'flex-end',bottom:20}} onPress={() => {

                    Alert.alert(
                        'Confirmation',
                        'Are you sure you want to pay montly amount?',
                        [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Yes',
                            onPress: () => {
                            // Handle "Yes" button press
                            setDialogVisibleref(true)
                          //  pay_monthly_payment()
                            },
                        },
                        ],
                        { cancelable: false }
                    );
                
                }


                }>
                    <View style={{ marginTop: 5 }}>
                        <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white, textAlign: 'center', marginStart: 8,borderRadius:3 }}>{t("Pay")} Rs. {get_monthly_payment.platform_fee.toFixed(2)}</Text>
                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                    </View>
                </TouchableOpacity>
                )}

                {get_monthly_payment.payment_open == false && (
                    <TouchableOpacity style={{alignSelf:'flex-end'}}  onPress={() => {
                       Alert.alert("Payment Closed","Payment will open when month completes or employer removes the employee or employee left the job")
                    }


                    }>
                        <View style={{  marginBottom: 10 }}>
                            <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white, textAlign: 'center', marginStart: 8}}>{t("Payment Closed")}</Text>
                            {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                        </View>
                    </TouchableOpacity>
                )}

                   

             
           </View>)}

           <Modal visible={cancel_dialog} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>


                       <Text>{t("Enter attendance rejection reason here")}</Text>


                        <TextInput multiline={true} style={{borderWidth:1,borderColor:Colors.textcolor,padding:10,borderRadius:10,height:80,marginTop:10}} placeholder='reason..'  onChangeText={(text) => set_cancel_reason(text)}  ></TextInput>
                      


                    

                       

                        {/* <TextInput style={{ color: Colors.textcolor,alignSelf:'center',borderRadius:10 }} placeholder='Enter Price' keyboardType='numeric' value={price} onChangeText={(text) => set_price(text)}></TextInput>
                    */}


                      
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={()=>{


                                    if(cancel_reason==''){
                                        set_cancel_dialog(false)
                                        Toast.show({
                                            type: 'success',
                                            text1: "Please enter attendance reject reason",
                                        });

                                    }else{
                                        set_cancel_dialog(false)
                                        make_attendance("absent",attendacnce_item._id,attendacnce_item.payment_service_id._id,attendacnce_item.date.slice(0,10))
                                        set_attendance_item(null)
                                       
                                    }
                               
                            }}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10 }}>{t("Reject Attendance")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={()=>{
                                set_cancel_dialog(false)
                            }} >
                           
                                <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10}}>{t("Close")}</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>


            <Modal visible={isDialogVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>{t("Please select the date when your employee will rejoin you")}</Text>

                 
                        <View>
                            <Text style={styles.labelText}>{t("From Date")}</Text>
                            <TouchableWithoutFeedback onPress={openDatePicker} >
                                <Text style={{padding:10,backgroundColor:Colors.grayview,borderRadius:3,marginTop:15}}>{chosenDate.toDateString()}</Text>
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

                        

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={()=>{
                                 extend_job(chosenDate)
                            }}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10 }}>{t("Extend Job")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={closeDialog}>
                            <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10}}>{t("Close")}</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>


         


        </View>


        <Modal visible={isDialogVisibleref} animationType="slide" transparent>
             <View style={styles.modalContainer}>
                 <View style={styles.dialogContainer}>
                     <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Enter Referal Code (IF ANY) </Text>

                     
                     <TextInput style={{borderRadius:10,borderWidth:1,borderColor:Colors.grayview}} placeholder="Enter your referal code "  keyboardType='numeric' value={referal_code} onChangeText={(text) => set_referal_code(text)} />

                    

                       
                        <TouchableOpacity onPress={()=>{

doPayment()
setDialogVisibleref(false)
                          // make_payment()
                        }}>
                            <Text style={{backgroundColor:Colors.orange,marginTop:5,padding:10,color:Colors.white,textAlign:"center",borderRadius:10}}>CONTINUE</Text>

                        </TouchableOpacity>

                 

                     


                     <TouchableOpacity onPress={() => {
                         closeDialog()
                     }}>
                         <Text style={{marginTop:10,backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10,textAlign:'center'}}>Close</Text>
                     </TouchableOpacity>







                 </View>
             </View>
           </Modal> 

           <Modal visible={isDialogVisiblepayment} animationType="slide" transparent>
             <View style={styles.modalContainer}>
                 <View style={styles.dialogContainer2}>

                     <ActivityIndicator/>
                     <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Please wait until payment processing..</Text>

                     

                       
                     
                 





                 </View>
             </View>
           </Modal> 
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
       height:220

    },
    dialogContainer2: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        marginStart: 10,
        marginEnd: 10,
        borderRadius: 10,
       height:80

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
        color: Colors.textcolor



    },
    item: {
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        height:40,
        width:100,
        
      },

    
    
    
 





})



export default AttendanceScreen