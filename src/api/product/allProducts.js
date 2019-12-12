import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';

export function allProducts(id,apiKey,lang,page){
  return fetch(BASE_URL+PRODUCT+'?seller='+id+'&lang='+lang+'&page='+page,{
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

export function userMainProducts(id,apiKey,lang){
  return fetch(BASE_URL+PRODUCT+'?seller='+id+'&lang='+lang,{
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
