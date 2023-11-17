import React, { useState,useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView,ActivityIndicator } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { Rating, AirbnbRating } from 'react-native-ratings';
import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';





const ProfileScreen = () => {

    const navigation = useNavigation()

    const [loading, setLoading] = useState(false);

    const [get_name, set_name] = useState('Nana Udyog');



    useEffect(() => {
        getProfile();
    }, []);

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

    return (
        <View style={{ flex: 1 }}>


            <View style={{ height: 220, backgroundColor: Colors.blue, borderBottomLeftRadius: 200, borderBottomRightRadius: 200 }}>


                <View style={{ height: 50, position: 'absolute', start: 20, top: 10 }}>
                    <Text style={{ color: Colors.white }}>Rating</Text>
                    <AirbnbRating
                        count={5} // Number of rating items
                        reviews={['Terrible', 'Bad', 'OK', 'Good', 'Great']} // Optional review text
                        defaultRating={3} // The rating to display (adjust as needed)
                        size={15} // Size of the rating items
                        showRating={false} // Set to false to hide the rating value
                    />
                </View>

                <View style={{ alignItems: 'center', top: 20 }}>
                    <Image style={{ width: 100, height: 100 }} source={require('../../assets/images/profile.png')}></Image>
                    <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 18 }}>{get_name}</Text>
                    <Text style={{ color: Colors.white, fontWeight: 'light', fontSize: 14 }}>Subscribed</Text>


                </View>

                <View style={{ flexDirection: 'row', height: 50, width: 50, alignItems: 'center', position: 'absolute', right: 20 }}>
                    <Image style={{ width: 23, height: 23 }} source={require('../../assets/images/like.png')}></Image>
                    <Text style={{ color: Colors.white, fontWeight: 'light', fontSize: 14, marginTop: 3, marginStart: 3 }}>36</Text>

                </View>




            </View>

            <ScrollView style={{ top: '5%' }}>
              
            <View >
                <View style={{flexDirection:'row',alignItems:'center',margin:10}}>
                    <Text style={{flex:3,color:Colors.textcolor,fontWeight:'medium',fontSize:17}}>Job Request</Text>
                    <TouchableOpacity style={{backgroundColor:Colors.blue,padding:10,borderRadius:10,width:80}} onPress={()=>{
                            navigation.navigate("JobRequestScreen")
                    }}>
                        <Text style={{textAlign:'center',color:Colors.white,fontSize:10}}>View</Text>
                    </TouchableOpacity>
                  

                </View>
                <View style={{height:2,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10}}/>

                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                    <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Professional Skill</Text>
                    <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                            navigation.navigate("ChooseSkillScreen")
                    }}>
                        <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View</Text>
                    </TouchableOpacity>
                 

                </View>
                <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />

                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                    <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Notification</Text>
                    <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }}>
                        <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80, marginStart: 10 }}>
                        <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Edit</Text>
                    </TouchableOpacity>

                </View>
                <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />

                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                    <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Membership History</Text>
                    <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }}>
                        <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80, marginStart: 10 }}>
                        <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Edit</Text>
                    </TouchableOpacity>

                </View>
                <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />


                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                    <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Chat board</Text>
                    <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }}>
                        <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80, marginStart: 10 }}>
                        <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Edit</Text>
                    </TouchableOpacity>

                </View>
                <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />


                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                    <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Wallet History</Text>
                    <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }}>
                        <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80, marginStart: 10 }}>
                        <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Edit</Text>
                    </TouchableOpacity>

                </View>
                <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />


                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                    <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Recent Activity</Text>
                    <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }}>
                        <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80, marginStart: 10 }}>
                        <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Edit</Text>
                    </TouchableOpacity>

                </View>
                <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />


                <View style={{ margin: 10 }}>
                    <Text style={{  color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Work</Text>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                            navigation.navigate("WorkDetailScreen")
                        }}>
                            <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Monthly</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80, marginStart: 10 }} onPress={() => {
                            navigation.navigate("WorkDetailScreen")
                        }}>
                            <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Daily</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80, marginStart: 10 }} onPress={() => {
                            navigation.navigate("WorkDetailScreen")
                        }}>
                            <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Yearly</Text>
                        </TouchableOpacity>
                    </View>


                </View>
                <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />


            </View>
            </ScrollView>









        </View>
    )

}


export default ProfileScreen