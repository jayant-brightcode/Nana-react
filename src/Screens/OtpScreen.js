import React,{ useState,useRef,useEffect } from "react";
import { Button, Image, StyleSheet, Text, View, TouchableOpacity ,ActivityIndicator} from "react-native";
import Colors from "../Utils/Color";
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { saveToken } from "../Utils/LocalStorage.js";
import { Remote } from "../Utils/Remote.js";







const OtpScreen = () => {
  const route = useRoute();
  const { cred } = route.params


  const navigation = useNavigation()

  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState('');

  const otpRef = useRef(null);

  useEffect(() => {
    setTimeout(() => otpRef.current.focusField(0), 250);
    }, []);

  const handleCodeChanged = (code) => {
    setOtp(code);
  };


  const veryfyOtp = async () => {


    if (!otp.trim()) {
      Toast.show({
        type: 'success',
        text1: `Please enter otp`,
      });
      return;
    }

    

   

    try {

      setLoading(true)
      const apiUrl = Remote.BASE_URL +"user/verify_otp";

      const userData = {
        phone: cred.phone_number,
        otp: otp
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
        saveToken('Bearer ' + responsedata.access_token); 
       
        navigation.navigate("AccountCreatedScreen")


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


      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <Image source={require('../../assets/images/otp.png')} style={{ width: '30%', height: '50%', marginTop: '10%' }}></Image>
          <Text style={{ color: Colors.white, marginTop: 13, fontSize: 18, fontWeight: 'bold' }}>Verify your mobile Number</Text>
        </View>
      </View>
      <View>
        <Text style={{ color: Colors.textcolor, marginTop: '10%', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>We have sent an OTP on your mobile {'\n'} number {cred.otp} {'\n'} </Text>


      </View>
      <OTPInputView
        style={styles.otpInput}
        pinCount={4} // The number of OTP digits
        ref={otpRef} 
        autoFocusOnLoad={false}
        codeInputFieldStyle={styles.otpInputField}
        codeInputHighlightStyle={styles.otpInputHighlight}
        onCodeChanged={handleCodeChanged}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}




      <View style={styles.footer}>

        <TouchableOpacity style={styles.button} onPress={() => {

          veryfyOtp()
         
        }}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
        <Text style={{ color: Colors.textcolor, alignSelf: 'center', marginTop: 10, fontWeight: 'bold' }}>Send Otp</Text>
      </View>






    </View>
  )




}


const styles = StyleSheet.create({


  container: {
    flex: 1,

    alignItems: 'center'

  },
  header: {


    width: "100%",
    height: "30%",
    backgroundColor: Colors.orange

  },
  imageContainer: {
    alignItems: 'center'
  },
  otpInput: {
    width: '60%',
    height: '6%',
    marginTop: '10%',
 

    alignSelf: 'center',

  },
  otpInputField: {
    borderColor: Colors.dark_gray,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: Colors.dark_gray,
    color: Colors.black,
    fontWeight: 'bold'

  },
  otpInputHighlight: {
    borderColor: 'black',
  },

  button: {

    width: '100%',
    height: '100%', // Set the desired height here
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    padding: 20

  }


})

export default OtpScreen