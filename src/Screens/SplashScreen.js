import React ,{ useEffect,useRef } from "react";
import { View,Text,Image,StyleSheet, StatusBar } from "react-native";
import Colors from "../Utils/Color";
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import * as Animatable from 'react-native-animatable';
import { getToken } from "../Utils/LocalStorage";
import { Remote } from "../Utils/Remote";

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
        getProfile();
     
      }

     // navigation.replace("ClassScreen")


    }, 3000); // 2 seconds delay

    // Clear the timer to avoid memory leaks
    return () => clearTimeout(timer);
  }, [navigation]); 


  const getProfile = async () => {


    try {
      
        const token = await getToken(); // Replace with your actual Bearer token
        let apiUrl = Remote.BASE_URL + "user/get_profile"



        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json', // Adjust content type as needed
            },
        });



        if (response.ok) {
            const data = await response.json();


            console.log(data.profile_details.customer_type)



            if(data.profile_details.is_verified==false){
              const datas = {
                phone_number: data.profile_details.phone,
                otp: '',
                screen:"signup"
              }
        
              navigation.replace("LoginScreen", { cred: datas })
      
      
            }
     

            else if(data.profile_details.customer_type==null){
              const data = {
                screen:"not_updated"
              }
              
              navigation.replace("ChooseEmployeeTypeScreen",{page:data})
            }else{
              navigation.replace('HomeScreen'); // Navigate to the SignupScreen
            }
          







        } else {
            console.error('Error:', response.status, response.statusText);
          
        }
    } catch (error) {
        console.error('Fetch error:', error);
       
    }





};


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
        <View style={styles.centered}>
        <Animatable.Image
          ref={animatedViewRef}
          source={require('../../assets/images/logo.png')}
          style={styles.backgroundImage}
          resizeMode="contain" // Added resizeMode
        />
      </View>
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
        alignSelf:'center',
        
        width: 200,
        height: 200,
      },
    text: {
      fontSize: 16,
      marginTop: 16,
      color:Colors.white,
   
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    foregroundImage: {
        position: 'absolute',
        bottom: 0, // Adjust as needed to position the second image
        width: '100%',
        height: '18%', // Adjust the height as needed
    
      },
  });


export default SplashScreen  