import {BASE_URL,PRODUCT,PRODUCT_URL,CATEGORY_URL} from '../url/url';

export function getSubcategories(apiKey,lang,page,categoryId){
  return fetch(BASE_URL+'subcategory?category='+categoryId+'&lang='+lang+'&page='+page,{
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
