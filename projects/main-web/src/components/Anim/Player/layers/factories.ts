import {LayerProps, LayerType} from '../types'
import ImageLayer from './ImageLayer'
import PreComposeLayer from './PreComposeLayer'
import VideoLayer from './VideoLayer'

export function newLayer(props: LayerProps) {
  const type = props.type

  if (type === LayerType.Video) {
    return new VideoLayer(props)
  }
  if (type === LayerType.Image) {
    return new ImageLayer(props)
  }
  if (type === LayerType.PreComposition) {
    return new PreComposeLayer(props)
  }

  return undefined
}
