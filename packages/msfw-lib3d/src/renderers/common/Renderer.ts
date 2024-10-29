import Vector4 from 'src/math/Vector4'
import Backend from './Backend'

export interface RendererParameters {
  logarithmicDepthBuffer?: boolean | undefined
  alpha?: boolean | undefined
  antialias?: boolean | undefined
  samples?: number | undefined
}

export default class Renderer {
  constructor(backend: Backend, parameters: RendererParameters = {}) {
    const {logarithmicDepthBuffer = false, alpha = true, antialias = false, samples = 0} = parameters

    this.domElement = backend.getDomElement()

    this.backend = backend

    this.samples = samples || antialias === true ? 4 : 0

    this.alpha = alpha

    this.logarithmicDepthBuffer = logarithmicDepthBuffer

    this._width = this.domElement.width
    this._height = this.domElement.height

    this._viewport = new Vector4(0, 0, this._width, this._height)
  }

  readonly domElement: HTMLCanvasElement

  readonly backend: Backend

  readonly samples: number
  readonly alpha: boolean
  readonly logarithmicDepthBuffer: boolean

  private _width: number
  private _height: number
  private _viewport: Vector4
}
