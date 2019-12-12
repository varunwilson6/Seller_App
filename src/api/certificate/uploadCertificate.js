import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';
import RNFetchBlob from 'rn-fetch-blob'

export function uploadCertificate(pdf,sellerId,lang){
  return RNFetchBlob.fetch('POST', BASE_URL+'seller/'+sellerId+'/certificate?lang='+lang, {
      'Content-Type': 'multipart/form-data',
  }, [
          { name: 'certificate',filename: 'certificate', type: '/pdf', data: RNFetchBlob.wrap(pdf) }

      ]).then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON
  })
  .catch((error) => {

  })
}
