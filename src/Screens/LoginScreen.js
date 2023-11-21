import React from 'react'
import { Text, Image, View, StyleSheet, TextInput, TouchableOpacity ,StatusBar} from 'react-native'
import Colors from '../Utils/Color'
import { useNavigation } from '@react-navigation/native'; // Import navigation functions




const LoginScreen = () => {

  const navigation = useNavigation()

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

        <TextInput style={styles.input} placeholder="+91 000 0000 000" keyboardType='number-pad'/>

        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 2 ,alignSelf:'center'}}>-----or-----</Text>


        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 2 }}>Login with Member Id</Text>

        <TextInput style={styles.input} placeholder="Member ID Code" />

        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 2 ,alignSelf:'center'}}>-----or-----</Text>


        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 2 }}>Login with Email address</Text>

        <TextInput style={styles.input} placeholder="Enter email here" />

        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 2 }}>Enter Password to Access</Text>

        <TextInput style={styles.input} placeholder="Enter 8 Digit Password here" />

        <TouchableOpacity style={styles.button} onPress={() => {
        navigation.navigate("HomeScreen")

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

