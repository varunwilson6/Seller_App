import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';

export function updateCertificate(sellerId,certificateId,title,lang){
  return fetch(BASE_URL+'seller/'+sellerId+'/certificate/'+certificateId+'?lang='+lang,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      "title" : title
    })
  })
  .then((response) => {
    const statusCode = response.status;
    const data = response.json();
    return Promise.all([statusCode, data]);
  })
  .catch((error) => {

  })
}
