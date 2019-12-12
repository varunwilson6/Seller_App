import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';

export function getProductWithId(id,apiKey,lang){
  return fetch(BASE_URL+'product/'+id+'?lang='+lang+'&imageStatus=all',{
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
