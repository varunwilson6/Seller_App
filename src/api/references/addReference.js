import {BASE_URL,RFQ,PRODUCT_URL} from '../url/url';

export function addReference(text,name,companyName,phone,email,website,sellerId,lang,apiKey){
  var body={
    "client" : {
       "name" : name,
       "companyName" : companyName
      }
  }
  if(text){
    body["text"]=text
  }
  if(phone){
    body["client"]["phone"]=phone
  }
  if(email){
    body["client"]["email"]=email
  }
  if(website){
    body["client"]["website"]=website
  }
  return fetch(BASE_URL+'seller/'+sellerId+'/reference?lang='+lang,{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'apiKey':apiKey
    },
    body:JSON.stringify(body)
  })
  .then((response) => {
    const statusCode = response.status;
    const data = response.json();
    return Promise.all([statusCode, data]);
  })
  .catch((error) => {

  })
}
