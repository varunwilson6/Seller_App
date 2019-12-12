import {BASE_URL,USER,AUTH_URL} from '../url/url';
import RNFetchBlob from 'rn-fetch-blob'

export function uploadImage(mime,image,ext,id,lang){
  return RNFetchBlob.fetch('POST', BASE_URL+'seller/'+id+'/avatar?lang='+lang, {
      'Content-Type': 'multipart/form-data',
  }, [
          { name: 'image', filename: 'IMG_' + ext, type: mime, data: RNFetchBlob.wrap(image) }

      ]).then((resp) => {
          return resp
      }).catch((err) => {
      })
    }
