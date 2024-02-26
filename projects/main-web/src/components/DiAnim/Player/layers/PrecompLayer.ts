import {DiFrameInfo} from '../types'
import * as m4 from '../utils/m4'
import {DiWebGLRenderingContext} from '../utils/types'
import DiLayer from './Layer'
import {makeLayer} from './makes'

export default class PrecompLayer extends DiLayer {
  private layers?: DiLayer[]

  async init(gl: DiWebGLRenderingContext) {
    this.layers = []

    // 初始化layers
    const layerPropss = this.props.layers
    if (layerPropss) {
      for (let i = 0, l = layerPropss.length; i < l; i++) {
        const layer = makeLayer(layerPropss[i])
        if (layer) {
          this.layers.push(layer)
        }
      }
    }

    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].init(gl)
    }
  }

  render(gl: DiWebGLRenderingContext, parentMatrix: Float32Array, frameInfo: DiFrameInfo) {
    const localMatrix = this.getLocalMatrix(frameInfo)
    if (!localMatrix) return

    const viewMatrix = m4.multiply(parentMatrix, localMatrix)

    this.layers?.forEach(layer => {
      layer.render(gl, viewMatrix, frameInfo)
    })
  }

  clear(gl?: WebGLRenderingContext | undefined) {
    this.layers?.forEach(layer => layer.clear(gl))
    this.layers = undefined
  }
}
