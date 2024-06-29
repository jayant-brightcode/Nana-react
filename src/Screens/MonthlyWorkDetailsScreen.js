import React, { useState, useEffect ,useRef,useCallback} from 'react'

import { RefreshControl,Alert,View, Text, StyleSheet, Image, PermissionsAndroid,FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal,TouchableWithoutFeedback, SafeAreaView, Platform } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions

import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';


import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker'
import ViewShot from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import { writeFile, DownloadDirectoryPath } from 'react-native-fs';
import { useTranslation } from 'react-i18next';



import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
const MonthlyWorkDetailScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { detail } = route.params

    const viewShotRefs = useRef({});
    const [visibleIndex, setVisibleIndex] = useState(null);
    const [get_request, set_request] = useState([])
    const [loading, setLoading] = useState(false);
    const [get_id, set_id] = useState('')
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [user_details, set_user_details] = useState({});
    const [chosenDate, setChosenDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [desc, set_desc] = useState("");

    const [chosenDate1, setChosenDate1] = useState(new Date());
    const [showDatePicker1, setShowDatePicker1] = useState(false);
    const [payment_service_id, set_payment_service_id] = useState('');

    const [reciept,set_reciept] = useState('')
    const [show_reciept,set_show_reciept] = useState(false)

    
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

    const openDialog = () => {
        setDialogVisible(true);
    };


    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true)
        get_job_request()
        setRefreshing(false);
        
      };

    const onDateChange = (event, selectedDate) => {
        if (event.type === 'set') {
            setChosenDate(selectedDate);
            setShowDatePicker(false);
        } else{
            setShowDatePicker(false);

        }
    };


    const onDateChange1 = (event, selectedDate) => {
        if (event.type === 'set') {
            setChosenDate1(selectedDate);
            setShowDatePicker1(false);
        } else {
            setShowDatePicker1(false);

        }
    };

    const openDatePicker = () => {
 
        setShowDatePicker(true);
    };

    const openDatePicker1 = () => {

        setShowDatePicker1(true);
    };
    const closeDialog = () => {
        setDialogVisible(false);
    };

    const handleButtonPress = () => {
      
  
       send_leave_request()
    };

    useEffect(() => {
        getProfile();
        fetchLanguage()
    }, []);
    useEffect(() => {
        get_job_request();
    }, []);


    //  const saveImageToDownloads = async (fileUri, fileName) => {
    //     try {
    //         console.log(fileUri,fileName)
    //       const response = await RNFetchBlob.fs.cp(fileUri, `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}.png`);
    //       console.log(response)
    //       Alert.alert("succss","Reciept save to Downloads")
    //       set_show_reciept(false)
    //     } catch (error) {
    //         Alert.alert("Failed","Something went wrong")
    //     }
    //   };


    const saveImageToDownloads = async (fileUri, fileName) => {
        try {
          let directoryPath = '';
      
          // Determine the directory path based on platform
          if (Platform.OS === 'ios') {
            directoryPath = RNFetchBlob.fs.dirs.DocumentDir;
          } else if (Platform.OS === 'android') {
            directoryPath = RNFetchBlob.fs.dirs.DownloadDir;
          }
      
          // Copy the file to the specified directory
          const response = await RNFetchBlob.fs.cp(fileUri, `${directoryPath}/${fileName}.png`);
          
          // Check if the file was successfully copied
        // if (response) {
            Alert.alert('Success', 'Receipt saved to Downloads');
        //   } else {
        //     Alert.alert('Failed', 'Something went wrong while saving the receipt');
        //   }
      
          // Hide the receipt after saving
          set_show_reciept(false);
        } catch (error) {
          console.error('Error saving receipt:', error);
          Alert.alert('Failed', 'Something went wrong while saving the receipt');
        }
      };


      const captureViewSnapshot = useCallback(async () => {
        try {
            setLoading(true)
          if (visibleIndex === null) {
            Alert.alert('Error', 'No item is currently visible');
            setLoading(false)
            return;
          }
    
          const viewShotRef = viewShotRefs.current[visibleIndex];
    
          if (!viewShotRef) {
            Alert.alert('Error', 'Failed to capture snapshot of the currently visible item');
            setLoading(false)
            return;
          }
    
          // Capture snapshot of the view
          const uri = await viewShotRef.capture();
          set_reciept(uri)
          set_show_reciept(true)
          const downloadsPath = RNFetchBlob.fs.dirs.DownloadDir;

          // Convert the snapshot into PDF
          const options = {
            html: `<img src="${uri}" />`,
            fileName: new Date().toString()+"recipet",
            directory: DownloadDirectoryPath,
          };
          const pdf = await RNHTMLtoPDF.convert(options);
          setLoading(false)
          // Alert user about successful conversion
      //  Alert.alert('Success', `PDF saved at: ${pdf.filePath}`);
          
        } catch (error) {
            setLoading(false)
          // Handle errors
          console.error('Error capturing snapshot and converting to PDF:', error);
          Alert.alert('Error', 'Failed to capture snapshot and convert to PDF');
        }
      }, [visibleIndex]);
    
      const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems.length > 0) {
          setVisibleIndex(viewableItems[0].index);
        } else {
          setVisibleIndex(null);
        }
      }, []);
    
      const requestStoragePermission = async () => {
        if(Platform.OS=='android'){
         try {
             const permissionStatus = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
         
             if (permissionStatus === RESULTS.GRANTED) {
             
               console.log('Storage permission already granted');
             } else {
               const newPermissionStatus = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
               if (newPermissionStatus === RESULTS.GRANTED) {
                 console.log('Storage permission granted');
                 captureViewSnapshot()
               } else {
                 console.log('Storage permission denied');
                 captureViewSnapshot()
               }
             }
               captureViewSnapshot()
           } catch (error) {
             console.error('Error requesting storage permission:', error);
           }
   
           captureViewSnapshot()
        }else{
         captureViewSnapshot()

        }
   };
   


  

   

    const renderJobItem = ({ item,index }) => {


        const skillsString = item.job_request_id.skills.map(skill => skill.name).join(', ');







        return (
            <View>
                <ViewShot ref={(ref) => (viewShotRefs.current[index] = ref)} options={{format:'png',quality:1}} >

                <View style={{borderRadius:10,borderWidth:1,borderColor:Colors.orange, marginTop: 13, flexDirection: 'row', alignItems: 'center', marginStart: 10, marginEnd: 10, padding: 10 ,borderBottomWidth:2,borderBottomColor:Colors.dark_gray}}>
                  
                    <View style={{ flex: 1}}>

                    <TouchableOpacity onPress={()=>{
                      requestStoragePermission()
                   }}>

                    <Text  style={{fontWeight:'bold',textDecorationLine:'underline'}}>{t("Download Reciept")}</Text>
                  
                    </TouchableOpacity>


                    <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10,marginBottom:12}}>
                            <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t("Request Id")}</Text>
                            <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.job_request_id.order_id}</Text>
    
                            </View>  


                    {item.job_request_id.from_user_id._id.toString()==get_id.toString() && (
                            <View>

                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                        <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t("To")}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.job_request_id.to_user_id.name}</Text>


                        </View>  



                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                        <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t("From")}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.job_request_id.from_user_id.name}</Text>

                        </View>      




                        </View>

                        )}


{item.job_request_id.to_user_id._id.toString()==get_id.toString() && (
                            <View>



                           <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                            <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t("From")}</Text>
                            <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.job_request_id.from_user_id.name}</Text>
    
                            </View>    

                            <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                            <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t("To")}</Text>
                            <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.job_request_id.to_user_id.name}</Text>
    
    
                            </View>  
    
    
    
                              
    
    
    
    
                                    </View>

                        )}


                   <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>

<Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t("Profession Name")}</Text>
<Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.job_request_id.to_user_id.profession_name}</Text>

 </View>


 <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
 <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t("Profession Skill")}</Text>
 <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{skillsString}</Text>


     </View>


     <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                        <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t("Job Type")}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.job_request_id.job_pref.name}</Text>


                        </View>


                        <View style={{height:2,backgroundColor:Colors.gray,width:'100%',marginTop:10}}>

                        </View>


                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>

                        <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t("Job Request Sent Date")}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{new Date(item.job_request_id.createdAt).toDateString()}</Text>

                            
                        </View>

                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                        <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t("Working Date")}</Text>

                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{new Date(item.job_request_id.date).toDateString()}</Text>

                        </View>


                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>

                        <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t("Work Started Date")}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14}}>{item.job_request_id.joined_date==null ? "Not yet Started" : new Date(item.job_request_id.joined_date).toDateString()}</Text>


                         </View>


                        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                        <Text style={{ color: Colors.textcolor, fontSize: 14}}>{t("Work Completed Date")}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.job_request_id.quit_date==null ? "Not yet Completed" : new Date(item.job_request_id.quit_date).toDateString() }</Text>


                         </View>


                         <View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

                         </View>

                         {item.job_request_id.job_pref.name == "Monthly Job" && (

<View>


  
{Platform.OS=='android' && (
     <View>

     <Text style={{ color: Colors.textcolor, fontSize: 14,fontWeight:'bold',marginTop:8}}>{t("Salary Structure")}</Text>
     
     
     <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
     
                                     <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t('Gross Monthly Salary')}</Text>
                                     <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>Rs. {item.job_request_id.amount_set}</Text>
     
     
             </View>
     
     
     
     <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
     
     <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t("Convenience Fees")}({item.job_request_id.job_pref.platform_charge}%)Inc. 18% GST</Text>
     <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>Rs. {(item.job_request_id.job_pref.platform_charge / 100 * item.job_request_id.amount_set).toFixed()}</Text>
     
     
     </View>
     
     <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
     
     <Text style={{ color: Colors.textcolor, fontSize: 14 }}>{t("Net Monthly Salary")}</Text>
     <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>Rs. {item.job_request_id.amount_set - (item.job_request_id.job_pref.platform_charge / 100 * item.job_request_id.amount_set).toFixed()}</Text>
     
     
     </View>
     
     </View>
)}



<View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

</View>





                          <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                          <Text style={{ color: Colors.textcolor,  fontSize: 14 }}>{t("Request Status")}</Text>
                          <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 14 }}>{item.job_request_id.application_status}</Text>


                           </View>

                           <View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

                          </View>


                          <View style={{backgroundColor:Colors.gray,padding:10}}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 12 }}>{t("Job Description")}</Text>
                <Text style={{ color: Colors.black, fontWeight: 'bold', fontSize: 12 }}>{item.job_request_id.desc}</Text>

                        </View>

                        <View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

</View>

        </View>

        

        





)}







                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14,marginTop:10 }}>{t("Job Duration Details")}</Text>

                        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 14 }}>{t("Start Date")}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{new Date(item.start_date).toDateString()}</Text>

                        </View>

                        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 14 }}>{t("End Date")}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{new Date(item.end_date).toDateString()}</Text>

                            </View>

                            <View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

</View>

<Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14,marginTop:10 }}>{t("Leaves Details")}</Text>

<View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
<Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 14 }}>{t("Total Leave Request")}</Text>
<Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.sent_leaves_length}</Text>

</View>

<View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
<Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 14 }}>{t("Accepted Leaves")}</Text>
<Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.accepted_leaves_length}</Text>

</View>

<View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
<Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 14 }}>{t("Rejected Leaves")}</Text>
<Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.rejected_leaves_length}</Text>

</View>

<View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

</View>

<Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14,marginTop:10 }}>{t("Attendance Details")}</Text>

<View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
<Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 14 }}>{t("Pending")}</Text>
<Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.pending_length}</Text>

</View>

<View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
<Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 14 }}>{t("Present")}</Text>
<Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.present_length}</Text>

</View>

<View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
<Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 14 }}>{t("Absent")}</Text>
<Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>{item.absent_length}</Text>

</View>
<View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

</View>

{Platform.OS=="android" && (
    <View>
    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
    <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 14 }}>{t("Total Earning(Attendance Wise)")}</Text>
    <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 14 }}>Rs. {Number(item.amount_collected).toFixed(2)}</Text>
    
    </View>
    <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:10}}>
                             <Text style={{ color: Colors.textcolor,fontSize: 14 }}>{t("Payment Status")}</Text>
    
                             <Text style={{ color: Colors.red, fontWeight: 'bold', fontSize: 14 }}>{item.payment_status}</Text>
    
                                </View>
    
                                </View>
)}

                            <View style={{width:'100%',height:2,backgroundColor:Colors.gray,marginTop:10}}>

                          </View>


                  
                        <TouchableOpacity style={styles.button1} onPress={() => {
                            navigation.navigate("AttendaceScreen",{detail:item})
                        }


                        }>
                            <View style={{ marginTop: 10, marginBottom: 10 }}>
                                <Text style={{ backgroundColor: '#0E86D4', padding: 10, color: Colors.white ,textAlign:'center',borderRadius:10,overflow:'hidden'}}>View or Make Attendance</Text>
                                {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                            </View>
                        </TouchableOpacity>

                        {get_id.toString() == detail.to_user_id._id.toString() && detail.is_joined==true && detail.is_quit==false && (
                            <TouchableOpacity style={styles.button1} onPress={() => {

                                set_payment_service_id(item._id)
                                openDialog()
                            }


                            }>
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ backgroundColor: '#68BBE3', padding: 10, color: Colors.white, textAlign: 'center' ,borderRadius:10,overflow:'hidden'}}>Request Leave</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>


                        )}

                    


                        


                   

                    </View>

                 
                    

                </View>
                </ViewShot>
        </View> 


        )
    };


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


                set_id(data.profile_details._id)

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



    const get_job_request = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_work_details"


            const queryParams = {
                job_request_id: detail._id,

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

            


                set_request(data.work_details);

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

   

    const send_leave_request = async () => {


        if (!desc.trim()) {
            Toast.show({
                type: 'success',
                text1: `Please enter leave description`,
            });
            return;
        }





        try {

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/send_leave_application";

     

            const userData = {
                payment_service_id: payment_service_id,
                from_date: chosenDate,
                to_date: chosenDate1,
                desc: desc


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
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)

                 closeDialog()


            } else {
                // Handle error
                closeDialog()
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)

            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false)

        }

    }

  

 

   


 



    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={styles.container}>



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: Platform.OS=='android' ? 10 :0, padding: 10, alignItems: 'center' }}>
                    <TouchableOpacity onPress={()=>{
                              navigation.goBack()
                    }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>

                    </TouchableOpacity>
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>{t("Requests")}</Text>

                    </View>


                </View>

            </View>


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View style={{marginBottom:80}}>

                <FlatList

                    data={get_request}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    onViewableItemsChanged={onViewableItemsChanged}
                />
            </View>


            <Modal visible={isDialogVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Enter leave description</Text>

                        <TextInput  style={styles.input} placeholder="Enter description here .." value={desc} onChangeText={(text) => set_desc(text)} />

                        <View>
                            <Text style={styles.labelText}>From Date</Text>
                            <TouchableWithoutFeedback  onPress={openDatePicker} >
                                <Text style={styles.rowinput}>{chosenDate.toDateString()}</Text>
                            </TouchableWithoutFeedback>
                            {showDatePicker && (
                                <DateTimePicker

                                    value={chosenDate}
                                    mode="date"
                                    is24Hour={false}
                                    display="default"
                                    minimumDate={new Date()}
                                    onChange={onDateChange}
                                />
                            )}
                        </View>

                        <View>
                            <Text style={styles.labelText}>To Date</Text>
                            <TouchableWithoutFeedback onPress={openDatePicker1} >
                                <Text style={styles.rowinput}>{chosenDate1.toDateString()}</Text>
                            </TouchableWithoutFeedback>
                            {showDatePicker1 && (
                                <DateTimePicker

                                    value={chosenDate1}
                                    mode="date"
                                    is24Hour={false}
                                    display="default"
                                    minimumDate={new Date()}
                                    onChange={onDateChange1}
                                />


                            )}
                        </View>



                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10 ,overflow:'hidden'}}>send leave request</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={closeDialog}>
                            <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10,overflow:'hidden'}}>Close</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </Modal>

            <Modal visible={show_reciept} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>


                      

                    <View style={{width:'100%',height:'90%'}}>

                    <Image  style={{width:'100%',height:'100%',resizeMode:'center'}}source={{uri:reciept}} ></Image>

                    </View>

        

                      
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={()=>{
                              saveImageToDownloads(reciept, "Nana_Reciept"+Date.now());

                            }}>
                                <Text style={{ backgroundColor: Colors.orange, padding: 10, color: Colors.white,borderRadius:10 }}>Download</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={()=>{
                                set_show_reciept(false)
                            }}>
                                <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10}}>Close</Text>
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
    rowinput: {
        width: '100%',
        height: 45,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,
        marginTop:5,
        overflow:'hidden'


    },




})



export default MonthlyWorkDetailScreen