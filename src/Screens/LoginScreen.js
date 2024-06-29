import React,{useState,useEffect} from 'react'
import { Text, Image, View, StyleSheet, TextInput, TouchableOpacity ,StatusBar,ActivityIndicator, ScrollView, Platform, SafeAreaView} from 'react-native'
import Colors from '../Utils/Color'
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Toast from 'react-native-toast-message';
import { saveToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
 import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
// import { initializeApp } from '@react-native-firebase/app';
 //import auth from '@react-native-firebase/auth';
// import firebase from '@react-native-firebase/app';
 import messaging from '@react-native-firebase/messaging'
 import { AppleButton,appleAuth } from '@invertase/react-native-apple-authentication';
import { getFcmToken } from '../Utils/fcm';



const LoginScreen = () => {

  const navigation = useNavigation()
  const [isEmulator, setIsEmulator] = useState(false);

 // const [isFirebaseInitialized, setFirebaseInitialized] = useState(false);




  

  // useEffect(() => {
  //   const initializeFirebase = async () => {
  //     try {
  //       // Initialize Firebase
  //       if(!firebase.apps.length){
  //         await initializeApp(firebaseConfig);
  //         setFirebaseInitialized(true);
  //       }
      
  //     } catch (error) {
  //       console.error('Firebase initialization error:', error.message);
  //     }
  //   };

    

  //   initializeFirebase();
  // }, []);
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


 



  // const auth = getAuth();

  const handleGoogleSignIn = async () => {
    try {

     // if(isFirebaseInitialized){

     

        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        console.log(userInfo)
  
        // // Get Google Sign-In credentials
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

  const [phoneNumber, setPhoneNumber] = useState('');
  const [memberId, setMemberId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [login_type, set_login_type] = useState('');


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

  const handleLogin = () => {
    // Determine the login type based on the filled information
    if (phoneNumber !== '') {
      // Phone login

      if(isValidPhone(phoneNumber)){

        if(password==''){
          Toast.show({
            type: 'success',
            text1: `Enter correct password for phone number`,
          });
          return;
  
        }else{
          
            set_login_type('phone')
            Login("phone")
          
        }

        

      }else{

        Toast.show({
          type: 'success',
          text1: `Enter correct phone number`,
        });
        return;


      }
    } else if (memberId !== '') {
      // Member ID login
      if(password==''){
        Toast.show({
          type: 'success',
          text1: `Enter correct password for member id login`,
        });
        return;

      }else{
        set_login_type('member_id')
        Login("member_id")
      }
    
    } else if (email !== '') {
      // Email and Password login
      if(password==''){
        Toast.show({
          type: 'success',
          text1: `Enter correct password for email id login`,
        });
        return;

      }else{
        set_login_type('email')
        Login("email")
      }

    
    } 



  };

  const Login = async (login_type) => {


      try {



    
        let fcmToken = '';

        try {
          fcmToken = await messaging().getToken();
        } catch (error) {
         // console.error('Error fetching FCM token:', error);
          fcmToken = '';
        }
        console.log('FCM Token:', fcmToken);
      
  
       setLoading(true)
       const apiUrl = Remote.BASE_URL+"user/login";
       let userData;

        if(login_type=="email"){

           if(!isValidEmail(email)){
            Toast.show({
              type: 'success',
              text1: "Please enter valid email address",
            });
            return
           }


           userData = {
            login_type:login_type,
            email: email,
            password: password,
            device_token:fcmToken
          };
        }

        if(login_type=="member_id"){
          userData = {
           login_type:login_type,
           member_id: memberId,
           password: password,
           device_token:fcmToken
         };
       }

       if(login_type=="phone"){
        userData = {
         login_type:login_type,
         mobile_number:phoneNumber,
         password:password,
         device_token:fcmToken
       };
     }
      
  
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



          // if(login_type=="email" || login_type=="member_id"){
            saveToken('Bearer ' + responsedata.access_token); 
            CheckRegistration('Bearer ' + responsedata.access_token)
            




          // }else{
          //     const data = {
          //   phone_number: phoneNumber,
          //   otp: responsedata.access_token,
          //   screen:"login"
          // }
    
          // navigation.navigate("OtpScreen", { cred: data })
  

          // }

        
  
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


  const CheckRegistration = async (token) => {


      try {

      //const fcmToken = await messaging().getToken();
       // const fcmToken = "dddd"
     //  console.log('FCM Token:', fcmToken);
      
  
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
      //  const fcmToken = "dcddcdcd"
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
  


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.orange}></StatusBar>
     
     


      <Image source={require('../../assets/images/account_created.jpg')} style={styles.backgroundImage} />

      <Image
          source={require('../../assets/images/logo.png')}
          style={{width:60,height:60,alignSelf:'flex-end',position:'absolute',marginTop:16,right:10}}
        />
      {/* <Image source={require('../../assets/images/login.png')} style={{ width: 70, height: 30, alignSelf: 'center', marginTop: '10%' }} /> */}
      <Text style={{ color: Colors.red, alignSelf: 'center', fontWeight: 'bold', fontSize: 22,marginTop:'10%' }}>Login with Nana</Text>
      {/* <Text style={{ color: Colors.textcolor, alignSelf: 'center', fontWeight: 'medium', fontSize: 15 }}>Please Login your account here
      </Text> */}


       <ScrollView>

    
      <View style={{ padding: 20}}>
        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 7 }}>Login with Phone Number</Text>

        <TextInput style={styles.input} placeholder="+91 000 0000 000" keyboardType='number-pad'value={phoneNumber} onChangeText={(text) => {
           if(text.length<=10){
            setPhoneNumber(text)
           }
        }}/>

        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12,alignSelf:'center'}}>-----or-----</Text>


        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 2 }}>Login with Member Id</Text>

        <TextInput style={styles.input} placeholder="Member ID Code" value={memberId} onChangeText={(text) => setMemberId(text)} />

        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 ,alignSelf:'center'}}>-----or-----</Text>


        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 2 }}>Login with Email address</Text>

        <TextInput style={styles.input} placeholder="Enter email here" value={email} onChangeText={(text) => setEmail(text)}/>

        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 2 }}>Enter Password to Access</Text>

        <TextInput style={styles.input} placeholder="Enter minimum 4 digit password here" secureTextEntry={true} value={password} onChangeText={(text) => setPassword(text)}/>

        {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
        <TouchableOpacity style={styles.button} onPress={() => {
   
          handleLogin()

      }}>

       
        <Text style={styles.buttonText}>Login Now</Text>
       </TouchableOpacity>

       <View style={{flexDirection:'row',alignSelf:'center', marginTop: 5}}>

        

        <TouchableOpacity onPress={()=>{
          navigation.navigate("ForgotPasswordScreen")
        }}>
        <Text style={{ color: '#0E86D4', fontWeight: 'medium', fontSize: 15 }}>Forgot Password?</Text>

        </TouchableOpacity>


</View>
       <View style={{flexDirection:'row',alignSelf:'center', marginTop: 6}}>

        
       <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15 }}>Dont have an account? </Text>
       <TouchableOpacity onPress={()=>{
          navigation.navigate("SignupScreen")
       }}>
       <Text style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 15 }}>Signup</Text>
       </TouchableOpacity>
      

       </View>

       <View>
       <View>
              <TouchableOpacity
      style={{
        width: '100%',
        height: 48,
        marginTop: 8,
        backgroundColor: Colors.white, // Google Sign-In button color
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:Colors.gray,borderWidth:1,padding:10,
        borderRadius: 4,
        elevation:2
      }}
      onPress={handleGoogleSignIn}
    >
      <Image
        source={require('../../assets/images/google.png')}
        style={{ width: 24, height: 24, marginRight: 10 }}
      />
      <Text style={{ color: 'white', color:Colors.black }}>
        Signin with Google
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
         buttonType={AppleButton.Type.SIGN_IN}
         style={{
           marginTop:10,
           marginBottom:20,
           borderWidth:1,
           borderColor:Colors.gray,
           width: '100%', // You must specify a width
           height: 48, // You must specify a height
         }}
         
       />
        </TouchableOpacity>
        
      )}

    </View>

      </View>
      </ScrollView>
   

     

    </View>
    </SafeAreaView>
  )


}


const styles = StyleSheet.create({

  container: {
    flex: 1
  },
  backgroundImage: {
    position: "absolute",
    width: '100%',
    height: '100%'
  },
  input: {
    width: '100%',
    height: '8%',
    backgroundColor: Colors.gray,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize:12,
    borderColor:Colors.orange,
    borderWidth:1,
    marginTop:4


  },
  button: {


   
    width: '100%',


    height: '8%', // Set the desired height here
    backgroundColor: Colors.blue,
    alignItems: 'center',
    marginTop:'2%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,

  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})



export default LoginScreen


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
