import {Framebuffer, ThisWebGLContext, createFramebuffer, drawTexture} from '../base'
import {m4} from '../base'
import {FrameInfo, LayerVectorProps} from '../types'
import AbstractDrawer from './AbstractDrawer'
import Layer, {createLayer} from './Layer'

export default class VectorDrawer extends AbstractDrawer<LayerVectorProps> {
  private _subLayers?: Layer[]
  private _framebuffer: Framebuffer | null = null
  private _viewMatrix: m4.Mat4 = m4.identity()

  async init(gl: ThisWebGLContext) {
    const width = this.width
    const height = this.height
    this._framebuffer = createFramebuffer(gl, width, height)
    this._viewMatrix = m4.perspectiveCamera(width, height)
    const parInFrame = this.props.inFrame

    // 子图层列表
    this._subLayers = []
    const layerPropss = this.props.layers
    if (layerPropss) {
      for (let i = layerPropss.length - 1; i >= 0; i--) {
        const props = layerPropss[i]
        const inFrame = props.inFrame + parInFrame
        const outFrame = props.outFrame + parInFrame
        // 遮罩过滤
        if (props.isTrackMatte) continue
        // 创建图层
        const layer = createLayer({...props, inFrame, outFrame}, this.playData)
        if (!layer) continue
        await layer.init(gl, layerPropss)
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

    const width = this.width
    const height = this.height

    // 子图层渲染
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.viewport(0, 0, width, height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const opacity = this.transform.getOpacity(parentFrameInfo.frameId)
    const frameInfo = {...parentFrameInfo, width: width, height: height, opacity}
    const viewMatrix = this._viewMatrix

    for (let i = 0, l = subLayers.length; i < l; i++) {
      const layer = subLayers[i]
      if (!layer.verifyTime(frameInfo.frameId)) continue
      layer.render(gl, viewMatrix, frameInfo, framebuffer)
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

    drawTexture(gl, width, height, true)

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
