import React,{Component} from 'react'
import { Image,StyleSheet, Text, View, 
         Button, Alert, ActivityIndicator,
         TextInput,KeyboardAvoidingView, AsyncStorage } from 'react-native';
import LabelValue from '../commun/LabelValue'
import BigButton from '../commun/BigButton'
import CustomMessage from '../commun/CustomMessage'
import {
    Permissions,
    Notifications,
  } from 'expo';

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {tokenid:undefined,custmess:undefined, spin:false, email:'',errorflag:false, notificacio:undefined};
        
    }

    async componentWillMount(){    
        
        this.registerForPushNotificationsAsync();        
        // Handle notifications that are received or selected while the app
        // is open. If the app was closed and then opened by tapping the
        // notification (rather than just tapping the app icon to open it),
        // this function will fire on the next tick after the app starts
        // with the notification data.
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
    
    }
    
    _handleNotification = (notification) => {
        this.setState({notification: notification});
      };
    
      
    
    async registerForPushNotificationsAsync() {
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
    
        //console.warn("Esta solicitando permisos....")
        //let token = await Notifications.getExpoPushTokenAsync();
        
        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
          // Android remote notification permissions are granted during the app
          // install, so this will only ask on iOS
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
    
        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
          return;
        }
    
        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        
        AsyncStorage.setItem('tokenid',token)
        this.setState({tokenid:token});
    
    }


    isError(){
        if(this.state.errorflag){
            return(<CustomMessage 
                typeMessage='Error'
                messageText={this.state.custmess}
             />)
        }
        
    }
    register(){
        //let requestx = 'http://192.168.100.253/openDoor'
        let requestx = `http://opendoornst.azurewebsites.net/door/login/${this.state.email}/${this.state.tokenid}`
        
        this.setState({spin:true})
        
        console.log(`Email ${this.state.email}   Token ${this.state.tokenid}`)
        console.log("Entra a REGISTER---------->>>>>>>>>",requestx)
        
        return fetch(requestx,{
          method: 'get', 
          })
          .then(resp=>{
            
            if(resp.ok)
            {
              console.debug("Respuesta de Fetch-OK-->>>",resp)
              return resp.json()
            }
            console.debug("Respuesta de Fetch-Error-->>>",resp)
            throw new Error('Network response was not ok.',resp);
            
          })
          .then(r=>{
            console.debug("Respuesta que llega",r)
            return r
          })
          .catch((error) => {
              console.debug('ERROR 1::::',error)
              
              this.setState({spin:false})
              Alert.alert(
                'CONFIRMACION',
                `Error al intentar abrir la puerta: ${error}.`,
                [
                  
                  {text: 'OK', onPress: () => console.log('No se abrio la puerta'),  style: 'cancel'},
                ],
                { cancelable: false }
              )
              return {No:"101",Error:"Error al abrir Nearshore Puerta", ErrorDetail:error}
          })
    }

    async onLoginPress(){
        
        this.setState({spin:true,errorflag:false})
        var re = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i
        
        if(re.test(this.state.email)){
            try{
                this.register()
                .then(resp=>{
                        console.warn('Respuesta.respOk --->>>>',resp)
                        if(resp.response=='Success')
                        {
                            AsyncStorage.setItem('email',this.state.email)
                            AsyncStorage.setItem('tokenid',this.state.tokenid)
                            AsyncStorage.setItem('profile',resp.profile)
                            AsyncStorage.setItem('registered',"true")
                            this.setState({errorflag:false})
                            this.props.registered()
                        }
                        else
                        {
                            this.setState({custmess:`Error in the initial login: ${resp.number}: ${resp.detail}`,errorflag:true,spin:false})
                        }
                })
            }
            catch(error){
                this.setState({custmess:`Error sending request to register the user: ${error}`,errorflag:true,spin:false})
            }
            

        }
        else{
            this.setState({custmess:'Email no es correcto, debe tener dominio nearshoretechnology',errorflag:true,spin:false})
        }

    }
    renderButton(){
        if(this.state.spin)
        {
            return (<View >
                        <ActivityIndicator size='large'  />
                    </View>)
        }

        return(
           <BigButton onPress={
                   this.onLoginPress.bind(this)
               }>
               LOGIN
           </BigButton>
        );
    }
    saveEmail(em){
        this.setState({email:em})
    }
    render() {
        return (
            <KeyboardAvoidingView behavior="padding">
                <View style={stylesx.content}>
                    <Image
                            style={stylesx.imgLogo}
                            source={require('../../assets/Logo.png')}
                        />
                    <View style={{ marginTop:-10}}>
                        <LabelValue labelx={'EMAIL'}>
                            <TextInput 
                                style={stylesx.inputemail}
                                placeholder='Nearshore Email'
                                underlineColorAndroid='transparent'
                                keyboardType='email-address' 
                                blurOnSubmit={true} 
                                autoCorrect={false} 
                                autoCapitalize="none" 
                                onChangeText={(email)=>{this.saveEmail(email)}}
                            />
                        </LabelValue>
                    </View>

                    {this.isError()}
                    {this.renderButton()}
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const stylesx = {
    inputemail:{
        borderBottomWidth:1,
        marginTop: 10,
        color:'#595959',
        fontSize: 16
        
    },
    imgLogo:{
        height: 125,
        width: 300,
        //borderRadius: 10
    },
    content:{
        flex:1,
        //position: 'absolute', top: 0, bottom: 0, left: 0, right: 0
        justifyContent: 'space-around',
        margin: 3,
        // flexDirection:'column',
        //alignSelf: 'center',
        // borderColor: '#000',
        //borderWidth:1,


        
    },

    spinnerStyle:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight:40        
    }
  };

export default Login;