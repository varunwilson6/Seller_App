import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';

export function allProductImages(id,apiKey,lang){
  return fetch(BASE_URL+PRODUCT+id+'/image?lang='+lang,{
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
