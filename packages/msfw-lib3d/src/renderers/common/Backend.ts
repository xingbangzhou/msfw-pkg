import {createCanvasElement} from '../../utils'
import Renderer from './Renderer'

export interface BackendParameters {
  canvas?: HTMLCanvasElement | undefined
}

export default class Backend {
  constructor(parameters: BackendParameters = {}) {
    this.parameters = Object.assign({}, parameters)
    this.data = new WeakMap()
    this.renderer = null
    this.domElement = null
  }

  readonly parameters: BackendParameters

  renderer: Renderer | null
  domElement: HTMLCanvasElement | null

  protected data: WeakMap<WeakKey, any>

  async init(renderer: Renderer) {
    this.renderer = renderer
  }

  getDomElement() {
    let domElement = this.domElement

    if (domElement === null) {
      domElement = this.parameters.canvas !== undefined ? this.parameters.canvas : createCanvasElement()

      this.domElement = domElement
    }

    return domElement
  }
}
