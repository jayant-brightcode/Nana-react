import React, { useState,useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView ,ActivityIndicator, SafeAreaView} from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { useRoute } from '@react-navigation/native';
import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { useTranslation } from 'react-i18next';






const RecentActivityScreen = ()=>{
    const navigation = useNavigation()
    // const route = useRoute();
    // const { category } = route.params

    const [get_category, set_category] = useState([])
    const [loading, setLoading] = useState(false);


   
        useEffect(() => {
            get_activity()
            fetchLanguage()
         }, []);

       

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
          
  
   
    const renderJobItem = ({ item }) => { 
        
       
         

        
        return (
        <TouchableOpacity onPress={() => {
           // navigation.navigate("EmployeeDetailScreen", { user: item })
        }}>

            <View style={{ marginTop: 13, flexDirection: 'row', alignItems: 'center', marginStart: 10, marginEnd: 10, backgroundColor: Colors.grayview, borderRadius: 10 }}>
                <View
                    style={{
                        width: 50,
                        height: 80,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                        backgroundColor: item.grayview,
                        alignItems: 'center',
                        marginStart:8,
                        justifyContent: 'center', // Center the content vertically
                    }}
                >
                        <Image style={{ width: 30, height: 30, borderRadius:500 }} source={require('../../assets/images/recent.png')} />
                </View>
                    <View style={{ flex: 1, marginLeft: 14, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 13 }}>{item.activity}</Text>
                        <Text style={{ color: Colors.black, fontWeight: '300', fontSize: 12,marginTop:10 }}>On {new Date(item.createdAt).toDateString()}  {new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>


                      

                    </View>
              
            </View>
        </TouchableOpacity>


    )};


   

  


    const get_activity = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_recent_activity"

           

          

            // Construct the URL with query parameters
          //  const urlWithParams = `${apiUrl}?${new URLSearchParams(queryParams)}`;


            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();


                set_category(data.recent_activity);

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

  
   

    return(

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

    <View style={styles.container}>



        <View style={styles.topbar}>
            <View style={{ flexDirection: 'row', marginTop: Platform.OS=="android"?10:0, padding: 10, alignItems: 'center' }}>
            <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                    }}>
                                            <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>  
                     <View style={{ marginStart: 15, flex: 1 }}>
                    <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>{t("Recent Activities")}</Text>

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

                    data={get_category}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                />
            </View>


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

    }




})



export default RecentActivityScreen