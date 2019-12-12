import { BASE_URL, PRODUCT, PRODUCT_URL } from '../url/url';
import RNFetchBlob from 'rn-fetch-blob'

export function uploadBroucherAPI(pdf, sellerId, lang) {
    return RNFetchBlob.fetch('POST', BASE_URL + `product/${sellerId}/productpdf?ln=${lang}`,
        {
        'Content-Type': 'multipart/form-data',
        }, [
        { name: 'productPdf', filename: 'productPdf', type: '/pdf', data: RNFetchBlob.wrap(pdf) }
    ]).then((response) => response.json())
        .then((responseJSON) => {
            console.log( "Response on Broucher Uploading", responseJSON )
            return responseJSON
        })
        .catch((error) => {
            console.log("Error on Broucher Uploading",error)
        })
}
