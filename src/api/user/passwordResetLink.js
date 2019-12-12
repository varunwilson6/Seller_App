import {BASE_URL,PASSWORD_RESET_LINK,AUTH_URL} from '../url/url';

export function passwordResetLink(email,lang){
  return fetch(BASE_URL+PASSWORD_RESET_LINK+'?lang='+lang,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      "email":email,
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
