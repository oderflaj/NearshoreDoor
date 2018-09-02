import React from 'react';
import { AsyncStorage, StyleSheet, Text, View, Button, Alert, ActivityIndicator,TextInput } from 'react-native';
import {
  Permissions,
  Notifications,
} from 'expo';
//import registerForPushNotificationsAsync from 'registerForPushNotificationsAsync';
import Login from './components/views/Login'
import Opendoor from './components/views/Opendoor'

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {spin:false,notification: {},email:undefined,tokenid:undefined,registered:undefined}

  //-----------------------------------------------------------------------------------------------------
  }
  async componentWillMount() {
    let registered = await AsyncStorage.getItem('registered') || "false"
    let email = await AsyncStorage.getItem('email')
    let tokenid = await AsyncStorage.getItem('tokenid')
    let profile = await AsyncStorage.getItem('profile')

    console.log("Se carga información inicial:")
    console.log("registered->",registered)
    console.log("email->",email)
    console.log("tokenid->",tokenid)
    console.log("profile->",profile)
    this.setState({registered:registered,email:email,tokenid:tokenid})
  }

  
  //----------------------------------------------------------------------------------------------------------
  SpinnerButton(){
    if(this.state.spin)
    {
      return(
              <View style={styleMedia.spinnerStyle}>
                  <ActivityIndicator size={'large'}  />
                  <Button title='CANCELAR' onPress={()=>{
                    this.setState({spin:false})
                  }} />
              </View>
            );
    }
    else
    {
      return <Button title='Presioname' onPress={()=>{
        
        this.abreteSesamo()
        
        
      }} />
    }



    
  };

  async setDataNST(){
    let resu =  AsyncStorage.getItem('registered')
    console.debug("Resultado->",resu)
    let email =  AsyncStorage.getItem('email')
    let tokenid =  AsyncStorage.getItem('tokenid')
    let profile =  AsyncStorage.getItem('profile') || ""
    this.setState({registered:"true",email:email,tokenid:tokenid,profile:profile})
    
  }

  unsetDataNST(){
    this.setState({registered:"false"})
    console.debug("El registro se pone el FALSE")
  }

  isRegistered()
  {
    console.debug(this.state)

    if(this.state.registered==undefined)
    {
      return(
      <View>
        <Text>
          LOADING . . .
        </Text>
      </View>)
    }
    else
    {
      console.debug("this.state.email->",this.state.email,"this.state.tokenid->",this.state.tokenid,"this.state.registered->",this.state.registered)
      if( this.state.email != undefined && this.state.tokenid != undefined)
      {
        
        if(this.state.registered=="true"){
          return(<Opendoor notregistered={this.unsetDataNST.bind(this)} email={this.state.email} tokenid={this.state.tokenid}/>)
        }
        if(this.state.registered=="false"){
          return(<Login registered={this.setDataNST.bind(this)} email={this.state.email} tokenid={this.state.tokenid}/>)
        }
        
      }
      else{
        return(<Login registered={this.setDataNST.bind(this)} email={this.state.email} tokenid={this.state.tokenid}/>)
      }
    }

    

    
  }

  render() {
    
    return (
      <View style={styles.container}>
        {this.isRegistered()}
      </View>
    );
  }
}

const styleMedia = {
  spinnerStyle:{
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      maxHeight:40        
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
