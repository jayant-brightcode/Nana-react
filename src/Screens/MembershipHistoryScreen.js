import React, { useState,useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity ,ActivityIndicator,StatusBar} from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';


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

    useEffect(() => {
        get_membership_history();
    }, []);

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

            <View style={[styles.planItem, selectedItem === item && styles.selectedItem]}>
                <Text style={styles.planYear}>{item.registration_charge_id.year+ " year"}</Text>
                
                <Text style={[styles.planPrice, selectedItem === item && styles.selectedItemPrice]}>₹ {item.payment_amount}/-</Text>
                

           
            </View>
            <Text style={{marginStart:20}}>Purchased date -  {new Date(item.payment_date).toDateString()}</Text>
            <Text style={{marginStart:20}}>Expired date -  {new Date(item.expire_on).toDateString()}</Text>


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






            } else {
                console.error('Error:', response.status, response.statusText);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };


    



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
        borderRadius: 10,
        borderColor:Colors.blue,
        borderWidth:1,
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