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

const ChoosePlanScreen = () => {

  

    const navigation = useNavigation()
    const [plan, setPlan] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
   
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        get_plans();
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
            handleItemPress(item)
        }}>

            <View style={[styles.planItem, selectedItem === item && styles.selectedItem]}>
                <Text style={styles.planYear}>{item.year+ " year"}</Text>
                <Text style={[styles.planPrice, selectedItem === item && styles.selectedItemPrice]}>₹ {item.price}/-</Text>
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
               
                setPlan(data.plans);
                setSelectedItem(data.plans[0])
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
            <View style={{ alignSelf: 'center', marginTop: 70, marginStart: 20, marginEnd: 20 }}>
                <Image source={require('../../assets/images/job.png')} style={{ height: 130, width: 130, alignSelf: 'center' }}></Image>
                <Text style={{ color: Colors.red, fontWeight: 'bold', fontSize: 23, marginTop: 10, alignSelf: 'center' }}>JOBS ANYWHERE</Text>
                <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15, marginTop: 10, alignSelf: 'center', textAlign: "center" }}>If you want to do work any where
                    {'\n'}that you want, We will help to Find{'\n'}
                    your dream jobs easily
                </Text>



            </View>

            <Text style={{ marginStart: 20, marginTop: '13%', color: Colors.textcolor }}>Choose your plan below</Text>
            <FlatList
                data={plan}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderPlanItem}
            />

            <View style = {styles.footer}>

                <View style={{margin:10}}>
                    <TouchableOpacity style={{backgroundColor:Colors.blue,width:'100%',padding:10,borderRadius:10}} onPress={()=>{

                        const data = {
                            selected_plan: selectedItem._id,
                            
                        }
                        navigation.navigate("PaymentScreen", { plan: data })
                    }}>
                        <Text style={{alignSelf:'center',color:Colors.white}}>PAY NOW</Text>
                    </TouchableOpacity>
                  
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
        height: 70,
        backgroundColor: Colors.grayview,
        alignItems: 'center'

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
        backgroundColor: Colors.dark_gray
    },
    selectedItemPrice:{
        backgroundColor:Colors.blue,
        color:Colors.white,
        borderWidth:0
    },
    footer:{
        position:'absolute',
        bottom:'5%',
  
     
        width:'100%',


       

    }
})



export default ChoosePlanScreen