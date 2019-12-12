import React,{Component} from 'react';
import {View,Text,Image,TouchableOpacity,ScrollView,AsyncStorage,Alert} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import CardView from 'react-native-cardview'
import {Actions} from 'react-native-router-flux';
import ImageLoad from 'react-native-image-placeholder';
import { TextField } from 'react-native-material-textfield';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import LocalizedStrings from 'react-native-localization';
import Spinner from 'react-native-loading-spinner-overlay';

/*CONSTANTS */
import {APP_COLOR,LIGHT_GRAY_TAB} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {MOBILE} from '../../constants/image';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
import TouchableOpacityBtn from '../../components/touchableOpacity';

/*STYLES */
import {STYLES} from './styles';

/* LOCALIZATION */
import {en} from '../../localization/eng'
import {fr} from '../../localization/france'
import {de} from '../../localization/germany'
import {it} from '../../localization/italy'
import {es} from '../../localization/spain'
import {pl} from '../../localization/polish'
import {nl} from '../../localization/nederlands'
import {tr} from '../../localization/turkish'

let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({en:en,fr: fr,de: de,it: it,es: es});

/* API */
import {updatePassword} from '../../api/user/updatePassword'
import {USER} from '../../api/sharedPreferencesKeys'

var id=""
var apiKey=""

export default class ChangePassword extends Component{
  constructor(props){
    super(props);
    this.state={
      visible:false,
      password:'',
      confirmPassword:'',
      loading:false
    }
  }
  componentWillMount(){
    this.setState({
      visible:false
    })
    AsyncStorage.getItem(USER).then((value) => {
      if(value){
        var user = JSON.parse(value)
        id=user.user.id
        apiKey=user.auth.key
      }
    })
    AsyncStorage.getItem("currLang").then((value) => {
      i18.setLanguage(value)
      this.setState({
        visible:false
      })
    })
  }
  savePassword(){
    if(!this.state.password){
      Alert.alert(
        '',
        i18.passwordLengthError,
        [{text:i18.ok}]
      )
      return
    }
    if(!this.state.confirmPassword){
      Alert.alert(
        '',
        i18.passwordLengthError,
        [{text:i18.ok}]
      )
      return
    }
    if(this.state.password != this.state.confirmPassword){
      Alert.alert(
        '',
        i18.passwordNotMatched,
        [{text:i18.ok}]
      )
      return
    }
    this.setState({
      loading:true
    })
    updatePassword(id,apiKey,this.state.password,i18.getLanguage()).then((response) => {
      if(response.id){
         Alert.alert(
          '',
          i18.passwordUpdatedSuccessfully,
          [{text:i18.ok,onPress: () =>   this.setState({
                  loading:false
                }, () => {
                  Actions.BottomTab()
                })
        }]
        )
      }
      else {
        Alert.alert(
          '',
          response.message,
          [{text:i18.ok,onPress: () =>   this.setState({
                  loading:false
                })}]
        )
      }
    })
  }
  render(){
    return(
      <View style={{flex:1,backgroundColor:LIGHT_GRAY_TAB}}>
        <View style={STYLES.horzLine}/>
        <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

        <View style={STYLES.textfield}>
          <TextField tintColor='gray' fontSize={14} labelFontSize={12} activeLineWidth={0.5} secureTextEntry label={i18.password} onChangeText={ (password) => this.setState({ password })}/>
        </View>

        <View style={STYLES.textfield}>
          <TextField tintColor='gray' fontSize={14} labelFontSize={12} activeLineWidth={0.5} secureTextEntry label={i18.newPassword}  onChangeText={ (confirmPassword) => this.setState({ confirmPassword })}/>
        </View>

         <View style={STYLES.bottomButton}>
            <TouchableOpacityBtn onPress={() => this.savePassword()} style={STYLES.buttonTxt} title={i18.save}/>
        </View>

      </View>
    )
  }
}
