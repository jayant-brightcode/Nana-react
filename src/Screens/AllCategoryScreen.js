import React, { useState,useEffect } from 'react'

import { RefreshControl,View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback, TouchableHighlight,ActivityIndicator, SafeAreaView} from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { Remote } from '../Utils/Remote';
import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import { useTranslation } from 'react-i18next';
import EmptyState from '../component/NoData';




const bottomNavBar = [
    { id: 1, name: 'Home',icon:require('../../assets/images/home.png') },
    { id: 2, name: 'Jobs', icon: require('../../assets/images/work.png') },
    { id: 3, name: 'Categories', icon: require('../../assets/images/cat.png') },
    { id: 4, name: 'Promotion', icon: require('../../assets/images/31.png') },
    { id: 5, name: 'Setting', icon: require('../../assets/images/setting.png') },

    // Add more languages as needed
];



const AllCategoryScreen = ()=>{


    const navigation = useNavigation()

    const [get_category,set_category] = useState([])
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedItem, setSelectedItem] = useState(bottomNavBar[2]);


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
 
         if (item.name == "Home") {
            navigation.navigate("HomeScreen")
           
        }
 
 
         if (item.name == "Setting") {
             navigation.navigate("SettingScreen")
         }
 
 
         if (item.name == "Promotion") {
             const data = {
                 screen: "home"
             }
             navigation.navigate("MyPurchasedPromotionScreen", { page: data })
          
         }
 
 
         setSelectedItem(item);
 
 
 
 
 
     };
    const renderPlanItem = ({ item }) => (

        <TouchableOpacity   onPress={() => {
            console.log(item)

      
            
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

    useEffect(() => {
       get_categories();
       fetchLanguage()
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        get_categories()
       
        setRefreshing(false);
      
        
      };

    const renderCategoryList = ({ item }) => (
        <TouchableOpacity onPress={() => {

            navigation.navigate("JobsScreen", { category: item })
            
        }}>

            <View style={[styles.cat_item]}>
            <Image 
                    source={require('../../assets/images/cat_back.png')}
                    style={{width:100,height:100,position:'absolute' }}
                />
                  <Image
                    source={{ uri: Remote.BASE_URL+item.image }}
                    style={{ width: 55, height: 55,borderRadius:500 }}
                />
                <Text style={{marginTop:8,fontSize:12,textAlign:'center',bottom:7,color:Colors.black,fontWeight:'bold'}}>{item.name}</Text>
            </View>
        </TouchableOpacity>


    );

    const get_categories = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "get_category"

         


            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();


                set_category(data.category);

                setLoading(false)






            } else {
                console.error('Error:', response.status, response.statusText);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };












    return(

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={styles.container}>

          



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: Platform.OS=="android"?10:20, padding: 10, alignItems: 'center' }}>
                    <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                    }}>
                         <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>{t("Job Categories")}</Text>

                    </View>


                </View>

            </View>


           

        


           
            <View style={{flex:1}}>


                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}

                {get_category.length==0 && (
                 <EmptyState
              
                 title="No Data Found"
                 description="All Categories will be display here"
               />
            )}

                <FlatList
                     
                    data={get_category}
                    numColumns={3}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderCategoryList}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                      }
                />
            </View>

        </View>

        <View style={{
                    position: 'absolute',
                    bottom:0,
                   
                
                    width:'100%',
                    backgroundColor:Colors.navcolor,
                    alignItems:'center'
                   
                  
                }}>



            <FlatList
                
                data={bottomNavBar}
                horizontal={true}
                
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPlanItem}
            />
            </View>


        </SafeAreaView>
    )



}


const styles = StyleSheet.create({

    container:{
        flex:1,
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


export default AllCategoryScreen