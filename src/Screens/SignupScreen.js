import React, { useState ,useEffect} from 'react';
import { View, Image, TextInput, ActivityIndicator, StyleSheet, Text, StatusBar, TouchableOpacity, ScrollView,KeyboardAvoidingView,Platform, SafeAreaView } from 'react-native';
import Colors from '../Utils/Color';
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Toast from 'react-native-toast-message';
import { Remote } from '../Utils/Remote.js';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
// import { initializeApp } from '@react-native-firebase/app';
// import auth from '@react-native-firebase/auth';
// import firebase from '@react-native-firebase/app';
 import messaging from '@react-native-firebase/messaging'
import { saveToken } from '../Utils/LocalStorage';
import { AppleButton,appleAuth } from '@invertase/react-native-apple-authentication';




const SignupScreen = () => {

  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChecked, setChecked] = useState(false);


  useEffect(() => {

    if(Platform.OS=='ios'){
   // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
   return appleAuth.onCredentialRevoked(async () => {
    console.warn('If this function executes, User Credentials have been Revoked');
  });
    }
 
  }, []);
  
  useEffect(() => {
    // Initialize Google Sign-In
    GoogleSignin.configure({
      iosClientId:'537647498687-j32b8vfr8tjdiv0jkj7vcnf0nkk06abh.apps.googleusercontent.com',
      webClientId: '537647498687-1f3cmb9tl248r5n37a21j9tilhj1v8s1.apps.googleusercontent.com', // replace with your web client ID from Firebase
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {

      if(!isChecked){
        Toast.show({
          type: 'success',
          text1: `Please accept terms and condition`,
        });
        return;
       }


     // if(isFirebaseInitialized){
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        console.log(userInfo)
  
        // Get Google Sign-In credentials
        // const googleCredential = auth.GoogleAuthProvider.credential(
        //   userInfo.idToken,
        //   userInfo.accessToken
        // );
  
        // // Sign in to Firebase with Google credentials
        // const firebaseUserCredential = await auth().signInWithCredential(googleCredential);
  
        // // Access the UID from the signed-in Firebase user
        // const userUID = firebaseUserCredential.user.uid;
  
        // // Now you can use the userUID as needed
        // console.log('User UID:', userUID);



        GoogleLogin(userInfo.idToken,userInfo.user.name,userInfo.user.email)

       // GoogleLogin(userUID,userInfo.user.name,userInfo.user.email)



        
     // }


     

   

     // console.log(userInfo)
   
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
       console.log(error)
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(error)

      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(error)

      } else if (error.code === statusCodes.DEVELOPER_ERROR) {
        // Developer error
        console.error('Developer error:', error.message);
      } else {
        // Handle other errors
        console.error('Google Sign-In error:', error.message);
      } 
    }
  };

  const onAppleButtonPress =async()=>{

    console.log("apple")
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });


   
    const { fullName, email } = appleAuthRequestResponse;

    console.log(appleAuthRequestResponse)
     

   if (email) {
   GoogleLogin(appleAuthRequestResponse.identityToken,appleAuthRequestResponse.fullName.familyName,appleAuthRequestResponse.email)
      // GoogleLogin("sfdsfdsfdsfsd","sdsadsada","ash@gmail.com")

   } else {
      Toast.show({
        type: 'success',
        text1: `Something wrong with apple account`,
      });
    }
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
  
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated

 
      console.log("logged in")
    }
  }


  const CheckRegistration = async (token) => {


    try {

      //const fcmToken = await messaging().getToken();
      const fcmToken = "dcdfdfdfdfd"
      console.log('FCM Token:', fcmToken);
    

      setLoading(true)
      const apiUrl = Remote.BASE_URL+"user/check_registration";
   
      
  
    

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json', // Adjust content type as needed
      },
        
      });


      const responsedata = await response.json();


   
 


      if (response.ok) {

        console.log(responsedata)
      
        setLoading(false)



        if(responsedata.message=="not_verified"){

          const data = {
            phone_number: responsedata.phone,
            otp: '',
            screen:"signup"
          }
    
          navigation.navigate("OtpScreen", { cred: data })
  
        }


        else if(responsedata.message=="new_User"){

          // const data = {
          //   phone_number: mobile,
          //   otp: responsedata.otp,
          //   screen:"signup"
          // }
    
          // navigation.navigate("OtpScreen", { cred: data })
  
           navigation.navigate("AccountCreatedScreen")

        }else if(responsedata.message=="choose_customer_type"){
          const data = {
            screen:""
          }
          
          navigation.navigate("ChooseEmployeeTypeScreen",{page:data})

        }else if(responsedata.message=="registration"){
          const data= {
            screen:""
        }
         navigation.navigate("RegistrationFormScreen", { page: data })
        }
        else if(responsedata.message=="ok"){
          navigation.replace("HomeScreen")
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

  const GoogleLogin = async (c_user_id,u_name,u_email) => {


    try {


  
      let fcmToken = '';

      try {
        fcmToken = await messaging().getToken();
      } catch (error) {
       // console.error('Error fetching FCM token:', error);
        fcmToken = '';
      }
     // const fcmToken = "dddddddddf"
      console.log('FCM Token:', fcmToken);
    

      setLoading(true)
      const apiUrl = Remote.BASE_URL+"user/login";
       let userData;

 
         userData = {
          login_type:"gmail",
          email: u_email,
          gmail_token:c_user_id,
          name:u_name,
          device_token:fcmToken

        };
     

     
    

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });


      const responsedata = await response.json();
      console.log(responsedata)
 


      if (response.ok) {
        // Handle success
        // Toast.show({
        //   type: 'success',
        //   text1: responsedata.message,
        // });
        setLoading(false)

      
          saveToken('Bearer ' + responsedata.access_token); 
          
         
          CheckRegistration('Bearer ' + responsedata.access_token)

    

      

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

  const toggleCheckbox = () => {
    setChecked(!isChecked);
  };


  const signup = async () => {



  //   navigation.navigate("ChooseEmployeeTypeScreen")
  // return;


    

    if (!name.trim()) {
      Toast.show({
        type: 'success',
        text1: `Please enter name`,
      });
      return;
    }

    if (!mobile.trim()) {
      Toast.show({
        type: 'success',
        text1: `Please enter phone number`,
      });
      return;
    }

    if (!isValidPhone(mobile)) {
      Toast.show({
        type: 'success',
        text1: `Please enter correct phone number`,
      });
      return;
    }

    if (!email.trim()) {
      Toast.show({
        type: 'success',
        text1: `Please enter email address`,
      });
      return;
    }

    if(!isValidEmail(email)){
      Toast.show({
        type: 'success',
        text1: `Please enter valid email address`,
      });
      return;
    }

    if (!password.trim()) {
      Toast.show({
        type: 'success',
        text1: `Please enter password`,
      });
      return;
    }

    if (password.trim().length < 4) {
      Toast.show({
        type: 'success',
        text1: `Password must me 4 digit long `,
      });
      return;
    }

    if(!isChecked){
      Toast.show({
        type: 'success',
        text1: `Please accept terms and condition`,
      });
      return;
     }

    try {

      setLoading(true)
      const apiUrl = Remote.BASE_URL+"user/signup";

      const userData = {
        email: email,
        password: password,
        mobile_number: mobile,
        name: name,
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
        // Toast.show({
        //   type: 'success',
        //   text1: responsedata.message,
        // });
        setLoading(false)
        const data = {
          phone_number: mobile,
          otp: responsedata.otp,
          screen:"signup"
        }
  
        navigation.navigate("OtpScreen", { cred: data })


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
        <Image source={require('../../assets/images/account_created.jpg')} style={styles.backgroundImage} />

      <StatusBar backgroundColor={Colors.orange} />
    
      <Image
          source={require('../../assets/images/logo.png')}
          style={{width:60,height:60,alignSelf:'flex-end',position:'absolute',marginTop:16,right:10}}
        />
      <View style={styles.contentContainer}>
        {/* Input fields and button */}

      
        {/* <View style={styles.spacer}></View> */}

       
        <Text style={{color:Colors.red,fontSize:22,fontWeight:'bold'}}>Signup</Text>
        <Text style={{ color: Colors.navcolor, fontWeight: 'bold', fontSize: 15 }}>for your dream job</Text>

        <ScrollView style={styles.subTextContainer} automaticallyAdjustKeyboardInsets={true}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1,height:550 }}
          >
        <View >
          <Text style={{ color: Colors.black, fontWeight: 'medium', fontSize: 15, marginBottom: 7 }}>
            Signup your Account
          </Text>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}


        

     



          <TextInput style={styles.input} placeholder="Enter your Name here" value={name} onChangeText={(text) => setName(text)} />
          <TextInput style={styles.input} placeholder="Enter your Mobile here" keyboardType='numeric' value={mobile} onChangeText={(text) => {
             if(text.length<=10){
              setMobile(text)
             }
          }} />
          <TextInput style={styles.input} placeholder="Enter your Email here" value={email} onChangeText={(text) => setEmail(text)} />



          <Text style={{ color: Colors.black, fontWeight: 'medium', fontSize: 15, marginTop: 5}}>
            Enter Password to Access ahead
          </Text>
          <Text style={{ color: Colors.dark_gray, marginBottom: 14 }}>(Password will be used to login Account)</Text>



          <TextInput style={styles.input} placeholder="Enter minimum 4 digit password here" secureTextEntry={true} value={password} onChangeText={(text) => setPassword(text)} />
         
      



         <View style={{flexDirection:'row'}}>

         <TouchableOpacity onPress={toggleCheckbox} style={styles.checkboxContainer}>
         {isChecked && <Text style={styles.checkmark}>✔</Text>}
         </TouchableOpacity>
           <Text>I agree to the </Text>

           <TouchableOpacity onPress={()=>{
              navigation.navigate("TermsScreen")
           }}>
           <Text style={{color:Colors.orange,fontWeight:'bold',fontSize:13}}>Terms and Conditions</Text>
           </TouchableOpacity>
         </View>
        
        
        
       
       
       
       
       
          <TouchableOpacity style={styles.button} onPress={() => { signup() }


          }>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>NEXT</Text>
              {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
            </View>
          </TouchableOpacity>


          <View style={{flexDirection:'row',alignSelf:'center',marginTop:10}}>

        
              <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15 }}>Already have an account? </Text>
              <TouchableOpacity onPress={()=>{
                 navigation.popToTop();
                navigation.replace("LoginScreen")
              }}>
              <Text style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 15 }}>Login</Text>
              </TouchableOpacity>


              </View>

              <View>
              <TouchableOpacity
      style={{
        width: '100%',
        height: 48,
        marginTop: 5,
        backgroundColor: Colors.white, // Google Sign-In button color
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:Colors.gray,borderWidth:1,padding:10,
        borderRadius: 4,
        elevation:2
      }}
      onPress={()=>{
        handleGoogleSignIn()
      }}
    >
      <Image
        source={require('../../assets/images/google.png')}
        style={{ width: 24, height: 24, marginRight: 10 }}
      />
      <Text style={{ color: 'white', color:Colors.black }}>
        Signup with Google
      </Text>
    </TouchableOpacity>
    </View>


    {Platform.OS=='ios' && (

<TouchableOpacity onPress={()=>{
  onAppleButtonPress()
}}>
<AppleButton
 buttonStyle={AppleButton.Style.WHITE}
 onPress={()=>{

 }}
 buttonType={AppleButton.Type.SIGN_UP}
 style={{
   marginTop:10,
   borderWidth:1,
   borderColor:Colors.gray,
   marginBottom:20,
   width: '100%', // You must specify a width
   height: 48, // You must specify a height
 }}
 
/>
</TouchableOpacity>

)}
       




        </View>
        </KeyboardAvoidingView>
        </ScrollView>
        {/* Small background image aligned to the right */}

      </View>
      {/* <Image
        source={require('../../assets/images/job_header.png')}
        style={styles.backgroundImage}
      /> */}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
 
  },
  button: {
    backgroundColor: Colors.blue,
    padding: 10,
    borderRadius: 5,
    marginTop: 10
  },
  contentContainer: {
    flex: 1,
    top: '5%',
    alignItems: 'center',
   
  },
  backgroundImage: {
    position: 'absolute',

 

    width: '100%',     // Set the image width
    height: '100%', // Ensure the image takes up the full height
  },
  logoImage: {


    width: 70,     // Set the image width
    height: 40, // Ensure the image takes up the full height
  },
  text: {
    color: Colors.red,
    fontWeight: 'bold',
    fontSize: 23
  },
  spacer: {
    width: 50,
    height: 5,
    backgroundColor: Colors.gray
  },



  input: {
    width: '100%',
    height: 45,
    backgroundColor: Colors.gray,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,
    borderColor: Colors.orange,
    borderWidth: 1


  },
  subTextContainer: {
    width: '80%',
   
    top: 10,


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
  checkboxContainer: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.orange,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: Colors.orange,
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 13,
    color: Colors.textcolor,
  },
});

export default SignupScreen;


function isValidPhone(value) {
  const phonePattern = /^\d{10}$/; // Assumes a 10-digit phone number
  return phonePattern.test(value)
}

function isValidEmail(email) {
  // Regular expression for a basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email against the regular expression
  return emailRegex.test(email);
}
