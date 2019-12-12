import {BASE_URL,CHECK_USERNAME_AVAILABILITY,AUTH_URL} from '../url/url';

export function checkUsernameAvailability(username,lang){
  return fetch(BASE_URL+CHECK_USERNAME_AVAILABILITY+username+'?lang='+lang)
  .then((response) => {
    const statusCode = response.status;
    const data = response.json();
    return Promise.all([statusCode, data]);
  })
  .catch((error) => {

  })
}
