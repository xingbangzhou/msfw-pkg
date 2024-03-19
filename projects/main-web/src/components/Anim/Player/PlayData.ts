import {PlayProps} from './types'

export default class PlayData {
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

  get duration() {
    return this._props.duration
  }

  get rootLayers() {
    return this._props.targetComp.layers
  }

  getLayerByComps(id: number) {
    return this._props.comps.find(el => el.id === id)
  }
}
