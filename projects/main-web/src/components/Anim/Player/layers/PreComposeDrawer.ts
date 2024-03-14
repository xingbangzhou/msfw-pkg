import {Framebuffer, ThisWebGLContext, createFramebuffer, createTexture, drawTexRectangle} from '../base'
import {m4} from '../base'
import {FrameInfo} from '../types'
import AbstractDrawer from './AbstractDrawer'
import Layer from './Layer'

export default class PreComposeDrawer extends AbstractDrawer {
  private _subLayers?: Layer[]
  private _framebuffer: Framebuffer | null = null
  private _projectionMatrix: m4.Mat4 = m4.identity()

  async init(gl: ThisWebGLContext) {
    const width = this.layerRef.width
    const height = this.layerRef.height
    this._framebuffer = createFramebuffer(gl, width, height)
    this._projectionMatrix = m4.worldProjection(width, height)

    // 初始化子图层
    this._subLayers = []
    const layerPropss = this.layerRef.props.layers
    if (layerPropss) {
      for (let i = 0, l = layerPropss.length; i < l; i++) {
        const layer = new Layer(layerPropss[i])
        await layer.init(gl)
        this._subLayers.push(layer)
      }
    }
  }

  draw(
    gl: ThisWebGLContext,
    matrix: m4.Mat4,
    parentFrameInfo: FrameInfo,
    parentFramebuffer: WebGLFramebuffer | null = null,
  ) {
    const framebuffer = this._framebuffer
    const subLayers = this._subLayers
    if (!framebuffer || !subLayers || !subLayers.length) return

    const width = this.layerRef.width
    const height = this.layerRef.height

    // 子图层渲染
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.viewport(0, 0, width, height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const frameInfo = {...parentFrameInfo, width: width, height: height}
    const projectionMatrix = this._projectionMatrix

    for (let i = 0, l = subLayers.length; i < l; i++) {
      const layer = subLayers[i]
      layer.render(gl, projectionMatrix, frameInfo, framebuffer)
    }
    // 上屏
    gl.bindFramebuffer(gl.FRAMEBUFFER, parentFramebuffer || null)
    gl.viewport(
      0,
      0,
      parentFramebuffer ? parentFrameInfo.width : gl.canvas.width,
      parentFramebuffer ? parentFrameInfo.height : gl.canvas.height,
    )

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture)
    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)

    drawTexRectangle(gl, width, height, true)

    // 释放
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  destroy(gl?: ThisWebGLContext) {
    if (this._framebuffer) {
      gl?.deleteFramebuffer(this._framebuffer)
      gl?.deleteTexture(this._framebuffer.texture)
      this._framebuffer = null
    }

    this._subLayers?.forEach(el => el.destroy(gl))
    this._subLayers = undefined
  }
}
