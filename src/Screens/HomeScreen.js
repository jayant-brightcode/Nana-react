import React, { useState,useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback, TouchableHighlight,StatusBar,ActivityIndicator } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';



const bottomNavBar = [
    { id: 1, name: 'Home',icon:require('../../assets/images/home.png') },
    { id: 2, name: 'Offer', icon: require('../../assets/images/offer.png') },
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
    const [selectedScreen, setSelectedScreen] = useState('Home'); // Set the initial selected screen
    const [loading, setLoading] = useState(false);
  
    const [selectedItem, setSelectedItem] = useState(bottomNavBar[0]);
    const [get_name, set_name] = useState('Nana Udyog');

    const [get_category, set_category] = useState([]);
    const [get_all_nearby_employee, set_all_nearby_employee] = useState([]);
    const [get_all_nearby_daily_service_employee, set_all_nearby_daily_service_employee] = useState([]);
    const [get_all_nearby_monthly_service_employee, set_all_nearby_monthly_service_employee] = useState([]);
    useEffect(() => {
        get_categories();
    }, []);
    useEffect(() => {
        get_all_nearby_employees();
    }, []);

    useEffect(() => {
        get_all_nearby_daily_service();
    }, []);

    useEffect(() => {
       get_all_nearby_monthly_service();
    }, []);

    useEffect(() => {
       getProfile();
    }, []);

    const handleItemPress = (item) => {
        setSelectedItem(item);
        Toast.show({
            type: 'success',
            text1: `Selected Plan: ${item.name}`,
        });
        

        if (item.name == "Offer") {
            navigation.navigate("OfferScreen")
        }

        if (item.name == "Categories") {
            navigation.navigate("AllCategoryScreen")
        }




    };


    const renderPlanItem = ({ item }) => (

        <TouchableOpacity onPress={() => {
            
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
                    source={{ uri: Remote.BASE_URL+item.image }}
                    style={{ width: 40, height: 40 }}
                />
                <Text style={{marginTop:8,fontSize:12,textAlign:'center'}}>{item.name}</Text>
           
            </View>
        </TouchableOpacity>

        


    );

    const renderRecentSearch = ({ item }) => {
        const skillsString = item.userSkills.map(skill => skill.name).join(', ');
        return(

        
        <TouchableOpacity onPress={() => {

                navigation.navigate("EmployeeDetailScreen", { user: item })

        }}>

            <View style={{ marginTop: 13, flexDirection: 'row', alignItems: 'center', marginStart: 10, marginEnd: 10, backgroundColor: Colors.grayview, borderRadius: 10 }}>
                <View
                    style={{
                        width: 50,
                        height: 80,
                        borderTopLeftRadius:10,
                        borderBottomLeftRadius:10,
                        backgroundColor: item.cols,
                        alignItems: 'center',
                        justifyContent: 'center', // Center the content vertically
                    }}
                >
                    <Image style={{ width: 50, height: 50, resizeMode: 'center' }} source={{ uri: Remote.BASE_URL + item.profile }} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                    
                    <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>Skills - {skillsString}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>Job Preference - {item.jobPref.name}</Text>
                </View>
                <View style={{ flex: 0, justifyContent: 'flex-end', marginRight: 10 }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/next.png')} />
                </View>
            </View>
        </TouchableOpacity>


    )};






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


                set_name(data.profile_details.name)

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


    const get_all_nearby_employees = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_employee"

            const queryParams = {
                size: 2,

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
                console.error('Error:', response.status, response.statusText);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };

    const get_all_nearby_daily_service = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_employee"

            const queryParams = {
                daily_service: "daily",

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

    const get_all_nearby_monthly_service = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_employee"

            const queryParams = {
                monthly_job: "monthly",

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


    return (
        <View style={styles.container} >
            <StatusBar backgroundColor={Colors.blue} />


            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: 10, padding: 10 }}>
                    <TouchableOpacity onPress={() => {
                        
                        navigation.navigate("ProfileScreen")
                    }}>
                    <Image style={{ width: 40, height: 40,resizeMode:'contain',marginTop:5}} source={require('../../assets/images/profile.png')} ></Image></TouchableOpacity>
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>{get_name}</Text>
                        <Text style={{ color: Colors.white, fontWeight: 'medium', fontSize: 15 }}>Subscribed</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: 100, marginTop: 10, padding: 10, justifyContent: 'space-between', alignSelf: 'flex-end' }}>

                        <Image style={{ width: 24, height: 24 ,resizeMode:'contain'}} source={require('../../assets/images/message.png')}></Image>
                        <Image style={{ width: 24, height: 24,resizeMode:'contain' }} source={require('../../assets/images/notification.png')}></Image>

                    </View>

                </View>

            </View>


            <ScrollView style={{marginBottom:90}}>



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
                        <TextInput
                            placeholder="search here"
                            style={{ flex: 1,padding:10 }}

                        />
                    </View>


                </View>

                <View
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

                </View>

                <View style={{ marginStart: 10, marginEnd: 10, marginTop: 20, flexDirection: 'row' }}>

                    <Text style={{ color: Colors.textcolor, fontSize: 15, fontWeight: 'medium', flex: 10, marginTop: 4 }}>Job Categories</Text>
                    <Image source={require('../../assets/images/next.png')} style={{ width: 18, height: 18, marginRight: 5, marginStart: 13, resizeMode: 'contain', flex: 1 }} />





                </View>
                <View style={{ backgroundColor: Colors.dark_gray, height: 1, marginStart: 10, marginEnd: 10 }}>

                </View>


                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}



                <View style={{ height: 120 }}>

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



                <View style={{ marginStart: 10, marginEnd: 10, marginTop: 10, flexDirection: 'row' }}>

                    <Text style={{ color: Colors.textcolor, fontSize: 15, fontWeight: 'medium', flex: 10, marginTop: 4 }}>Daily Services Near me</Text>
                    <Text style={{ marginStart: 13, flex: 3, width: 120, backgroundColor: Colors.dark_gray, padding: 3, textAlign: 'center' }}>view all</Text>

                </View>
                <View style={{ backgroundColor: Colors.dark_gray, height: 1, marginStart: 10, marginEnd: 10 }}>

                </View>


                <View>

                    <FlatList

                        data={get_all_nearby_daily_service_employee}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={renderRecentSearch}
                        scrollEnabled={false}
                    />
                </View>






                <View style={{ marginStart: 10, marginEnd: 10, marginTop: 10, flexDirection: 'row' }}>

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
                </View>


                <View style={{ marginStart: 10, marginEnd: 10, marginTop: 10, flexDirection: 'row' }}>

                    <Text style={{ color: Colors.textcolor, fontSize: 15, fontWeight: 'medium', flex: 10, marginTop: 4 }}>Employees Near me</Text>
                    <Text style={{ marginStart: 13, flex: 3, width: 120, backgroundColor: Colors.dark_gray, padding: 3, textAlign: 'center' }}>view all</Text>

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
    )





}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
        height: 80,

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
        backgroundColor: Colors.grayview,
        alignItems: 'center'

    },
    cat_item_font: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
    },

})



export default HomeScreen