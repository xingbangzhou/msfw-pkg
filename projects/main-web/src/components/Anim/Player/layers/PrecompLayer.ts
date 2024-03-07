import {FrameInfo} from '../types'
import * as m4 from '../base/m4'
import {ThisWebGLContext} from '../base/glapi'
import BaseLayer from './BaseLayer'
import {newLayer} from './factories'
import {drawLineRectangle} from '../base/primitives'

export default class PrecompLayer extends BaseLayer {
  private layers?: BaseLayer[]

  protected async onInit(gl: ThisWebGLContext) {
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
      await this.layers[i].init(gl)
    }
  }

  protected onDraw(gl: ThisWebGLContext, matrix: m4.Mat4, frameInfo: FrameInfo) {
    // Test: 绘制线框
    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)
    drawLineRectangle(gl, this.props.width || frameInfo.width, this.props.height || frameInfo.height)

    // 绘制子图层
    this.layers?.forEach(layer => {
      layer.render(gl, matrix, frameInfo)
    })
  }

  protected onDestroy(gl?: ThisWebGLContext | undefined) {
    this.layers?.forEach(layer => layer.destroy(gl))
    this.layers = undefined
  }
}
