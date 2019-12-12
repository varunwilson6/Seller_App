import React,{Component} from 'react'
import {View,Text,TextInput,AsyncStorage,TouchableOpacity,ScrollView,Image,Alert,Platform,FlatList} from 'react-native'

/*  THIRD PARTY LIBRARIES */
import LocalizedStrings from 'react-native-localization';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Pdf from 'react-native-pdf';

import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {CANCEL,NO_CERTIFICATE} from '../../constants/image';

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
import {uploadCertificate} from '../../api/certificate/uploadCertificate'
import {updateCertificate} from '../../api/certificate/updateCertificate'
import {userProfile} from '../../api/user/userProfile'
import {removeCertificate} from '../../api/certificate/removeCertificate'

var sellerId=""
var apiKey=""

export default class MembershipPlan extends Component{

  constructor(props){
    super(props);
    this.state={
      loading:true,
      pdf:null,
      title:'',
      isOpenTitleModal:false,
      isResultFound:null
    }
  }
  componentWillMount(){
     this.setState({
       visible:false
     })
     AsyncStorage.getItem(USER).then((value) => {
     if(value){
       var user = JSON.parse(value)
       sellerId=user.user.id
       apiKey=user.auth.key
       this.getCurrLang()
     }
   })
   }

   userProfile(){
     userProfile(sellerId,apiKey,i18.getLanguage()).then((response) => {
       if(response.id){
         this.setState({
           loading:false,
           pdf:response.certificates && response.certificates.length > 0?response.certificates:null,
           title:response.title?response.title:"",
         }, () => {
            if(this.state.pdf){
              this.setState({
                isResultFound:true
              })
            }
            else{
              this.setState({
                isResultFound:false
              })
            }
         })
       }
       else{
         this.setState({
         loading:false,
         isResultFound:false
        })
       }
     })
   }
    getCurrLang(){
       AsyncStorage.getItem("currLang").then((value) => {
       i18.setLanguage(value)
       this.userProfile()
     })
     }

  addCertificate(){
    DocumentPicker.show({
    filetype: [DocumentPickerUtil.pdf(),'public.composite-content'],
  },(error,res) => {
    if(error) {
     return console.log(error)
    }
    if(res.uri){
      if(this.state.pdf == null || this.state.pdf == undefined || this.state.pdf == '') {
        this.setState({
          pdf: [{uri:res.uri}]
        })
      }
      else{
        this.setState({
          pdf: [...this.state.pdf,{uri: res.uri}]
        });
      }
      this.uploadCertificate(Platform.OS == "ios"?res.uri.split('file://')[1]:res.uri)
    }
    else{
      Alert.alert(
        '',
        response.somethingWentWrong,
        [{text:i18.ok,onPress: () =>   this.setState({
                loading:false
              })}]
      )
    }
  });
  }

  uploadCertificate(pdf) {
    this.setState({
      loading:true,
      isResultFound:null
    })
      uploadCertificate(pdf,sellerId,i18.getLanguage()).then((response) => {
        if(response.id){
          this.setState({
            loading:false,
            isOpenTitleModal:true,
            certificateId:response.id
          },() => {
            this.userProfile()
          })
        }
        else{
          console.log(response)
          Alert.alert(
            '',
            response.message,
            [{text:i18.ok,onPress: () =>   this.setState({
                    loading:false
                  })}]
          )
        }
    }).catch(err => {
      console.log(" Upload Error ",err)
    })
  }

  viewCertificate(pdf){
    Actions.ViewCertificate({
      title:i18.viewCertificateTitle,
      pdf:pdf
    })
  }

  removeCertificate(id){
    console.log("PDF id or URL ", id, id.split(":")[1], this.state.pdf )

    Alert.alert(
      i18.delete,
      i18.areYouSure,
      [
        {text:i18.cancel,style:'cancel'},
        {text:i18.yes,onPress: () => {
          this.deleteCertificate(id)
        }}
      ],
      {cancelable:false}
      )
    }

  deleteCertificate(certificateId){
    this.setState({
      loading:true
    })
    removeCertificate(sellerId,certificateId,i18.getLanguage()).then((response) => {
      this.userProfile()
    })
  }
  renderPdf(pdf,title) {
    return (
      <View>
        <View style={{flexDirection:'row',alignSelf:'center'}}>
            <View style={STYLES.pdf}>
              <Pdf source={{uri:encodeURI(pdf.uri?pdf.uri:pdf.url),cache:true}} style={[STYLES.pdf,{marginTop:0}]}/>
            </View>
            <TouchableOpacity style={{position:'absolute',marginTop:25,right:-3,width:30,height:30}} activeOpacity={1} onPress={() => this.removeCertificate(pdf._id)}>
              <Image style={STYLES.cancel} source={CANCEL}/>
            </TouchableOpacity>
        </View>
          <Text style={STYLES.title}>{title}</Text>
          <TouchableOpacity style={{marginTop:10}} activeOpacity={1} onPress={() => this.viewCertificate(pdf.uri?pdf.uri:pdf.url)}>
            <Text style={STYLES.btnTxt}>{i18.clickToView}</Text>
          </TouchableOpacity>
      </View>
    )
  }

  addTitle(){

    if(!this.state.title){
      Alert.alert(
        '',
        i18.titleCannotBeEmpty,
        [{text:i18.ok}]
      )
      return
    }
    this.setState({
      loading:true
    })
    updateCertificate(sellerId,this.state.certificateId,this.state.title,i18.getLanguage()).then((response) => {
      let status = response[0]
      let data = response[1]
      if(status < 300){
        Alert.alert(
          '',
          i18.certificateUploadedSuccessfully,
          [{text:i18.ok,onPress: () =>   this.setState({
                  loading:false,
                  isOpenTitleModal:false
                })}]
        )
      }
      else{
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
      <View style={{flex:1,backgroundColor:'white'}}>
      <AddTitleModal isOpen={this.state.isOpenTitleModal} onChangeText={(title) => this.setState({title:title})} addTitle={() => this.addTitle()}/>
      <View style={STYLES.childRoot}>
        <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />
        <Image source={NO_CERTIFICATE} style={[STYLES.product,{display:this.state.isResultFound == false?"flex":"none"}]}/>
        <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/25,color:'gray',display:this.state.isResultFound == false?"flex":"none"}]}>{i18.noCertificatesUploaded}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {this.state.pdf && this.state.pdf != undefined ? this.state.pdf.map(i => <View key={i.uri}>{this.renderPdf(i,i.title?i.title:this.state.title)}</View>) : null}
          </View>
        </ScrollView>
      </View>
      <View style={[STYLES.button]}>
        <TouchableOpacityBtn onPress={() => this.addCertificate()} style={STYLES.buttonTxt} title={i18.addCertificate}/>
      </View>
      </View>
    )
  }
}
