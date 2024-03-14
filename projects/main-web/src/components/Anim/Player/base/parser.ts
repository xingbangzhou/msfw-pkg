import {PlayProps} from '../types'

export default class Parser {
  constructor(props: PlayProps) {
    props.frameRate = this.frameRate = props.frameRate || 30
    this._props = props
    this.frames = props.duration * props.frameRate
  }

  private _props: PlayProps

  readonly frameRate: number
  readonly frames: number

  get width() {
    return this._props.width
  }

  get height() {
    return this._props.height
  }

  get rootLayers() {
    return this._props.layers
  }
}
