import {FrameInfo} from '../types'
import * as m4 from '../base/m4'
import {ThisWebGLContext} from '../base/glapi'
import BaseLayer from './BaseLayer'
import {newLayer} from './factories'
import {drawLineRect} from '../base/primitives'

export default class PrecompLayer extends BaseLayer {
  private layers?: BaseLayer[]

  async init(gl: ThisWebGLContext) {
    this.layers = []

    // 初始化layers
    const layerPropss = this.props.layers
    if (layerPropss) {
      for (let i = 0, l = layerPropss.length; i < l; i++) {
        const layer = newLayer(layerPropss[i])
        if (layer) {
          this.layers.push(layer)
        }
      }
    }

    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].init(gl)
    }
  }

  render(gl: ThisWebGLContext, parentMatrix: Float32Array, frameInfo: FrameInfo) {
    const localMatrix = this.getLocalMatrix(frameInfo)
    if (!localMatrix) return

    const viewMatrix = m4.multiply(parentMatrix, localMatrix)

    // 绘制线框
    gl.uniformMatrix4fv(gl.uniforms.matrix, false, viewMatrix)
    drawLineRect(gl, this.props.width || frameInfo.width, this.props.height || frameInfo.height)

    console.log(m4.strMat4(viewMatrix))

    this.layers?.forEach(layer => {
      layer.render(gl, viewMatrix, frameInfo)
    })
  }

  clear(gl?: WebGLRenderingContext | undefined) {
    this.layers?.forEach(layer => layer.clear(gl))
    this.layers = undefined
  }
}
