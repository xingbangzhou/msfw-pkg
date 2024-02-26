import {DiLayerProps, DiLayerType} from '../types'
import ImageLayer from './ImageLayer'
import PrecompLayer from './PrecompLayer'
import VideoLayer from './VideoLayer'

export function makeLayer(props: DiLayerProps) {
  const type = props.type

  if (type === DiLayerType.Video) {
    return new VideoLayer(props)
  }
  if (type === DiLayerType.Image) {
    return new ImageLayer(props)
  }
  if (type === DiLayerType.Precomposition) {
    return new PrecompLayer(props)
  }

  return undefined
}
