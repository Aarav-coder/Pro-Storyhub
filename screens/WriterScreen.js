import React from 'react';
import {  Text, TouchableOpacity ,View,KeyboardAvoidingView,Image,ToastAndroid} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import db from '../config'
import * as firebase from 'firebase'

constructor(){
    super() 
    
searchTransactions=async(text)=>{
    var enteredText=text.split('')