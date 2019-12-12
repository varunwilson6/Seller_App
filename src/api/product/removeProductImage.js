import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';

export function removeProductImage(productId,imageId,apiKey,lang){
  return fetch(BASE_URL+PRODUCT+productId+'/image/'+imageId+'?lang='+lang,{
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
