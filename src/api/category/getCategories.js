import {BASE_URL,PRODUCT,PRODUCT_URL,CATEGORY_URL} from '../url/url';

export function getCategories(apiKey,lang,page){
  return fetch(BASE_URL+'category?lang='+lang+'&page='+page,{
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
