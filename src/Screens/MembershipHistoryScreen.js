import React, { useState,useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity ,ActivityIndicator,StatusBar} from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import CommentDialog from '../component/MemberShipDialog';

const plans = [
    { id: 1, year: '1 Year', price: 999 },
    { id: 2, year: '3 Year', price: 2100 },

    // Add more languages as needed
];

const MembershipHistoryScreen = () => {

  

    const navigation = useNavigation()
    const [plan, setPlan] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
   
    const [loading, setLoading] = useState(false);
    const [is_plan_expired, set_is_plan_expired] = useState(false);
    const [active_plan,set_active_plan] = useState({})
    const [isDialogVisible_member, setDialogVisible_member] = useState(false);

    useEffect(() => {
        check_registration_expiry();
    }, []);

    useEffect(() => {
        get_membership_history();
    }, []);

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

    const handleItemPress = (item) => {
        setSelectedItem(item);
        Toast.show({
            type: 'success',
            text1: `Selected Plan: ${item.year}`,
        });


    };

    const renderPlanItem = ({ item }) => (
        <TouchableOpacity onPress={()=>{
           
        }}>

            <View style={{borderRadius:10,borderColor:Colors.orange,backgroundColor:Colors.grayview,borderWidth:1,margin:15,padding:3}}>
                <View style={[styles.planItem]}>
                    <Text style={styles.planYear}>{item.registration_charge_id.year + " year"}</Text>

                    <Text style={[styles.planPrice, selectedItem === item && styles.selectedItemPrice]}>₹ {item.payment_amount}/-</Text>



                </View>
                <Text style={{ marginStart: 20 }}>Purchased date -  <Text style={{fontWeight:'bold'}}>{new Date(item.payment_date).toDateString()}</Text></Text>
                <Text style={{ marginStart: 20, marginBottom: 10 }}>Expiry date -  <Text style={{fontWeight:'bold'}}>{new Date(item.expire_on).toDateString()}</Text></Text>
             </View>
           
       


        </TouchableOpacity>

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
              
                setLoading(false)

                if(data.registration_payment_history.length==0){
             
                        
                      openDialog_member()
                  
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
             
                set_is_plan_expired(data.renewal)
                set_active_plan(data.expired_plan)

                console.log(data)

            

               
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



    const make_payment = async () => {

        try {

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/make_registration_payment";
            const userData = {
                payment_mode: "UPI",
                payment_status: "success",
                transaction_id: "sdfddafafaf",
                registration_charge_id: active_plan._id

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
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)

                get_membership_history()


                // navigation.popToTop();
                // navigation.replace("HomeScreen")




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
        <View style={styles.container} >
            <StatusBar backgroundColor={Colors.orange}></StatusBar>
            <Image source={require('../../assets/images/plan_header.png')} style={{ height: 140, width: '100%', position: 'absolute' }}></Image>
            <View style={{ alignSelf: 'center', marginTop: '40%', marginStart: 20, marginEnd: 20 }}>
              
                <Text style={{ color: Colors.red, fontWeight: 'bold', fontSize: 18, marginTop: 10, alignSelf: 'center' }}>Membership History</Text>
                



            </View>

            <FlatList
                data={plan}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderPlanItem}
            />



            {is_plan_expired==true && (
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
                          make_payment()
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
    )





}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
  
     
        width:'100%',


       

    }
})



export default MembershipHistoryScreen