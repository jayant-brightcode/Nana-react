import React ,{ useEffect,useRef } from "react";
import { View,Text,Image,StyleSheet, StatusBar } from "react-native";
import Colors from "../Utils/Color";
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import * as Animatable from 'react-native-animatable';
import { getToken } from "../Utils/LocalStorage";

const SplashScreen = () =>{


  const navigation = useNavigation(); // Get access to navigation functions
  const animatedViewRef = useRef(null);
  let token;
  useEffect(() => {
    launcher();
}, []);

  const launcher = async () => {
      token = await getToken()
  
  }


  useEffect(() => {
    // Use a timer to navigate to the SignupScreen after 2 seconds
    const timer = setTimeout(() => {

      if(token==null){
        console.log("sss",token)
        navigation.replace('LoginScreen'); // Navigate to the SignupScreen
        

      }else{
        console.log("ppp",token)
        navigation.replace('HomeScreen'); // Navigate to the SignupScreen
      }


    }, 3000); // 2 seconds delay

    // Clear the timer to avoid memory leaks
    return () => clearTimeout(timer);
  }, [navigation]); 


  useEffect(() => {
    if (animatedViewRef.current) {
      // Start the YoYo animation when the component mounts
      animatedViewRef.current.animate('bounceInDown', 1000).then(() => {
        // Chain a different animation, e.g., 'fadeIn' after the 'bounceInDown'
        animatedViewRef.current.animate('flipInY', 1000);
      });
    }
  }, []);




    return(
        <View style={styles.container}>
        <StatusBar backgroundColor={Colors.orange}/>
        <Animatable.Image ref={animatedViewRef}
          source={require('../../assets/images/splash.jpg')} style={styles.backgroundImage}  />
        <Animatable.Image animation="slideInLeft"
          duration={1000} source={require('../../assets/images/splash_bottom.png')} style={styles.foregroundImage}  />

      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:Colors.orange
      
   
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
    text: {
      fontSize: 16,
      marginTop: 16,
      color:Colors.white,
   
    },
    foregroundImage: {
        position: 'absolute',
        bottom: 0, // Adjust as needed to position the second image
        width: '100%',
        height: '18%', // Adjust the height as needed
    
      },
  });


export default SplashScreen  