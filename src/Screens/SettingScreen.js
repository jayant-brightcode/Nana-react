import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList,Linking, TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback, TouchableHighlight, ActivityIndicator, Alert, Platform, SafeAreaView } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { Remote } from '../Utils/Remote';
import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import { useTranslation } from 'react-i18next';
import SendIntent from 'react-native-send-intent';


const bottomNavBar = [
    { id: 1, name: 'Home',icon:require('../../assets/images/home.png') },
    { id: 2, name: 'Jobs', icon: require('../../assets/images/work.png') },
    { id: 3, name: 'Categories', icon: require('../../assets/images/cat.png') },
    { id: 4, name: 'Promotion', icon: require('../../assets/images/31.png') },
    { id: 5, name: 'Setting', icon: require('../../assets/images/setting.png') },

    // Add more languages as needed
];



const SettingScreen = () => {


    const navigation = useNavigation()

    const [selectedItem, setSelectedItem] = useState(bottomNavBar[4]);

    const [social ,set_social] = useState(null)


     
    const { t, i18n } = useTranslation();

    const changeLanguage = (language) => {
     i18n.changeLanguage(language);
   };



   const fetchLanguage = async () => {
    const lang = await getSavedLanguage();

    switch (lang) {
        case "English":
            changeLanguage("en");
            break;
        case "Hindi":
            changeLanguage("hi");
            break;
        case "Tamil":
            changeLanguage("ta");
            break;
        case "Gujrati":
            changeLanguage("gu");
            break;
        case "Assamese":
            changeLanguage("as");
            break;
        case "Kannada":
            changeLanguage("kn");
            break;
        case "Malayalam":
            changeLanguage("ml");
            break;
        case "Oriya":
            changeLanguage("or");
            break;
        case "Telugu":
            changeLanguage("te");
            break;
        case "Panjabi":
            changeLanguage("pa");
            break;
        case "Bengali":
            changeLanguage("ba");
            break;
        case "Marathi":
            changeLanguage("mr");
            break;
        default:
            // Handle default case, maybe fallback to English
            changeLanguage("en");
            break;
    }
};

    useEffect(() => {
        getSocailLinks()
        fetchLanguage()
    }, []);

    const handlePress = async (url) => {
    
      

        try {
            const supported = await Linking.canOpenURL(url);
    
            if (supported) {
                await Linking.openURL(url);
            } else {
                console.log(`Don't know how to open URI: ${url}`);
            }
        } catch (error) {
            console.error('An error occurred', error);
        }
      };
    
    const handleItemPress = (item) => {
        // setSelectedItem(item);
 
        // navigation.navigate("SettingScreen")
       
         
 
         if (item.name == "Home") {
             navigation.navigate("HomeScreen")
            
         }
 
         if (item.name == "Categories") {
             navigation.navigate("AllCategoryScreen")
          
         }

         if (item.name == "Jobs") {
            navigation.navigate("TempJobScreen")
           
        }
 
 
       
 
 
         if (item.name == "Promotion") {
             const data = {
                 screen: "home"
             }
             navigation.navigate("MyPurchasedPromotionScreen", { page: data })
          
         }
 
 
         setSelectedItem(item);
 
 
 
 
 
     };

     const getSocailLinks = async () => {


        try {
          
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "get_social_links"

         


            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();

                console.log(data.links)


                set_social(data.links);

            






            } else {

            
            }
        } catch (error) {
            console.error('Fetch error:', error);
         
        }





    };
    const renderPlanItem = ({ item }) => (

        <TouchableOpacity   onPress={() => {

      
            
            handleItemPress(item)
        }}>

            <View style={[styles.planItem, selectedItem === item && styles.selectedItem]}>
                <Image
                    source={item.selected ? item.icon : item.icon}
                    style={{ width: '120%', height: '120%' }}
                />
               {/* <Text style={styles.planYear}>{item.name}</Text> */}
            </View>
        </TouchableOpacity>

    );





















    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={styles.container}>



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: Platform.OS=='android'?10:0, padding: 10, alignItems: 'center' }}>
                <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                    }}>
                                            <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>  
                                        <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>{t("Settings")}</Text>

                    </View>


                </View>

            </View>


            <View style={{ flex: 1 ,marginTop:'2%'}}>


                <TouchableOpacity  style={{width:'100%' ,justifyContent:'center'}}  onPress={()=>{

                    const data  = {
                        screen:"setting"
                    }
                    navigation.replace("MyPurchasedPromotionScreen",{page:data})

                }}>


                    <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10,alignSelf:'center' }}>{t("Promotions")}</Text>
                    <View style={{ backgroundColor: Colors.dark_gray, height: 2,width:'100%' }}></View>

                </TouchableOpacity>


                <TouchableOpacity style={{width:'100%' ,justifyContent:'center'}}  onPress={()=>{

            
                navigation.navigate("TermsScreen")

                }}>


                <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10,alignSelf:'center' }}>{t("Terms and Conditions")}</Text>
                <View style={{ backgroundColor: Colors.dark_gray, height: 2 }}></View>

                </TouchableOpacity>


                <TouchableOpacity  style={{width:'100%' ,justifyContent:'center'}} onPress={()=>{

               
                navigation.navigate("PolicyScreen")

                }}>


                <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10,alignSelf:'center' }}>{t("Privacy Policy")}</Text>
                <View style={{ backgroundColor: Colors.dark_gray, height: 2 }}></View>

                </TouchableOpacity>



                <TouchableOpacity  style={{width:'100%' ,justifyContent:'center'}} onPress={()=>{

               
navigation.navigate("CancellationScreen")

}}>


<Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10,alignSelf:'center' }}>{t("Refund And Cancellation Policy")}</Text>
<View style={{ backgroundColor: Colors.dark_gray, height: 2 }}></View>

</TouchableOpacity>


                <TouchableOpacity style={{width:'100%' ,justifyContent:'center'}}  onPress={()=>{

                  
                    navigation.navigate("HelpScreen")

                    }}>


                    <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10,alignSelf:'center' }}>{t("Contact Us")}</Text>
                    <View style={{ backgroundColor: Colors.dark_gray, height: 2 }}></View>

                    </TouchableOpacity>


                 
                <TouchableOpacity  style={{width:'100%' ,justifyContent:'center'}} onPress={()=>{

                  
                   navigation.navigate("AboutScreen")

                    }}>


                    <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10,alignSelf:'center' }}>{t("About NANA")}</Text>
                    <View style={{ backgroundColor: Colors.dark_gray, height: 2 }}></View>


                    </TouchableOpacity>

                    <TouchableOpacity  style={{width:'100%' ,justifyContent:'center'}} onPress={()=>{

if(social!=null){
    console.log(social[0].facebook)
     handlePress(social[0].facebook)
}
}}>






<View style={{flexDirection:'row',alignSelf:'center',padding:10}}>


<Image style={{ width: 20, height: 20, }} source={require('../../assets/images/facebook.png')}></Image>
<Text style={{marginStart:3,fontWeight:'bold',fontSize:18}}>Facebook</Text>



</View>    
</TouchableOpacity>
<View style={{ backgroundColor: Colors.dark_gray, height: 2 }}></View>

<TouchableOpacity  onPress={()=>{

if(social!=null){
    handlePress(social[0].instagram)
}
}}>


                    

                  

<View style={{flexDirection:'row',alignSelf:'center',padding:10}}>


<Image style={{ width: 20, height: 20 }} source={require('../../assets/images/instagram.png')}></Image>
<Text style={{fontWeight:'bold',marginStart:3,fontSize:18}}>Instagram</Text>


</View>    
</TouchableOpacity>


<View style={{ backgroundColor: Colors.dark_gray, height: 2 }}></View>



<TouchableOpacity  style={{width:'100%' ,justifyContent:'center'}} onPress={()=>{

if(social!=null){
    handlePress(social[0].twitter)
}
}}>


                    

                  

<View style={{flexDirection:'row',alignSelf:'center',padding:10}}>


<Image style={{ width: 20, height: 20 }} source={require('../../assets/images/twitter.png')}></Image>
<Text style={{fontWeight:'bold',marginStart:3,fontSize:18}}>X</Text>


</View>    
</TouchableOpacity>



<View style={{ backgroundColor: Colors.dark_gray, height: 2 }}></View>


<TouchableOpacity style={{width:'100%' ,justifyContent:'center'}}   onPress={()=>{

if(social!=null){
    handlePress(social[0].youtube)
}
}}>


                    

                  

<View style={{flexDirection:'row',alignSelf:'center',padding:10}}>


<Image style={{ width: 20, height: 20 }} source={require('../../assets/images/youtube.png')}></Image>
<Text style={{fontWeight:'bold',marginStart:3,fontSize:18}}>Youtube</Text>


</View>    
</TouchableOpacity>


<View style={{ backgroundColor: Colors.dark_gray, height: 2 }}></View>


 {Platform.OS=="android" && (
    <TouchableOpacity style={{width:'100%' ,justifyContent:'center'}}  onPress={()=>{



if(Platform.OS=='android'){
    if(social!=null){

        const whatsappUrl = `whatsapp://send?phone=${social[0].whatsapp_number}`;
        Linking.canOpenURL(whatsappUrl)
        .then((supported) => {
        if (!supported) {
        console.log("WhatsApp is not installed on your device.");
        } else {
        return Linking.openURL(whatsappUrl);
        }
        })
        .catch((err) => console.error('An error occurred', err));
        }

}


}}>






<View style={{flexDirection:'row' ,alignSelf:'center',padding:10}}>


<Image style={{ width: 20, height: 20 }} source={require('../../assets/images/whatsapp.png')}></Image>
<Text style={{marginStart:3,fontWeight:'bold',fontSize:18}}>Whatsapp</Text>


</View>    
</TouchableOpacity>


 )}



<View style={{ backgroundColor: Colors.dark_gray, height: 2 }}></View>



{Platform.OS=='android' && (
    <TouchableOpacity style={{width:'100%' ,justifyContent:'center'}}   onPress={()=>{

        if(social!=null){
        handlePress(social[0].rating_link)
        }
        }}>
        
        
        
        
        
        
        <View style={{flexDirection:'row',alignSelf:'center',padding:10}}>
        
        
        <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/star.png')}></Image>
        <Text style={{fontWeight:'bold',marginStart:3,fontSize:18}}>Rate us</Text>
        
        
        </View>    
        </TouchableOpacity>
)}





<View style={{position:'absolute',bottom:'5%',alignItems:'center',width:'100%'}}>

<Text style={{textAlign:'center',alignSelf:'center',fontWeight:'500'}}>NARNARAYAN UDYOG PRIVATE LIMITED</Text>
</View>




<View style={{flexDirection:'row',justifyContent:'space-between',padding:10,marginTop:20}}>


                
               






                    </View>



                    <View style={{flexDirection:'row',justifyContent:'space-between',padding:10,marginTop:20}}>

               








                    </View>

                    <View style={{flexDirection:'row',justifyContent:'space-between',padding:10,marginTop:20}}>









</View>



            </View>

            {/* <View style={{
                    position: 'absolute',
                    bottom:0,
                   
                
                    width:'100%',
                    backgroundColor:Colors.navcolor,
                    alignItems:'center'
                   
                  
                }}>

            <FlatList
                
                data={bottomNavBar}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPlanItem}
            />
            </View> */}



        </View>
        </SafeAreaView>
    )



}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor:Colors.white
    },
    cat_item: {
        flexDirection: 'coloumn',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
        margin: 10,
        width: 100,
        marginTop: 10,
        height: 100,
        backgroundColor: Colors.grayview,
        alignItems: 'center'

    },
    cat_item_font: {
        fontSize: 12,
        textAlign: 'center',


    },
    topbar: {
        backgroundColor: Colors.blue,
        height: 70,

    },
    selectedItem: {
        borderColor: Colors.blue,
        backgroundColor:Colors.blue
    },
    itemContainer: {

        flex: 1,
        padding: 10,
        borderColor: Colors.white,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        height: 50, // Adjust the height of each item
    },
    planItem: {
        flexDirection: 'coloumn',
        justifyContent: 'space-between',
        padding: 10,
        width: 75,
        height:75,
        backgroundColor: Colors.navcolor,
        alignItems: 'center'

    },
    planYear: {
        fontSize: 11,

        fontWeight: 'bold',
    },
    planPrice: {
        fontSize: 16,
        width: 100,
        textAlign: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.white,
        color: Colors.white,
        padding: 10,
        backgroundColor: Colors.dark_gray
    },
    selectedItemPrice: {
        backgroundColor: Colors.blue,
        color: Colors.white,
        borderWidth: 0
    },


})


export default SettingScreen