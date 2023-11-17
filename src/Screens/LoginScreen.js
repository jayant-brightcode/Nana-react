import React from 'react'
import { Text, Image, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import Colors from '../Utils/Color'
import { useNavigation } from '@react-navigation/native'; // Import navigation functions




const LoginScreen = () => {

  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/account_created.jpg')} style={styles.backgroundImage} />

      <Image source={require('../../assets/images/login.png')} style={{ width: 200, height: 200, alignSelf: 'center', marginTop: 40 }} />
      <Text style={{ color: Colors.red, alignSelf: 'center', fontWeight: 'bold', fontSize: 25 }}>Login</Text>
      <Text style={{ color: Colors.textcolor, alignSelf: 'center', fontWeight: 'medium', fontSize: 18 }}>Please Login your account here
      </Text>

      <View style={{ padding: 20, marginTop: 30 }}>
        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15, marginBottom: 10 }}>Enter your mobile number here</Text>

        <TextInput style={styles.input} placeholder="+91 000 0000 000" />

        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15, marginBottom: 10 }}>Enter your Member ID Code</Text>

        <TextInput style={styles.input} placeholder="Member ID Code" />

        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15, marginBottom: 10 }}>Enter Password to Access</Text>

        <TextInput style={styles.input} placeholder="Enter 8 Digit Password here" />


      </View>

      <TouchableOpacity style={styles.button} onPress={() => {
        navigation.navigate("RegistrationFormScreen")

      }}>
        <Text style={styles.buttonText}>Login Now</Text>
      </TouchableOpacity>

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
    height: 45,
    backgroundColor: Colors.gray,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,


  },
  button: {


    position: 'absolute',
    width: '90%',
    bottom: 20,

    height: 45, // Set the desired height here
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
})



export default LoginScreen

