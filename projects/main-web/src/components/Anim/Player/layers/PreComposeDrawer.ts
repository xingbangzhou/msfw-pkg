import {ThisWebGLContext, createTexture, drawLineRectangle, drawTexRectangle} from '../base'
import {Mat4} from '../base/m4'
import {FrameInfo} from '../types'
import AbstractDrawer from './AbstractDrawer'
import Layer from './Layer'

export default class PreComposeDrawer extends AbstractDrawer {
  private subLayers?: Layer[]
  private _framebuffer?: WebGLFramebuffer & {texture: WebGLTexture}

  async init(gl: ThisWebGLContext) {
    this.subLayers = []

    const layerPropss = this.layerRef.props.layers
    if (layerPropss) {
      for (let i = 0, l = layerPropss.length; i < l; i++) {
        const layer = new Layer(layerPropss[i])
        await layer.init(gl)
        this.subLayers.push(layer)
      }
    }
  }

  draw(gl: ThisWebGLContext, matrix: Mat4, frameInfo: FrameInfo) {
    if (!this.subLayers?.length) return

    const viewWidth = this.layerRef.width
    const viewHeight = this.layerRef.height
    // Test: 绘制线框
    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)
    drawLineRectangle(gl, this.layerRef.width || frameInfo.width, this.layerRef.height || frameInfo.height)

    // 合并绘制纹理
    const framebuffer = this._framebuffer || (gl.createFramebuffer() as WebGLFramebuffer & {texture: WebGLTexture})
    if (!framebuffer.texture) {
      framebuffer.texture = createTexture(gl) as WebGLTexture
    }
    this._framebuffer = framebuffer
    gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, viewWidth, viewHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0)

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
    if (gl.FRAMEBUFFER_COMPLETE !== status) {
      console.log('Frame buffer object is incomplete: ' + status.toString())
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, null)

    // 绘制合并子图层
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.viewport(0, 0, viewWidth, viewHeight)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const viewFrameInfo = {...frameInfo, width: viewWidth, height: viewHeight}
    const projectionMatrix = this.layerRef.projectionMatrix

    this.subLayers?.forEach(layer => {
      layer.render(gl, projectionMatrix, viewFrameInfo)
    })

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture)
    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)

    drawTexRectangle(gl, viewWidth, viewHeight, true)
  }

  destroy(gl?: ThisWebGLContext) {
    if (this._framebuffer) {
      gl?.deleteFramebuffer(this._framebuffer)
      gl?.deleteTexture(this._framebuffer.texture)
      this._framebuffer = undefined
    }

    this.subLayers?.forEach(el => el.destroy(gl))
    this.subLayers = undefined
  }
}
