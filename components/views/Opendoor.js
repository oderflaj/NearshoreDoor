import React,{Component} from 'react'
import { Image,ScrollView,StyleSheet, Text, View, Button, Alert, ActivityIndicator,TextInput, AsyncStorage } from 'react-native';
import LabelValue from '../commun/LabelValue'
import BigButton from '../commun/BigButton'
import CustomMessage from '../commun/CustomMessage'

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {spin:false,email:this.props.email,tokenid:this.props.tokenid,latitude: null,longitude: null,error: null,errorflag:false,custmess:''}
        
    }

    async componentWillMount(){
        // let registeredx = await AsyncStorage.getItem('registered') || "false"
        // let emailx = await AsyncStorage.getItem('email') || ""
        // let tokenidx = await AsyncStorage.getItem('tokenid') || ""
        // let profilex = await AsyncStorage.getItem('profile') || ""
        // //this.state.setState({email:email,tokenid:tokenid});
        // console.debug("registered->",registeredx," email->",emailx," tokenid->",tokenidx," profile->",profilex)
        // if(registeredx != undefined && emailx  != undefined && tokenidx != undefined && profilex  != undefined){
        //     this.state.setState({email:emailx,tokenid:tokenidx});
        // }

        console.debug("Email->",this.state.email)
        console.debug("tokenid->",this.state.tokenid)

    }

    async abreteSesamoSend(){
        let requestx = `http://opendoornst.azurewebsites.net/door/open//${this.state.email}/${this.state.tokenid}/${this.state.latitude}/${this.state.longitude}/`
        
        console.debug("RequestX->",requestx)
        
        this.setState({spin:true})
        

        return await fetch(requestx,{
          method: 'get', 
          })
          .then(resp=>{
        
            console.debug("Despues del fetch->",resp)
            if(resp.ok)
            {
              return resp.json()
            }
            
            throw new Error('Error request was not ok.');
            
          })
          .then(r=>{
            console.log("Respuesta interpretada",r)
            this.setState({spin:false})
            if(r.response=='Success'){
                Alert.alert(
                    'CONFIRMATION',
                    `Nearshore Door is opened!!!`,
                    [
                      
                      {text: 'OK', onPress: () => console.log('Se abrio la puerta'),  style: 'cancel'},
                    ],
                    { cancelable: false }
                  )
            }
            else{
                

                Alert.alert(
                    'ERROR',
                    `${r.number}:${r.detail}`,
                    [
                      
                      {text: 'OK', onPress: () => console.log('NO se abrio la puerta'),  style: 'cancel'},
                    ],
                    { cancelable: false }
                  )
                  if(r.response =='Bad token' || r.response == 'User not found'|| r.number == '106'){
                    AsyncStorage.setItem('email',"")
                    AsyncStorage.setItem('tokenid',"")
                    AsyncStorage.setItem('profile',"")
                    AsyncStorage.setItem('registered',"false")
                    this.props.notregistered()
                }
            }
            
              return r
          })
          .catch((error) => {
              console.warn('ERROR 1::::',error)
              
              this.setState({spin:false})
              Alert.alert(
                'CONFIRMACION',
                `Error when trying to open the door: ${error}. Check your internet connection.`,
                [
                  
                  {text: 'OK', onPress: () => console.log('No se abrio la puerta'),  style: 'cancel'},
                ],
                { cancelable: false }
              )
              return {No:"201",Error:"Error to Open the Nearshore Door", ErrorDetail:error}
          })
    }
    
 
    
    async abreteSesamo(){
        await navigator.geolocation.getCurrentPosition(
            (position) => {
              this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
              });              
              console.debug("abreteSesamoSend-->")
              this.abreteSesamoSend()
              //return position;
            },
            (error) => this.setState({ custmess:error.message,errorflag:true,spin:false }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        )
        
    }
    onEntrarPress(){
        console.debug(this.state.email)
        this.setState({spin:true,errorflag:false})
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test(this.state.email)){
            
            try {
                this.abreteSesamo()    
            } catch (error) {
                this.setState({custmess:error,errorflag:true,spin:false})    
            }

            

        }
        else{
            this.setState({custmess:`Email no es correcto: ${this.state.email}`,errorflag:true,spin:false})
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
           <BigButton fsize={50} onPress={
                   this.onEntrarPress.bind(this)
               }>
               OPEN
           </BigButton>
        );
    }
    isError(){
        if(this.state.errorflag){
            return(<CustomMessage 
                typeMessage='Error'
                messageText={this.state.custmess}
             />)
        }
    }
    render() {
        //this.state.setState({email:this.props.email,tokenid:this.props.tokenid})
        console.debug("Render this.state.email",this.state.email)
        console.debug("Render this.state.tokenid",this.state.tokenid)
        if(this.state.email==undefined||this.state.tokenid==undefined)
        {
            return(
                <View>
                    <Text>
                        LOADING . . .
                    </Text>
                </View>
            )
        }
        else
        {
            
            return (
                
                    <View style={stylesx.content}>
                        <Image
                                style={stylesx.imgLogo}
                                source={require('../../assets/Logo.png')}
                            />
                        
                        {this.isError()}
                        {this.renderButton()}
                    </View>
                
            );
        }
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