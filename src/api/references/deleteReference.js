import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';

export function deleteReference(sellerId,referenceId,apiKey,lang){
  return fetch(BASE_URL+'seller/'+sellerId+'/reference/'+referenceId+'?lang='+lang,{
    method:'DELETE',
    headers:{
      'apikey':apiKey
    }
  })
  .then((response) => {
    return response
  })
  .catch((error) => {
  })
}
