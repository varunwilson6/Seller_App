import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';
import RNFetchBlob from 'rn-fetch-blob'

export function uploadProductImage(mime,image,ext,id,lang){
  return RNFetchBlob.fetch('POST', BASE_URL+PRODUCT+id+'/image?lang='+lang, {
      'Content-Type': 'multipart/form-data',
  }, [
          { name: 'image', filename: 'IMG_' + ext, type: mime, data: RNFetchBlob.wrap(image) }

      ]).then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON
  })
  .catch((error) => {

  })
}
