import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity,KeyboardAvoidingView,Image} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import db from '../config'
import * as firebase from 'firebase'
export default class WelcomeScreen extends React.Component{
    constructor(){
        super() 
        this.state={
            email:'',
            password:''
        }
    }
    login=async(email,password)=>{
        if(email && password){
        
            try{
             const response=await firebase.auth().signInWithEmailAndPassword(email, password)
             if(response){
              this.props.navigation.navigate('TransactionScreen')
             }
            }
            catch(error){
                switch(error.code){
                    case 'auth/user-not-found':
                        alert('User does not exist')
                        break;
                    case 'auth/invalid-email':
                        alert('Incorrect email or password')
                }
            }
        }
        else{
            alert('Enter email and password')
        }
    }
    render(){
        return(
            <View>
                <Text>
                WILY
                </Text>
                <Image source={require('../assets/booklogo.jpg')} style={{width:200,height:200}}>
                
                </Image>
                <View>
                    <TextInput  placeholder='abc@example.com'
                    keyboardType='email-address'
                    onChangeText={Text=>{
                        this.setState({
                            email:Text
                        })
                    }}
                    >
                        
                    </TextInput>

                    <TextInput  placeholder='enter password'
                    secureTextEntry={true}
                    onChangeText={Text=>{
                        this.setState({
                            password:Text
                        })
                    }}
                    >
                        
                    </TextInput>

                </View>
                <View> 
                <TouchableOpacity
                onPress={()=>{this.login(this.state.email, this.state.password)}}

                >
                    <Text>
                       Login
                    </Text>
                </TouchableOpacity>
                </View>
            </View>
        )
    }
}