import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, StatusBar,ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import Colors from "../Utils/Color";
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { getToken } from "../Utils/LocalStorage";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useRoute } from '@react-navigation/native';
import { Remote } from "../Utils/Remote";
import Video from 'react-native-video-controls';


import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message

const ViewPromotionDetailScreen = () => {

    const navigation = useNavigation()
    const route = useRoute();
    const { data } = route.params

  

    console.log("DETAILS",data.details.likes.length)
    console.log("DETAILS",data.details.view_count.length)
   // console.log("DETAILS",data.details.view_count.length)
   
   
    const [index, setIndex] = React.useState(0)
    const isCarousel = React.useRef(null)

   



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
            changeLanguage("bn");
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
        // Check and request permission on component mount
        AddViewToPromotion();
        fetchLanguage()
    }, []);




    const AddViewToPromotion = async () => {
    

      try {

 
            const apiUrl = Remote.BASE_URL + "user/add_view_count";

        

            const userData = {
                promotion_id: data.details._id,
              

            };

           

           


            const token = await getToken()

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });


            const responsedata = await response.json();
            console.log(responsedata)


            if (response.ok) {
                // Handle success

                console.log("ok")
              
         

          


            } else {
                // Handle error

                console.log("not ok")
               

            }
        } catch (error) {
        
            console.log(error)
        }

    }


    const AddLike = async () => {
    

        try {
  
   
              const apiUrl = Remote.BASE_URL + "user/like_promotion";
  
          
  
              const userData = {
                  promotion_id: data.details._id,
                
  
              };
  
             
  
             
  
  
              const token = await getToken()
  
              const response = await fetch(apiUrl, {
                  method: 'POST',
                  headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(userData),
              });
  
  
              const responsedata = await response.json();
              console.log(responsedata)
  
  
              if (response.ok) {
                  // Handle success
  
                  Toast.show({
                    type: 'error',
                    text1: 'Like added',
                   });

                   
                
           
  
            
  
  
              } else {
                  // Handle error
  
                  Toast.show({
                    type: 'error',
                    text1: 'already liked',
                   });
                 
  
              }
          } catch (error) {
          
              console.log(error)
          }
  
      }


    const renderItem = ({ item }) =>



    (


        <View>
            <Image source={{ uri: Remote.BASE_URL + item }} style={styles.bannerImage} />

        </View>
    );



    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={styles.container}>
            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: Platform.OS=="android"?10:0, padding: 10, alignItems: 'center' }}>


                <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                    }}>
                                            <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>  

                                 <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>{t("Promotion Details")}</Text>

                    </View>


                    


                </View>

            </View>


             <ScrollView>


             {data.details!=null && data.details.vide !=null && (
                        <Video
                        source={{ uri: Remote.BASE_URL+data.details.vide }}
                        style={styles.video}
                        controls={true}
                        resizeMode="contain"
                        fullscreen={true}
                        toggleResizeModeOnFullscreen={true}
                        repeat={true}
                        // Show player controls (play, pause, etc.)
                        />
            )}


            <View style={{ alignSelf: 'center' }}>


                <Carousel

                    data={data.details.photos}

                    renderItem={renderItem}
                    sliderWidth={400}
                    itemWidth={350}
                    ref={isCarousel}
                    autoplay={true}
                    autoplayDelay={4000}
                    loop={true}
                    onSnapToItem={(index) => setIndex(index)}
                    containerCustomStyle={{
                        flexGrow: 0,




                    }}
                    removeClippedSubviews={false}



                />
                <Pagination

                               dotsLength={data.details.photos.length}
                                activeDotIndex={index}
                                containerStyle={{ paddingVertical: 10 }}
                                carouselRef={isCarousel}
                                dotStyle={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    marginHorizontal: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.92)'
                                }}
                                inactiveDotOpacity={0.4}
                                inactiveDotScale={0.6}
                                tappableDots={true}
                                removeClippedSubviews={true}

                            />
            </View>



            <View style={{flexDirection:'row',justifyContent:'space-between',margin:12}}>
            <TouchableOpacity style={{borderWidth:1,borderColor:Colors.orange,width:'47%',borderRadius:10}} onPress={()=>{
                AddLike()
            }}>
                <View style={{flexDirection:'row'}}>
                    <Image style={{width:20,height:20,marginTop:10,marginStart:10,tintColor:Colors.orange}} source={require('../../assets/images/like.png')}></Image>
                    <Text style={{color:Colors.orange,padding:10,borderRadius:10,width:'65%',textAlign:'center'}} >{t("Like Now")}</Text>

                </View>
            </TouchableOpacity>

            <TouchableOpacity style={{borderWidth:1,borderColor:Colors.orange,width:'47%',borderRadius:10,marginStart:10}} onPress={()=>{
              //  AddLike()
            }}>
                <View style={{flexDirection:'row'}}>
                    <Image style={{width:20,height:20,marginTop:10,marginStart:10,tintColor:Colors.orange}} source={require('../../assets/images/eye.png')}></Image>
                    <Text style={{color:Colors.orange,padding:10,borderRadius:10,width:'65%',textAlign:'center'}} >{data.details.view_count.length} {t("Views")} </Text>

                </View>
            </TouchableOpacity>
            </View>

            <View style={{elevation:2,margin:10,backgroundColor:Colors.white,padding:10}}>

           
           
            <Text style={{fontSize:15,fontWeight:'400',}}>{t("Promotion Title")}</Text>

            <Text style={{fontSize:18,marginTop:10,fontWeight:'bold'}}>{data.details.title}</Text>

            </View>
            <View style={{height:2,marginTop:10,backgroundColor:Colors.textcolor}}></View>


            <View style={{elevation:2,margin:10,backgroundColor:Colors.white,padding:10}}>

            <Text style={{fontSize:15,fontWeight:'400'}}>{t("Promotion Description")}</Text>

            <Text style={{ fontSize: 15,marginTop:20 }}>{data.details.desc}</Text>

            </View>
            <View style={{ height: 1, marginTop: 10, backgroundColor: Colors.textcolor }}></View>

            
           
         
          {/*
           <View style={{elevation:2,margin:10,backgroundColor:Colors.white}}>
                <Text style={{ color: Colors.textcolor, marginStart: 10 ,fontWeight:'bold',marginTop:20}}>Profession Name</Text>
                <Text style={{ color: Colors.textcolor, marginStart: 10,marginTop:2 }}>{data.details.user_id.profession_name}</Text>

                <Text style={{ color: Colors.textcolor, marginStart: 10, marginTop: 10 ,fontWeight:'bold'}}>Profession Experience</Text>
                    <Text style={{ color: Colors.textcolor, fontWeight: "300", padding: 10, marginTop: 2 }}>{data.details.user_id.profession_experience}</Text>
         
               
                <Text style={{ color: Colors.textcolor, marginStart: 10,marginTop:10,fontWeight:'bold' }}>Profession Description </Text>
                    <Text style={{ color: Colors.textcolor, fontWeight: "300", padding: 10, marginTop: 2 }}>{data.details.user_id.profession_description}</Text>
         
         
             

                    {/* <Text style={{ color: Colors.textcolor, marginStart: 10, marginTop: 10, fontWeight: 'bold' }}>Profession Photos</Text>

                    <FlatList
                        data={profile.profession_photo}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderImageItem}
                        horizontal
                    /> */}
            {/* </View>*/} 
       

            
            </ScrollView>


        </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Colors.white
       

    } ,topbar: {
        backgroundColor: Colors.blue,
        height: 70,

    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        width:'100%'

    },
    bannerImage: {
        padding: 10,
        width: 450,
        marginTop:10,
        height: 200,
        borderRadius: 10,
        alignSelf: 'center',

        resizeMode: 'contain'


    },
    video: {
        alignSelf:'center',
        width: '100%',
        height: 200,
        
        
        
    },

   
});


export default ViewPromotionDetailScreen  