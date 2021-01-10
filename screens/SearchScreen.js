import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import db from '../config'
export default class SearchScreen extends React.Component {
  constructor(props){
    super(props)
    this.state={alltransactions:[],
    lastVisibleTransaction:null,
    search:''
    }
  }
  componentDidMount=async()=>{
    const query=await db.collection('transactions').get()
    query.docs.map(doc=>{
      this.setState({
        alltransactions:[...this.state.alltransactions,doc.data()]
      })
    })
  }
  fetchMoreTransactions=async()=>{
    var enteredText=text.split('')
    var text=text.toUpperCase()
    if(enteredText[0].toUpperCase()==='B'){
       const transaction=await db.collections('transactions').where('bookid','==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
       transaction.docs.map(doc=>{
        this.setState({alltransactions:[...this.state.alltransactions,doc.data()],lastVisibleTransaction:doc})
       })
    }
    else if(enteredText[0].toUpperCase()==='S'){
      const transaction=await db.collections('transactions').where('studentid','==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
      transaction.docs.map(doc=>{
       this.setState({alltransactions:[...this.state.alltransactions,doc.data()],lastVisibleTransaction:doc})
      })
   }
  }
  searchTransactions=async(text)=>{
    var enteredText=text.split('')
    var text=text.toUpperCase()
    if(enteredText[0].toUpperCase()==='B'){
       const transaction=await db.collections('transactions').where('bookid','==',text).get()
       transaction.docs.map(doc=>{
        this.setState({alltransactions:[...this.state.alltransactions,doc.data()],lastVisibleTransaction:doc})
       })
    }
    else if(enteredText[0].toUpperCase()==='S'){
      const transaction=await db.collections('transactions').where('studentid','==',text).get()
      transaction.docs.map(doc=>{
       this.setState({alltransactions:[...this.state.alltransactions,doc.data()],lastVisibleTransaction:doc})
      })
   }
  }
  render(){
  return (
    <View>
    <TextInput
    placeholder='book id or student id'
    onChangeText={text=>{this.setState({search:text})}}
    >

    </TextInput>
    <TouchableOpacity
    onPress={()=>(this.searchTransactions(this.state.search))}
    >
      <Text>
       search
      </Text>
    </TouchableOpacity>
    <FlatList
    data={this.state.alltransactions}
    renderItem={({item})=>{
      <View style={{borderBottomWidth:2}}>
      <Text>
        {'book id'+item.bookid}
      </Text>
      <Text>
        {'student id'+item.studentid}
      </Text>
      <Text>
        {'transaction type'+item.transactionType}
      </Text>
      <Text>
        {'Date'+item.date.toDate()}
      </Text>

      </View>
    }}
    keyExtractor={(item,index)=>index.toString()}
    onEndReached={this.fetchMoreTransactions}
    onEndReachedThreshold={0.7}
    />
    <View style={styles.container}>
      <Text>SearchScreen</Text>
    </View>
    </View>
  );
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
