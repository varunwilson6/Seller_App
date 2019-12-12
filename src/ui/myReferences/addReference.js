import React,{Component} from 'react'
import {View,Text,TextInput,AsyncStorage,TouchableOpacity,ScrollView,Image,Alert,Platform,FlatList} from 'react-native'

/*  THIRD PARTY LIBRARIES */
import LocalizedStrings from 'react-native-localization';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import { TextField } from 'react-native-material-textfield';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {CANCEL,NO_REFERENCE} from '../../constants/image';
import {APP_COLOR} from '../../constants/colors';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
import TouchableOpacityBtn from '../../components/touchableOpacity';
import AddTitleModal from '../../components/addTitleModal';

/* LOCALIZATION */
import {en} from '../../localization/eng'
import {fr} from '../../localization/france'
import {de} from '../../localization/germany'
import {it} from '../../localization/italy'
import {es} from '../../localization/spain'
import {pl} from '../../localization/polish'
import {nl} from '../../localization/nederlands'
import {tr} from '../../localization/turkish'

import {YELLOW_COLOR,BUTTON_COLOR,FORM_BACKGROUND} from '../../constants/colors';

let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({en:en,fr: fr,de: de,it: it,es: es});

/*STYLES */
import {STYLES} from './styles';

/* API */
import {USER} from '../../api/sharedPreferencesKeys'
import {addReference} from '../../api/references/addReference'
import {userProfile} from '../../api/user/userProfile'
import {referenceById} from '../../api/references/referenceById'
import {updateReference} from '../../api/references/updateReference'

var sellerId=""
var apiKey=""

export default class AddReference extends Component{

  constructor(props){
    super(props);
    this.state={
      loading:false,
      name:'',
      companyName:'',
      contactNumber:'',
      email:'',
      website:'',
      description:''
    }
  }
  componentWillMount(){
     this.setState({
       visible:false
     })
     if(this.props.referenceId){
       this.setState({
         loading:true
       })
     }
     AsyncStorage.getItem(USER).then((value) => {
     if(value){
       var user = JSON.parse(value)
       sellerId=user.user.id
       apiKey=user.auth.key
       this.getCurrLang()
     }
   })
   }

   getCurrLang(){
      AsyncStorage.getItem("currLang").then((value) => {
      i18.setLanguage(value)
      this.referenceById()
    })
    }

    referenceById(){
      referenceById(sellerId,this.props.referenceId,apiKey,i18.getLanguage()).then((response) => {
        if(response.id){
          this.setState({
            loading:false,
            name:response.client?response.client.name:"",
            companyName:response.client?response.client.companyName:"",
            contactNumber:response.client?response.client.phone:"",
            email:response.client?response.client.email:"",
            website:response.client?response.client.website:"",
            description:response.text,
          })
        }
        else{
          this.setState({
          loading:false
         })
        }
      })
    }

   validateEmail(email) {
       var check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         return check.test(email);
     };

   addReference(){
     if(!this.state.name){
       Alert.alert(
       '',
       i18.enterValidName,
       [{text:i18.ok}]
     )
       return
     }
     if(!this.state.companyName){
       Alert.alert(
       '',
       i18.enterValidCompanyName,
       [{text:i18.ok}]
     )
       return
     }

     this.setState({
       loading:true
     })
     if(this.props.isUpdate){
       updateReference(this.state.description,this.state.name,this.state.companyName,this.state.contactNumber,this.state.email,this.state.website,sellerId,this.props.referenceId,i18.getLanguage(),apiKey).then((response) => {
         let status = response[0]
         let data = response[1]
         if(status<300){
           Alert.alert(
            '',
            i18.yourReferenceSavedSuccessfully,
            [{text:i18.ok,onPress: () =>   this.setState({
                    loading:false
                  }, () => {
                    Actions.BottomTab()
                  })
                }]
          )
         }
         else{
           Alert.alert(
            '',
            data.message,
            [{text:i18.ok,onPress: () => this.setState({
                    loading:false
                  })}]
          )
         }
       })
       return
     }
     addReference(this.state.description,this.state.name,this.state.companyName,this.state.contactNumber,this.state.email,this.state.website,sellerId,i18.getLanguage(),apiKey).then((response) => {
       let status = response[0]
       let data = response[1]
       if(status<300){
         Alert.alert(
          '',
          i18.yourReferenceCreatedSuccessfully,
          [{text:i18.ok,onPress: () =>   this.setState({
                  loading:false
                }, () => {
                  Actions.BottomTab()
                })
              }]
        )
       }
       else{
         Alert.alert(
          '',
          data.message,
          [{text:i18.ok,onPress: () => this.setState({
                  loading:false
                })}]
        )
       }
     })
   }
  render(){

    return(
      <View style={{flex:1,backgroundColor:'white',paddingBottom:20}}>
      <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

      <KeyboardAwareScrollView>
      <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/50,marginLeft:SCREEN_HEIGHT/33.3,textAlign:'left',fontSize:14,color:APP_COLOR,fontWeight:'bold'}]}>{i18.clientInformation}</Text>

      <View style={[STYLES.textfield,{marginTop:0}]}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.name} value={this.state.name} onChangeText={ (name) => this.setState({ name })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.companyName} value={this.state.companyName} onChangeText={ (companyName) => this.setState({ companyName })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} keyboardType="phone-pad" label={i18.contactNumber} value={this.state.contactNumber} onChangeText={ (contactNumber) => this.setState({ contactNumber })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField autoCapitalize="none" labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} keyboardType="email-address" activeLineWidth={0.5} label={i18.email} value={this.state.email} onChangeText={ (email) => this.setState({ email })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField autoCapitalize="none" labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.website} value={this.state.website} onChangeText={ (website) => this.setState({ website })}/>
      </View>

      <TextInput underlineColorAndroid='rgba(0,0,0,0)' onChangeText={ (description) => this.setState({ description })} placeholder={i18.shortNote} style={STYLES.description} value={this.state.description} textAlignVertical='top' multiline = {true} numberOfLines = {4}/>

      <View style={STYLES.relativeButton}>
          <TouchableOpacityBtn onPress={() => this.addReference()} style={[STYLES.buttonTxt,{color:'white'}]} title={this.props.isUpdate?i18.save:i18.add}/>
      </View>

      </KeyboardAwareScrollView>


    </View>
    )
  }
}
