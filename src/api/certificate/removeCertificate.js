import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';

export function removeCertificate(sellerId,certificateId,lang){
  return fetch(BASE_URL+'seller/'+sellerId+'/certificate/'+certificateId+'?lang='+lang,{
    method:'DELETE'
  })
  .then((response) => {
    return response
  })
  .catch((error) => {
  })
}
