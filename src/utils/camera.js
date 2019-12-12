import ImagePicker from 'react-native-image-crop-picker';

export function pickSingleWithCamera(cropping) {
  return ImagePicker.openCamera({
    cropping: cropping,
    width: 500,
    height: 500,
    includeExif: true,
  }).then(image => {
    return image
  }).catch(e => alert(e));
}

export function pickFromGallery(cropit,circular) {
  return ImagePicker.openPicker({
    width: 300,
    height: 300,
    mediaType:'photo',
    cropping: cropit,
    cropperCircleOverlay: circular,
    compressImageMaxWidth: 640,
    compressImageMaxHeight: 480,
    compressImageQuality: 0.5,
    compressVideoPreset: 'MediumQuality',
    includeExif: true,
  }).then(image => {
    return image
  }).catch(e => {
  });
}

export function pickVideo() {
  return ImagePicker.openPicker({
    mediaType:'video',
    maxFiles:1,
    multiple: false,
    includeExif: true,
  }).then(image => {
    return image
  }).catch(e => {
  });
}
