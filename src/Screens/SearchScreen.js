import React, { useState,useEffect,useRef } from 'react'

import { View, Text, StyleSheet, Image,Animated, FlatList, TouchableOpacity, ScrollView ,ActivityIndicator, TextInput, SafeAreaView} from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { useRoute } from '@react-navigation/native';
import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Geolocation from 'react-native-geolocation-service';
import Geocoding from 'react-native-geocoding';
import EmptyState from '../component/NoData.js';

import { useTranslation } from 'react-i18next';






const SearchScreen = ()=>{
    const navigation = useNavigation()
    const route = useRoute();
   // const { category } = route.params


   const addressParts = ['Skill','Name','City', 'State', 'District','Profession Name'];
   const [currentPartIndex, setCurrentPartIndex] = useState(0);
   const fadeAnim = useRef(new Animated.Value(1)).current;
 
 useEffect(() => {
    const timer = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentPartIndex((prevIndex) => (prevIndex + 1) % addressParts.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [currentPartIndex, fadeAnim]);
   Geocoding.init('AIzaSyA4d6_D7yrcGAgSSHNpR7DbG-o-l955TPw');

    const [search_data, set_search_data] = useState([])
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [profile, set_profile] = useState({});

    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);


     
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
     fetchLanguage()
       getProfile()
      }, []);

  const handleSearch = () => {
    // Implement your search logic here
    search(searchText)
  };


    useEffect(() => {
      // get_employee_by_category();
    }, []);
    const renderJobItem = ({ item }) => { 
        
        let skillsString;

        if(item.userSkills!=null){
             skillsString = item.userSkills.map(skill => skill.name).join(', ');
        }
        console.log(Remote.BASE_URL + item.profile)
         

        
        return (
        <TouchableOpacity onPress={() => {
            navigation.navigate("EmployeeDetailScreen", { user: item })
        }}>

            <View style={{ marginTop: 13, flexDirection: 'row', alignItems: 'center', marginStart: 10, marginEnd: 10, backgroundColor: Colors.white,borderWidth:1,borderColor:Colors.gray, borderRadius: 10 }}>
                <View
                    style={{
                        width: 80,
                        height: 80,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                        backgroundColor: Colors.dark_blue,
                        alignItems: 'center',
                     
                        justifyContent: 'center', // Center the content vertically
                    }}
                >
                        <Image style={{ width: 50, height: 50, borderRadius:50 }} source={{ uri: Remote.BASE_URL + item.profile }} />
                </View>
                    <View style={{ flex: 1, marginLeft: 14, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                        {item.customer_type=="employee" && (
                            <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}><Text style={{fontWeight:'light'}}>{t('Skills')} - </Text>{skillsString}</Text>

                         )}

                        {item.customer_type=="employer" && (
                            <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}><Text style={{fontWeight:'light'}}>{t("Profession Name")} - </Text>{item.profession_name}</Text>

                         )}
                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                            <View>
                                <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 9 }}>{t("Rating")}</Text>
                                <AirbnbRating
                                    count={5}
                                    reviews={['Terrible', 'Bad', 'Good', 'Great', 'Excellent']}
                                    defaultRating={item.avg_rating}
                                    size={12}
                                    showRating={false}
                                    isDisabled={true}
                                />
                            </View>

                            <View style={{ marginStart: 10, marginTop: 15 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={{ width: 13, height: 13, tintColor: Colors.navcolor,tintColor:Colors.dark_gray }} source={require('../../assets/images/like.png')}></Image>
                                    <Text style={{ color: Colors.black, fontWeight: 'bold', fontSize: 12, marginStart: 5 }}>{item.liked_by.length}</Text>
                                </View>


                            </View>
                        </View>

                    </View>
                <View style={{ flex: 0, justifyContent: 'flex-end', marginRight: 10 }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/next.png')} />
                </View>
            </View>
        </TouchableOpacity>


    )};


    const getProfile = async () => {


        try {
          setLoading(true)
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

            set_profile(data.profile_details)

            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.profile_details.latitude}&lon=${data.profile_details.longitude}`)
            .then((response) => response.json())
            .then((json) => {
              const addressComponent = json.display_name;
              setAddress(addressComponent);
            
            })
            .catch((error) => setLoading(false));
    
    
    
    
           
    
    
            
    
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
    


    const search = async (query) => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/search"

            const queryParams = {
                query_for:query,

            };

          

            // Construct the URL with query parameters
            const urlWithParams = `${apiUrl}?${new URLSearchParams(queryParams)}`;


            const response = await fetch(urlWithParams, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();


                set_search_data(data.users);

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






        <View style={{backgroundColor:Colors.orange,flexDirection:'row',alignItems:'center'}}>

         

        <TouchableOpacity  onPress={()=>{
                              navigation.goBack()
                    }}>
                    <Image style={{ width: 20, height: 20 ,marginStart:8}} source={require('../../assets/images/arrow.png')}></Image>

                    </TouchableOpacity>

       
        {address && (
        <View style={{backgroundColor:Colors.orange,padding:10}}>
                      <Text style={{fontWeight:'bold',color:Colors.white,fontSize:12,padding:10,backgroundColor:Colors.orange,borderRadius:10}}>{t("Address")} - {address}</Text>

        </View>
      )}

         
        </View>

        <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: Colors.white,
                            borderRadius:10,borderWidth:2,borderColor:Colors.blue,
                          
                            margin:10,
              
                            borderRadius: 5,
                            paddingLeft: 10,
                        }}
                    >
                        <Image source={require('../../assets/images/search.png')} style={{ width: 20, height: 20, marginRight: 5 }} />
                       

                       
                        <TextInput
                                placeholder={`Search with ${addressParts[currentPartIndex]}`}
                                style={{ flex: 1, padding: 15}}
                                value={searchText}
                                onChangeText={(text) => setSearchText(text)}
                                onSubmitEditing={handleSearch}  
                                returnKeyType="go"  
                            />

                       
                        
                    </View>
                    <Text style={{top:10,start:10}}>{t("Your Search Results")}</Text>

                </View>



            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View style={{marginTop:8,flex:1}}>

                <FlatList

                    data={search_data}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                />
            </View>


            {search_data.length==0 && (
                 <EmptyState
                 title="No Data Found"
                 description="Try with different keywords"
               />
            )}


        </View>

        </SafeAreaView>



    )

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Colors.white
    },
    




})



export default SearchScreen