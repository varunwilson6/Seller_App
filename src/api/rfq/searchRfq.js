import {BASE_URL,PRODUCT,ORDER_URL,RFQ} from '../url/url';

export function searchRfq(apiKey,searchInput,category,subCategory,lang,page,perPage){
  var URL_STRING=BASE_URL+RFQ+'/search?search='+searchInput+'&lang='+lang+'&page='+page+'&perPage='+perPage

  if(category){
   URL_STRING=URL_STRING.concat("&category="+category)
  }
  if(subCategory){
   URL_STRING=URL_STRING.concat("&subCategory="+subCategory)
  }
  console.log(URL_STRING);
  return fetch(URL_STRING,{
    method:'GET',
    headers:{
      'apikey':apiKey
    }
  })
   .then((response) => {
    const statusCode = response.status;
    const data = response.json();
    return Promise.all([statusCode, data]);
  })
  .catch((error) => {

  })
}
