import React,{Component} from 'react'
import {View,Text,TextInput,AsyncStorage,TouchableOpacity,ScrollView,Image,Alert,Platform} from 'react-native'

/*  THIRD PARTY LIBRARIES */
import LocalizedStrings from 'react-native-localization';
import { Dropdown } from 'react-native-material-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import { TextField } from 'react-native-material-textfield';
import CheckBox from 'react-native-check-box'
import ActionSheet from 'react-native-actionsheet'
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {APP_LOGO,ATTACH,CHECKMARK_ENABLE,CHECKMARK_DISABLE} from '../../constants/image';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
import TouchableOpacityBtn from '../../components/touchableOpacity';

/* LOCALIZATION */
import {en} from '../../localization/eng'
import {fr} from '../../localization/france'
import {de} from '../../localization/germany'
import {it} from '../../localization/italy'
import {es} from '../../localization/spain'
import {pl} from '../../localization/polish'
import {nl} from '../../localization/nederlands'
import {tr} from '../../localization/turkish'

import {BUTTON_COLOR,FORM_BACKGROUND} from '../../constants/colors';

let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({en:en,fr: fr,de: de,it: it,es: es});

/*STYLES */
import {STYLES} from './styles';

/* API */
import {USER} from '../../api/sharedPreferencesKeys'
import {sendQuotation} from '../../api/quotation/sendQuotation'

/* FUNCTIONS */
import {pickSingleWithCamera,pickFromGallery} from '../../utils/camera'

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = [ 'Cancel', 'From Camera', 'From Library' ]
var cameraImgCount=0
var libraryImgCount=0
var senderId=""
var apiKey=""

export default class SendQuotations extends Component{

  constructor(props){
    super(props);

    this.state={
      quantityRequired:'',
      unitPrice:'',
      productDescription:this.props.productDescription,
      proposal:'',
      deliveryTime:'',
      title:'',
      quotedPrice:'',
      coverLetter:'',
      estimatedDeliveryTime:'',
      minQuantity:'',
      loading:false,
      minQualityPlaceholder:'',
      quotedPricePlaceholder:''
    }
  }

  componentWillMount(){
    this.setState({
      minQualityPlaceholder:"≥ "+this.props.quantityRequired,
      quotedPricePlaceholder:"≥ "+this.props.unitPrice
    })
    AsyncStorage.getItem("currLang").then((value) => {
      if(value){
        i18.setLanguage(value)
      }
    })
    AsyncStorage.getItem(USER).then((value) => {
    if(value){
      var user = JSON.parse(value)
      senderId=user.user.id
    }
  })
  }

  sendQuotation(){
    if(!this.state.title){
      Alert.alert(
        '',
        i18.pleaseEnterTitle,
        [{text:i18.ok}]
      )
      return
    }
    if(!this.state.minQuantity){
      Alert.alert(
        '',
        i18.pleaseEnterMinQuantity,
        [{text:i18.ok}]
      )
      return
    }
    if(!this.state.quotedPrice){
      Alert.alert(
        '',
        i18.pleaseEnterQuotedPrice,
        [{text:i18.ok}]
      )
      return
    }
    if(!this.state.estimatedDeliveryTime){
      Alert.alert(
        '',
        i18.pleaseEnterEstimatedDeliveryTime,
        [{text:i18.ok}]
      )
      return
    }
     if(!this.state.coverLetter){
      Alert.alert(
        '',
        i18.pleaseEnterCoverLetter,
        [{text:i18.ok}]
      )
      return
    }
    this.setState({
      loading:true
    })
    sendQuotation(this.props.rfqId,this.state.title,this.state.coverLetter,this.props.productId,senderId,this.state.quotedPrice,this.state.minQuantity,this.state.estimatedDeliveryTime,i18.getLanguage()).then((response) => {
      let status=response[0]
      let data=response[1]
      if(status < 300){
         Alert.alert(
          '',
          i18.quottionSubmittedSuccessfully,
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
          [{text:i18.ok,onPress: () =>   this.setState({
                  loading:false
                })}]
        )
      }
    })

  }
  render(){

    return(
      <View style={{flex:1,backgroundColor:'white'}}>
      <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

      <KeyboardAwareScrollView>
          <Text style={[STYLES.title,{color:'gray'}]}>{i18.title}</Text>
          <TextInput multiline underlineColorAndroid='rgba(0,0,0,0)' style={[STYLES.textInput]} placeholder={i18.enterTitle} onChangeText={title => this.setState({title})}/>
          <View style={[STYLES.horzLine,{marginTop:10,marginLeft:10}]}/>

          <Text style={[STYLES.title,{color:'gray'}]}>{i18.minQuantity}</Text>
          <TextInput keyboardType="phone-pad" underlineColorAndroid='rgba(0,0,0,0)' style={[STYLES.textInput]} placeholder={this.state.minQualityPlaceholder} onChangeText={minQuantity => this.setState({minQuantity})}/>
          <View style={[STYLES.horzLine,{marginTop:10,marginLeft:10}]}/>

          <Text style={[STYLES.title,{color:'gray'}]}>{i18.quotedPrice} {i18.perQuantity}</Text>
          <TextInput keyboardType="phone-pad" underlineColorAndroid='rgba(0,0,0,0)' style={[STYLES.textInput]} placeholder={this.state.quotedPricePlaceholder} onChangeText={quotedPrice => this.setState({quotedPrice})}/>
          <View style={[STYLES.horzLine,{marginTop:10,marginLeft:10}]}/>

          <Text style={[STYLES.title,{color:'gray'}]}>{i18.estimatedDeliveryTime} ({i18.inDays})</Text>
          <TextInput keyboardType="phone-pad" underlineColorAndroid='rgba(0,0,0,0)' style={[STYLES.textInput]} placeholder={i18.enterEtimatedDeliveryTime} onChangeText={estimatedDeliveryTime => this.setState({estimatedDeliveryTime})}/>
          <View style={[STYLES.horzLine,{marginTop:10,marginLeft:10}]}/>

          <Text style={[STYLES.title,{color:'gray'}]}>{i18.coverLetter}</Text>
          <TextInput textAlignVertical='top' multiline underlineColorAndroid='rgba(0,0,0,0)' style={[STYLES.description,{marginTop:5}]} placeholder={i18.enterCoverLetter} onChangeText={coverLetter => this.setState({coverLetter})}/>
          <View style={[STYLES.horzLine,{marginTop:10,marginLeft:10,display:this.state.productDescription?"flex":"none"}]}/>

      </KeyboardAwareScrollView>
        <View style={[STYLES.button]}>
            <TouchableOpacityBtn onPress={() => this.sendQuotation()} style={STYLES.buttonTxt} title={i18.submit}/>
        </View>

      </View>
    )
  }
}
