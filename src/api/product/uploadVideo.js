import {BASE_URL,PRODUCT,PRODUCT_URL} from '../url/url';
import RNFetchBlob from 'rn-fetch-blob'

export function uploadProductVideo(mime,video,ext,id,lang){
  return RNFetchBlob.fetch('POST', BASE_URL+PRODUCT+id+'/video?lang='+lang, {
      'Content-Type': 'multipart/form-data',
  }, [
          { name: 'video', filename: 'video_' + ext, type: mime, data: RNFetchBlob.wrap(video) }

      ]).then((response) => response.json())
  .then((responseJSON) => {
    return responseJSON
  })
  .catch((error) => {

  })
}
