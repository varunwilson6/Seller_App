import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';

export function referenceById(sellerId,referenceId,apiKey,lang){
  return fetch(BASE_URL+'seller/'+sellerId+'/reference/'+referenceId+'?lang='+lang,{
    method:'GET',
    headers:{
      'apikey':apiKey
    }
  })
  .then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON
  })
  .catch((error) => {

  })
}
