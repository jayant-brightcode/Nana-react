import React, { useState,useEffect } from 'react'

import { View, Text,Alert, StyleSheet, Image, FlatList, TouchableOpacity ,ActivityIndicator,StatusBar, SafeAreaView} from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import CommentDialog from '../component/MemberShipDialog';
import { useTranslation } from 'react-i18next';
import RazorpayCheckout from 'react-native-razorpay'
import {Buffer} from 'buffer'
import axios from 'axios';
import { Modal } from 'react-native';
import { TextInput } from 'react-native-paper';

const plans = [
    { id: 1, year: '1 Year', price: 999 },
    { id: 2, year: '3 Year', price: 2100 },

    // Add more languages as needed
];

const MembershipHistoryScreen = () => {

  

    const navigation = useNavigation()
    const [plan, setPlan] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);

    const [plan2, setPlan2] = useState([]);
    const [selectedItem2, setSelectedItem2] = useState([]);
   
    const [loading, setLoading] = useState(false);
    const [is_plan_nenew, set_is_plan_nenew] = useState(false);
    const [is_plan_purchase, set_plan_purchase] = useState(false);

    const [active_plan,set_active_plan] = useState({})
    const [isDialogVisible_member, setDialogVisible_member] = useState(false);

    const [referal_code, set_referal_code] = useState("");

    const [isDialogVisible, setDialogVisible] = useState(false);

    const [isDialogVisiblepayment, setDialogVisiblepayment] = useState(false);

    const [phone_number, set_phone_number] = useState('');
    const [email_address, set_email_address] = useState('');




    useEffect(() => {
        check_registration_expiry();
        fetchLanguage()
    }, []);

    useEffect(() => {
        getProfile()
      
      }, []);

    useEffect(() => {
        get_membership_history();
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


    const handleButtonPress_member = () => {
        // Handle button press action
        closeDialog_member();
        navigation.navigate("ChoosePlanScreen")
     
      };

      const openDialog = () => {

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

    const openDialog_member = () => {
        setDialogVisible_member(true);
      };
    
      const closeDialog_member = () => {
        setDialogVisible_member(false);
      };

    const handleItemPress = (item) => {
        setSelectedItem(item);
        Toast.show({
            type: 'success',
            text1: `Selected Plan: ${item.year}`,
        });


    };

    useEffect(() => {
        get_plans();
    }, []);

    const handleItemPress2 = (item) => {
        setSelectedItem2(item);

        
       


    };

    const renderPlanItem2 = ({ item }) => (
        <TouchableOpacity onPress={()=>{
            handleItemPress2(item)

            {
                console.log(is_plan_nenew)
                console.log(is_plan_purchase)
            }


          
        

             if(is_plan_nenew==true ){



                setDialogVisible(true)

                

               // handlePaymentSuccess

                // const data = {
                //     selected_plan: selectedItem2._id,
                    
                // }
                // navigation.navigate("PaymentScreen", { plan: data })


            }else if(is_plan_nenew==false && is_plan_purchase==false){
                // const data = {
                //     selected_plan: selectedItem2._id,
                    
                // }
                // navigation.navigate("PaymentScreen", { plan: data })

                setDialogVisible(true)


            }
             else{

                Alert.alert(
                    'Confirmation',
                    'Your Plan is not expired yet!!',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Ok',
                        onPress: () => {
                          
                          
                        },
                      },
                    ],
                    { cancelable: false }
                  );
              
             }
        }}>

            <View  style={[{borderColor:Colors.orange,borderWidth:2,justifyContent:'space-between',padding:10,borderRadius:10,margin:10}, selectedItem === item && styles.selectedItem]}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              
              <Text style={styles.planYear}>{item.year+ " year"}</Text>
              <Text style={[styles.planPrice, selectedItem === item && styles.selectedItemPrice]}>₹ {item.price}/-</Text>
           </View>

           <View style={{flexDirection:'row',width:'90%',justifyContent:'flex-start'}}>
              
              <Text style={{color:Colors.textcolor,fontSize:12}}>{t("Renewal Charge")}</Text>
              <Text style={{color:Colors.orange,fontWeight:'bold',marginStart:10}}>₹ {item.renewal_price}/-</Text>
           </View>

           
        

            </View>

         
        </TouchableOpacity>

    );

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
               
                setPlan2(data.plans);
                setSelectedItem2(data.plans[0])
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
     

            <View style={{borderRadius:10,borderColor:Colors.orange,backgroundColor:Colors.white,borderWidth:1,margin:15,padding:3,width:370,marginStart:10,alignSelf:'center'}}>
                <View style={{flexDirection:'row',padding:10,justifyContent:'space-between'}}>
                    <Text style={styles.planYear}>{item.registration_charge_id.year + " year validity"}</Text>

                   <Text style={[styles.planPrice, selectedItem === item && styles.selectedItemPrice]}>₹ {item.payment_amount}/-</Text>



                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                <Text style={{ marginStart: 10 }}>{t('Purchased date')} - </Text>
                <Text style={{fontWeight:'bold',marginEnd:10}}>{new Date(item.payment_date).toDateString()}</Text>

                </View>

                <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                <Text style={{ marginStart: 10, marginBottom: 10 }}>{t('Expiry date')} -  </Text> 
                <Text style={{fontWeight:'bold',marginEnd:10}}>{new Date(item.expire_on).toDateString()}</Text>

                </View>

                <View  style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={{ marginStart: 10, marginBottom: 10 }}>{t("Renewal Charge")} - </Text> 
                <Text style={{fontWeight:'bold',marginEnd:10}}>Rs. {item.registration_charge_id.renewal_price}</Text>

                </View>
           
             </View>
           
       


    

    );



    const get_membership_history = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token

            const response = await fetch(Remote.BASE_URL + "user/get_reg_payment_history", {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });

            if (response.ok) {
                const data = await response.json();
               
                setPlan(data.registration_payment_history);
                console.log(data.registration_payment_history)
              
                setLoading(false)

                if(data.registration_payment_history.length==0){
             
                        
                    //  openDialog_member()
                  
                }






            } else {
                console.error('Error:', response.status, response.statusText);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };


    const check_registration_expiry = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token

            const response = await fetch(Remote.BASE_URL + "user/check_registration_expiry", {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });

            if (response.ok) {
                const data = await response.json();

                console.log("vvv",data)

              //  set_is_plan_purchased(data.status)

               

               
              //  if(data.expired_plan.length==0){
                   
                    set_active_plan(data.expired_plan)
                    set_is_plan_nenew(data.renewal)
                    set_plan_purchase(data.is_purchased)
                   
              //  }else{
                   // set_is_plan_nenew(data.renewal)
                   // set_active_plan(data.expired_plan)
                
                
               // }

                
             
  

       

            

               
                setLoading(false)






            } else {
                console.error('Error:', response.error, response.statusText);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };



    // const make_payment = async () => {

    //     try {

    //         setLoading(true)
    //         const apiUrl = Remote.BASE_URL + "user/make_registration_payment";
    //         const userData = {
    //             payment_mode: "UPI",
    //             payment_status: "success",
    //             transaction_id: "sdfddafafaf",
    //             registration_charge_id: active_plan._id

    //         };

    //         const token = await getToken()

    //         const response = await fetch(apiUrl, {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `${token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(userData),
    //         });


    //         const responsedata = await response.json();


    //         if (response.ok) {
    //             // Handle success
    //             Toast.show({
    //                 type: 'success',
    //                 text1: responsedata.message,
    //             });
    //             setLoading(false)

    //             get_membership_history()


    //             // navigation.popToTop();
    //             // navigation.replace("HomeScreen")




    //         } else {
    //             // Handle error
    //             Toast.show({
    //                 type: 'success',
    //                 text1: responsedata.error,
    //             });
    //             setLoading(false)

    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         setLoading(false)

    //     }

    // }


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

            make_payment(selectedItem2._id,paymentDetails)
      
           
      
          
          } catch (error) {
            Alert.alert('Error', `Failed to fetch or save payment details: ${error.message}`);
          }


    }

    const doPayment =  (price) => {


        try {

            setDialogVisiblepayment(true)
            
            setLoading(true)


            var options = {
                description: 'NANA HELPS',
                image: 'https://i.imgur.com/3g7nmJC.png',
                currency: 'INR',
                key: 'rzp_live_YCbbttwTGEwnOk', // Your api key
                amount: price * 100,
                name: 'NANA HELPS',
                prefill: {
                  email: email_address,
                  contact:phone_number,
                  name: 'Razorpay Software'
                },
                theme: {color: '#F37254'},
              
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
                    text1: 'Your membership plan purchased',
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

    



    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={styles.container} >
            <StatusBar backgroundColor={Colors.orange}></StatusBar>
            <Image source={require('../../assets/images/plan_header.png')} style={{ height: 140, width: '100%', position: 'absolute' }}></Image>

            <Text style={{position:'absolute',bottom:0, fontSize:11,color: Colors.textcolor,fontWeight:'bold',color:Colors.orange,marginTop:5,backgroundColor:Colors.gray,padding:10,margin:10 ,width:'94%'}}>{t("Note")} - <Text style={{color:Colors.textcolor,fontWeight:'300'}}>{t("After the plan expires, you are required to pay the renewal charge based on the selected plan to continue accessing the services of this app")}</Text></Text>

            <View style={{ marginTop: '10%', marginStart: 20, marginEnd: 20 }}>
              
                <View style={{flexDirection:'row'}}>  
                    
                <TouchableOpacity onPress={()=>{
                              navigation.goBack()
                    }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>

                    </TouchableOpacity>

                <Text style={{marginStart:10, color: Colors.white, fontWeight: 'bold', fontSize: 18, alignSelf: 'center' }}>{t("Membership History")}</Text>
                
                </View>

              



            </View>

            <View style={{height:256,width:'100%'}}>
            <FlatList
                style={{marginTop:'20%'}}
                data={plan}
                horizontal={true}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderPlanItem}
            />

            </View>

          

          <Text style={{ marginStart: 20, color: Colors.orange }}>Membership Plans</Text>
         
            <View style={{flex:1,marginBottom:'20%'}}>

         
            <FlatList
                data={plan2}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderPlanItem2}
            />
   </View>


            {is_plan_nenew==true && is_plan_purchase==true && (
                <View style={{
                    backgroundColor: Colors.grayview,
                    width: '100%',
                    position: 'absolute', bottom: 0, padding: 10, elevation: 5, // Add elevation for Android
                    shadowColor: '#000', // Shadow properties for iOS
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                }}>


                    <Text style={{ color: Colors.black, fontWeight: 'bold', fontSize: 18 }}>It seems your current plan has expired</Text>
                    <Text style={{ color: Colors.textcolor, fontWeight: 'light', fontSize: 13 }}>Renew your plan here</Text>


                    <TouchableOpacity onPress={()=>{
                          setDialogVisible(true)
                    }}>
                       
                        <Text style={{ color: Colors.black, fontWeight: 'bold', fontSize: 18, borderRadius: 10, backgroundColor: Colors.orange, padding: 10, textAlign: 'center', color: Colors.white, marginTop: 10 }}>Pay Rs. {active_plan.renewal_price}</Text>
                    </TouchableOpacity>

                </View>
            )}

<CommentDialog
        isVisible={isDialogVisible_member}
        onClose={closeDialog_member}
        onButtonPress={handleButtonPress_member}
      />

        </View>


        <Modal visible={isDialogVisible} animationType="slide" transparent>
             <View style={styles.modalContainer}>
                 <View style={styles.dialogContainer}>
                     <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Enter Referal Code (IF ANY) </Text>

                     
                     <TextInput style={{borderRadius:10,borderWidth:1,borderColor:Colors.grayview}} placeholder="Enter your referal code "  keyboardType='numeric' value={referal_code} onChangeText={(text) => set_referal_code(text)} />

                    

                       
                        <TouchableOpacity onPress={()=>{

                        doPayment(selectedItem2.price)
                      
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
        borderColor: Colors.orange,
        color: Colors.white,
        padding: 10,
        backgroundColor: Colors.orange,
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
        bottom:'5%',
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



export default MembershipHistoryScreen