import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';

export function allProductRatingsPaginate(productId,lang,page,perPage){
  return fetch(BASE_URL+PRODUCT+'/'+productId+'/review?lang='+lang+'&page='+page+'&perPage='+perPage,{
    method:'GET'
  })
.then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON
  })
  .catch((error) => {

  })
}

export function viewProductRatings(productId,lang){
  return fetch(BASE_URL+PRODUCT+'/'+productId+'/review?lang='+lang+'&page=1&perPage=4',{
    method:'GET'
  })
  .then((response) => {
    const statusCode = response.status;
    const data = response.json();
    return Promise.all([statusCode, data]);
  })
  .catch((error) => {

  })
}
