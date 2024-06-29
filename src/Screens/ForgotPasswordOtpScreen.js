import React,{ useState,useRef,useEffect } from "react";
import { Button, Image, StyleSheet, Text, View, TouchableOpacity ,ActivityIndicator} from "react-native";
import Colors from "../Utils/Color";
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { saveToken } from "../Utils/LocalStorage.js";
import { Remote } from "../Utils/Remote.js";







const ForgotPasswordOtpScreen = () => {
  const route = useRoute();
  const { cred } = route.params


  const navigation = useNavigation()

  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState('');

  const [method,set_method] =  useState('')

  const otpRef = useRef(null);

  const [isResendEnabled, setResendEnabled] = useState(true);
  const [timerCount, setTimerCount] = useState(30);



  useEffect(() => {
    if(isValidPhone(cred.email)){
      set_method("mobile no")
    }else{
      set_method("email address")
    }
  },[]);



  useEffect(() => {
    let interval;
    if (!isResendEnabled && timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount(prevCount => prevCount - 1);
      }, 1000);
    } else if (timerCount === 0) {
      setResendEnabled(true);
      setTimerCount(30); // Reset timer count
    }

    // Clear interval on component unmount or when isResendEnabled becomes true
    return () => clearInterval(interval);
  }, [isResendEnabled, timerCount]);


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
      const apiUrl = Remote.BASE_URL +"user/verify_change_password_otp";

      const userData = {
        email: cred.email,
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
       
        const data = {
          otp: responsedata.otp,
            email:cred.email
      
          }
        navigation.navigate("NewPasswordScreen",{cred:data})
       
       
    


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


  const resendOtp = async () => {


   

    

   

    try {

      setLoading(true)
      const apiUrl = Remote.BASE_URL +"user/resend_otp";

      const userData = {
        phone: cred.email,
        type:"password"
   
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
        setResendEnabled(false);
        setTimerCount(30); // Reset timer count when resending starts
       
       
    


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
          <Text style={{ color: Colors.white, marginTop: 13, fontSize: 18, fontWeight: 'bold' }}>Verify your Account details</Text>
        </View>
      </View>
      <View>
        <Text style={{ color: Colors.textcolor, marginTop: '10%', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>We have sent an OTP on your {method} {cred.otp} {'\n'} </Text>


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

        <TouchableOpacity
      onPress={() => {
        if (isResendEnabled) {
          resendOtp();
        }
      }}
      disabled={!isResendEnabled} // Disable button based on state
    >
      <Text style={{ color: 'black', alignSelf: 'center', marginTop: 10, fontWeight: 'bold' }}>
        {isResendEnabled ? 'Resend Otp' : `Resend in ${timerCount}s`}
      </Text>
    </TouchableOpacity>
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
    borderColor: Colors.orange,
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

export default ForgotPasswordOtpScreen


//helpers

function isEmpty(value) {
  return value === null || value == "null" || value === undefined || (typeof value === 'string' && value.trim() === '');
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function isValidPhone(value) {
  const phonePattern = /^\d{10}$/; // Assumes a 10-digit phone number
  return phonePattern.test(value)
}