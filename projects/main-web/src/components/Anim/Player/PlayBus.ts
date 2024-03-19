import {PlayProps} from './types'

export default class PlayBus {
  constructor() {}

  private _props?: PlayProps

  private _frameRate = 30
  private _frames = 0

  loadProps(props: PlayProps) {
    this._props = props
    this._frameRate = props?.frameRate || 30
    this._frames = props?.duration * props.frameRate
  }

  get frameRate() {
    return this._frameRate
  }

  get frames() {
    return this._frames
  }

  get width() {
    return this._props?.width || 0
  }

  get height() {
    return this._props?.height || 0
  }

  get duration() {
    return this._props?.duration
  }

  get rootLayers() {
    return this._props?.targetComp.layers
  }

  getLayerByComps(id: number) {
    return this._props?.comps.find(el => el.id === id)
  }
}
