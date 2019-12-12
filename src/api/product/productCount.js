import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';

export function productCount(id,apiKey){
  return fetch(BASE_URL+PRODUCT+'info?seller='+id)
  .then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON
  })
  .catch((error) => {

  })
}
