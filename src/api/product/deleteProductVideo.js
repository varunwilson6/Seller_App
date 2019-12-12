import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';

export function deleteProductVideo(productId,videoId,lang){
  return fetch(BASE_URL+PRODUCT+productId+'/video/'+videoId+'?lang='+lang,{
    method:'DELETE'
  })
  .then((response) => {
    return response
  })
  .catch((error) => {
  })
}
