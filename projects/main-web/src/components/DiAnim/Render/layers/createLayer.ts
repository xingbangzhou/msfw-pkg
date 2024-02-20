import {DiLayerInfo, DiLayerType} from '../types'
import ImageLayer from './ImageLayer'
import VideoLayer from './VideoLayer'

export function createLayer(info: DiLayerInfo) {
  if (info.type === DiLayerType.MP4x) {
    return new VideoLayer(info)
  }
  if (info.type === DiLayerType.Image) {
    return new ImageLayer(info)
  }

  return undefined
}
