import {BASE_URL,PLAN,PLAN_URL} from '../url/url';

export function allPlansByLocation(page,location,lang){
  return fetch(BASE_URL+PLAN+'?page='+page+'&location='+location+'&lang='+lang,{
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
