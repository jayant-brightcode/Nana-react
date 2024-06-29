import React, { useState } from 'react';
import { View, Image, TextInput, ActivityIndicator, StyleSheet, Text, StatusBar, TouchableOpacity, ScrollView,KeyboardAvoidingView,Platform } from 'react-native';
import Colors from '../Utils/Color';
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Toast from 'react-native-toast-message';
import { Remote } from '../Utils/Remote.js';
import { useRoute } from '@react-navigation/native';
const NewPasswordScreen = () => {

  const navigation = useNavigation();

  const route = useRoute();

  const { cred } = route.params

  const [password,set_password] = useState('');

  const [loading, setLoading] = useState(false);


  const ChangePassword= async () => {


  //   navigation.navigate("ChooseEmployeeTypeScreen")
  // return;

   

    if (!password.trim()) {
      Toast.show({
        type: 'success',
        text1: `Please enter new password`,
      });
      return;
    }

    if (password.length<4) {
        Toast.show({
          type: 'success',
          text1: `Password must be greater or equal to 8 digit`,
        });
        return;
      }

   

    try {

      setLoading(true)
      const apiUrl = Remote.BASE_URL+"user/change_password";

      const userData = {
        password:password,
        email:cred.email
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
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
        
        navigation.popToTop();
        navigation.replace("LoginScreen")


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

    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.orange} />
      <View style={styles.contentContainer}>
        {/* Input fields and button */}

        <Image
          source={require('../../assets/images/signup.png')}
          style={styles.logoImage}
        />
        <View style={styles.spacer}></View>
        <Text style={styles.text}>Add New Password</Text>
        <Text style={{ color: Colors.dark_gray, fontWeight: 'bold', fontSize: 15 }}>Make it more secure</Text>

        <ScrollView style={styles.subTextContainer} automaticallyAdjustKeyboardInsets={true}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
        <View >
          <Text style={{ color: Colors.black, fontWeight: 'medium', fontSize: 15, marginBottom: 10}}>
            Enter your New Password
          </Text>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}


        

     
          <TextInput style={{backgroundColor:Colors.grayview,borderRadius:10,padding:10}} placeholder="Enter your New Password here" value={password} onChangeText={(text) => set_password(text)} />



         

         
          <TouchableOpacity style={styles.button} onPress={() => { ChangePassword() }


          }>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>NEXT</Text>
              {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
            </View>
          </TouchableOpacity>
       




        </View>
        </KeyboardAvoidingView>
        </ScrollView>
        {/* Small background image aligned to the right */}

      </View>
      <Image
        source={require('../../assets/images/job_header.png')}
        style={styles.backgroundImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  button: {
    backgroundColor: Colors.blue,
    padding: 10,
    borderRadius: 5,
    marginTop: 10
  },
  contentContainer: {
    flex: 1,
    top: '10%',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backgroundImage: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 200,     // Set the image width
    height: 120, // Ensure the image takes up the full height
  },
  logoImage: {


    width: '40%',     // Set the image width
    height: '10%', // Ensure the image takes up the full height
  },
  text: {
    color: Colors.red,
    fontWeight: 'bold',
    fontSize: 23
  },
  spacer: {
    width: 190,
    height: 5,
    backgroundColor: Colors.gray
  },



  input: {
    width: '100%',
    height: '12%',
    backgroundColor: Colors.gray,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,
    borderColor: Colors.orange,
    borderWidth: 1


  },
  subTextContainer: {
    width: '80%',
    marginBottom: 10,
    top: '4%',


  },
  textviews: {
    width: '100%',

    marginBottom: 10,
    top: 30,






  },
  buttonContent: {
    flexDirection: 'row', // Align text and icon horizontally
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginRight: 5, // Adjust the spacing between text and icon
  },
  icon: {
    width: 20,
    height: 20,
    // Change the icon color
  },
});

export default NewPasswordScreen;


function isValidPhone(value) {
  const phonePattern = /^\d{10}$/; // Assumes a 10-digit phone number
  return phonePattern.test(value)
}
