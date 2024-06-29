import React, { useState,useEffect } from 'react'

import { View, Text, StyleSheet, Image,TextInput, FlatList, TouchableOpacity ,ActivityIndicator,StatusBar, SafeAreaView, Platform} from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import RazorpayCheckout from 'react-native-razorpay'
import {Buffer} from 'buffer'
import axios from 'axios';
import { Modal } from 'react-native';

const plans = [
    { id: 1, year: '1 Year', price: 999 },
    { id: 2, year: '3 Year', price: 2100 },

    // Add more languages as needed
];

const ChoosePlanScreen = () => {

  

    const navigation = useNavigation()
    const [plan, setPlan] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
   
    const [loading, setLoading] = useState(false);

    const [referal_code, set_referal_code] = useState("");

    const [isDialogVisible, setDialogVisible] = useState(false);

    const [isDialogVisiblepayment, setDialogVisiblepayment] = useState(false);

    const [phone_number, set_phone_number] = useState('');
    const [email_address, set_email_address] = useState('');


    useEffect(() => {
        getProfile()
      
      }, []);
    
    useEffect(() => {
        get_plans();
    }, []);

    const handleItemPress = (item) => {
        setSelectedItem(item);
    


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


    const renderPlanItem = ({ item }) => (

        
        <TouchableOpacity onPress={()=>{
            handleItemPress(item)
        }}>

            <View>
            <View style={[styles.planItem, selectedItem === item && styles.selectedItem]}>
              
              <Text style={styles.planYear}>{item.year+ " year"}</Text>
              <Text style={[styles.planPrice, selectedItem === item && styles.selectedItemPrice]}>₹ {item.price}/-</Text>
           </View>

           <View style={{flexDirection:'row',marginStart:18,width:'90%',justifyContent:'flex-start',marginTop:2}}>
              
              <Text style={{color:Colors.textcolor,fontSize:12}}>Renewal Charge</Text>
              <Text style={{color:Colors.orange,fontWeight:'bold',marginStart:10}}>₹ {item.renewal_price}/-</Text>
           </View>
        

            </View>

         
        </TouchableOpacity>

    );

    const openDialog = () => {

        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
    };


    const make_payment = async (id,details) => {

        try {

            setLoading(true)

            




            const apiUrl = Remote.BASE_URL + "user/make_registration_payment";
            const userData = {
                payment_mode: details.method,
                payment_status:"success",
                transaction_id: details.id,
                registration_charge_id: id,
                referal_code:referal_code,
                payment_id:details.id
               
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


            if (response.ok) {
                // Handle success
                setDialogVisiblepayment(false)

                Toast.show({
                    type: 'success',
                    text1: 'Account setup Completed',
                });
                setLoading(false)


                navigation.popToTop();
                navigation.replace("HomeScreen")
   
            


            } else {
                // Handle error
                Toast.show({
                    type: 'success',
                    text1: responsedata.error,
                });
                setLoading(false)
                setDialogVisiblepayment(false)


            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false)
            setDialogVisiblepayment(false)


        }

    }



    const get_plans = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token

            const response = await fetch(Remote.BASE_URL + "get_all_registration_plans", {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)
               
                setPlan(data.plans);
                setSelectedItem(data.plans[0])

                if(Platform.OS=='ios'){
                    // const data2 = {
                    //     selected_plan: data.plans[0]._id,
                        
                    // }
                    // navigation.navigate("PaymentScreen", { plan: data2 })
                     make_payment(data.plans[0]._id)
                }
               
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

            make_payment(selectedItem._id,paymentDetails)
      
           
      
          
          } catch (error) {
            Alert.alert('Error', `Failed to fetch or save payment details: ${error.message}`);
            setDialogVisiblepayment(false)

          }


    }

    const doPayment =  (price) => {


        try {
            setLoading(true)
            setDialogVisiblepayment(true)


            var options = {
                description: 'Credits towards Membership',
                image: 'https://i.imgur.com/3g7nmJC.png',
                currency: 'INR',
                key: 'rzp_live_YCbbttwTGEwnOk', // Your api key
                amount: price * 100,
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

    //phonepay


    //do that 




    



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={styles.container} >
            <StatusBar backgroundColor={Colors.orange}></StatusBar>

          


         
            <Image source={require('../../assets/images/plan_header.png')} style={{ height: 140, width: '100%', position: 'absolute' }}></Image>
            <View style={{ alignSelf: 'center', marginTop: '7%', marginStart: 20, marginEnd: 20 }}>
                <Image source={require('../../assets/images/job.png')} style={{ height:100, width: 100, alignSelf: 'center' }}></Image>
                <Text style={{ color: Colors.red, fontWeight: 'bold', fontSize: 18, marginTop: 10, alignSelf: 'center' }}>JOBS ANYWHERE</Text>
                <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 13, marginTop: 10, alignSelf: 'center', textAlign: "center" }}>If you want to do work any where
                    {'\n'}that you want, We will help to Find{'\n'}
                    your dream jobs easily
                </Text>



            </View>

            <TouchableOpacity style={{position:'absolute',top:0,alignSelf:'flex-end'}} onPress={()=>{
                                  navigation.popToTop();
                                  navigation.replace("HomeScreen")
                    }}>
                    <Text style={{fontWeight:'bold',marginTop:10,color:Colors.white,marginEnd:20}}>SKIP</Text>
                  

                 
         </TouchableOpacity>



            {Platform.OS=='android' && (

                <View     style={{flex:1}}> 
                      <Text style={{ marginStart: 20, marginTop: '5%', color: Colors.textcolor,marginBottom:10 }}>Choose your plan below</Text>
            <View style={{flex:1,marginBottom:'25%'}}>
            <FlatList
           
             
                data={plan}
    
             
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderPlanItem}
              
            />
            </View>

   
            <View style = {styles.footer}>

                <View style={{margin:10}}>
                    <TouchableOpacity style={{backgroundColor:Colors.blue,width:'100%',padding:10,borderRadius:10}} onPress={()=>{

                        // const data = {
                        //     selected_plan: selectedItem._id,
                            
                        // }
                        // navigation.navigate("PaymentScreen", { plan: data })


                         setDialogVisible(true)


                    }}>
                        <Text style={{alignSelf:'center',color:Colors.white}}>PAY NOW</Text>
                    </TouchableOpacity>
                  
               
                    <Text style={{ fontSize:11,color: Colors.textcolor,fontWeight:'bold',color:Colors.orange,marginTop:5,backgroundColor:Colors.gray,padding:2 }}>Note - <Text style={{color:Colors.textcolor,fontWeight:'300'}}>After the plan expires, you are required to pay the renewal charge based on the selected plan to continue accessing the services of this app.</Text></Text>

                 
             
                    
                </View>

                {/* <View>
                    <TouchableOpacity style={{ backgroundColor: Colors.grayview, width: 170, padding: 10, borderRadius: 10 }} onPress={()=>{
                        navigation.navigate("HomeScreen")
                    }}>
                        <Text style={{ alignSelf: 'center', color: Colors.textcolor }}>SKIP</Text>
                    </TouchableOpacity>

                </View> */}

               

            </View>


                    </View>

            )}
          
     
        </View>

        <Modal visible={isDialogVisible} animationType="slide" transparent>
             <View style={styles.modalContainer}>
                 <View style={styles.dialogContainer}>
                     <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Enter Referal Code (IF ANY) </Text>

                     
                     <TextInput style={{borderRadius:10,borderWidth:1,borderColor:Colors.grayview}} placeholder="Enter your referal code "  keyboardType='numeric' value={referal_code} onChangeText={(text) => set_referal_code(text)} />

                    

                       
                        <TouchableOpacity onPress={()=>{

doPayment(selectedItem.price)
setDialogVisible(false)
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
                 <View style={styles.dialogContainer}>

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
        backgroundColor:Colors.white,
        height:'100%'
    }, 
    selectedItem: {
        borderColor:Colors.blue,
        borderWidth:1
    },
    itemContainer: {
        flex: 1,
        margin: 10,
        padding: 10,
        borderColor: Colors.white,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        height: 50, // Adjust the height of each item
    },
    planItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginStart: 20,
        marginEnd: 20,
        marginTop: 10,
        borderRadius: 10,
        height: 70,
        backgroundColor: Colors.grayview,
        alignItems: 'center',
  

    },
    planYear: {
        fontSize: 18,

        fontWeight: 'bold',
  
    },
    planPrice: {
        fontSize: 16,
        width: 100,
        textAlign: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.white,
        color: Colors.white,
        padding: 10,
        backgroundColor: Colors.dark_gray,
        overflow: 'hidden'
    },
    selectedItemPrice:{
        backgroundColor:Colors.blue,
        color:Colors.white,
        borderWidth:0,
        overflow: 'hidden'
    },
    footer:{
        position:'absolute',
        bottom:10,
        backgroundColor:Colors.white,
  
     
        width:'100%',


       

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
})



export default ChoosePlanScreen