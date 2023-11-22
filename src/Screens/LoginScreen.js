import React,{useState} from 'react'
import { Text, Image, View, StyleSheet, TextInput, TouchableOpacity ,StatusBar} from 'react-native'
import Colors from '../Utils/Color'
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Toast from 'react-native-toast-message';
import { saveToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';





const LoginScreen = () => {

  const navigation = useNavigation()

  const [phoneNumber, setPhoneNumber] = useState('');
  const [memberId, setMemberId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [login_type, set_login_type] = useState('');


  const handleLogin = () => {
    // Determine the login type based on the filled information
    if (phoneNumber !== '') {
      // Phone login

      if(!isValidPhone(phoneNumber)){

        Toast.show({
          type: 'success',
          text1: `Please enter correct phone number`,
        });
        return;

      }else{
        set_login_type('phone')
        Login("phone")
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
      
  
        setLoading(true)
        const apiUrl = Remote.BASE_URL+"user/login";
       let userData;

        if(login_type=="email"){
           userData = {
            login_type:login_type,
            email: email,
            password: password
          };
        }

        if(login_type=="member_id"){
          userData = {
           login_type:login_type,
           member_id: memberId,
           password: password
         };
       }

       if(login_type=="phone"){
        userData = {
         login_type:login_type,
         mobile_number:phoneNumber
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
        console.log(responsedata)
   
  
  
        if (response.ok) {
          // Handle success
          Toast.show({
            type: 'success',
            text1: responsedata.message,
          });
          setLoading(false)

          if(login_type=="email" || login_type=="member_id"){
            saveToken('Bearer ' + responsedata.access_token); 
            navigation.navigate("HomeScreen")
            navigation.popToTop();

          }else{
              const data = {
            phone_number: phoneNumber,
            otp: responsedata.access_token,
            screen:"login"
          }
    
          navigation.navigate("OtpScreen", { cred: data })
  

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
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.orange}></StatusBar>
      <Image source={require('../../assets/images/account_created.jpg')} style={styles.backgroundImage} />

      <Image source={require('../../assets/images/login.png')} style={{ width: '30%', height: '20%', alignSelf: 'center', marginTop: '10%' }} />
      <Text style={{ color: Colors.red, alignSelf: 'center', fontWeight: 'bold', fontSize: 18 }}>Login</Text>
      <Text style={{ color: Colors.textcolor, alignSelf: 'center', fontWeight: 'medium', fontSize: 15 }}>Please Login your account here
      </Text>

      <View style={{ padding: 20, marginTop: '2%' }}>
        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10 }}>Login with Phone Number</Text>

        <TextInput style={styles.input} placeholder="+91 000 0000 000" keyboardType='number-pad'value={phoneNumber} onChangeText={(text) => setPhoneNumber(text)}/>

        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 2 ,alignSelf:'center'}}>-----or-----</Text>


        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 2 }}>Login with Member Id</Text>

        <TextInput style={styles.input} placeholder="Member ID Code" value={memberId} onChangeText={(text) => setMemberId(text)} />

        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 2 ,alignSelf:'center'}}>-----or-----</Text>


        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 2 }}>Login with Email address</Text>

        <TextInput style={styles.input} placeholder="Enter email here" value={email} onChangeText={(text) => setEmail(text)}/>

        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 2 }}>Enter Password to Access</Text>

        <TextInput style={styles.input} placeholder="Enter 8 Digit Password here"  value={password} onChangeText={(text) => setPassword(text)}/>

        <TouchableOpacity style={styles.button} onPress={() => {
   
          handleLogin()

      }}>
        <Text style={styles.buttonText}>Login Now</Text>
       </TouchableOpacity>
       <View style={{flexDirection:'row',alignSelf:'center', marginTop: '3%'}}>
       <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15 }}>Dont have an account? </Text>
       <TouchableOpacity onPress={()=>{
          navigation.navigate("SignupScreen")
       }}>
       <Text style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 15 }}>Signup</Text>
       </TouchableOpacity>
      

       </View>

      </View>

   

     

    </View>
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
    fontSize:12


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


