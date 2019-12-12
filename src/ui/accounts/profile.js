import React,{Component} from 'react';
import {View,Text,Image,TouchableOpacity,ScrollView,AsyncStorage,Alert,TextInput} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageLoad from 'react-native-image-placeholder';
import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import { TextField } from 'react-native-material-textfield';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import ActionSheet from 'react-native-actionsheet'
import LocalizedStrings from 'react-native-localization';
import Spinner from 'react-native-loading-spinner-overlay';
import Geocoder from 'react-native-geocoder';
import RNGooglePlaces from 'react-native-google-places';
import MultiSelect from 'react-native-multiple-select';
import CheckBox from 'react-native-check-box'
import FastImage from 'react-native-fast-image'

/*CONSTANTS */
import {BUTTON_COLOR,LIGHT_GRAY_TAB,APP_COLOR} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {EDIT_PROFILE,UNVERIFIED,VERIFIED,CHECKMARK_ENABLE,CHECKMARK_DISABLE} from '../../constants/image';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
import TouchableOpacityBtn from '../../components/touchableOpacity';

/* FUNCTIONS */
import {pickSingleWithCamera,pickFromGallery} from '../../utils/camera'

/*STYLES */
import {STYLES} from './styles';

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = [ 'Cancel', 'From Camera', 'From Library' ]

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
import {RATING_YELLOW,RATING_RED} from '../../constants/colors';

/* API */
import {userProfile} from '../../api/user/userProfile'
import {updateUser} from '../../api/user/updateUser'
import {USER} from '../../api/sharedPreferencesKeys'
import {uploadImage} from '../../api/user/uploadProfilePic'
import {verifyEmail} from '../../api/auth/verifyEmail'
import {userMainProducts} from '../../api/product/allProducts'


var id=""
var apiKey=""
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = 0.003;

var displayPic="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"

export default class Profile extends Component{
  constructor(props){
    super(props);
    this.showActionSheet = this.showActionSheet.bind(this)
    this.handleActionSheet = this.handleActionSheet.bind(this)
    this.state={
      phone:'',
      selected:'',
      image:null,
      images:null,
      profileDisplay:'flex',
      visible:true,
      loading:true,
      username:'',
      firstName:'',
      lastName:'',
      email:'',
      username:'',
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      state:'',
      cityName:'',
      zip_code:'',
      country_name:'',
      address:'',
      isEmailVerified:false,
      isProfileVerified:'',
      operationalState:'',
      operatinalCityName:'',
      operationalZipcode:'',
      operationalCountry_name:'',
      website:'',
      established:'',
      employeeCount:'',
      companyProfile:'',
      description:'',
      companyName:'',
      operationalAddress:'',
      mainProducts:[],
      mainProductsItems : [],
      contactPersonEmail:'',
      contactPersonName:'',
      contactPersonPhone:'',
      isProfileVerified:'pending',
      isProfileApproved:'pending',
    }
  }
  componentWillMount(){

    AsyncStorage.getItem(USER).then((value) => {
      if(value){
        var user = JSON.parse(value)

        id=user.user.id
        apiKey=user.auth.key
        userProfile(user.user.id,apiKey,i18.getLanguage()).then((response) => {
          if(response.id){
            this.setState({
            loading:false,
            firstName:response.firstName,
            lastName:response.lastName,
            email:response.email,
            username:response.username,
            contactNumber:response.phone,
            isEmailVerified:response.isEmailVerified,
            isProfileVerified:response.isProfileVerified,
            state:response.registeredAddress?response.registeredAddress.state:"",
            cityName:response.registeredAddress?response.registeredAddress.city:"",
            zip_code:response.registeredAddress && response.registeredAddress != undefined && response.registeredAddress.areaCode?response.registeredAddress.areaCode.toString():"",
            country_name:response.registeredAddress?response.registeredAddress.country:"",
            address:response.registeredAddress?response.registeredAddress.address:"",
            operationalState:response.operationalAddress?response.operationalAddress.state:"",
            operatinalCityName:response.operationalAddress?response.operationalAddress.city:"",
            operationalZipcode:response.operationalAddress && response.operationalAddress != undefined && response.operationalAddress.areaCode?response.operationalAddress.areaCode.toString():"",
            operationalCountry_name:response.operationalAddress?response.operationalAddress.country:"",
            website:response.website?response.website:"",
            established:response.established && response.established != undefined?response.established.toString():"",
            employeeCount:response.employeeCount && response.employeeCount != undefined?response.employeeCount.toString():"",
            companyProfile:response.companyProfile?response.companyProfile:"",
            description:response.aboutUs?response.aboutUs:"",
            companyName:response.companyName?response.companyName:"",
            operationalAddress:response.operationalAddress?response.operationalAddress.address:"",
            mainProducts:response.mainProducts?response.mainProducts:[],
            visible:false,
            isChecked:false,
            prevOperationalState:'',
            prevOperationalCountry_name:'',
            prevOperatinalCityName:'',
            prevOperationalZipcode:'',
            prevOperationalAddress:'',
            contactPersonEmail:response.contactPerson?response.contactPerson.email:"",
            contactPersonName:response.contactPerson?response.contactPerson.name:"",
            contactPersonPhone:response.contactPerson?response.contactPerson.phone:"",
            isProfileVerified:response.isProfileVerified,
            isProfileApproved:response.isProfileApproved,
          })
          }
          else{
            this.setState({
            loading:false,
          })
          }
        })
        userMainProducts(id,apiKey,i18.getLanguage()).then((response) =>{
          for(i=0;i<response.count;i++){
            this.setState({
              mainProductsItems:[...this.state.mainProductsItems,{id:response.products[i].id,name:response.products[i].name}]
            })
          }
        })
      }
    })

      AsyncStorage.getItem("currLang").then((value) => {
        i18.setLanguage(value)
        this.setState({
          visible:false
        })
      })

  }

    onClickCheckmark() {
          this.setState({
            isChecked:!this.state.isChecked
          }, () => {
            if(this.state.isChecked){
              this.setState({
                prevOperationalState:this.state.operationalState,
                prevOperationalCountry_name:this.state.operationalCountry_name,
                prevOperatinalCityName:this.state.operatinalCityName,
                prevOperationalZipcode:this.state.operationalZipcode,
                prevOperationalAddress:this.state.operationalAddress,

                operationalState:this.state.state,
                operationalCountry_name:this.state.country_name,
                operatinalCityName:this.state.cityName,
                operationalZipcode:this.state.zip_code,
                operationalAddress:this.state.address
              })
            }
            else{
              this.setState({
                operationalState:this.state.prevOperationalState,
                operationalCountry_name:this.state.prevOperationalCountry_name,
                operatinalCityName:this.state.prevOperatinalCityName,
                operationalZipcode:this.state.prevOperationalZipcode,
                operationalAddress:this.state.prevOperationalAddress
              })
            }
          })
        }
  openGooglePlaces() {
    this.setState({
      visible:true
    })
    RNGooglePlaces.openAutocompleteModal()
    .then((place) => {
      var coords = {
        lat:  place.latitude,
        lng:  place.longitude
      };
      this.setState({
        region: {
          latitude: place.latitude,
          longitude: place.longitude
        }
      });
      Geocoder.geocodePosition(coords).then(res => {
        this.setState({
          state:res[0].adminArea,
          country_name:res[0].country,
          cityName:res[0].locality,
          zip_code:res[0].postalCode,
          visible:false,
          address:res[0].formattedAddress
        })
    })
    .catch(err => {
      this.setState({
      visible:false
      })
    })
    })
    .catch((error) => {
      this.setState({
      visible:false
      })
    })
    }

    openGooglePlaces2() {
      this.setState({
      visible:true
    })
      RNGooglePlaces.openAutocompleteModal()
      .then((place) => {
        var coords = {
          lat:  place.latitude,
          lng:  place.longitude
        };
        this.setState({
          region: {
            latitude: place.latitude,
            longitude: place.longitude
          }
        });
        Geocoder.geocodePosition(coords).then(res => {
          this.setState({
            operationalState:res[0].adminArea,
            operationalCountry_name:res[0].country,
            operatinalCityName:res[0].locality,
            operationalZipcode:res[0].postalCode,
             visible:false,
            operationalAddress:res[0].formattedAddress
          })
      })
      .catch(err => {
        this.setState({
      visible:false
      })
      })
      })
      .catch((error) => {
        this.setState({
      visible:false
      })
      })
      }
  changePassword(){
    Actions.ChangePassword({
      title:i18.changePassword
    })
  }
  showActionSheet() {
   this.ActionSheet.show()
 }

 handleActionSheet(i) {
   this.setState({
     selected: i
   },() => {
    if(this.state.selected == 1){
      this.pickSingleWithCamera(false)
    }
     if(this.state.selected == 2){
     this.pickFromGallery(false,false)
   }
   })

}
  pickSingleWithCamera(cropping) {
    pickSingleWithCamera(cropping).then(image => {
      this.setState({
        image: {uri: image.path, width: image.width, height: image.height},
        images: null,
        profileDisplay:'none'
      });
      this.imageUpload(image.path,image.mime)
    })
  }
  pickFromGallery(cropit,circular) {
    pickFromGallery(cropit,circular).then((image) => {
      this.setState({
        image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
        images: null,
        profileDisplay:'none'
      });
      this.imageUpload(image.path,image.mime)
  })
}

  renderImage(image) {
    return <Image resizeMode="contain" source={image} style={[STYLES.profile]}/>
  }

  renderAsset(image) {
    return this.renderImage(image);
  }
  imageUpload(image,mime) {
    this.setState({
      loading:true
    })
      const ext=mime.split('/')[1]
      uploadImage(mime,image,ext,id,i18.getLanguage()).then((response) => {
        this.setState({
          loading:false
        }, () => {
            Actions.BottomTab()
        })
    })
  }
  updateUser(){

   if(!this.state.address){
     Alert.alert(
        '',
        i18.addressCannotBeEmpty,
        [{text:i18.ok}]
      )
      return
   }
   if(!this.state.operationalAddress){
    Alert.alert(
        '',
        i18.operationalAddressCannotBeEmpty,
        [{text:i18.ok}]
      )
      return
   }
   if(!this.state.website){
    Alert.alert(
        '',
        i18.websiteCannotBeEmpty,
        [{text:i18.ok}]
      )
      return
   }
   if(!this.state.established){
    Alert.alert(
        '',
        i18.establishedCannotBeEmpty,
        [{text:i18.ok}]
      )
      return
   }
   if(!this.state.employeeCount){
    Alert.alert(
        '',
        i18.employeeCountCannotBeEmpty,
        [{text:i18.ok}]
      )
      return
   }
   this.setState({
    loading:true
   })
    updateUser(id,apiKey,this.state.username,this.state.email,this.state.contactNumber,this.state.firstName,this.state.lastName,this.state.state,this.state.cityName,this.state.zip_code,
      this.state.country_name,this.state.address,this.state.operationalState,this.state.operatinalCityName,this.state.operationalZipcode,this.state.operationalCountry_name,
      this.state.website,this.state.established,this.state.employeeCount,this.state.companyName, this.state.description,this.state.operationalAddress,this.state.mainProducts,i18.getLanguage(),this.state.contactPersonName,this.state.contactPersonPhone,this.state.contactPersonEmail).then((response) => {
      if(response.id){
        Alert.alert(
          '',
          i18.profileUpdatedSuccessfully,
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
  emailVerifiedModel(){
    Alert.alert(
    i18.emailNotVerified,
    i18.verifyNow,
    [
  {text:i18.later,style:'cancel'},
  {text:i18.verify,onPress: () => {
    this.setState({
      loading:true
    })
    verifyEmail(this.state.email,i18.getLanguage()).then((response) => {
      Alert.alert(
       '',
       response.message,
       [{text:i18.ok,onPress: () =>   this.setState({
               loading:false
             })}]
     )

    })
  }}
  ],
    {cancelable:false}
    )
  }

  onSelectedItemsChange = (mainProducts) => {
      this.setState({
        mainProducts:mainProducts
      })
   }

   isProfileVerifiedBackgroundColor(status){
  if(status == 'pending'){
    return RATING_YELLOW
  }
  if(status == 'verified'){
    return '#28C2E1'
  }
  if(status == 'rejected'){
    return RATING_RED
  }
  return RATING_YELLOW
}

isProfileApprovedBackgroundColor(status){
  if(status == 'pending'){
    return RATING_YELLOW
  }
  if(status == 'approved'){
    return '#28C2E1'
  }
  if(status == 'rejected'){
    return RATING_RED
  }
  return RATING_YELLOW
}
  render(){

    return(
        <View style={{flex:1,backgroundColor:'white',paddingBottom:SCREEN_HEIGHT/33.3}}>
          <View style={STYLES.horzLine}/>
          <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

            <KeyboardAwareScrollView>

            <ActionSheet ref={o => this.ActionSheet = o}options={options} cancelButtonIndex={CANCEL_INDEX}
            destructiveButtonIndex={DESTRUCTIVE_INDEX} onPress={this.handleActionSheet} title={i18.attachPhotos}/>

            <TouchableOpacity activeOpacity={1} onPress={this.showActionSheet}>
              <View style={[STYLES.profileContainer]}>
                {this.state.image ? this.renderAsset(this.state.image) : null}
                {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                <FastImage style={[STYLES.profile,{display:this.state.profileDisplay}]} source={{uri:encodeURI(this.props.displayPic?this.props.displayPic:displayPic),priority: FastImage.priority.normal,}}
      						resizeMode={FastImage.resizeMode.stretch}/>
                <Text style={[STYLES.text,{fontSize:12,color:'gray',marginTop:SCREEN_HEIGHT/100}]}>{i18.clickToEdit}</Text>

              </View>
            </TouchableOpacity>

            <View style={{flexDirection:'row'}}>
            <Text style={[STYLES.txt]}>{i18.profileVerification} : </Text>
            <View style={{marginTop:10,backgroundColor:this.isProfileVerifiedBackgroundColor(this.state.isProfileVerified),height:18,borderRadius:2,margin:3,paddingLeft:3,paddingRight:3}}>
              <Text style={{fontSize:13,color:'white'}}>{this.state.isProfileVerified}</Text>
            </View>
          </View>

          <View style={{flexDirection:'row'}}>
            <Text style={[STYLES.txt]}>{i18.profileApproval} : </Text>
            <View style={{marginTop:10,backgroundColor:this.isProfileApprovedBackgroundColor(this.state.isProfileApproved),height:18,borderRadius:2,margin:3,paddingLeft:3,paddingRight:3}}>
              <Text style={{fontSize:13,color:'white'}}>{this.state.isProfileApproved}</Text>
            </View>
          </View>

          <View style={[STYLES.grayDiv,{height:5,marginTop:SCREEN_HEIGHT/50}]}/>
            <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/50,marginLeft:SCREEN_HEIGHT/33.3,textAlign:'left',fontSize:14,color:APP_COLOR,fontWeight:'bold'}]}>{i18.basicInformation}</Text>
            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.firstName} value={this.state.firstName} onChangeText={ (firstName) => this.setState({ firstName })}/>
            </View>

            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.lastName} value={this.state.lastName} onChangeText={ (lastName) => this.setState({ lastName })}/>
            </View>

            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} keyboardType="phone-pad" label={i18.contactNumber} value={this.state.contactNumber} onChangeText={ (contactNumber) => this.setState({ contactNumber })}/>
            </View>

            <View style={[STYLES.textfield,{flexDriection:'row'}]}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} editable={false} tintColor='gray' fontSize={14} labelFontSize={12} activeLineWidth={0.5} label={i18.email} value={this.state.email} onChangeText={ (email) => this.setState({ email })}/>
              <TouchableOpacity style={{position:'absolute',right:10,top:SCREEN_HEIGHT/50+23}} activeOpacity={1} onPress={() => this.emailVerifiedModel()}>
                <Image source={UNVERIFIED} style={[STYLES.unVerified,{display:this.state.isEmailVerified?"none":"flex"}]}/>
            </TouchableOpacity>
            </View>
            <Text style={[STYLES.verified,{display:this.state.isEmailVerified?"flex":"none"}]}>verified</Text>

            <View style={[STYLES.grayDiv,{height:5,marginTop:10}]}/>
            <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/50,marginLeft:SCREEN_HEIGHT/33.3,textAlign:'left',fontSize:14,color:APP_COLOR,fontWeight:'bold'}]}>{i18.contactPersonDetails}</Text>
            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.name} value={this.state.contactPersonName} onChangeText={ (contactPersonName) => this.setState({ contactPersonName })}/>
            </View>

            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} keyboardType="phone-pad" tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.contactNumber} value={this.state.contactPersonPhone} onChangeText={ (contactPersonPhone) => this.setState({ contactPersonPhone })}/>
            </View>

            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} labelFontSize={12} activeLineWidth={0.5} keyboardType="email-address" label={i18.email} value={this.state.contactPersonEmail} onChangeText={ (contactPersonEmail) => this.setState({ contactPersonEmail })}/>
            </View>

            <View style={[STYLES.grayDiv,{height:5,marginTop:10}]}/>

            <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/50,marginLeft:SCREEN_HEIGHT/33.3,textAlign:'left',fontSize:14,color:APP_COLOR,fontWeight:'bold'}]}>{i18.registeredAddress}</Text>
            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} onFocus={() => this.openGooglePlaces()}  tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.Address} value={this.state.address} onChangeText={ (address) => this.setState({ address })}/>
            </View>

            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} editable={false} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.city} value={this.state.cityName} onChangeText={ (cityName) => this.setState({ cityName })}/>
            </View>

            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} editable={false} tintColor='gray' fontSize={14} labelFontSize={12} activeLineWidth={0.5} label={i18.zipCode} value={this.state.zip_code} onChangeText={ (zip_code) => this.setState({ zip_code })}/>
            </View>

            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} editable={false} tintColor='gray' fontSize={14} labelFontSize={12} activeLineWidth={0.5} label={i18.country} value={this.state.country_name} onChangeText={ (country_name) => this.setState({ country_name })}/>
            </View>

            <View style={[STYLES.grayDiv,{height:5,marginTop:10}]}/>

            <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/50,marginLeft:SCREEN_HEIGHT/33.3,textAlign:'left',fontSize:14,color:APP_COLOR,fontWeight:'bold'}]}>{i18.operationalAddress}</Text>
            <CheckBox style={{flex: 1, marginTop: SCREEN_HEIGHT/50,marginLeft:SCREEN_HEIGHT/33.3}} onClick={()=>this.onClickCheckmark()} isChecked={this.state.isChecked} checkBoxColor={BUTTON_COLOR}
              rightText={i18.sameAsRegisteredAddress} rightTextStyle={{fontSize:13,color:'gray'}}
              checkedImage={<Image source={CHECKMARK_ENABLE} style={STYLES.checkMark}/>} unCheckedImage={<Image source={CHECKMARK_DISABLE} style={STYLES.checkMark}/>}/>

            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} onFocus={() => this.openGooglePlaces2()}  tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.operationalAddress} value={this.state.operationalAddress} onChangeText={ (operationalAddress) => this.setState({ operationalAddress })}/>
            </View>

            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} editable={false} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.city} value={this.state.operatinalCityName} onChangeText={ (operatinalCityName) => this.setState({ operatinalCityName })}/>
            </View>

            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} editable={false} tintColor='gray' fontSize={14} labelFontSize={12} activeLineWidth={0.5} label={i18.zipCode} value={this.state.operationalZipcode} onChangeText={ (operationalZipcode) => this.setState({ operationalZipcode })}/>
            </View>

            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} editable={false} tintColor='gray' fontSize={14} labelFontSize={12} activeLineWidth={0.5} label={i18.country} value={this.state.operationalCountry_name} onChangeText={ (operationalCountry_name) => this.setState({ operationalCountry_name })}/>
            </View>

            <View style={[STYLES.grayDiv,{height:5,marginTop:10}]}/>

            <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/50,marginLeft:SCREEN_HEIGHT/33.3,textAlign:'left',fontSize:14,color:APP_COLOR,fontWeight:'bold'}]}>{i18.companyInfo}</Text>
            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} autoCapitalize="none" tintColor='gray' fontSize={14} labelFontSize={12} activeLineWidth={0.5} label={i18.website} value={this.state.website} onChangeText={ (website) => this.setState({ website })}/>
            </View>

            <View style={STYLES.textfield}>
              <TextField keyboardType="number-pad" labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} labelFontSize={12} activeLineWidth={0.5} label={i18.established} value={this.state.established} onChangeText={ (established) => this.setState({ established })}/>
            </View>

            <View style={STYLES.textfield}>
              <TextField keyboardType="number-pad" labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} labelFontSize={12} activeLineWidth={0.5} label={i18.employeeCount} value={this.state.employeeCount} onChangeText={ (employeeCount) => this.setState({ employeeCount })}/>
            </View>

            <View style={STYLES.textfield}>
              <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} labelFontSize={12} activeLineWidth={0.5} label={i18.companyName} value={this.state.companyName} onChangeText={ (companyName) => this.setState({ companyName })}/>
            </View>

            <TextInput underlineColorAndroid='rgba(0,0,0,0)' onChangeText={ (description) => this.setState({ description })} placeholder={i18.description} style={STYLES.description} value={this.state.description} textAlignVertical='top' multiline = {true} numberOfLines = {4}/>

            <View style={{marginHorizontal:SCREEN_HEIGHT/50,marginTop:SCREEN_HEIGHT/50}}>
            <MultiSelect hideTags items={this.state.mainProductsItems} uniqueKey="name" ref={(component) => { this.multiSelect = component }}
              onSelectedItemsChange={this.onSelectedItemsChange} selectedItems={this.state.mainProducts} selectText={i18.mainProducts}
              searchInputPlaceholderText={i18.searchProducts+"..."} tagRemoveIconColor={APP_COLOR}
              tagBorderColor={APP_COLOR} tagTextColor={APP_COLOR} selectedItemTextColor={APP_COLOR} selectedItemIconColor={APP_COLOR}
              itemTextColor="#000" displayKey="name" searchInputStyle={{ color: APP_COLOR }} submitButtonColor={BUTTON_COLOR} submitButtonText={i18.add}/>
            <View>
              {this.state.mainProducts && this.state.mainProducts != undefined && this.state.mainProducts.length > 0?this.multiSelect.getSelectedItemsExt(this.state.mainProducts):null}
            </View>
            </View>

            <View style={[STYLES.button,{backgroundColor:'white',borderWidth:1,borderColor:BUTTON_COLOR}]}>
              <TouchableOpacityBtn onPress={() => this.changePassword()} style={[STYLES.buttonTxt,{color:BUTTON_COLOR}]} title={i18.changePassword}/>
            </View>

            <View style={[STYLES.button,{marginTop:SCREEN_HEIGHT/33.3}]}>
              <TouchableOpacityBtn onPress={() => this.updateUser()} style={[STYLES.buttonTxt]} title={i18.updateDetails}/>
            </View>

            </KeyboardAwareScrollView>

      </View>
    )
  }
}
