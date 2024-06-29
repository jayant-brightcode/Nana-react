import { ActivityIndicator, Alert, FlatList, Image, SafeAreaView, StatusBar, TextInput, ToastAndroid, TouchableOpacity } from "react-native"
import { Text, View } from "react-native-animatable"
import Colors from "../Utils/Color"
import { useEffect, useState } from "react"



const ClassScreen =()=>{

    const [post ,setPost] = useState([])
    const [loading ,setLoading] = useState(false)




    useEffect(()=>{

         GetPost()

    },[])






    const GetPost = async()=>{


        try {

            setLoading(true)


            const response = await fetch("https://jsonplaceholder.typicode.com/posts",{
                method:'GET'
            })

            if(response.ok){
               const data = await response.json()
               setPost(data)

               console.log(data)
               setLoading(false)

            }else{
                console.log("not ok")
                setLoading(false)

            }
            
        } catch (error) {

            ToastAndroid.show("Something went wrong "+error,ToastAndroid.LONG)
            setLoading(false)

            
        }



    }


    return (
        <SafeAreaView style={{flex:1,backgroundColor:Colors.white}}>


          
          <View style={{flex:1}}>

          <FlatList
             data={post}
            renderItem={({item})=>(
                <View style={{margin:20,padding:20}}>
                <Text style={{fontSize:20,fontWeight:'bold'}}>{item.title}</Text>
                <Text>{item.body}</Text>
                

            </View>
         )}
             keyExtractor={(item)=>item.id}
            >


            </FlatList>
          </View>



           {loading && (

          <ActivityIndicator size={50} style={{position:'absolute'}}></ActivityIndicator>
          
           )}

      


             


          


        </SafeAreaView>
    )




}

export default ClassScreen





