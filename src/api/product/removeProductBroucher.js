import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';

export function removePdfBroucher(productId,pdfId,lang){
  return fetch(BASE_URL+'product/'+productId+'/pdf/'+pdfId+'?lang='+lang,{
    method:'DELETE'
  })
  .then((response) => {
    return response
  })
  .catch((error) => {
  })
}
