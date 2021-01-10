
import React from 'react';
import { StyleSheet, Text, View, Image, Alert, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import db from '../Config'
import * as firebase from 'firebase';
export default class TransactionScreen extends React.Component {
  constructor(){
    super();
    this.state={
      hascamerapermissions:null,
      scanned:false,
      scannedData:'',
      scannedBookId:'',
      scannedStudentId:'',
      buttonState:'normal',
      transactionmessage:''
    }
  }
  getcamerapermissions=async(id)=>{
    const {status}=await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hascamerapermissions:status === "granted",
      buttonState:id,
      scanned:false
    })
  }
  handlebarcodescanned=async(type,data)=>{
    const {buttonState}=this.state
    if(buttonState==='bookid'){
    this.setState({
      scanned:true,
      scannedBookId:data,
      buttonState:'normal'
    })
  }
  else if(buttonState==='studentid'){
    this.setState({
      scannedStudentId:true,
      scannedData:data,
      buttonState:'normal'
    })
  }
}
handleTransaction=async()=>{
  var transactionType=await this.checkBookEligibility()
  if(!transactionType){
    alert('The book does not exist in the library')
    this.setState({
      scannedStudentId:'',
      scannedBookId:''
    })
  }
  else if(transactionType==='issue'){
    var isStudentEligible=await this.checkStudentEligibilityForBookIssue()
   
  if(isStudentEligible){
    this.initiateBookIssue()
    alert('Book Issued To The Student')
  }
}
  else{
   var isStudentEligible=await this.checkStudentEligibilityForBookReturn()
   if(isStudentEligible){
    this.initiateBookReturn()
   }
    alert('Book Returned To The Library')
   }
}

checkStudentEligibilityForBookIssue=async()=>{
  const StudentRef=await db.collection('Students').where('StudentId','==',this.state.scannedStudentId).get()
  var isStudentEligible=''
  if(StudentRef.docs.length==0){
   this.setState({
     scannedStudentId:'',
     scanBookId:''
   })
   isStudentEligible=false
   alert('Student does not exist in the database')
  }
  else{
    StudentRef.docs.map(doc=>{
      var Student=doc.data()
      if(student.numberOfBooksIssued<2){
        isStudentEligible=true
      }
      else{
        isStudentEligible=false
        alert('Student already has 2 books')
        this.setState({
          scannedStudentId:'',
          scanBookId:''
        })
      }
    })
  }
  return isStudentEligible
  }
 
  checkStudentEligibilityForBookReturn=async()=>{
    const TransactionRef=await db.collection('Transactions').where('BookId','==',this.state.scannedBookId).limit(1).get()
    var isStudentEligible=''
    
   
      TransactionRef.docs.map(doc=>{
        var lastBookTransaction=doc.data()
        if(lastBookTransaction.studentId===this.state.studentId){
          isStudentEligible=true
        }
        else{
          isStudentEligible=false
          alert('The book was not issued by the same student')
          this.setState({
            scannedStudentId:'',
            scanBookId:''
          })
        }
      })
    
    return isStudentEligible
    }
checkBookEligibility=async()=>{
  const bookRef=await db.collection('Books').where('BookId','==',this.state.scannedBookId).get()
  var transactionType=''
  if(bookRef.docs.length==0){
    
    this.setState({
      scannedStudentId:'',
      scanBookId:''
    })
    isStudentEligible=false
    alert('Student does not exist in the database')
   }
   else{
     StudentRef.docs.map(doc=>{
       var Student=doc.data()
       if(student.numberOfBooksIssued<2){
         isStudentEligible=true
       }
       else{
         isStudentEligible=false
         alert('Student already has 2 books')
         this.setState({
           scannedStudentId:'',
           scanBookId:''
         })
       }
     })
   }
   return isStudentEligible
}
initiatebookissue=async()=>{
  db.collection('transaction').add({
    'studentId': this.state.scannedStudentId,
    'bookId': this.state.scannedBookId,
    'date': firebase.firestore.Timestamp.now().toDate(),
    'transactionType': 'issue'
   })
   db.collection('books').doc(this.state.scannedBookId).update({
     'bookAvailability': false
   })
   db.collection('students').doc(this.state.scannedStudentId).update({
     'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)
   })
   this.setState({scannedStudentId:'', scannedBookId:''})
}
initiateBookReturn=async()=>{
  db.collection('transaction').add({
    'studentId': this.state.scannedStudentId,
    'bookId': this.state.scannedBookId,
    'date': firebase.firestore.Timestamp.now().toDate(),
    'transactionType': 'issue'
   })
   db.collection('books').doc(this.state.scannedBookId).update({
     'bookAvailability': true
   })
   db.collection('students').doc(this.state.scannedStudentId).update({
     'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
   })
   this.setState({scannedStudentId:'', scannedBookId:''})
}
  render(){
    const hascamerapermissions=this.state.hascamerapermissions;
    const scanned=this.state.scanned;
    const buttonState=this.state.buttonState;
    if(buttonState!=='normal' && hascamerapermissions){
    return(
     <BarCodeScanner
     onBarCodeScanned={scanned?undefined:this.handlebarcodescanned}
     style={StyleSheet.absoluteFillObject}
     >

     </BarCodeScanner>
    )
    }
  
    else if(buttonState==='normal'){
  return (
    <KeyboardAvoidingView>

   
    <View style={styles.container}>
      <View>
      <Image
    source={require('../assets/booklogo.jpg')}
    style={{width:200,height:200}}
    ></Image>
      </View>
      <Text>{hascamerapermissions===true? this.state.scannedData:'request camera permission'}</Text>
      <TextInput
      placeholder='bookid'
      onChangeText={Text=>this.setState({
        scannedBookId:Text
      })}
      value={this.state.scannedBookId}
      
      />
      <TouchableOpacity style={{backgroundColor:'blue',padding:10,margin:10,width:200,height:50,}}
      onPress={()=>{this.getcamerapermissions('bookid')}
  }
      >
<Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>
  Scan bookid code
</Text>
      </TouchableOpacity>
      <TextInput
      placeholder='studentid'
      onChangeText={Text=>this.setState({
        scannedStudentId:Text
      })}
      value={this.state.scannedStudentId}
      
      />
      <TouchableOpacity style={{backgroundColor:'blue',padding:10,margin:10,width:200,height:50,}}
      onPress={()=>{this.getcamerapermissions('studentid')}
  }
      >
<Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>
  Scan studentid code
</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{backgroundColor:'blue',padding:10,margin:10,width:200,height:50,}}
      onPress={async()=>{var transactionMessage=this.handleTransaction();
  
  this.setState({
    scannedBookId:'',
    scannedData:''
  })
}}
      >
<Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>
 submit
</Text>
      </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>
  );
}
}
}
const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
