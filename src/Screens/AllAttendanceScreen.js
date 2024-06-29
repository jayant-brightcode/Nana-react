import React, { useState, useEffect } from 'react'

import {RefreshControl,Modal, TextInput,Alert,View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { useRoute } from '@react-navigation/native';
import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import DateTimePicker from '@react-native-community/datetimepicker'
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


const AllAttendanceScreen = () => {
    const navigation = useNavigation()
   

    const [attendance, set_attendance] = useState([])
    const [loading, setLoading] = useState(false);
    const [chosenDate, setChosenDate] = useState(new Date());
    const [chosenDate2, setChosenDate2] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDatePicker2, setShowDatePicker2] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [cancel_reason,set_cancel_reason] =useState('')
    const [cancel_dialog,set_cancel_dialog] =useState(false)
    const [attendacnce_item,set_attendance_item] = useState(null)
    const onDateChange = (event, selectedDate) => {
        if (event.type === 'set') {
            setChosenDate(selectedDate);
       
            setShowDatePicker(false);
            
 
        } else {
            setShowDatePicker(false);
        }
    };

    const onDateChange2 = (event, selectedDate) => {
        if (event.type === 'set') {
            setChosenDate2(selectedDate);
       
            setShowDatePicker2(false);
            
 
        } else {
            setShowDatePicker2(false);
        }
    };

    const openDatePicker = () => {
        setShowDatePicker(true);
    };

    const openDatePicker2 = () => {
        setShowDatePicker2(true);
    };
    useEffect(() => {
        get_attendance();
        fetchLanguage()
    }, []);

    const onRefresh = () => {
        setRefreshing(true)
        get_attendance()
        setRefreshing(false);
        
      };
   


  
   
    const renderJobItem = ({ item }) => {

     


        let skillsString="";

        if(item.job_request_id.skills!=null){
             skillsString = item.job_request_id.skills.map(skill => skill.name).join(', ');
        }



        return (
            <View>

          

            

              

            <View style={{orderRadius:10,borderWidth:1,borderColor:Colors.orange, marginTop: 13, marginStart: 10, marginEnd: 10, backgroundColor: Colors.white, borderRadius: 10,padding:10 }}>
     

            <View style={{flexDirection:'row',justifyContent:'space-between',marginStart:10,marginEnd:10}}>
   
      
   <Text style={{fontWeight:'400',fontSize:14,color:Colors.black}}>{t('Attendance By')}</Text>
   <Text style={{fontWeight:'400',fontSize:14,color:Colors.black}}>{item.from_user_id.name}</Text>
   
</View> 



<View style={{flexDirection:'row',justifyContent:'space-between',marginTop:4,marginStart:10,marginEnd:10}}>


<Text style={{fontWeight:'400',fontSize:14,color:Colors.black}}>{t('Attendance To')}</Text>
<Text style={{fontWeight:'400',fontSize:14,color:Colors.black}}>{item.to_user_id.name}</Text>

</View> 

<View style={{height:1,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10,marginTop:10}}>

</View>


<Text style={{marginStart:10,fontSize:13,fontWeight:'bold',color:Colors.black,marginTop:10}}>{t('Job Description')}</Text>
<Text style={{marginStart:10,fontSize:15,color:Colors.textcolor}}>{item.job_request_id.desc}</Text>
<View style={{height:1,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10,marginTop:10}}>

</View>
<Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>{t('Working for skill')}</Text>
<Text style={{marginStart:10,fontSize:15,color:Colors.orange}}>{skillsString}</Text>

<View style={{height:1,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10,marginTop:10}}>

</View>


<View style={{flexDirection:'row',justifyContent:'space-between'}}>
<Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>{t('Attendance Date')}</Text>
<Text style={{marginEnd:10,marginTop:10}}>{new Date(item.date).toDateString()}</Text>


</View>

<View style={{height:1,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10,marginTop:10}}>

</View>

<View style={{flexDirection:'row',justifyContent:'space-between'}}>
<Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>{t('Added Amount')}</Text>
<Text style={{marginEnd:10,marginTop:10,fontWeight:'bold'}}>Rs. {item.amount}</Text>


</View>

<View style={{height:1,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10,marginTop:10}}>

</View>


<View style={{flexDirection:'row',justifyContent:'space-between'}}>
<Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>{t('Attendance Status')}</Text>
<Text style={{marginEnd:10,marginTop:10,color:'green'}}>{item.attendance_status}</Text>


</View>

{item.attendance_status=="absent" && (
    <View>
<Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>{t('Rejected Reason')}</Text>
<Text style={{marginStart:10,marginEnd:10,marginTop:10,color:'green'}}>{item.reject_reason}</Text>

</View>
)}





<View style={{height:1,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10,marginTop:10}}>

</View>


<Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10,color:Colors.red}}>{t('Options')}</Text>

<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
<Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>{t('Approve Attendance')}</Text>
<TouchableOpacity onPress={()=>{
      
      console.log("rrrrrpppppp",item.payment_service_id._id)
    make_attendance("present",item._id,item.payment_service_id,item.date.slice(0,10))
}}>
<Text style={{marginEnd:10,marginTop:10,color:'green',borderRadius:10,padding:8,borderColor:'green',borderWidth:1,width:80,textAlign:'center'}}>{t('Approve Attendance')}</Text>

</TouchableOpacity>


</View>

<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
<Text style={{marginStart:10,fontSize:13,fontWeight:'bold',marginTop:10}}>{t('Reject Attendance')}</Text>

<TouchableOpacity onPress={()=>{
        console.log(item)
        set_attendance_item(item)
        set_cancel_dialog(true)
   
}}>
<Text style={{marginEnd:10,marginTop:10,color:'red',borderRadius:10,padding:8,borderColor:'red',borderWidth:1,width:80,textAlign:'center'}}>{t('Reject')}</Text>

</TouchableOpacity>


</View>



               
               
                
                
            </View>
            </View>


        )
    };


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


    const make_attendance = async (status,attendance_id,payment_service_id,date) => {



        try {

            console.log("dddddd",payment_service_id)

           

            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/make_attendance";

            let userData;

            if(status=="present"){
                userData = {
                    attendance_id: attendance_id,
                    attendance_status: status,
                    payment_service_id: payment_service_id,
                    type:"submit",
                    date:date
    
                };
    
            }else{
                userData = {
                    attendance_id: attendance_id,
                    attendance_status: status,
                    payment_service_id: payment_service_id,
                    type:"submit",
                    date:date,
                    reason:cancel_reason
    
                };
    
            }
      
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
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)

                get_attendance()
              



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


    
    const get_attendance = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_all_attendance"

           
            //   const queryParams = {
            //    // date: chosenDate.toISOString().slice(0,10),
            //   };



            // Construct the URL with query parameters
            const urlWithParams = `${apiUrl}?${new URLSearchParams(apiUrl)}`;


            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();
                console.log("attt",data)


                set_attendance(data.attendance);

                setLoading(false)






            } else {
                console.error('Error:', response.status, response);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };

    const get_attendance_with_date = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_all_attendance"

           
              const queryParams = {
                  from_date: chosenDate.toISOString().slice(0,10),
                  to_date: chosenDate2.toISOString().slice(0,10),
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
                console.log("attt",data)


                set_attendance(data.attendance);

                setLoading(false)






            } else {
                console.error('Error:', response.status, response);
                setLoading(false)
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
                <View style={{ flexDirection: 'row', marginTop: 10, padding: 10, alignItems: 'center' }}>
                  
                <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                    }}>
                         <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>  
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>{t('Manage Attendance')}</Text>

                    </View>

                   


                </View>

            </View>

     

            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
               <View>
                 <Text style={{marginStart:10,marginTop:3}}>{t('From date')}</Text>
                 <TouchableOpacity onPress={openDatePicker}>
                            <Text style={{
                                borderColor: Colors.orange,
                                borderWidth: 1,borderRadius:10, margin:10, height: 40, backgroundColor: Colors.gray, padding: 10, color: Colors.textcolor
                            }}>{chosenDate.toDateString()}</Text>
                        </TouchableOpacity>

            {showDatePicker && (
                            <DateTimePicker
                                value={chosenDate}
                                mode="date"
                                is24Hour={false}
                                display="default"
                                onChange={onDateChange}
                            />
                        )}
               </View>

               <View>
                <Text style={{marginStart:10,marginTop:3}}>To date</Text>
                <TouchableOpacity onPress={openDatePicker2}>
                            <Text style={{
                                borderColor: Colors.orange,
                                borderWidth: 1,borderRadius:10,margin:10, height: 40, backgroundColor: Colors.gray, padding: 10, color: Colors.textcolor
                            }}>{chosenDate2.toDateString()}</Text>
                        </TouchableOpacity>

            {showDatePicker2 && (
                            <DateTimePicker
                                value={chosenDate2}
                                mode="date"
                                is24Hour={false}
                                display="default"
                                onChange={onDateChange2}
                            />
                        )}   
               </View>

               <TouchableOpacity style={{marginTop:'5%'}} onPress={()=>{
                  get_attendance_with_date()
               }}>
                            <Text style={{
                                borderColor: Colors.orange,
                            
                                borderWidth: 1,backgroundColor:Colors.red,borderRadius:10, margin:10, height: 40, padding: 10, color: Colors.white
                            }}>{t('Apply')}</Text>
                        </TouchableOpacity>

            </View>
          


         

          


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
          
                
                     
          <View style={{flex:1,marginBottom:'2%'}}>

<FlatList

  
    data={attendance}
    keyExtractor={(item) => item._id.toString()}
    renderItem={renderJobItem}
    refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
/>
</View>
        
           

       


      
            <Modal visible={cancel_dialog} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>


                        <Text>{t('Enter attendance rejection reason here')}</Text>

                        <TextInput multiline={true} style={{borderWidth:1,borderColor:Colors.textcolor,padding:10,borderRadius:10,height:80,marginTop:10}} placeholder='reason..'  onChangeText={(text) => set_cancel_reason(text)}  ></TextInput>
                      


                    

                       

                        {/* <TextInput style={{ color: Colors.textcolor,alignSelf:'center',borderRadius:10 }} placeholder='Enter Price' keyboardType='numeric' value={price} onChangeText={(text) => set_price(text)}></TextInput>
                    */}


                      
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={()=>{


                                    if(cancel_reason==''){
                                        set_cancel_dialog(false)
                                        Toast.show({
                                            type: 'success',
                                            text1: "Please enter attendance reject reason",
                                        });

                                    }else{
                                        set_cancel_dialog(false)
                                    
                                        make_attendance("absent",attendacnce_item._id,attendacnce_item.payment_service_id,attendacnce_item.date.slice(0,10))
                                        set_attendance_item(null)
                                       
                                    }
                               
                            }}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10 }}>{t('Reject Attendance')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={()=>{
                                set_cancel_dialog(false)
                            }} >
                           
                                <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10}}>{t('Close')}</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>

          

         


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
        height: 70,

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
       height:220

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
        color: Colors.textcolor



    },
    item: {
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        height:40,
        width:100,
        
      },





})



export default AllAttendanceScreen