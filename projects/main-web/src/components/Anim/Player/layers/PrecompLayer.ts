import {FrameInfo} from '../types'
import * as m4 from '../base/m4'
import {ThisWebGLContext, createTexture} from '../base/glapi'
import BaseLayer from './BaseLayer'
import {newLayer} from './factories'
import {drawRect} from '../base'

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

    // Draw
    const texture = createTexture(gl)
    if (texture) {
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.LUMINANCE,
        3,
        2,
        0,
        gl.LUMINANCE,
        gl.UNSIGNED_BYTE,
        new Uint8Array([128, 64, 128, 125, 192, 0]),
      )

      gl.uniformMatrix4fv(gl.uniforms.matrix, false, viewMatrix)

      drawRect(gl, frameInfo.width, frameInfo.height)
    }

    this.layers?.forEach(layer => {
      layer.render(gl, viewMatrix, frameInfo)
    })
  }

  clear(gl?: WebGLRenderingContext | undefined) {
    this.layers?.forEach(layer => layer.clear(gl))
    this.layers = undefined
  }
}
