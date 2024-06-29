import React, { useState,useEffect ,useRef} from 'react'

import {RefreshControl,InteractionManager,Animated,View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ScrollView,Button, TouchableWithoutFeedback, TouchableHighlight, StatusBar, ActivityIndicator, PermissionsAndroid,Platform, SafeAreaView, } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import Geolocation from 'react-native-geolocation-service';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { useTranslation } from 'react-i18next';



const bottomNavBar = [
    { id: 1, name: 'Home',icon:require('../../assets/images/home.png') },
    { id: 2, name: 'Jobs', icon: require('../../assets/images/work.png') },
    { id: 3, name: 'Categories', icon: require('../../assets/images/cat.png') },
    { id: 4, name: 'Promotion', icon: require('../../assets/images/31.png') },
    { id: 5, name: 'Setting', icon: require('../../assets/images/setting.png') },

    // Add more languages as needed
];


const categoryList = [
    { id: 1, name: 'IT Computer', Image: require('../../assets/images/it.png') },
    { id: 2, name: 'Design', Image: require('../../assets/images/design.png') },
    { id: 3, name: 'Marketing', Image: require('../../assets/images/market.png') },
    { id: 4, name: 'Telecaller', Image: require('../../assets/images/tele.png') },

]

const serviceList = [
    { id: 1, name: 'Electrician', Image: require('../../assets/images/electric.png') },
    { id: 2, name: 'Carpentar', Image: require('../../assets/images/carpenter.png') },
    {
        id: 3, name: 'Website Design', Image: require('../../assets/images/design.png')
    },
    {
        id: 4, name: 'Graphic Design', Image: require('../../assets/images/market.png')
    },

]

const recent_list = [
    { id: 1, name: 'Employee Name', desc: 'Skills : Carpenter, plumber', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'),cols:Colors.fadeOrange },
    { id: 2, name: 'Resonance Tech', desc: 'Location : Ranchi, Search for : Web developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/31.png'),cols:Colors.pink },
    { id: 3, name: 'Resonance Tech', desc: 'Location : Ranchi, Search for : Web developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 4, name: 'Resonance Tech', desc: 'Location : Ranchi, Search for : Web developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/31.png'), cols: Colors.pink },


]

const HomeScreen = () => {

    const navigation = useNavigation()

  
    const [index, setIndex] = React.useState(0)
    const isCarousel = React.useRef(null)


    const [index2, setIndex2] = React.useState(0)
    const isCarousel2 = React.useRef(null)


    const [index3, setIndex3] = React.useState(0)
    const isCarousel3 = React.useRef(null)

    const [notification_count, set_notification_count] = React.useState(0)
    const addressParts = ['Skill','Name','City', 'State', 'District',"Profession Name"];
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;



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


    const [selectedScreen, setSelectedScreen] = useState('Home'); // Set the initial selected screen
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedItem, setSelectedItem] = useState(bottomNavBar[0]);
    const [get_name, set_name] = useState('');
    const [get_image, set_image] = useState('');

    const [get_category, set_category] = useState([]);
    const [get_all_nearby_employee, set_all_nearby_employee] = useState([]);
    const [get_all_nearby_daily_service_employee, set_all_nearby_daily_service_employee] = useState([]);
    const [get_all_nearby_monthly_service_employee, set_all_nearby_monthly_service_employee] = useState([]);
    const [get_all_employee, set_all_employee] = useState([]);
    const[cart,set_cart]=useState(0)
    const [first_banner, set_first_banner] = useState([]);

    const [get_all_nearby_employer, set_all_nearby_employer] = useState([]);
    const [get_all_employer, set_all_employer] = useState([]);
    const [is_subscribed, set_is_subscribed] = useState(false);
    const [latitude, set_latitude] = useState('');
    const [longitude, set_longitude] = useState('');



    //location 
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    //banner

    const [bannerData,setBannerdata] = useState([])  //admibn
    const [bannerData2,setBannerdata2] = useState([]) //location
    const [bannerData3,setBannerdata3] = useState([]) //state
    const [bannerData4,setBannerdata4] = useState([]) //district
    const [bannerData5,setBannerdata5] = useState([]) //pan india


    useEffect(() => {
        getProfile();
     }, []);

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

    const requestNotificationPermission = async () => {
        if(Platform.OS ==="android"){
          try {
            PermissionsAndroid.check('android.permission.POST_NOTIFICATIONS').then(
              response => {
                if(!response){
                  PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS',{
                      title: 'Notification',
                      message:
                        'App needs access to your notification ' +
                        'so you can get Updates',
                      buttonNeutral: 'Ask Me Later',
                      buttonNegative: 'Cancel',
                      buttonPositive: 'OK',
                  })
                }
              }
            ).catch(
              err => {
                console.log("Notification Error=====>",err);
              }
            )
          } catch (err){
            console.log(err);
          }
        }
      };

    const renderItem = ({ item }) => (
        <View>
            <TouchableOpacity onPress={()=>{
                 const data={
                    details:item
                 }

            navigation.navigate("ViewPromotionDetailScreen",{data:data})
            }}>
            <Image source={{uri:Remote.BASE_URL+item.photos[0]}} style={styles.bannerImage} />
            </TouchableOpacity>
     
        </View>
    );

    const renderPromotion = ({ item }) => (
        <View>
            <TouchableOpacity onPress={()=>{
                 const data={
                    details:item
                 }

            navigation.navigate("ViewPromotionDetailScreen",{data:data})
            }}>
            <Image source={{uri:Remote.BASE_URL+item.photos[0]}} style={{borderRadius:10,width:360,height:200,marginStart:2,marginEnd:10}} />
            </TouchableOpacity>
     
        </View>
    );


    const check_registration_expiry = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token

            const response = await fetch(Remote.BASE_URL + "user/check_registration_expiry", {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });

            if (response.ok) {
                const data = await response.json();

                console.log("vvv",data)

              //  set_is_plan_purchased(data.status)

               

               
              //  if(data.expired_plan.length==0){
                   
                 
              if(data.is_purchased==true && data.renewal==false){
                set_is_subscribed(true)
                console.log("iopppppppppppppp",data.renewal)
             
              }else{
                set_is_subscribed(false)
              }
              
             
                   
              //  }else{
                   // set_is_plan_nenew(data.renewal)
                   // set_active_plan(data.expired_plan)
                
                
               // }

                
             
  

       

            

               
                setLoading(false)






            } else {
                console.error('Error:', response.error, response.statusText);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };


    const requestLocationPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                   );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getLocation();
                } else {
                    console.log("hello")
                    requestLocationPermission();
                }
            } else if (Platform.OS === 'ios') {

                Geolocation.requestAuthorization('whenInUse').then((result) => {
                    if (result === 'granted') {
                        getLocation();
                    } else {
                        requestLocationPermission()
                    }
                });
              
            }
        } catch (err) {
           requestLocationPermission()
        }
    };


  
    const getLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                if(latitude != null && longitude != null){
                  // get_all_nearby_daily_service(latitude,longitude);
             
                   // get_all_nearby_monthly_service(latitude,longitude);
                    get_all_nearby_employees(latitude,longitude);
                    fetch_all_nearby_employer(latitude,longitude)
                    update_lat_lon(latitude, longitude)
                    set_latitude(latitude)
                    set_longitude(longitude)
                   
                }
            },
            error => {
                setError(error.message || 'Error getting location');
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    useEffect(() => {
        requestLocationPermission();

        // Clean up the geolocation watcher on component unmount
        return () => {
            Geolocation.stopObserving();
        };
    }, []);


    useEffect(() => {
        // get_all_nearby_daily_service();
        fetchLanguage()
     }, []);

    const onRefresh = () => {
        setRefreshing(true);
         get_categories()
         getProfile()
       //  get_all_nearby_employees()

         get_all_employees()
         get_cart()
     //    fetch_all_nearby_employer()
         fetch_all_employer()
         get_running_promotion()
         check_registration_expiry()
         get_notification_count();
        
        setRefreshing(false);
      
        
      };
  


      useEffect(() => {
        requestNotificationPermission();
    }, []);

    useEffect(() => {
        get_notification_count();
    }, []);

  

    useEffect(() => {
        check_registration_expiry();
    }, []);

    useEffect(() => {
        get_all_employees()
     }, []);


    useEffect(() => {
        get_categories();
    }, []);


    

    useEffect(() => {
      // get_all_nearby_monthly_service();
    }, []);

    useEffect(() => {
        fetch_all_employer();
     }, []);

     useEffect(() => {
      //  fetch_all_nearby_employer();
     }, []);


    

    useEffect(() => {
        get_running_promotion();
     }, []);


     useEffect(() => {
        get_cart()
    }, []);

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


        if (item.name == "Promotion") {
            const data = {
                screen: "home"
            }
            navigation.navigate("MyPurchasedPromotionScreen", { page: data })
         
        }


      //  setSelectedItem(item);





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

    const renderRecentSearch = ({ item }) => {

        let skillsString;

        if(item.userSkills!=null){
             skillsString = item.userSkills.map(skill => skill.name).join(', ');
        }
       
        return(

        
        <TouchableOpacity onPress={() => {

                navigation.navigate("EmployeeDetailScreen", { user: item })

        }}>

            <View style={{ marginTop: 13, flexDirection: 'row', alignItems: 'center', marginStart: 10, marginEnd: 10, backgroundColor: Colors.light_puple,borderWidth:1,borderColor:Colors.gray, borderRadius: 10 }}>
                <View
                    style={{
                        width: 80,
                        height: 80,
                        padding:10,
                    
                        borderTopLeftRadius:10,
                        borderBottomLeftRadius:10,
                        backgroundColor: Colors.dark_blue,
                       
                        alignItems: 'center',
                        justifyContent: 'center', // Center the content vertically
                    }}
                >
                    <Image style={{ width: 50, height: 50 ,borderRadius:50}} source={{ uri: Remote.BASE_URL + item.profile }} />
                </View>
                    <View style={{ flex: 1, marginLeft: 14, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                         {item.customer_type=="employee" && (
                            <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}><Text style={{fontWeight:'light'}}>{t("Skills")} - </Text>{skillsString}</Text>

                         )}

                        {item.customer_type=="employer" && (
                            <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}><Text style={{fontWeight:'light'}}>{t("Profession Name")} - </Text>{item.profession_name}</Text>

                         )}
                        <View style={{flexDirection:'row',marginTop:4}}>
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

                            <View style={{marginStart:10,marginTop:15}}>
                                <View style={{flexDirection:'row'}}>
                                    <Image style={{ width: 13, height: 13,tintColor:Colors.navcolor,tintColor:Colors.dark_gray }} source={require('../../assets/images/like.png')}></Image>
                                    <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 12, marginStart: 5 }}>{item.liked_by.length}</Text>
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


    const get_cart = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_cart"

            // const queryParams = {
            //     category_id: category._id,

            // };

          

            // // Construct the URL with query parameters
            // const urlWithParams = `${apiUrl}?${new URLSearchParams(queryParams)}`;


            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();


                set_cart(data.cart.length);

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



    //api calls
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


                if(data.profile_details.gender==null){
                    const data = {
                        screen:""
                      }
                 
               
                  navigation.replace("RegistrationFormScreen", { page: data })
                }else if(data.profile_details.alternate_phone==null){
                    const data = {
                        screen:""
                      }
                 
               
                  navigation.replace("RegistrationFormScreen", { page: data })
                }else if(data.profile_details.state==null){
                    const data = {
                        screen:""
                      }
                 
               
                  navigation.replace("RegistrationFormScreen", { page: data })
                }else if(data.profile_details.district==null){
                    const data = {
                        screen:""
                      }
                 
               
                  navigation.replace("RegistrationFormScreen", { page: data })
                }else if(data.profile_details.city==null){
                    const data = {
                        screen:""
                      }
                 
               
                  navigation.replace("RegistrationFormScreen", { page: data })
                }

                if(data.profile_details.customer_type==null){
                    const data = {
                        screen:"not_updated"
                      }
                      
                      navigation.replace("ChooseEmployeeTypeScreen",{page:data})
                }



                if(data.profile_details.phone==null){
                    navigation.replace("SendOtpForResetPhoneScreen",{screen:"home"})
                }


                set_name(data.profile_details.name)
                set_image(data.profile_details.profile)

                setLoading(false)






            } else {
                console.error('Error:', response.status, response.statusText);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch errors:', error);
            setLoading(false)
        }





    };


    const get_categories = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "get_category"

            const queryParams = {
                size: 3,
                
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


    const get_all_nearby_employees = async (latitude,longitude) => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_employee"

            const queryParams = {
                size: 20,
                latitude:latitude,
                longitude:longitude,
        
               


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

                
              

                set_all_nearby_employee(data.employee);

                setLoading(false)






            } else {
                console.error('Errorss:', await response.json());
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };

    const get_all_nearby_daily_service = async (latitude,longitude) => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_employee"

            const queryParams = {
                daily_service: "daily",
                latitude:latitude,
                longitude:longitude,
                size:20
              


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
             

                set_all_nearby_daily_service_employee(data.employee);

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

    const get_all_nearby_monthly_service = async (latitude,longitude) => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_employee"

            const queryParams = {
                monthly_job: "monthly",
                latitude:latitude,
                longitude:longitude,
                size:20
              

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


                set_all_nearby_monthly_service_employee(data.employee);

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

    const update_lat_lon = async (latitude,longitude) => {



        try {

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/update_lat_lon";

            const userData = {
               latitude:latitude,
               longitude:longitude

            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
                body: JSON.stringify(userData),
            });


            const responsedata = await response.json();


            if (response.ok) {
                // Handle success
                // Toast.show({
                //     type: 'success',
                //     text1: responsedata.message,
                // });
                setLoading(false)
           



            } else {
                // Handle error
                Toast.show({
                    type: 'success',
                    text1: responsedata.error,
                });
                setLoading(false)

            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false)

        }





    };

    const get_all_employees = async (latitude, longitude) => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_employee"

            const queryParams = {
                size: 20,
              




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


                set_all_employee(data.employee);

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


    const fetch_all_nearby_employer = async (latitude,longitude) => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_employer"

            const queryParams = {
                size: 20,
                latitude:latitude,
                longitude:longitude,
        
               


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

                
              

                set_all_nearby_employer(data.employer);

                setLoading(false)






            } else {
                console.error('Errorss:', await response.json());
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };


    const fetch_all_employer = async (latitude, longitude) => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_employer"

            const queryParams = {
                size: 20,
              




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


                set_all_employer(data.employer);

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

    const get_running_promotion = async () => {
        


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_running_promotion"


            const queryParams = {
                type: "home",
              




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

            const data = await response.json();
            console.log(data)

            if (response.ok) {
           

                console.log("PAN",data.district)



      
                setBannerdata(data.admin);
                setBannerdata2(data.location)
                setBannerdata3(data.state)
         
                setBannerdata4(data.district)
                setBannerdata5(data.pan_india)
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

    const get_notification_count = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/notification_count"

            

            // Construct the URL with query parameters
          ;


            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });
    


            if (response.ok) {
                const data = await response.json();
                console.log("NOTIFICATION",data)
              

                set_notification_count(data.notification_length)
              
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



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>
        <View style={styles.container} >
            <StatusBar backgroundColor={Colors.blue} />


            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: Platform.OS=="android"?10:0, padding: 10,alignItems:'center' }}>
                    {get_image === null ? (
                        <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
                            <Image
                                style={{ width:40, height: 40, borderRadius: 50}}
                                source={require('../../assets/images/logo.png')}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => {
                                navigation.navigate("ProfileScreen")
                        }}>


                            <Image
                                style={{ width: 40, height: 40, borderRadius: 50 }}
                                source={{ uri: Remote.BASE_URL + get_image }} // Assuming photo is a valid URI
                            />
                        </TouchableOpacity>
                    )}
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text numberOfLines={1} style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20,maxWidth:150 }}>{get_name}</Text>
                        <TouchableOpacity onPress={()=>{
                                      navigation.navigate("MembershipHistoryScreen")
                        }}>

                         {Platform.OS=='android' && (
                            <Text style={{ color: Colors.white, fontWeight: 'medium', fontSize: 15 }}>{is_subscribed==false ? t("Not Subscribed") : t("Subscribed")}</Text>

                         )}
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', width: 150, marginTop: 10, padding: 10, justifyContent: 'space-between', alignSelf: 'flex-end' }}>

                    <TouchableOpacity onPress={()=>{
                         navigation.navigate("CartScreens")
                    }}>
                        <View>
                           <Image style={{ width: 24, height: 24,resizeMode:'contain' }} source={require('../../assets/images/cart.png')}></Image>
                            <Text style={{color:Colors.white,textAlign:'center',fontWeight:'bold',fontSize:9,bottom:16,backgroundColor:Colors.red,width:12,height:12}}>{cart}</Text>
                        </View>

                    </TouchableOpacity>

                     <TouchableOpacity onPress={()=>{
                            navigation.navigate("ChatRoomScreen")
                     }}>
                            <Image style={{ width: 24, height: 24, resizeMode: 'contain' }} source={require('../../assets/images/message.png')}></Image>

                     </TouchableOpacity>

                     <TouchableOpacity onPress={()=>{
                         navigation.navigate("NotificationScreen")
                     }}>
                     <View>
                           <Image style={{ width: 24, height: 24,resizeMode:'contain' }} source={require('../../assets/images/notification.png')}></Image>
                            <Text style={{color:Colors.white,textAlign:'center',fontWeight:'bold',fontSize:9,bottom:16,backgroundColor:Colors.red,width:12,height:12}}>{notification_count}</Text>
                        </View>

                     </TouchableOpacity>

                    </View>
                    

                    

                </View>

            </View>


            <ScrollView  refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      } style={{marginBottom:90}}>


               <TouchableOpacity  onPress={()=>{
                            navigation.navigate("SearchScreen")
                        }}>
                <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: Colors.grayview,
                            marginStart: 10,
                            marginTop: 14,
                            marginEnd: 10,
                            borderRadius: 5,
                            paddingLeft: 10,
                        }}
                    >
                        <Image source={require('../../assets/images/search.png')} style={{ width: 20, height: 20, marginRight: 5 }} />
                       

                       
                        <Text
                            
                            style={{ flex: 1,padding:15 }}

                        > Search with {addressParts[currentPartIndex]}
                        </Text>
                        
                    </View>


                </View>
                </TouchableOpacity>



                <View style={{flexDirection:'row',justifyContent:'space-between',width:'96%'}}>

                <TouchableOpacity onPress={()=>{
                  navigation.navigate("ContractScreen")
                }} >
                    <Text style={{fontSize:13,marginTop:10,marginStart:10,padding:8,borderRadius:10,borderColor:Colors.orange,borderWidth:2}}>{t("Contract Jobs")}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                 navigation.navigate("PurchasePromotionScreen")
                }}>
                    <Text style={{fontSize:13,marginTop:10,marginStart:10,padding:8,borderRadius:10,borderColor:Colors.orange,borderWidth:2}}>{t("Add Promotions")}</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={()=>{
                            navigation.navigate("HelpScreen")
                }} >
                    <Text style={{fontSize:13,marginTop:10,marginStart:10,padding:8,borderRadius:10,borderColor:Colors.orange,borderWidth:2}}>{t("Contact us")}</Text>
                </TouchableOpacity>
                </View>

               

                {/* <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',

                        marginTop: 14,
                        marginEnd: 10,
                        borderRadius: 5,
                        paddingLeft: 10,

                    }}
                >

                    <TextInput
                        placeholder="Search Location"
                        style={{flex: 3, backgroundColor: Colors.grayview, borderRadius: 10,padding:10 }} />
                    <TextInput
                        placeholder="25 km"
                        style={{ flex: 2, marginStart: 15, backgroundColor: Colors.grayview, borderRadius: 10,padding:10 }} />

                    <Image source={require('../../assets/images/back.png')} style={{ width: 32, height: 32, marginRight: 5, flex: 1, marginStart: 13, resizeMode: 'contain' }} />

                </View> */}

                <View style={{alignSelf:'center'}}>


<Carousel

    data={bannerData}

    renderItem={renderItem}
    sliderWidth={400}
    itemWidth={400}
    ref={isCarousel}
    autoplay={true}
    autoplayDelay={2000}
    // loop={true}
    onSnapToItem={(index) => setIndex(index)}
    removeClippedSubviews={true}
    containerCustomStyle={{
        flexGrow: 0,
        backgroundColor:Colors.white,
       
        marginTop: 10,


    }}



/>
<Pagination

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

/>
               </View>

                <View style={{ marginStart: 10, marginEnd: 10, marginTop: 20, flexDirection: 'row' }}>

                    <Text style={{ color: Colors.textcolor, fontSize: 15, fontWeight: 'medium', flex: 10, marginTop: 4 }}>{t("Job Categories")} </Text>
                   
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate("AllCategoryScreen")
                    }}>
                      <Image source={require('../../assets/images/next.png')} style={{ width: 18, height: 18, marginRight: 5, marginStart: 13, resizeMode: 'contain', flex: 1 }} />

                    </TouchableOpacity>
                




                </View>
                <View style={{ backgroundColor: Colors.dark_gray, height: 1, marginStart: 10, marginEnd: 10 }}>

                </View>


                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}



                <View style={{ height: 120 ,margin:10}}>

                    <FlatList

                        data={get_category}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={renderCategoryList}
                    />
                </View>


                {/* <View style={{ marginStart: 10, marginEnd: 10, marginTop: 10, flexDirection: 'row' }}>

                    <Text style={{ color: Colors.textcolor, fontSize: 15, fontWeight: 'medium', flex: 10, marginTop: 4 }}>Service Categories</Text>
                    <Image source={require('../../assets/images/next.png')} style={{ width: 32, height: 32, marginRight: 5, marginStart: 13, resizeMode: 'center', flex: 1 }} />





                </View>
                <View style={{ backgroundColor: Colors.dark_gray, height: 1, marginStart: 10, marginEnd: 10 }}>

                </View>

                <View style={{ height: 120 }}>

                    <FlatList

                  
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderCategoryList}
                    />
                </View> */}

                {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Latitude: {location?.latitude || 'N/A'}</Text>
                    <Text>Longitude: {location?.longitude || 'N/A'}</Text>
                    <Button title="Get Location" onPress={requestLocationPermission} />
                    {error && <Text style={{ color: 'red' }}>{error}</Text>}
                </View>



                <View style={{ marginStart: 10, marginEnd: 10, marginTop: 10, flexDirection: 'row' }}>

                    <Text style={{ color: Colors.textcolor, fontSize: 15, fontWeight: 'medium', flex: 10, marginTop: 4 }}>Daily Services Near me</Text>
                    <Text style={{ marginStart: 13, flex: 3, width: 120, backgroundColor: Colors.dark_gray, padding: 3, textAlign: 'center' }}>view all</Text>

                </View>
                <View style={{ backgroundColor: Colors.dark_gray, height: 1, marginStart: 10, marginEnd: 10 }}>

                </View> */}

{/* 
                <View>

                    <FlatList

                        data={get_all_nearby_daily_service_employee}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={renderRecentSearch}
                        scrollEnabled={false}
                    />
                </View> */}






                {/* <View style={{ marginStart: 10, marginEnd: 10, marginTop: 10, flexDirection: 'row' }}>

                    <Text style={{ color: Colors.textcolor, fontSize: 15, fontWeight: 'medium', flex: 10, marginTop: 4 }}>Monthly Services Near me</Text>
                    <Text style={{ marginStart: 13, flex: 3, width: 120, backgroundColor: Colors.dark_gray, padding: 3, textAlign: 'center' }}>view all</Text>

                </View>
                <View style={{ backgroundColor: Colors.dark_gray, height: 1, marginStart: 10, marginEnd: 10 }}>

                </View>


                <View>

                    <FlatList

                        data={get_all_nearby_monthly_service_employee}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={renderRecentSearch}
                        scrollEnabled={false}
                    />
                </View> */}

{/* <View style={{alignSelf:'center'}}>


<Carousel

    data={bannerData2}

    renderItem={renderItem}
    sliderWidth={400}
    itemWidth={400}
    ref={isCarousel2}
    autoplay={true}
    autoplayDelay={2000}
    // loop={true}
    onSnapToItem={(index2) => setIndex2(index2)}
    removeClippedSubviews={true}
    containerCustomStyle={{
        flexGrow: 0,
        backgroundColor:Colors.white,
       
        marginTop: 10,


    }}



/>
<Pagination

    dotsLength={bannerData2.length}
    activeDotIndex={index2}
    containerStyle={{ paddingVertical: 10 }}
    carouselRef={isCarousel2}
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

/>
               </View> */}


                <View style={{marginStart:10,marginEnd:10}}>

                <FlatList
                  
                
                    data={bannerData2}
                    horizontal
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderPromotion}
                   
                />
                </View>


                <View style={{ marginStart: 10, marginEnd: 10, marginTop: 10, flexDirection: 'row' }}>

                    <Text style={{ color: Colors.textcolor, fontSize: 15, fontWeight: 'medium', flex: 10, marginTop: 4 }}>{t("Employee Near me")}</Text>
                    <TouchableOpacity onPress={()=>{
                        if(latitude!='' && longitude!=''){
                            const item = {
                                latitude:latitude,
                                longitude:longitude,
                                page:"home",
                                name:"All Employees near me"
                            }
                            navigation.navigate("JobsScreen", { category: item })
                        }
                      
                    }}>
                    <Text style={{ marginStart: 13, flex: 3, width: 120, backgroundColor: Colors.blue, padding: 3, textAlign: 'center',color:Colors.white }}>{t("View all")}</Text>

                    </TouchableOpacity>

                </View>
                <View style={{ backgroundColor: Colors.dark_gray, height: 1, marginStart: 10, marginEnd: 10 }}>

                </View>


                <View>

                    <FlatList

                        data={get_all_nearby_employee}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={renderRecentSearch}
                        scrollEnabled={false}
                    />
                </View>


                {/* <View style={{alignSelf:'center'}}>


<Carousel

    data={bannerData3}

    renderItem={renderItem}
    sliderWidth={400}
    itemWidth={400}
    ref={isCarousel3}
    autoplay={true}
    autoplayDelay={2000}
    // loop={true}
    onSnapToItem={(index3) => setIndex3(index3)}
    removeClippedSubviews={true}
    containerCustomStyle={{
        flexGrow: 0,
        backgroundColor:Colors.white,
       
        marginTop: 10,


    }}



/>
<Pagination

    dotsLength={bannerData3.length}
    activeDotIndex={index3}
    containerStyle={{ paddingVertical: 10 }}
    carouselRef={isCarousel3}
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

/>
               </View> */}


              <View style={{marginStart:10,marginEnd:10,marginTop:10}}>

                <FlatList

                    data={bannerData3}
                    horizontal
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderPromotion}
             
                />
                </View>

                <View style={{ marginStart: 10, marginEnd: 10, marginTop: 10, flexDirection: 'row' }}>

                    <Text style={{ color: Colors.textcolor, fontSize: 15, fontWeight: 'medium', flex: 10, marginTop: 4 }}>{t("All Employees")}</Text>
                    <TouchableOpacity onPress={()=>{
                         const item = {
                            page:"home",
                            name:"All Employees"
                        }
                        navigation.navigate("JobsScreen", { category: item })
                    }}>
                    <Text style={{ marginStart: 13, flex: 3, width: 120, backgroundColor: Colors.blue, padding: 3, textAlign: 'center' ,color:Colors.white}}>{t("View all")}</Text>

                    </TouchableOpacity>

                </View>
                <View style={{ backgroundColor: Colors.dark_gray, height: 1, marginStart: 10, marginEnd: 10 }}>

                </View>


                <View>

                    <FlatList

                        data={get_all_employee}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={renderRecentSearch}
                        scrollEnabled={false}
                    />
                </View>


              
                <View style={{marginStart:10,marginEnd:10,marginTop:10}}>

                <FlatList

                    data={bannerData4}
                    horizontal
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderPromotion}
                 
                />
                </View>


                <View style={{ marginStart: 10, marginEnd: 10, marginTop: 10, flexDirection: 'row' }}>

                    <Text style={{ color: Colors.textcolor, fontSize: 15, fontWeight: 'medium', flex: 10, marginTop: 4 }}>{t("Employers near me")}</Text>
                    <TouchableOpacity onPress={()=>{
                          if(latitude!='' && longitude!=''){
                            const item = {
                                latitude:latitude,
                                longitude:longitude,
                                page:"home",
                                name:"All Employers near me"
                            }
                            navigation.navigate("JobsScreen", { category: item })
                        }
                    }}>
                    <Text style={{ marginStart: 13, flex: 3, width: 120, backgroundColor: Colors.blue, padding: 3, textAlign: 'center',color:Colors.white }}>{t("View all")}</Text>

                    </TouchableOpacity>

                    </View>
                    <View style={{ backgroundColor: Colors.dark_gray, height: 1, marginStart: 10, marginEnd: 10 }}>

                    </View>


                    <View>

                    <FlatList

                        data={get_all_nearby_employer}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={renderRecentSearch}
                        scrollEnabled={false}
                    />
                    </View>


                 
              <View style={{marginStart:10,marginEnd:10,marginTop:10}}>

                    <FlatList

                        data={bannerData5}
                        horizontal
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={renderPromotion}
                
                    />
                    </View>



                    


                    <View style={{ marginStart: 10, marginEnd: 10, marginTop: 10, flexDirection: 'row' }}>

                    <Text style={{ color: Colors.textcolor, fontSize: 15, fontWeight: 'medium', flex: 10, marginTop: 4 }}>{t("All Employers")}</Text>
                    <TouchableOpacity onPress={()=>{
                          const item = {
                         
                            page:"home",
                            name:"All Employers"
                        }
                        navigation.navigate("JobsScreen", { category: item })
                    }}>
                    <Text style={{ marginStart: 13, flex: 3, width: 120, backgroundColor: Colors.blue,color:Colors.white, padding: 3, textAlign: 'center' ,color:Colors.white}}>{t("View all")}</Text>

                    </TouchableOpacity>

                    </View>
                    <View style={{ backgroundColor: Colors.dark_gray, height: 1, marginStart: 10, marginEnd: 10 }}>

                    </View>


                    <View>

                    <FlatList

                        data={get_all_employer}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={renderRecentSearch}
                        scrollEnabled={false}
                    />
                    </View>






            </ScrollView>


            <View style={{
                    position: 'absolute',
                    bottom: 0,
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
            </View>
         
            




        </View>
        </SafeAreaView>
    )





}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Colors.white
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
    topbar: {
        backgroundColor: Colors.blue,
        height: Platform.OS=="android"?85:85,

    },
    cat_item: {
        flexDirection: 'coloumn',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
        margin: 3,
        width: 97,
        marginTop: 10,
        height: 97,
       
        alignItems: 'center'

    },
    cat_item_font: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    bannerImage: {
        padding: 10,
        width: 370,
        height: 120,
        borderRadius:10,
        alignSelf:'center'


    },

})



export default HomeScreen