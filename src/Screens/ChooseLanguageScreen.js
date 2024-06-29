import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, SafeAreaView } from "react-native";
import Colors from "../Utils/Color";
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { getSavedLanguage, getToken, saveLanguage } from "../Utils/LocalStorage.js";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { Remote } from "../Utils/Remote.js";

import { useRoute } from '@react-navigation/native';


import { useTranslation } from 'react-i18next';





const languages = [
  { _id: 1, name: 'English' },
  { _id: 2, name: 'Hindi' },
  { _id: 3, name: 'Tamil' },
  { _id: 4, name: 'Gujrati' },
  { _id: 5, name: 'Assamese' },
  { _id: 6, name: 'Kannada' },
  { _id: 7, name: 'Malayalam' },
  { _id: 8, name: 'Oriya' },
  { _id: 9, name: 'Telugu' },
  { _id: 10, name: 'Panjabi' },
  { _id: 11, name: 'Bengali' },
  { _id: 13, name: 'Marathi' }
  // Add more languages as needed
];













const ChooseLanguageScreen = () => {

  const navigation = useNavigation()

  const [selectedItem, setSelectedItem] = useState(null);
  // const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);

  const route = useRoute();
    const page = route.params
    console.log(page)
  useEffect(() => {
    getLanguages();
    if(page=="profile"){
      fetchLanguage()
    }

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


  const handleItemPress =async (item) => {
    setSelectedItem(item);
    // Toast.show({
    //   type: 'success',
    //   text1: `Selected Language: ${item.name}`,
    // });

    await saveLanguage(item.name); 
    console.log(page.page)

    if(page.page.screen=="member"){
      const data = {
        screen:""
       }
       navigation.navigate("ChooseEmployeeTypeScreen",{page:data})
   
    }else{

      navigation.replace("ProfileScreen")
    }
  


  };



  const getLanguages = async () => {


    try {
      setLoading(true)
      const token = await getToken(); // Replace with your actual Bearer token

      const response = await fetch(Remote.BASE_URL+"get_language", {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json', // Adjust content type as needed
        },
      });

      if (response.ok) {
        const data = await response.json();
        //setLanguages(data.language);
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

  const updateLanguage = async () => {


    if (selectedItem==null) {
      Toast.show({
        type: 'success',
        text1: `Please select language`,
      });
      return;
    }





    try {
      const token = await getToken();
      setLoading(true)
      const apiUrl = Remote.BASE_URL + "user/update_language";

      const userData = {
        langugae_id: selectedItem._id,
      
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
        // Toast.show({
        //   type: 'success',
        //   text1: responsedata.message,
        // });
        setLoading(false)
      

        const data = {
          screen:""
        }
        
        navigation.navigate("ChooseEmployeeTypeScreen",{page:data})
      

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
                        navigation.goBack()
                    }}>
                  <Image style={{ width: 20, height: 20,marginStart:10 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>  
        <Text style={styles.text}>{t('Choose the Language')}</Text>
        <View style={styles.imageContainer}>
          <Image source={require('../../assets/images/otp.png')} style={{width:100,height:80}} />
        </View>
      </View>

      <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15, marginTop: 20, marginStart: 20 }}>{t('Select the language to get started')}</Text>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      
      <FlatList style={{ marginTop: 20, marginBottom: 100 }}
        data={languages}
        numColumns={2} // Set the number of columns you want in your grid
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.itemContainer,
              selectedItem === item && styles.selectedItem, // Apply selected style
            ]}
            onPress={() => handleItemPress(item)}
          >
            <Text style={styles.languageName}>{item.name}</Text>
          </TouchableOpacity>

        )}
      />

      {/* <View style={styles.footer}>



        <TouchableOpacity style={styles.button} onPress={() => {

          
             

               //updateLanguage()
            

        }}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Keep going</Text>
            {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
          {/* </View>

        </TouchableOpacity>
      </View> */} 


    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Set your desired background color
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
    height:'40%',
    marginEnd: 10,
    alignItems: 'flex-end', // Align the image to the right
  },

  selectedItem: {
    backgroundColor: Colors.orange, // Highlight the selected item
  },
  itemContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: Colors.grayview,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height:50, // Adjust the height of each item
    borderColor: Colors.orange,
    borderWidth: 1
  },
  languageName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    width: "100%",
    alignSelf: 'flex-end',

    padding: 20,
  },
  buttonContent: {
    flexDirection: 'row', // Align text and icon horizontally
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,

    marginRight: 5, // Adjust the spacing between text and icon
  },
  icon: {
    width: 40,
    height: 40,
    // Change the icon color
  },
  button: {
    backgroundColor: Colors.blue,
    padding: 10,
    borderRadius: 5,
    marginTop: 10
  },
});

export default ChooseLanguageScreen