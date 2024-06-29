import React, { useState,useEffect } from 'react'

import { RefreshControl,View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback, TouchableHighlight,ActivityIndicator, Platform, SafeAreaView} from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { Remote } from '../Utils/Remote';
import { getToken } from '../Utils/LocalStorage';
import EmptyState from '../component/NoData';





const NotificationScreen = ()=>{


    const navigation = useNavigation()
    const [notification,set_notification] = useState([])
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [request, set_request] = useState(null);
    

    useEffect(() => {
        getNotification()
    }, []);


    const get_payment_serice_for_attendance = async (id) => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_work_details"


            const queryParams = {
                payment_service_id: id,

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

                console.log(JSON.stringify(data.work_details))

            


                set_request(data.service_details);
                console.log("FFGFGFGGGG",data.service_details)

                navigation.navigate("AttendaceScreen",{detail:data.service_details})


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


    const NotificationStatus = async (id,item) => {



        try {

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/update_notification_status";

            const userData = {
                notification_id: id,

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
                console.log(responsedata)
                
                setLoading(false)
                if(item.action==="sent_leave_application"){
                    navigation.navigate("LeaveApplicationScreen")
                  }else  if(item.action==="leave_approved"){
                    navigation.navigate("LeaveApplicationScreen")
                  }else  if(item.action==="message_recived"){
                    navigation.navigate("ChatRoomScreen")
                  }else if(item.action==="job_request"){
                    const data = {
                        page:"notification",
                        id:item.supported_id
                    }
                    navigation.navigate("TempJobScreen",{cred:data})
                  }else if(item.action=="attendance"){
                    get_payment_serice_for_attendance(item.supported_id)
                  }
                  
        
                



            } else {
                // Handle error
               
                setLoading(false)
                if(item.action==="sent_leave_application"){
                    navigation.navigate("LeaveApplicationScreen")
                  }else  if(item.action==="leave_approved"){
                    navigation.navigate("LeaveApplicationScreen")
                  }else  if(item.action==="message_recived"){
                    navigation.navigate("ChatRoomScreen")
                  }else if(item.action==="job_request"){
                    const data = {
                        page:"notification",
                        id:item.supported_id
                    }
                    navigation.navigate("TempJobScreen",{cred:data})
                  }else if(item.action=="attendance"){
                    get_payment_serice_for_attendance(item.supported_id)
               }
        

            }
        } catch (error) {
          
            setLoading(false)
            if(item.action==="sent_leave_application"){
                navigation.navigate("LeaveApplicationScreen")
              }else  if(item.action==="leave_approved"){
                navigation.navigate("LeaveApplicationScreen")
              }else  if(item.action==="message_recived"){
                navigation.navigate("ChatRoomScreen")
              }else if(item.action==="job_request"){
                const data = {
                    page:"notification",
                    id:item.supported_id
                }
                navigation.navigate("TempJobScreen",{cred:data})
              }else if(item.action=="attendance"){
                get_payment_serice_for_attendance(item.supported_id)
             }
    

        }





    };
    const onRefresh = () => {
        setRefreshing(true);
        getNotification()
       
        setRefreshing(false);
      
        
      };

    const renderNotification = ({ item }) => (
        <TouchableOpacity onPress={() => {

          //  navigation.navigate("JobsScreen", { category: item })

        //   if(item.action==="job_request_send"){
        //       navigation.navigate("JobRequestScreen")
        //   }

        //   if(item.action==="job_request_cancelled"){
        //     navigation.navigate("JobRequestScreen")

        //   }


        if(item.is_seen==false){
            NotificationStatus(item._id,item)

        }else{
            if(item.action==="sent_leave_application"){
                navigation.navigate("LeaveApplicationScreen")
              }else  if(item.action==="leave_approved"){
                navigation.navigate("LeaveApplicationScreen")
              }else  if(item.action==="message_recived"){
                navigation.navigate("ChatRoomScreen")
              }else if(item.action==="job_request"){
                const data = {
                    page:"notification",
                    id:item.supported_id
                }
                navigation.navigate("TempJobScreen",{cred:data})
              }else if(item.action=="attendance"){
                   get_payment_serice_for_attendance(item.supported_id)
              }
        }

     

      

        }}>

            <View style={{flexDirection:'row',backgroundColor:item.is_seen?Colors.grayview:Colors.white,margin:10,padding:20,borderRadius:10}}>
                <Image
                    source={{ uri: Remote.BASE_URL + item.from.profile }}
                    style={{ width: 40, height: 40,borderRadius:100}}
                />

                <View style={{flexDirection:'column',marginStart:10,marginEnd:19}}>
                   <Text style={{color:Colors.textcolor,fontWeight:'bold'}}>{item.title}</Text>
                   <Text >{item.body}</Text>
                   <Text style={{color:Colors.black,fontSize:12,top:8}}>{new Date(item.createdAt).toDateString()}     {new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>

                </View>

              


            
            </View>
        </TouchableOpacity>


    );

    const getNotification = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_notification"

         


            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();

                console.log(data.notification)


                set_notification(data.notification);

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
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Notifications</Text>

                    </View>


                </View>

            </View>


            <View style={{flex:1}}>


                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}

                <FlatList
                     
                    data={notification}
                   
                  
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderNotification}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                      }
                />
            </View>


            {notification.length==0 && (
                 <EmptyState
                 title="No Data Found"
                 description="All Notification will be display here"
               />
            )}

        </View>

        </SafeAreaView>
    )



}


const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:Colors.white
    },

    topbar: {
        backgroundColor: Colors.blue,
        height: 70,

    },

})


export default NotificationScreen