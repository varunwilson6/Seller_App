import {BASE_URL,RFQ,ORDER_URL} from '../url/url';

export function autoComplete(searchInput,lang){
  return fetch(BASE_URL+RFQ+'/autocomplete?search='+searchInput+'&lang='+lang,{
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
