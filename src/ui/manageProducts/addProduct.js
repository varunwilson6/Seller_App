import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, AsyncStorage, Alert, Platform } from 'react-native';

/*  THIRD PARTY LIBRARIES */
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageLoad from 'react-native-image-placeholder';
import { Actions } from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import { TextField } from 'react-native-material-textfield';
import ActionSheet from 'react-native-actionsheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-loading-spinner-overlay';
import MultiSelect from 'react-native-multiple-select';
import LocalizedStrings from 'react-native-localization';
import FastImage from 'react-native-fast-image'
import VideoPlayer from 'react-native-video-player';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Pdf from 'react-native-pdf';

/* LOCALIZATION */
import { en } from '../../localization/eng'
import { fr } from '../../localization/france'
import { de } from '../../localization/germany'
import { it } from '../../localization/italy'
import { es } from '../../localization/spain'
import {pl} from '../../localization/polish'
import {nl} from '../../localization/nederlands'
import {tr} from '../../localization/turkish'

let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({ en: en, fr: fr, de: de, it: it, es: es });

/*CONSTANTS */
import { APP_COLOR, LIGHT_GRAY_TAB, BUTTON_COLOR } from '../../constants/colors';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../constants/common';
import { STAR, CANCEL, ATTACH, ADD_PRODUCT, QUOTATIONS, PROFILE, ORDERS, FAVOURITES, RIGHT_ARROW, BUYING_REQUEST, PROFILE_DETAILS, SETTINGS, PRIVACY, CONTRACT, CONTACT, APP_LOGO, ABOUT } from '../../constants/image';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
import TouchableOpacityBtn from '../../components/touchableOpacity';

/*STYLES */
import { STYLES } from './styles';

/* API */
import { createProduct } from '../../api/product/createProduct'
import { updateProduct } from '../../api/product/updateProduct'
import { USER } from '../../api/sharedPreferencesKeys'
import { uploadProductImage } from '../../api/product/uploadProductImage'
import { allProductImages } from '../../api/product/allProductImages'
import { removeProductImage } from '../../api/product/removeProductImage'
import { getProductWithId } from '../../api/product/getProductWithId'
import { uploadProductVideo } from '../../api/product/uploadVideo'
import { deleteProductVideo } from '../../api/product/deleteProductVideo'
import { uploadBroucherAPI } from '../../api/product/uploadProductBroucher'
import { removePdfBroucher } from '../../api/product/removeProductBroucher'

/* FUNCTIONS */
import { pickSingleWithCamera, pickFromGallery, pickVideo } from '../../utils/camera'

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = [i18.cancel, i18.fromCamera, i18.fromLibrary, i18.video]
var cameraImgCount = 0
var libraryImgCount = 0
var videoCount = 0
var id = ""
var apiKey = ""
var imagePlaceholder = "http://meeconline.com/wp-content/uploads/2014/08/placeholder.png"

export default class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.showActionSheet = this.showActionSheet.bind(this)
    this.handleActionSheet = this.handleActionSheet.bind(this)
    this.selectBroucher = this.selectBroucher.bind(this)

    this.state = {
      fetchedPdfs:[],
      pdf:[],
      productName: this.props.productName ? this.props.productName : '',
      keywords1: this.props.keywords1 ? this.props.keywords1 : '',
      keywords2: '',
      keywords3: '',
      subCategoryDisplay: 'none',
      image: this.props.image ? this.props.image : null,
      images: this.props.images ? this.props.images : null,
      selected: '',
      minQuantity: this.props.minQuantity ? this.props.minQuantity : '',
      productPrice: this.props.productPrice ? this.props.productPrice : '',
      loading: this.props.update ? true : false,
      addMoreKeywordDisplay: this.props.addMoreKeywordDisplay ? this.props.addMoreKeywordDisplay : 'flex',
      keywordsDisplay: this.props.keywordsDisplay ? this.props.keywordsDisplay : 'none',
      selectedItems: [],
      description: this.props.description ? this.props.description : '',
      controllerName: this.props.controllerName ? this.props.controllerName : '',
      category: this.props.category ? this.props.category : '',
      subCategory: this.props.subCategory ? this.props.subCategory : '',
      subCategoryId: this.props.subCategoryId ? this.props.subCategoryId : "",
      categoryId: this.props.categoryId ? this.props.categoryId : "",
      videos: this.props.videos ? this.props.videos : null,
      quickDetailsData: this.props.quickDetailsData ? this.props.quickDetailsData : [{ label: "", value: "" }],
      quickDetailsValue: '',
      quickDetailsLabel: '',
      avgProductRating: 0,
      totalReviewsCount: '',
      weight: this.props.weight ? this.props.weight : "",
      height: this.props.height ? this.props.height : "",
      width: this.props.width ? this.props.width : "",
      depth: this.props.depth ? this.props.depth : "",
      packageUnits: this.props.packageUnits ? this.props.packageUnits : "",
      packageLength: this.props.packageLength ? this.props.packageLength : "",
      packageWidth: this.props.packageWidth ? this.props.packageWidth : "",
      packageHeight: this.props.packageHeight ? this.props.packageHeight : "",
      packageWeight: this.props.packageWeight ? this.props.packageWeight : "",
      termsConditions: this.props.termsConditions ? this.props.termsConditions : "",
    }
  }

  openCategories() {
    Actions.ProductCategories({
      title: i18.categoryTitle,
      productName: this.state.productName,
      keywords1: this.state.keywords1,
      keywords2: this.state.keywords2,
      keywords3: this.state.keywords3,
      image: this.state.image,
      images: this.state.images,
      minQuantity: this.state.minQuantity,
      productPrice: this.state.productPrice,
      addMoreKeywordDisplay: this.state.addMoreKeywordDisplay,
      keywordsDisplay: this.state.keywordsDisplay,
      description: this.state.description,
      productId: this.props.productId,
      controllerName: this.props.controllerName ? this.props.controllerName : "",
      showTermsAndConditions: true,
      quickDetailsData: this.state.quickDetailsData,
      weight: this.state.weight,
      width: this.state.width,
      height: this.state.height,
      depth: this.state.depth,
      packageUnits: this.state.packageUnits,
      packageLength: this.state.packageLength,
      packageWidth: this.state.packageWidth,
      packageHeight: this.state.packageHeight,
      packageWeight: this.state.packageWeight,
      termsConditions: this.state.termsConditions
    })
  }

  componentWillMount() {
    if (this.props.subCategory) {
      this.setState({
        subCategoryDisplay: 'flex'
      })
    }
    AsyncStorage.getItem("currLang").then((value) => {
      if (value) {
        i18.setLanguage(value)
      }
    })
    AsyncStorage.getItem(USER).then((value) => {
      if (value) {
        var user = JSON.parse(value)
        id = user.user.id
        apiKey = user.auth.key

        if (this.props.update) {
          this.getProductWithId()
        }
      }
    })
  }

  getProductWithId() {
    getProductWithId(this.props.productId, apiKey, i18.getLanguage()).then((response) => {
      if (response.id) {
        if (response.quickDetails) {
          var quickDetails = []
          for (var i = 0; i < response.quickDetails.length; i++) {
            for (var key in response.quickDetails[i]) {
              var data = { label: "", value: "" }
              data.label = key
              data.value = response.quickDetails[i][key]
              quickDetails.push(data)
            }
          }
          this.setState({
            quickDetailsData: quickDetails
          })
        }
        console.log(response)
        this.setState({
          fetchedPdfs: response.productPdfs,
          productId:response.id,
          productName: response.name,
          keywords1: response.keywords.toString(),
          subCategoryDisplay: response.subCategory ? "flex" : "none",
          images: response.productPictures,
          videos: response.productVideos,
          selected: '',
          minQuantity: response.minQuantity,
          productPrice: response.productPrice,
          loading: false,
          addMoreKeywordDisplay: this.props.addMoreKeywordDisplay ? this.props.addMoreKeywordDisplay : 'flex',
          keywordsDisplay: this.props.keywordsDisplay ? this.props.keywordsDisplay : 'none',
          selectedItems: [],
          description: response.description,
          category: response.category ? response.category.name : "",
          subCategory: response.subCategory ? response.subCategory.name : "",
          categoryId: response.category ? response.category._id : "",
          subCategoryId: response.subCategory ? response.subCategory._id : "",
          avgProductRating: response.rating,
          totalReviewsCount: response.totalRatingsCount,
          weight: response.productDimensions && response.productDimensions.weight ? response.productDimensions.weight.toString() : '',
          height: response.productDimensions && response.productDimensions.height ? response.productDimensions.height.toString() : '',
          width: response.productDimensions && response.productDimensions.width ? response.productDimensions.width.toString() : '',
          depth: response.productDimensions && response.productDimensions.depth ? response.productDimensions.depth.toString() : '',
          packageUnits: response.packageDetails && response.packageDetails.units ? response.packageDetails.units.toString() : '',
          packageLength: response.packageDetails && response.packageDetails.boxSize && response.packageDetails.boxSize.length ? response.packageDetails.boxSize.length.toString() : '',
          packageWidth: response.packageDetails && response.packageDetails.boxSize && response.packageDetails.boxSize.width ? response.packageDetails.boxSize.width.toString() : '',
          packageHeight: response.packageDetails && response.packageDetails.boxSize && response.packageDetails.boxSize.height ? response.packageDetails.boxSize.height.toString() : '',
          packageWeight: response.packageDetails && response.packageDetails.weight ? response.packageDetails.weight.toString() : '',
          termsConditions: response.termsAndConditions? response.termsAndConditions: ""
        }, () => {
          if (response.productPictures && response.productPictures.length > 0) {
            libraryImgCount = response.productPictures.length
          }
          else {
            libraryImgCount = 0
          }
          if (response.productVideos && response.productVideos.length > 0) {
            videoCount = response.productVideos.length
          }
          else {
            videoCount = 0
          }
        })
      }
      else {
        Alert.alert(
          '',
          response.message,
          [{
            text: i18.ok, onPress: () => this.setState({
              loading: false
            })
          }]
        )
      }

    })
  }
  showActionSheet() {
    this.ActionSheet.show()
  }

  handleActionSheet(i) {
    this.setState({
      selected: i
    }, () => {
      if (this.state.selected == 1) {
        this.pickSingleWithCamera(false)
      }
      if (this.state.selected == 2) {
        this.pickFromGallery(false, false)
      }
      if (this.state.selected == 3) {
        this.pickVideo()
      }
    })
  }

  pickVideo() {
    pickVideo().then((images) => {
      if (this.state.images == null || this.state.images == undefined || this.state.images == '') {
        this.setState({
          images: [{ uri: images.path, width: images.width, height: images.height, mime: images.mime }],
          isAvatarPlaceholderImgDisplay: 'none',
        })
      }
      else {
        this.setState({
          images: [...this.state.images, { uri: images.path, width: images.width, height: images.height, mime: images.mime }],
          isAvatarPlaceholderImgDisplay: 'none',
        });
      }
      libraryImgCount = this.state.images.length
      if (cameraImgCount + libraryImgCount + videoCount > 6) {
        Alert.alert(
          '',
          i18.imageExceedsAlert,
          [{ text: i18.ok }]
        )
        this.removeImage(this.getIndex(images.path, this.state.images, 'uri'), "library")
        return
      }
      this.uploadProductVideo(images.path, images.mime)
    })
  }
  pickSingleWithCamera(cropping) {
    pickSingleWithCamera(cropping).then((image) => {
      if (this.state.image == null || this.state.image == undefined || this.state.image == '') {
        this.setState({
          image: [{ uri: image.path, width: image.width, height: image.height, mime: image.mime }],
          isAvatarPlaceholderImgDisplay: 'none',
        })
      }
      else {
        this.setState({
          image: [...this.state.image, { uri: image.path, width: image.width, height: image.height, mime: image.mime }],
          isAvatarPlaceholderImgDisplay: 'none',
        });
      }
      cameraImgCount = this.state.image.length
      if (cameraImgCount + libraryImgCount + videoCount > 6) {
        Alert.alert(
          '',
          i18.imageExceedsAlert,
          [{ text: i18.ok }]
        )
        this.removeImage(this.getIndex(image.path, this.state.image, 'uri'), "camera")
        return
      }
      this.imageUpload(image.path, image.mime)
    })
  }
  pickFromGallery(cropit, circular) {
    pickFromGallery(cropit, circular).then((images) => {
      if (this.state.images == null || this.state.images == undefined || this.state.images == '') {
        this.setState({
          images: [{ uri: images.path, width: images.width, height: images.height, mime: images.mime }],
          isAvatarPlaceholderImgDisplay: 'none',
        })
      }
      else {
        this.setState({
          images: [...this.state.images, { uri: images.path, width: images.width, height: images.height, mime: images.mime }],
          isAvatarPlaceholderImgDisplay: 'none',
        });
      }
      libraryImgCount = this.state.images.length
      if (cameraImgCount + libraryImgCount + videoCount > 6) {
        Alert.alert(
          '',
          i18.imageExceedsAlert,
          [{ text: i18.ok }]
        )
        this.removeImage(this.getIndex(images.path, this.state.images, 'uri'), "library")
        return
      }
      this.imageUpload(images.path, images.mime)
    })
  }
  imageUpload(image, mime) {
    this.setState({
      loading: true
    })

    const ext = mime.split('/')[1]
    uploadProductImage(mime, image, ext, this.props.productId ? this.props.productId : "", i18.getLanguage()).then((response) => {
      if (response._id) {
        getProductWithId(this.props.productId, apiKey, i18.getLanguage()).then((response) => {
          if (response.id) {
            this.setState({
              images: response.productPictures,
              videos: response.productVideos,
              loading: false,
            }, () => {
              if (response.productPictures && response.productPictures.length > 0) {
                libraryImgCount = response.productPictures.length
              }
              else {
                libraryImgCount = 0
              }
              if (response.productVideos && response.productVideos.length > 0) {
                videoCount = response.productVideos.length
              }
              else {
                videoCount = 0
              }
            })
          }
        })
      }
      else {
        Alert.alert(
          '',
          response.message,
          [{
            text: i18.ok, onPress: () => this.setState({
              loading: false
            })
          }]
        )
      }
    })
  }

  uploadProductVideo(video, mime) {
    this.setState({
      loading: true
    })

    const ext = mime.split('/')[1]
    uploadProductVideo(mime, video.split('file://')[1], ext, this.props.productId ? this.props.productId : "", i18.getLanguage()).then((response) => {
      if (response._id) {
        getProductWithId(this.props.productId, apiKey, i18.getLanguage()).then((response) => {
          if (response.id) {
            this.setState({
              images: response.productPictures,
              videos: response.productVideos,
              loading: false,
            }, () => {
              if (response.productPictures && response.productPictures.length > 0) {
                libraryImgCount = response.productPictures.length
              }
              else {
                libraryImgCount = 0
              }
              if (response.productVideos && response.productVideos.length > 0) {
                videoCount = response.productVideos.length
              }
              else {
                videoCount = 0
              }
            })
          }
        })
      }
      else {
        Alert.alert(
          '',
          response.message,
          [{
            text: i18.ok, onPress: () => this.setState({
              loading: false
            })
          }]
        )
      }
    })
  }
  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1; //to handle the case where the value doesn't exist
  }
  removeImage(index, mediaType) {
    if (mediaType == "library") {
      this.setState({
        images: this.state.images.filter((_, i) => i !== index)
      });
    }
    else {
      this.setState({
        image: this.state.image.filter((_, i) => i !== index)
      });
    }
  }
  removeProductImage(imageId, type) {
    Alert.alert(
      i18.delete,
      i18.areYouSure,
      [
        { text: i18.cancel, style: 'cancel' },
        {
          text: i18.yes, onPress: () => {
            if (type == 'image') {
              this.deleteImage(imageId)
            }
            else {
              this.deleteVideo(imageId)
            }
          }
        }
      ],
      { cancelable: false }
    )
  }

  deleteImage(imageId) {
    this.setState({
      loading: true
    })
    removeProductImage(this.props.productId ? this.props.productId : "", imageId, apiKey, i18.getLanguage()).then((response) => {
      getProductWithId(this.props.productId, apiKey, i18.getLanguage()).then((response) => {
        if (response.id) {
          this.setState({
            images: response.productPictures,
            videos: response.productVideos,
            loading: false,
          }, () => {
            if (response.productPictures && response.productPictures.length > 0) {
              libraryImgCount = response.productPictures.length
            }
            else {
              libraryImgCount = 0
            }
            if (response.productVideos && response.productVideos.length > 0) {
              videoCount = response.productVideos.length
            }
            else {
              videoCount = 0
            }
          })
        }
      })
    })
  }

  deleteVideo(videoId) {
    this.setState({
      loading: true
    })
    deleteProductVideo(this.props.productId ? this.props.productId : "", videoId, i18.getLanguage()).then((response) => {
      getProductWithId(this.props.productId, apiKey, i18.getLanguage()).then((response) => {
        if (response.id) {
          this.setState({
            images: response.productPictures,
            videos: response.productVideos,
            loading: false,
          }, () => {
            if (response.productPictures && response.productPictures.length > 0) {
              libraryImgCount = response.productPictures.length
            }
            else {
              libraryImgCount = 0
            }
            if (response.productVideos && response.productVideos.length > 0) {
              videoCount = response.productVideos.length
            }
            else {
              videoCount = 0
            }
          })
        }
      })
    })
  }
  renderImage(image, id) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <FastImage style={[STYLES.attach, { width: 150, height: 150 }]} source={{ uri: encodeURI(image.url ? image.url : imagePlaceholder), priority: FastImage.priority.normal, }}
          resizeMode={FastImage.resizeMode.stretch} />
        <TouchableOpacity style={{ position: 'absolute', marginTop: 5, right: -3, width: 30, height: 30 }} activeOpacity={1} onPress={() => this.removeProductImage(id, 'image')}>
          <Image style={STYLES.cancel} source={CANCEL} />
        </TouchableOpacity>
      </View>
    )
  }

  renderAsset(image, id) {
    return this.renderImage(image, id);
  }

  renderVideo(video, id) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: 150, height: 150, backgroundColor: 'black', marginLeft: SCREEN_HEIGHT / 50, marginTop: SCREEN_HEIGHT / 50, backgroundColor: 'black' }}>
          <VideoPlayer style={[STYLES.attach, { width: 150, height: 150, marginLeft: 0, marginTop: 0 }]} disableSeek video={{ uri: encodeURI(video.url ? video.url : video.uri) }} pauseOnPress />
        </View>
        <TouchableOpacity style={{ position: 'absolute', marginTop: 5, right: -3, width: 30, height: 30 }} activeOpacity={1} onPress={() => this.removeProductImage(id, 'video')}>
          <Image style={STYLES.cancel} source={CANCEL} />
        </TouchableOpacity>
      </View>
    );
  }
  validateFields() {

    if (!this.state.productName) {
      Alert.alert(
        '',
        i18.productNameCannotEmpty,
        [{ text: i18.ok }]
      )
      return
    }
    if (!this.state.keywords1) {
      Alert.alert(
        '',
        i18.pleaseEnterKeyword,
        [{ text: i18.ok }]
      )
      return
    }
    // if (!this.state.weight || !this.state.width || !this.state.width || !this.state.depth || !this.state.packageLength || !this.state.packageWidth || !this.state.packageHeight || !this.state.packageUnits || !this.state.packageWeight) {
    //   Alert.alert(
    //     '',
    //     i18.pleaseEnterDimensions,
    //     [{ text: i18.ok }]
    //   )
    //   return
    // }
    
    if (!this.state.category) {
      Alert.alert(
        '',
        i18.productCatCannotEmpty,
        [{ text: i18.ok }]
      )
      return
    }

    if (!this.state.description) {
      Alert.alert(
        '',
        i18.addProductDescription,
        [{ text: i18.ok }]
      )
      return
    }
    if (!this.state.minQuantity) {
      Alert.alert(
        '',
        i18.productQualityCannotBeEmpty,
        [{ text: i18.ok }]
      )
      return
    }
    if (!this.state.productPrice) {
      Alert.alert(
        '',
        i18.addProductPrice,
        [{ text: i18.ok }]
      )
      return
    }
    if (this.props.buttonTitle && this.props.controllerName == "allProducts") {
      this.updateProduct()
    }
    else {
      this.addProduct()
    }
  }
  updateProduct() {

    var productPictures = []

    if (this.state.images) {
      var galleryImgs = this.state.images.map(i => {
        return i.url;
      })
      productPictures = [...galleryImgs]
    }
    if (this.state.image) {
      var cameraImg = this.state.image.map(i => {
        return i.url;
      })
      productPictures = [...cameraImg]
    }
    if (this.state.images && this.state.image) {
      var cameraImg = this.state.image.map(i => {
        return i.url;
      })
      var galleryImgs = this.state.images.map(i => {
        return i.url;
      })
      productPictures = [...cameraImg, ...galleryImgs]
    }

    var keywords = []
    keywords.push(this.state.keywords1)

    var quickDetails = []
    for (var i = 0; i < this.state.quickDetailsData.length; i++) {
      var data = {}
      data[this.state.quickDetailsData[i].label] = this.state.quickDetailsData[i].value
      quickDetails.push(data)
    }
    this.setState({
      loading: true
    })


    updateProduct(this.state.productName, this.state.description, id, keywords, this.state.categoryId, this.state.subCategoryId, this.state.minQuantity, this.state.productPrice, this.props.productId ? this.props.productId : "", apiKey, i18.getLanguage(), quickDetails, this.state.weight, this.state.width, this.state.height, this.state.depth,
    this.state.packageLength,this.state.packageWidth,this.state.packageHeight,this.state.packageUnits,this.state.packageWeight, this.state.termsConditions).then(async(response) => {
      if (response.name) {

        if(this.state.pdf && this.state.pdf.length) {
          const AllPromise =  this.state.pdf.map(function(pdf){
            return uploadBroucherAPI(Platform.OS == "ios"?pdf.uri.split('file://')[1]:pdf.uri,response.id,i18.getLanguage())
          })
          
          try{
            const results = await Promise.all(AllPromise)
            results.forEach((result) => console.log(result.status));
          }catch(err) {
            console.log(err)
          }
        }

        this.setState({
          loading: false
        }, () => {
          Actions.AllProducts({
            status: "all",
            title: i18.allProductsTitle,
          })
        })
      }
      else {
        Alert.alert(
          '',
          response.message,
          [{
            text: i18.ok, onPress: () => this.setState({
              loading: false
            })
          }]
        )
      }

    })
  }
  addProduct() {
    this.setState({
      loading: true
    })

    var productPictures = []

    if (this.state.images) {
      var galleryImgs = this.state.images.map(i => {
        return i.uri;
      })
      productPictures = [...galleryImgs]
    }
    if (this.state.image) {
      var cameraImg = this.state.image.map(i => {
        return i.uri;
      })
      productPictures = [...cameraImg]
    }
    if (this.state.images && this.state.image) {
      var cameraImg = this.state.image.map(i => {
        return i.uri;
      })
      var galleryImgs = this.state.images.map(i => {
        return i.uri;
      })
      productPictures = [...cameraImg, ...galleryImgs]
    }

    var keywords = []
    keywords.push(this.state.keywords1)

    var quickDetails = []
    for (var i = 0; i < this.state.quickDetailsData.length; i++) {
      var data = {}
      data[this.state.quickDetailsData[i].label] = this.state.quickDetailsData[i].value
      quickDetails.push(data)
    }

    createProduct(this.state.productName, this.state.description, id, keywords, this.props.categoryId, this.props.subCategoryId, this.state.minQuantity, productPictures, this.state.productPrice, i18.getLanguage(), quickDetails, this.state.weight, this.state.width, this.state.height, this.state.depth,
      this.state.packageLength,this.state.packageWidth,this.state.packageHeight,this.state.packageUnits,this.state.packageWeight, this.state.termsConditions).then((response) => {
      if (response.name) {
        console.log("Response after Product adding", response)
        // this.uploadBroucher(Platform.OS == "ios"?this.state.pdf.uri.split('file://')[1]:this.state.pdf.uri)
        if(this.state.pdf && this.state.pdf.length) {
          const AllPromise =  this.state.pdf.map(function(pdf){
            return uploadBroucherAPI(Platform.OS == "ios"?pdf.uri.split('file://')[1]:pdf.uri,response.id,i18.getLanguage())
          })
          
          Promise.all(AllPromise).then(results => {
            results.forEach((result) => console.log(result.status));
          }).catch(err => console.log("Error in prmise, >>",err))
        }

        this.setState({
          loading: false
        }, () => {
          Actions.AllProducts({
            status: "all",
            title: i18.allProductsTitle,
          })
        })

      }
      else {
        Alert.alert(
          '',
          response.message,
          [{
            text: i18.ok, onPress: () => this.setState({
              loading: false
            })
          }]
        )
      }
    })
  }

  addMoreKeyword() {
    this.setState({
      addMoreKeywordDisplay: "none",
      keywordsDisplay: 'flex'
    })
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({
      selectedItems: [...this.state.selectedItems, selectedItems]
    });
  };


  deletePdfBroucher(certificateId){
    console.log(this.state)
    this.setState({
      loading:true
    })
    removePdfBroucher(this.state.productId,certificateId,i18.getLanguage()).then((response) => {
      console.log(response)
      const newPdfs = this.state.fetchedPdfs.filter(pdfs => pdfs ._id !== certificateId)
      this.setState({
        loading:false,
        fetchedPdfs:[...newPdfs]
      })
    })
  }

  renderQuickDetails(item, index) {
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <View style={[STYLES.halfTxtField]}>
            <TextField labelTextStyle={{ fontFamily: "DIN-Regular" }} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.key} value={this.state.quickDetailsData[index].label} onChangeText={(quickDetailsLabel) => this.onChangeQuickDetailsLabel(quickDetailsLabel, index)} />
          </View>
          <View style={[STYLES.halfTxtField, { marginLeft: SCREEN_HEIGHT / 100 }]}>
            <TextField labelTextStyle={{ fontFamily: "DIN-Regular" }} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.value} value={this.state.quickDetailsData[index].value} onChangeText={(quickDetailsValue) => this.onChangeQuickDetailsValue(quickDetailsValue, index)} />
          </View>
        </View>
        <TouchableOpacity activeOpacity={1} onPress={() => this.removeQuickDetailsAction(index)} style={[STYLES.deleteIcon, { display: this.state.quickDetailsData.length > 1 ? "flex" : "none" }]}>
          <Icon name="trash" size={15} color={BUTTON_COLOR} />
        </TouchableOpacity>
      </View>
    )
  }

  onChangeQuickDetailsLabel(label, index) {
    var _quickDetailsData = this.state.quickDetailsData
    _quickDetailsData[index].label = label
    this.setState({
      quickDetailsData: _quickDetailsData
    })
  }

  onChangeQuickDetailsValue(value, index) {
    var _quickDetailsData = this.state.quickDetailsData
    _quickDetailsData[index].value = value
    this.setState({
      quickDetailsData: _quickDetailsData
    })
  }

  addMoreAction() {
    var _quickDetailsData = this.state.quickDetailsData
    _quickDetailsData.push({ label: "", value: "" })
    this.setState({
      quickDetailsData: _quickDetailsData
    })

  }

  removeQuickDetailsAction(index) {
    var _quickDetailsData = this.state.quickDetailsData
    _quickDetailsData.splice(index, 1)
    this.setState({
      quickDetailsData: _quickDetailsData
    })
  }

  showAllReviews() {
    Actions.AllReviews({
      title: i18.allReviewsTitle,
      productId: this.props.productId
    })
  }

  productPreview() {
    Actions.ProductPreview({
      title: i18.productPreviewTitle,
      productId: this.props.productId
    })
  }

  removePdfBroucher(id, pdfi){

     console.log("PDF id or URL ", id, id.split(":")[1], this.state.pdf  )
    if( id.split(":")[1] ) {
       this.setState((state)=> {
        const updatePdf = this.state.pdf.filter((pdf, i) => i !== pdfi )
        return {
          ...state,
          pdf: [...updatePdf]
        }
      })
      return;
    }
    Alert.alert(
      i18.delete,
      i18.areYouSure,
      [
        {text:i18.cancel,style:'cancel'},
        {text:i18.yes,onPress: () => {
          this.deletePdfBroucher(id)
        }}
      ],
      {cancelable:false}
      )
    }

  renderPdf(pdf,title, pdfi) {
    return (
      <View>
        <View style={{flexDirection:'row',alignSelf:'center'}}>
            <View style={STYLES.pdf}>
              <Pdf source={{uri:encodeURI(pdf.uri?pdf.uri:pdf.url),cache:true}} style={[STYLES.pdf,{marginTop:0}]}/>
            </View>
            <TouchableOpacity style={{position:'absolute',marginTop:25,right:-3,width:30,height:30}} activeOpacity={1} onPress={() => this.removePdfBroucher(pdf._id ? pdf._id : pdf.uri, pdfi  )}>
              <Image style={STYLES.cancel} source={CANCEL}/>
            </TouchableOpacity>
        </View>
          <Text style={STYLES.title}>{title}</Text>
          <TouchableOpacity style={{marginTop:10, alignSelf:'center'}} activeOpacity={1} onPress={() => this.viewCertificate(pdf.uri?pdf.uri:pdf.url)}>
            <Text style={STYLES.btnTxt}>{i18.clickToView}</Text>
          </TouchableOpacity>
      </View>
    )
  }

  viewCertificate(pdf){
    Actions.ViewCertificate({
      title:i18.viewCertificateTitle,
      pdf:pdf
    })
  }


  selectBroucher(){
    DocumentPicker.show({
    filetype: [DocumentPickerUtil.pdf(),'public.composite-content'],
  },(error,res) => {
    if(error) {
     return console.log(error)
    }
    if(res.uri){
      if(!this.state.pdf.length) {
        this.setState({
          pdf: [{uri:res.uri}]
        })
      }
      else{
        this.setState({
          pdf: [...this.state.pdf,{uri: res.uri}]
        });
      }
    }
    else{
      Alert.alert(
        '',
        response.somethingWentWrong,
        [{text:i18.ok,onPress: () => {}}]
      )
    }
  });
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', paddingBottom: 20 }}>
        <Spinner visible={this.state.loading} textStyle={{ color: '#FFF', marginTop: -60 }} />

        <KeyboardAwareScrollView extraScrollHeight={20}>

          <ActionSheet ref={o => this.ActionSheet = o} options={options} cancelButtonIndex={CANCEL_INDEX}
            destructiveButtonIndex={DESTRUCTIVE_INDEX} onPress={this.handleActionSheet} title={i18.upload} />

          <View style={{ display: this.state.totalReviewsCount ? "flex" : "none" }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={STYLES.bigText}>{this.state.avgProductRating.toFixed(1)}</Text>
              <Image source={STAR} style={{ width: 25, height: 25, marginTop: Platform.OS == "ios" ? 18 : 19, marginLeft: 5 }} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity activeOpacity={1} style={{ width: SCREEN_WIDTH }} onPress={() => this.showAllReviews()}>
                <Text style={[STYLES.bigText, { width: SCREEN_WIDTH - SCREEN_HEIGHT / 12.5, fontSize: 16, marginTop: 5 }]}>{this.state.totalReviewsCount} {this.state.totalReviewsCount > 1 ? i18.customerReviews : i18.customerReview}</Text>
                <Icon name="chevron-right" size={12} color={APP_COLOR} style={STYLES.rightChevron} />
              </TouchableOpacity>
            </View>
            <View style={[STYLES.grayDiv, { height: 8, marginTop: SCREEN_HEIGHT / 50 }]} />
          </View>


          <View style={{ display: this.props.buttonTitle && this.props.controllerName == "allProducts" ? "flex" : "none" }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={[STYLES.text, { alignSelf: 'center', marginTop: SCREEN_HEIGHT / 50, fontSize: 14, fontWeight: 'bold', textAlign: 'left' }]}>{i18.productPreview}</Text>
              <TouchableOpacity activeOpacity={1} style={{ backgroundColor: BUTTON_COLOR, width: 80, marginLeft: 'auto', alignSelf: 'flex-end', justifyContent: 'center', marginRight: SCREEN_HEIGHT / 50, height: 35, borderRadius: 4, marginTop: SCREEN_HEIGHT / 50 }} onPress={() => this.productPreview()}>
                <Text style={{ color: 'white', fontFamily: 'DIN-Regular', alignSelf: 'center', fontSize: 14, fontWeight: 'bold', paddingLeft: 10, paddingRight: 10 }}>{i18.show}</Text>
              </TouchableOpacity>
            </View>
            <View style={[STYLES.grayDiv, { height: 8, marginTop: SCREEN_HEIGHT / 50 }]} />
          </View>

          <Text style={[STYLES.text, { marginTop: SCREEN_HEIGHT / 50, fontSize: 14, fontWeight: 'bold', textAlign: 'left' }]}>{i18.basicInformation}</Text>
          <View style={[STYLES.textfield, { marginTop: 0 }]}>
            <TextField labelTextStyle={{ fontFamily: "DIN-Regular" }} style={{ fontFamily: "DIN-Regular" }} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.productName} value={this.state.productName} onChangeText={(productName) => this.setState({ productName })} />
          </View>

          <View style={[STYLES.textfield, { marginTop: 0 }]}>
            <TextField labelTextStyle={{ fontFamily: "DIN-Regular" }} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.productKeywords} value={this.state.keywords1} onChangeText={(keywords1) => this.setState({ keywords1 })} />
          </View>
          <Text style={[STYLES.text, { marginTop: 0, fontSize: 14, textAlign: 'left', color: 'gray' }]}>{i18.keywordsEx}</Text>

          <View style={[STYLES.grayDiv, { height: 8, marginTop: SCREEN_HEIGHT / 50 }]} />

          <View style={{ flexDirection: 'row' }}>
            <Text style={[STYLES.text, { marginTop: SCREEN_HEIGHT / 50, fontSize: 14, fontWeight: 'bold', textAlign: 'left' }]}>{i18.quickDetails}</Text>
            <TouchableOpacity style={STYLES.rightAlign} onPress={() => this.addMoreAction()} activeOpacity={1}>
              <Text style={STYLES.rightAlignTxt}>{i18.addMore}</Text>
            </TouchableOpacity>
          </View>
          <Text style={[STYLES.text, { marginTop: 5, fontSize: 14, color: 'gray', textAlign: 'left' }]}>{i18.quickDetailsEx}</Text>

          {this.state.quickDetailsData ? this.state.quickDetailsData.map((i, index) => <View>{this.renderQuickDetails(i, index)}</View>) : null}

          <View style={[STYLES.grayDiv, { height: 8, marginTop: SCREEN_HEIGHT / 50 }]} />
          <Text style={[STYLES.text, { marginTop: SCREEN_HEIGHT / 50, fontSize: 14, fontWeight: 'bold', textAlign: 'left' }]}>{i18.productDimensions}</Text>

          <View style={[STYLES.textfield, { marginTop: 0 }]}>
            <TextField keyboardType="phone-pad" labelTextStyle={{ fontFamily: "DIN-Regular" }} style={{ fontFamily: "DIN-Regular" }} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.weight} value={this.state.weight} onChangeText={(weight) => this.setState({ weight })} />
          </View>

          <View style={[STYLES.textfield, { marginTop: 0 }]}>
            <TextField keyboardType="phone-pad" labelTextStyle={{ fontFamily: "DIN-Regular" }} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.width} value={this.state.width} onChangeText={(width) => this.setState({ width })} />
          </View>
          <View style={[STYLES.textfield, { marginTop: 0 }]}>
            <TextField keyboardType="phone-pad" labelTextStyle={{ fontFamily: "DIN-Regular" }} style={{ fontFamily: "DIN-Regular" }} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.height} value={this.state.height} onChangeText={(height) => this.setState({ height })} />
          </View>

          <View style={[STYLES.textfield, { marginTop: 0 }]}>
            <TextField keyboardType="phone-pad" labelTextStyle={{ fontFamily: "DIN-Regular" }} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.depth} value={this.state.depth} onChangeText={(depth) => this.setState({ depth })} />
          </View>

          <View style={[STYLES.grayDiv, { height: 8, marginTop: SCREEN_HEIGHT / 50 }]} />
          <Text style={[STYLES.text, { marginTop: SCREEN_HEIGHT / 50, fontSize: 14, fontWeight: 'bold', textAlign: 'left' }]}>{i18.packageDimensions}</Text>

          <View style={[STYLES.textfield, { marginTop: 0 }]}>
            <TextField keyboardType="phone-pad" labelTextStyle={{ fontFamily: "DIN-Regular" }} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.units} value={this.state.packageUnits} onChangeText={(packageUnits) => this.setState({ packageUnits })} />
          </View>

          <View style={[STYLES.textfield, { marginTop: 0 }]}>
            <TextField keyboardType="phone-pad" labelTextStyle={{ fontFamily: "DIN-Regular" }} style={{ fontFamily: "DIN-Regular" }} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.length} value={this.state.packageLength} onChangeText={(packageLength) => this.setState({ packageLength })} />
          </View>

          <View style={[STYLES.textfield, { marginTop: 0 }]}>
            <TextField keyboardType="phone-pad" labelTextStyle={{ fontFamily: "DIN-Regular" }} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.width} value={this.state.packageWidth} onChangeText={(packageWidth) => this.setState({ packageWidth })} />
          </View>
          
          <View style={[STYLES.textfield, { marginTop: 0 }]}>
            <TextField keyboardType="phone-pad" labelTextStyle={{ fontFamily: "DIN-Regular" }} style={{ fontFamily: "DIN-Regular" }} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.height} value={this.state.packageHeight} onChangeText={(packageHeight) => this.setState({ packageHeight })} />
          </View>

          <View style={[STYLES.textfield, { marginTop: 0 }]}>
            <TextField keyboardType="phone-pad" labelTextStyle={{ fontFamily: "DIN-Regular" }} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.weight} value={this.state.packageWeight} onChangeText={(packageWeight) => this.setState({ packageWeight })} />
          </View>

          <View style={[STYLES.grayDiv, { height: 8, marginTop: SCREEN_HEIGHT / 50 }]} />

          <Text style={[STYLES.text, { marginTop: SCREEN_HEIGHT / 50, fontSize: 14, fontWeight: 'bold', textAlign: 'left' }]}>{i18.catInformation}</Text>

          <TouchableOpacity onPress={() => this.openCategories()} activeOpacity={1}>
            <View style={[STYLES.textfield, { marginTop: 0 }]}>
              <TextField labelTextStyle={{ fontFamily: "DIN-Regular" }} editable={false} selectTextOnFocus={true} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={this.props.category ? i18.category : i18.searchCat} value={this.state.category} />
            </View>
          </TouchableOpacity>

          <View style={[STYLES.textfield, { marginTop: 0, display: this.state.subCategoryDisplay }]}>
            <TextField labelTextStyle={{ fontFamily: "DIN-Regular" }} editable={false} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.subCat} value={this.state.subCategory} />
          </View>

          <View style={[STYLES.grayDiv, { height: 8, marginTop: SCREEN_HEIGHT / 50 }]} />
          <Text style={[STYLES.text, { marginTop: SCREEN_HEIGHT / 50, fontSize: 14, fontWeight: 'bold', textAlign: 'left' }]}>{i18.productDetailsInformation}</Text>
  
          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            <View style={{ flexDirection: 'row' }}>
              {this.state.image ? this.state.image.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
              {this.state.images && this.state.images != undefined ? this.state.images.map(i => <View key={this.state.controllerName == "allProducts" ? i.url : i.uri}>{this.renderAsset(i, this.state.controllerName == "allProducts" ? i._id : "")}</View>) : null}
              {this.state.videos && this.state.videos != undefined ? this.state.videos.map(i => <View key={this.state.controllerName == "allProducts" ? i.url : i.uri}>{this.renderVideo(i, this.state.controllerName == "allProducts" ? i._id : "")}</View>) : null}
              <TouchableOpacity style={{ display: this.props.update && this.props.update == true ? "flex" : "none" }} activeOpacity={1} onPress={this.showActionSheet}>
                <View style={{ flexDirection: 'row' }}>
                  <ImageLoad placeholderStyle={{ width: 60, height: 60 }} resizeMode="stretch" style={[STYLES.attach, { width: this.state.images ? 60 : 40, height: this.state.images ? 60 : 40, marginTop: this.state.images ? 40 + SCREEN_HEIGHT / 50 : SCREEN_HEIGHT / 50 }]} source={ATTACH} />
                  <Text style={[STYLES.text, { marginTop: this.state.images ? SCREEN_HEIGHT / 50 + 60 : 30, color: 'gray', fontSize: 14 }]}>{i18.productPhoto}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <TextInput underlineColorAndroid='rgba(0,0,0,0)' onChangeText={(description) => this.setState({ description })} placeholder={i18.productDescription} style={STYLES.productDescription} value={this.state.description} textAlignVertical='top' multiline={true} numberOfLines={4} />

          <Text style={[STYLES.text, { marginTop: SCREEN_HEIGHT / 50, fontSize: 14, fontWeight: 'bold', textAlign: 'left' }]}>{i18.productTermsConditions}</Text>
          <TextInput underlineColorAndroid='rgba(0,0,0,0)' onChangeText={(termsConditions) => this.setState({ termsConditions })} placeholder={i18.enterTermsConditions} style={STYLES.productDescription} value={this.state.termsConditions} textAlignVertical='top' multiline={true} numberOfLines={4} />

{/*Product Broucher Details  */}
          <Text style={[STYLES.text, { marginTop: SCREEN_HEIGHT / 50, fontSize: 14, fontWeight: 'bold', textAlign: 'left' }]}>{"Product Brochure Details"}</Text>
            <View style={[STYLES.productBroucher]}>
              <View style={{flexDirection:'row', justifyContent:'space-between'}} >
              <Text>{"* Product Brochure "}</Text>
              <TouchableOpacity onPress={()=> this.selectBroucher()}>
                <Text style={[STYLES.rightAlignTxt]}>Add Broucher</Text>
              </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{flexDirection:'row', justifyContent:'space-around', flexWrap: 'wrap' }}>
                  { this.state.fetchedPdfs.map((pdf, i) => <View key={i.uri}>{this.renderPdf(pdf, pdf.title ? pdf.title : this.state.title, i)}</View>)}
                  { this.state.pdf.map((pdf, i) => <View key={i.uri}>{this.renderPdf(pdf, pdf.title ? pdf.title : this.state.title, i)}</View>)}
                </View>
              </ScrollView>
            </View>
{/*Product Broucher Details  */}    
          <Text style={[STYLES.text, { marginTop: SCREEN_HEIGHT / 33.3, fontSize: 14, fontWeight: 'bold', textAlign: 'left' }]}>{i18.requirement}</Text>
          <View style={[STYLES.textfield, { marginTop: 0 }]}>
            <TextField labelTextStyle={{ fontFamily: "DIN-Regular" }} keyboardType="phone-pad" tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.minQuality} value={this.state.minQuantity.toString()} onChangeText={(minQuantity) => this.setState({ minQuantity })} />
          </View>

          <View style={[STYLES.textfield, { marginTop: 0 }]}>
            <TextField labelTextStyle={{ fontFamily: "DIN-Regular" }} keyboardType="phone-pad" tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.productPrice} value={this.state.productPrice.toString()} onChangeText={(productPrice) => this.setState({ productPrice })} />
          </View>

          <View style={STYLES.relativeButton}>
            <TouchableOpacityBtn onPress={() => this.validateFields()} style={[STYLES.buttonTxt, { color: 'white' }]} title={this.props.buttonTitle && this.props.controllerName == "allProducts" ? this.props.buttonTitle : i18.submit} />
          </View>

        </KeyboardAwareScrollView>
      </View>
    )
  }
}
