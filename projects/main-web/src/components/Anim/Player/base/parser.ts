import {PlayProps} from '../types'

export default class Parser {
  constructor(props: PlayProps) {
    props.frameRate = this.frameRate = props.frameRate || 30
    this.props = props
    this.frames = Math.ceil((props.duration * 1000) / props.frameRate)
  }

  private props: PlayProps
  readonly frameRate: number
  readonly frames: number

  get width() {
    return this.props.width
  }

  get height() {
    return this.props.height
  }

  get rootLayers() {
    return this.props.layers
  }
}
