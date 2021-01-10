
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import TransactionScreen from './screens/TransactionScreen';
import SearchScreen from './screens/SearchScreen';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import WelcomeScreen from './screens/WelcomeScreen'
export default class App extends React.Component {
  render(){
  return (
    
      <AppContainer/>
    
  );
}
}
const tabNavigator=createBottomTabNavigator({
  Transaction:{screen:TransactionScreen},
  Search:{screen:SearchScreen},
},
{
defaultNavigationOptions:({navigation})=>({
  tabBarIcon:()=>{
const routeName=navigation.state.routeName;
if(routeName==='Transaction'){
  return(
    <Image
    source={require('./assets/book.png')}
    style={{width:40,height:40}}
    ></Image>
  )
}
else if(routeName==='Search'){
  return(
    <Image
    source={require('./assets/searchingbook.png')}
    style={{width:40,height:40}}
    ></Image>
  )
}
  }
})
}
)
const switchNavigator=createSwitchNavigator({
  WelcomeScreen:{screen:WelcomeScreen,
  tabNavigator:{screen:tabNavigator}
  }
})
const AppContainer=createAppContainer(switchNavigator)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
