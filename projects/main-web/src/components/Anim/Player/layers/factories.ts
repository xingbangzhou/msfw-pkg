import {LayerProps, LayerType} from '../types'
import ImageLayer from './ImageLayer'
import PrecompLayer from './PrecompLayer'
import VideoLayer from './VideoLayer'

export function newLayer(props: LayerProps) {
  const type = props.type

  if (type === LayerType.Video) {
    return new VideoLayer(props)
  }
  if (type === LayerType.Image) {
    return new ImageLayer(props)
  }
  if (type === LayerType.Precomposition) {
    return new PrecompLayer(props)
  }

  return undefined
}
