import React, { useState, useEffect } from 'react'

import { RefreshControl,View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal, TouchableWithoutFeedback, Platform, SafeAreaView } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';

import { useRoute } from '@react-navigation/native';
import CommentDialog from '../component/MemberShipDialog';
import EmptyState from '../component/NoData';
import { useTranslation } from 'react-i18next';



const bottomNavBar = [
    { id: 1, name: 'Home',icon:require('../../assets/images/home.png') },
    { id: 2, name: 'Jobs', icon: require('../../assets/images/work.png') },
    { id: 3, name: 'Categories', icon: require('../../assets/images/cat.png') },
    { id: 4, name: 'Promotion', icon: require('../../assets/images/31.png') },
    { id: 5, name: 'Setting', icon: require('../../assets/images/setting.png') },

    // Add more languages as needed
];



const MyPurchasedPromotionScreen = () => {

    const route = useRoute();
    const { page } = route.params
    console.log(page)
    const navigation = useNavigation();
    const [get_request, set_request] = useState([])
    const [isDialogVisible, setDialogVisible] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(bottomNavBar[3]);



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
    const handleItemPress = (item) => {
        // setSelectedItem(item);
 
        // navigation.navigate("SettingScreen")
       
         
 
        if (item.name == "Jobs") {
            navigation.navigate("TempJobScreen")
           
        }
 
         if (item.name == "Categories") {
             navigation.navigate("AllCategoryScreen")
          
         }
 
 
         if (item.name == "Setting") {
             navigation.navigate("SettingScreen")
         }
 
 
         if (item.name == "Home") {
            navigation.navigate("HomeScreen")
           
         }
 
 
         setSelectedItem(item);
 
 
 
 
 
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

    const openDialog = () => {
        setDialogVisible(true);
      };
    
      const closeDialog = () => {
        setDialogVisible(false);
      };

    const bannerData = [
        { id: 1, imageUrl: '../../assets/images/banner1.png' },
        { id: 2, imageUrl: '../../assets/images/banner2.png' },
        // Add more banner items here
    ];
    const [index, setIndex] = React.useState(0)
    const isCarousel = React.useRef(null)


    const onRefresh = () => {
        setRefreshing(true);
        if(page.screen=="setting"){
            get_purchased_promotion();

        }else{
            get_running_promotion();
        }
        
        setRefreshing(false);
      
        
      };
  

    useEffect(() => {
        fetchLanguage()
        if(page.screen=="setting"){
            get_purchased_promotion();
          
        }else{
            get_running_promotion();
        }
    }, []);

    const handleButtonPress = () => {
        // Handle button press action
        closeDialog();
        navigation.navigate("ChoosePlanScreen")
     
      };
    
 
      const renderItem = ({ item }) => 
      
        
       
          
            (

            
            <View>
                <TouchableWithoutFeedback onPress={()=>{
                     
                }}>
<Image  source={{ uri: Remote.BASE_URL + item }} style={styles.bannerImage} />
              
                </TouchableWithoutFeedback>
                
              
            </View>
        );


    const renderJobItem = ({ item }) => {

    

        
      





        return (
         

                <View style={{ marginTop: 13, flexDirection: 'row', alignItems: 'center', marginStart: 10, marginEnd: 10, backgroundColor: Colors.white, padding: 10,elevation:4 }}>
                
                    <View style={{ flex: 1 }}>

                        <View style={{ alignSelf: 'center' }}>


                            <Carousel

                                data={item.photos}

                                renderItem={renderItem}
                                sliderWidth={350}
                                itemWidth={350}
                                ref={isCarousel}
                                autoplay={false}
                                autoplayDelay={4000}
                                loop={false}
                                onSnapToItem={(index) => setIndex(index)}
                                containerCustomStyle={{
                                    flexGrow: 0,

                                   


                                }}
                            removeClippedSubviews={false}



                            />
                            {/* <Pagination

                                dotsLength={bannerData.length}
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

                            /> */}
                        </View>
                        {/* <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 22,marginTop:10 }}>{item.title}</Text> */}
                 
                        <TouchableOpacity onPress={()=>{
                             const data={
                                details:item
                             }

                             console.log(item)

                       navigation.navigate("ViewPromotionDetailScreen",{data:data})
                        }}>
                        <Text style={{ marginTop: 10, color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, textAlign: 'center', borderColor: Colors.fadeOrange, borderWidth: 2, padding: 10 }}>{t('view more')}</Text>

                        </TouchableOpacity>

                        <View style={{flexDirection:'row',position:'absolute',alignSelf:'flex-end',backgroundColor:Colors.black,padding:10}}>
                             <Image style={{width:20,height:20}} source={require('../../assets/images/eye.png')}></Image>
                             <Text style={{color:Colors.white,marginStart:4}}><Text style={{color:Colors.white,opacity:1}}>{item.view_count.length}</Text></Text>

                             <Image style={{width:20,height:20,marginStart:10}} source={require('../../assets/images/like.png')}></Image>
                             <Text style={{color:Colors.white,opacity:1,marginStart:4}}>{item.likes.length}</Text>

                        </View>

                        {/* <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>End Date - {new Date(item.to_date).toDateString() }</Text>
                        <Text style={{ color: Colors.red, fontWeight: 'bold', fontSize: 12 }}>Paid - Rs.{item.payment_amount}</Text> */}

            
                        {page.screen=="setting" && (
                            <View style={{marginTop:10}}>
                                    <Text style={{fontSize:11}}>{t('Promotion Started date')} - {new Date(item.from_date).toDateString()}</Text>
                                    <Text style={{fontSize:11}}>{t('Promotion End date')} - {new Date(item.to_date).toDateString()}</Text>
                            </View>
                        )}
                       









                    </View>




                </View>
          


        )
    };



    const get_purchased_promotion = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_purchased_promotion"


           





            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();

                console.log(data)




                set_request(data.promotion);

                setLoading(false)








            } else {
                if(response.status==401){
                    setLoading(false)
                    openDialog()
                }
              //  console.error('Error:', response.status, response.statusText);
               
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };


    const get_running_promotion = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_running_promotion"








            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();




                set_request(data.promotion);

                setLoading(false)








            } else {
                if(response.status==401){
                    setLoading(false)
                    openDialog()
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };





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
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>{t("Promotions")}</Text>

                    </View>


                    {page.screen=="setting" && (
                        <TouchableOpacity onPress={() => {

                            navigation.navigate("PurchasePromotionScreen")

                        }}>
                            <Text style={{ borderRadius: 10, borderWidth: 1, borderColor: Colors.white, padding: 10, color: Colors.white, marginEnd: 10,height:40, fontWeight: 'bold' }}>{t("Make Promotion")}</Text>

                        </TouchableOpacity>
                    )}

               



                </View>

            </View>

            {get_request.length==0 && (
                 <EmptyState
                 title="No Data Found"
                 description="All Promotions will be display here"
               />
            )}

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}


           {page.screen=="setting" && (
                <View style={{marginBottom:'20%'}} >

                    <FlatList

                        data={get_request}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={renderJobItem}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                          }
                    />
                </View>
           )}


       {page.screen!="setting" && (
            <View style={{ marginBottom: '35%' }}>

                <FlatList

                    data={get_request}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                      }
                />
            </View>
        )}




        <CommentDialog
          isVisible={isDialogVisible}
          onClose={closeDialog}
          onButtonPress={handleButtonPress}
       />
              {page.screen!="setting" && (
            <View style={{
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
            </View>)}

            


      

          



        </View>

        </SafeAreaView>

    )

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Colors.white
    },
    topbar: {
        backgroundColor: Colors.blue,
        height: Platform.OS=='android'?70:70,

    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',

    },
    dialogContainer: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        marginStart: 10,
        marginEnd: 10,
        borderRadius: 10,

    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    input: {
        width: '100%',
        height: 80,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,
        marginTop: 10,
        color: Colors.dark_gray



    },
    rowinput: {
        width: '100%',
        height: 45,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,


    },
    bannerImage: {
        padding: 10,
        width: 400,
        height: 200,
        borderRadius: 10,
        alignSelf: 'center',
      
 
       


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



export default MyPurchasedPromotionScreen



function isValidPhone(value) {
    const phonePattern = /^\d{10}$/; // Assumes a 10-digit phone number
    return phonePattern.test(value)
}
