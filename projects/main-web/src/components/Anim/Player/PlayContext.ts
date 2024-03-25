import {PlayProps} from './types'

export default class PlayContext {
  constructor() {}

  private _props?: PlayProps

  private _frameRate = 30
  private _frames = 0
  private _frameInterval = 0
  private _frameId = -1
  private _frameStamp = 0

  setPlayProps(props: PlayProps) {
    this._props = props
    this._frameRate = props?.frameRate || 30
    this._frames = (props?.duration || 0) * props.frameRate
    this._frameInterval = 1000 / this._frameRate
  }

  get frameRate() {
    return this._frameRate
  }

  get frames() {
    return this._frames
  }

  get frameInterval() {
    return this._frameInterval
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

  // 当前帧id
  setFrameId(id: number, stamp: number) {
    this._frameId = id
    this._frameStamp = stamp
  }

  get frameId() {
    return this._frameId
  }

  get frameStamp() {
    return this._frameStamp
  }

  get rootLayers() {
    return this._props?.targetComp.layers
  }

  getLayerByComps(id: number) {
    return this._props?.comps.find(el => el.id === id)
  }
}
