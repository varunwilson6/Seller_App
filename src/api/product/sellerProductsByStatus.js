import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';

export function listSellerProductsByStatus(sellerId,status,apiKey,lang,page){
  return fetch(BASE_URL+PRODUCT+'?seller='+sellerId+'&status='+status+'&lang='+lang+'&page='+page,{
    method:'GET',
    headers:{
      'apikey':apiKey
    }
  })
  .then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON;
  })
  .catch((error) => {
  })
}
