import {PlayProps} from './types'

export default class PlayStore {
  constructor() {}

  private _props?: PlayProps

  private _frames = 0
  private _frameRate = 30
  private _frameTime = 0 // 毫秒单位
  private _frameId = -1

  setProps(value: PlayProps) {
    this._props = value
    this._frameRate = value.frameRate || 30
    this._frames = (value.duration || 0) * value.frameRate
    this._frameTime = +(1000 / this._frameRate).toFixed(3).slice(0, -1)
  }

  get frames() {
    return this._frames
  }

  get frameRate() {
    return this._frameRate
  }

  get frameTime() {
    return this._frameTime
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

  set frameId(id: number) {
    this._frameId = id
  }

  get frameId() {
    return this._frameId
  }

  get rootLayers() {
    return this._props?.targetComp.layers
  }

  getCompLayer(id: number) {
    return this._props?.comps.find(el => el.id === id)
  }
}
