import React, { useState,useEffect } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, TouchableWithoutFeedback, ScrollView, ActivityIndicator, StatusBar, SafeAreaView, BackHandler } from "react-native";
import Colors from "../Utils/Color";
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import DateTimePicker from '@react-native-community/datetimepicker'
import { useRoute } from '@react-navigation/native';
import Picker from '@ouroboros/react-native-picker';
import { getSavedLanguage, getToken } from "../Utils/LocalStorage.js";
import { Remote } from "../Utils/Remote.js";
import { useTranslation } from 'react-i18next';
import RNExitApp from 'react-native-exit-app';

const languages = [
    { id: 1, name: 'I am a Employee (Job Seekers)' },
    { id: 2, name: 'I am a Employer' },


    // Add more languages as needed
];



const ChooseEmployeeTypeScreen = () => {

    const navigation = useNavigation()
    const route = useRoute();
    const { page } = route.params

    const [selectedItem, setSelectedItem] = useState(languages[0]);
    const [show_extra, set_show_extra] = useState(false);

    const [loading, setLoading] = useState(false);
    const [c_type, set_c_type] = useState('');



  



    if(page.screen=="profile"){
        useEffect(() => {
            getProfile();
            fetchLanguage()
        }, []);
    }else{
        useEffect(() => {
          
            fetchLanguage()
        }, []);
    }


    

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



    const handleItemPress = (item) => {
        setSelectedItem(item);
        // Toast.show({
        //     type: 'success',
        //     text1: `Selected Category: ${item.name}`,
        // });

        if (item.id == 1) {
            set_c_type("employee")
            const data = {
                screen:""
              }
          

       
                update_category("employee")
            

      

        
        }
        if (item.id == 2) {
            set_c_type("employer")
            const data = {
                screen:""
              }

           
                update_category("employer")
           
        }

        if (item.id == 3) {
            set_c_type("both")
            const data = {
                screen:""
              }
            if(page.screen=="profile"){
                update_category("both")
            }else{
                navigation.navigate("RegistrationFormScreen", { page: data })
            }
        }

      
     


    };

    const [job_pref, set_job_prefs] = useState([]);
  
  

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


                console.log(data.profile_details.customer_type)

                if(data.profile_details.customer_type=="employee"){
                    setSelectedItem(languages[0])
                }
                if(data.profile_details.customer_type=="employer"){
                    setSelectedItem(languages[1])
                }
                if(data.profile_details.customer_type=="both"){
                    setSelectedItem(languages[2])
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

    const update_category = async (cust) => {



        try {

           

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/update_custome_type";

            const userData = {
                customer_type: cust
   

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
                // Toast.show({
                //     type: 'success',
                //     text1: responsedata.message,
                // });
                setLoading(false)

                if(page.screen=="profile"){
                    navigation.replace("ProfileScreen")
                }else if(page.screen=="not_updated"){
                    navigation.replace("HomeScreen")
                }
                
                else{
                    const data= {
                        screen:""
                    }
                    navigation.navigate("RegistrationFormScreen", { page: data })
                }

                

         
              



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

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={styles.container}>
            <View style={styles.content}>

            <TouchableOpacity onPress={()=>{
                        if (navigation.canGoBack()) {
                            navigation.goBack()
                          
                            // Close the app if there are no screens to go back to
                          //  BackHandler.exitApp();
                          }else{
                           
                                RNExitApp.exitApp();

                       
                          }
                    }}>
                  <Image style={{ width: 20, height: 20,marginStart:10 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>  
                {page.screen=="profile" && (
                  <Text style={styles.text}>{t('Update the Category')}</Text>
                )}
                {page.screen=="" && (
                  <Text style={styles.text}>{t('Choose the Category')}</Text>
                )}

{page.screen=="not_updated" && (
                  <Text style={styles.text}>{t('Choose the Category')}</Text>
                )}
          
                <View style={styles.imageContainer}>
                    <Image source={require('../../assets/images/otp.png')} style={{ width: 100, height: 80 }} />
                </View>
            </View>

            <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15, marginTop: 20, marginStart: 20 }}>{t('Select the category to get started')}</Text>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View>


                 <FlatList style={{ marginTop: 10, marginBottom: 20 }}
                    data={languages}

                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.itemContainer,
                                selectedItem === item && styles.selectedItem, // Apply selected style
                                { flexDirection: 'row', justifyContent: 'space-between' }
                            ]}
                            onPress={() => handleItemPress(item)}
                        >
                            <Text style={[{ fontSize: 18 }, { color: selectedItem === item ? Colors.textcolor : Colors.dark_gray }, { fontWeight: selectedItem === item ? 'bold' : 'medium' }]}>{t(item.name)}</Text>
                            <Image
                                source={selectedItem === item ? require('../../assets/images/green_right.png') : require('../../assets/images/blue_right.png')}
                                style={{ width: 20, height: 20 }}
                            />

                        </TouchableOpacity>

                    )}
                /> 
            </View>


         


        </View>
        </SafeAreaView>
    );



};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', // Set your desired background color
    },
    rowstyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    content: {


        backgroundColor: Colors.orange,
    },
    selectedItem: {
        backgroundColor: Colors.white, // Highlight the selected item
    },
    itemContainer: {
        flex: 1,
        margin: 10,
        padding: 10,
        borderColor: Colors.orange,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: '12%', // Adjust the height of each item
    },
    languageName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 45,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,



    },
    rowinput: {
        width: 150,
        height: 45,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,
    


    },
    genderDropdown: {

        borderColor: Colors.gray,
        borderRadius: 8,


    },
    dropdownOptions: {
        position: 'absolute',
        top: 70,
        backgroundColor: 'white',
        elevation: 5,
        borderWidth: 1,
        borderColor: Colors.gray,
        borderRadius: 8,
    },
    dropdownOption: {
        padding: 10,
        borderBottomWidth: 1,
        width: 150,
        borderColor: Colors.gray,
    },
    dropdownText: {
        color: Colors.textcolor,
    },
    button: {



        width: '100%',
        bottom: 30,
        marginTop: 30,

        height: '10%', // Set the desired height here
        backgroundColor: Colors.blue,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,

    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 20,

        width: "100%"

    },
    content: {
        flexDirection: 'row',
        alignItems: 'center', // Center the text vertically
        backgroundColor: Colors.orange,
    },
    text: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginStart: 30,
    },
    imageContainer: {
        marginTop: 20,
        flex: 1,
        height: '40%',
        marginEnd: 10,
        alignItems: 'flex-end', // Align the image to the right
   
    },

  
 
    icon: {
        width: 40,
        height: 40,
        // Change the icon color
    },
   
});

export default ChooseEmployeeTypeScreen


function isValidPhone(value) {
    const phonePattern = /^\d{10}$/; // Assumes a 10-digit phone number
    return phonePattern.test(value)
}
