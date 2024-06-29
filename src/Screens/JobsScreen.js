import React, { useState,useEffect } from 'react'

import { RefreshControl,View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView ,ActivityIndicator, SafeAreaView} from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { useRoute } from '@react-navigation/native';
import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import { Rating, AirbnbRating } from 'react-native-ratings';
import EmptyState from '../component/NoData';
import { useTranslation } from 'react-i18next';




const jobs_list = [
    { id: 1, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Web Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 2, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'IOS Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.pink },
    { id: 3, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Android Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 4, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Blockchain Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.pink },
    { id: 5, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Web Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 6, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'IOS Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.pink },
    { id: 7, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Android Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.fadeOrange },
    { id: 8, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Blockchain Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.pink },
    { id: 9, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Web Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 10, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'IOS Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.pink },
    { id: 11, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Android Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 12, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Blockchain Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.pink },

]


const JobsScreen = ()=>{
    const navigation = useNavigation()
    const route = useRoute();
    const { category } = route.params

    const [get_category, set_category] = useState([])
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const { t, i18n } = useTranslation();

    const changeLanguage = (language) => {
     i18n.changeLanguage(language);
   };

    const onRefresh = () => {
        setRefreshing(true)
        if(category.page==null || category.page=='undefine'){
            get_employee_by_category();
            }else if(category.page=="home" && category.name=="All Employees near me"){
                get_all_nearby_employees(category.latitude, category.longitude)
            }else if(category.page=="home" && category.name=="All Employees"){
                get_all_employees()
            }else if(category.page=="home" && category.name=="All Employers near me"){
               
                fetch_all_nearby_employer(category.latitude, category.longitude)
            }
            else if(category.page=="home" && category.name=="All Employers"){
               
                fetch_all_employer()
            }
        setRefreshing(false);
        
      };
      useEffect(() => {
        fetchLanguage()
      
         }, []);

   
        useEffect(() => {
            if(category.page==null || category.page=='undefine'){
            get_employee_by_category();
            }else if(category.page=="home" && category.name=="All Employees near me"){
                get_all_nearby_employees(category.latitude, category.longitude)
            }else if(category.page=="home" && category.name=="All Employees"){
                get_all_employees()
            }else if(category.page=="home" && category.name=="All Employers near me"){
               
                fetch_all_nearby_employer(category.latitude, category.longitude)
            }
            else if(category.page=="home" && category.name=="All Employers"){
               
                fetch_all_employer()
            }
         }, []);

       
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
   
    // const renderJobItem = ({ item }) => { 
        
    //     let skillsString="";

    //     if(item.userSkills!=null){
    //          skillsString = item.userSkills.map(skill => skill.name).join(', ');
    //     }
    //     console.log(item)
         

        
    //     return (
    //     <TouchableOpacity onPress={() => {
    //         navigation.navigate("EmployeeDetailScreen", { user: item })
    //     }}>

    //         <View style={{backgroundColor: Colors.white,borderWidth:1,borderColor:Colors.gray, marginTop: 13, flexDirection: 'row', alignItems: 'center', marginStart: 10, marginEnd: 10, borderRadius: 10 }}>
    //             <View
    //                 style={{
    //                     width: 80,
    //                     height: 80,
    //                     borderTopLeftRadius: 10,
    //                     borderBottomLeftRadius: 10,
    //                     backgroundColor: Colors.dark_blue,
    //                     alignItems: 'center',
                       
    //                     justifyContent: 'center', // Center the content vertically
    //                 }}
    //             >
    //                     <Image style={{ width: 50, height: 50, borderRadius:50 }} source={{ uri: Remote.BASE_URL + item.profile }} />
    //             </View>
    //                 <View style={{ flex: 1, marginLeft: 14, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
    //                     <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
    //                     {item.customer_type=="employee" && (
    //                         <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}><Text style={{fontWeight:'light'}}>Skills - </Text>{skillsString}</Text>

    //                      )}

    //                     {item.customer_type=="employer" && (
    //                         <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}><Text style={{fontWeight:'light'}}>Profession Name - </Text>{item.profession_name}</Text>

    //                      )}
    //                     <View style={{ flexDirection: 'row', marginTop: 4 }}>
    //                         <View>
    //                             <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 9 }}>Rating</Text>
    //                             <AirbnbRating
    //                                 count={5}
    //                                 reviews={['Terrible', 'Bad', 'Good', 'Great', 'Excellent']}
    //                                 defaultRating={item.avg_rating}
    //                                 size={12}
    //                                 showRating={false}
    //                                 isDisabled={true}
    //                             />
    //                         </View>

    //                         <View style={{ marginStart: 10, marginTop: 15 }}>
    //                             <View style={{ flexDirection: 'row' }}>
    //                                 <Image style={{ width: 13, height: 13, tintColor: Colors.navcolor,tintColor:Colors.dark_gray }} source={require('../../assets/images/like.png')}></Image>
    //                                 <Text style={{ color: Colors.black, fontWeight: 'bold', fontSize: 12, marginStart: 5 }}>{item.liked_by.length}</Text>
    //                             </View>


    //                         </View>
    //                     </View>

    //                 </View>
    //             <View style={{ flex: 0, justifyContent: 'flex-end', marginRight: 10 }}>
    //                 <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/next.png')} />
    //             </View>
    //         </View>
    //     </TouchableOpacity>


    // )};


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


                set_category(data.employer);

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

                
              

                set_category(data.employer);

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


    const get_employee_by_category = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_employee"

            const queryParams = {
                category_id: category._id,

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


                set_category(data.employee);

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

                
              
                set_category(data.employee);
              

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

    const get_all_employees = async (latitude, longitude) => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_employee"

            const queryParams = {
           
              




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


                set_category(data.employee);

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
            <View style={{ flexDirection: 'row', marginTop: Platform.OS=="android"?10:0, padding: 10, alignItems: 'center' }}>
            <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                    }}>
                                            <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>  
                     <View style={{ marginStart: 15, flex: 1 }}>
                    <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>{category.name}</Text>

                </View>

                


            </View>
            <TouchableOpacity  onPress={()=>{
                            navigation.navigate("SearchScreen")
                        }}>
                <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: Colors.white,
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

                        >search here</Text>
                        
                    </View>


                </View>
                </TouchableOpacity>

        </View>


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View style={{marginBottom:'35%'}}>

                <FlatList

                    data={get_category}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            </View>

            {get_category.length==0 && (
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
    topbar: {
        backgroundColor: Colors.blue,
        height: 130,

    }




})



export default JobsScreen