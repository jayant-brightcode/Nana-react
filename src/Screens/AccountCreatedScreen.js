import React from "react";
import {StyleSheet,Image,View,Text,TouchableOpacity} from 'react-native'
import Colors from "../Utils/Color";
import { useNavigation } from '@react-navigation/native'; // Import navigation functions



const AccountCreatedScreen = ()=>{

    const navigation = useNavigation()

    return(
        <View style={styles.container}>

            <Image source={require('../../assets/images/account_created.jpg')} style={styles.backgroundImage}/>
            <Image source={require('../../assets/images/congrats.png')} style={{width:'50%',height:'20%',alignSelf:"center",marginTop:150}}/>
            <Text style={{color:Colors.textcolor,alignSelf:"center",fontWeight:'bold',textAlign:"center",fontSize:20,marginTop:20}}>You have successfully{'\n'}
                  setup your account</Text>

            <View style={styles.footer}>
            <Text style={{color:Colors.dark_gray,alignSelf:"center",fontWeight:'bold',textAlign:"center",fontSize:16,marginTop:20}}>Get Dream Jobs & Services

{'\n'}
and many more at your fingertips</Text>

            <TouchableOpacity style={styles.button} onPress={() => {
                navigation.navigate("MemberIdHintScreen")
            }
            
          
          
          }>
              <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Continue</Text>
                  {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
              </View>
     </TouchableOpacity>

            </View>

            

        </View>
    )



}



const styles = StyleSheet.create({

    container:{
        flex:1,
      
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
      footer:{
        position:'absolute',
        bottom:20,
        width:'100%',
        padding:20
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
      button: {
        backgroundColor: Colors.blue,
        padding: 10,
        borderRadius: 5,
        marginTop:10
      },

})



export default AccountCreatedScreen