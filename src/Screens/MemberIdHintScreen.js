import React from "react";
import {StyleSheet,Image,View,Text,TouchableOpacity} from 'react-native'
import Colors from "../Utils/Color";
 
import { useNavigation } from '@react-navigation/native'; // Import navigation functions



const MemberIdHintScreen = ()=>{
    
    const navigation = useNavigation()


    return(
        <View style={styles.container}>

            <Image source={require('../../assets/images/account_created.jpg')} style={styles.backgroundImage}/>
            <Image source={require('../../assets/images/member.png')} style={{width:'50%',height:'20%',alignSelf:"center",marginTop:200}}/>
            <Text style={{color:Colors.textcolor,alignSelf:"center",fontWeight:'medium',textAlign:"center",fontSize:15,marginTop:20}}>Member ID Code has been generated{'\n'}
                to your mobile number or email ID</Text>
                <View style={{width: '70%',height:5,backgroundColor:Colors.grayview,alignSelf:"center",marginTop:5}}/>      
                <Text style={{color:Colors.textcolor,alignSelf:"center",fontWeight:'medium',textAlign:"center",fontSize:12,marginTop:2}}> please use this Member ID Code while Login your Account</Text>
        
            <View style={styles.footer}>
            


            <TouchableOpacity onPress={()=>{

const data = {
  screen:"member"
}

navigation.navigate("ChooseLanguageScreen",{page:data})

            }}>
            <Image source={require('../../assets/images/back.png')} style={styles.icon} />


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
        alignSelf:'flex-end',
        
        padding:20,
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
        width: 40,
        height: 40,
         // Change the icon color
      },
      button: {
        backgroundColor: Colors.blue,
        padding: 10,
        borderRadius: 5,
        marginTop:10
      },

})



export default MemberIdHintScreen