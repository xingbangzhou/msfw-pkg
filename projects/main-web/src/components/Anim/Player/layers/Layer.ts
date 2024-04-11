import PlayData from '../PlayData'
import {Framebuffer, ThisWebGLContext, createFramebuffer, drawTexture, m4} from '../base'
import {
  FrameInfo,
  LayerImageProps,
  LayerProps,
  LayerShapeProps,
  LayerTextProps,
  LayerType,
  LayerVectorProps,
  LayerVideoProps,
  PreComposition,
} from '../types'
import AbstractDrawer from './AbstractDrawer'
import ImageDrawer from './ImageDrawer'
import ShapeDrawer from './ShapeDrawer'
import TextDrawer from './TextDrawer'
import VectorDrawer from './VectorDrawer'
import VideoDrawer from './VideoDrawer'

export default class Layer {
  constructor(drawer: AbstractDrawer<LayerProps>) {
    this.drawer = drawer
  }

  private drawer: AbstractDrawer<LayerProps>

  // 遮罩
  private _trackMatteLayer?: Layer
  private _drawFramebuffer: Framebuffer | null = null
  private _trackFramebuffer?: Framebuffer | null = null

  get type() {
    return this.drawer.props.type
  }

  get width() {
    return this.drawer.width
  }

  get height() {
    return this.drawer.height
  }

  get inFrame() {
    return this.drawer.props.inFrame
  }

  get outFrame() {
    return this.drawer.props.outFrame
  }

  verifyTime(frameId: number) {
    return frameId >= this.inFrame && frameId <= this.outFrame
  }

  async init(gl: ThisWebGLContext, parentLayers?: LayerProps[]) {
    // 遮罩对象
    const trackId = this.drawer.props.trackMatteLayer
    if (trackId && parentLayers) {
      const trackProps = parentLayers.find(el => el.id == trackId)
      if (trackProps) {
        this._trackMatteLayer = createLayer(trackProps, this.drawer.playData)
      }
    }
    // 初始化
    await this.drawer.init(gl)
    await this._trackMatteLayer?.init(gl)
  }

  render(
    gl: ThisWebGLContext,
    parentMatrix: m4.Mat4,
    frameInfo: FrameInfo,
    parentFramebuffer: WebGLFramebuffer | null = null,
  ) {
    const drawer = this.drawer
    const localMatrix = drawer.getMatrix(frameInfo)
    if (!localMatrix) return

    const {width: parentWidth, height: parentHeight} = frameInfo

    const opcaity = drawer.getOpacity(frameInfo)

    // 处理遮罩
    const trackMatteLayer = this._trackMatteLayer
    if (trackMatteLayer) {
      const drawFramebuffer = (this._drawFramebuffer =
        this._drawFramebuffer || createFramebuffer(gl, parentWidth, parentHeight))
      this._drawFramebuffer = drawFramebuffer
      const trackFramebuffer = (this._trackFramebuffer =
        this._trackFramebuffer || createFramebuffer(gl, parentWidth, parentHeight))
      if (!drawFramebuffer || !trackFramebuffer) return

      // 纹理渲染
      gl.bindFramebuffer(gl.FRAMEBUFFER, drawFramebuffer)
      gl.viewport(0, 0, parentWidth, parentHeight)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      const viewMatrix = m4.perspectiveCamera(parentWidth, parentHeight)
      const matrix = m4.multiply(viewMatrix, localMatrix)
      drawer.draw(gl, matrix, frameInfo, drawFramebuffer)

      // 遮罩渲染
      gl.bindFramebuffer(gl.FRAMEBUFFER, trackFramebuffer)
      gl.viewport(0, 0, parentWidth, parentHeight)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      trackMatteLayer.render(gl, parentMatrix, frameInfo, trackFramebuffer)

      // 上屏
      gl.bindFramebuffer(gl.FRAMEBUFFER, parentFramebuffer || null)
      gl.viewport(
        0,
        0,
        parentFramebuffer ? frameInfo.width : gl.canvas.width,
        parentFramebuffer ? frameInfo.height : gl.canvas.height,
      )
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      // 设置透明度
      gl.uniform1f(gl.uniforms.opacity, opcaity)
      gl.uniform1i(gl.uniforms.maskMode, 1)
      gl.uniformMatrix4fv(gl.uniforms.matrix, false, parentMatrix)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, drawFramebuffer.texture)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, trackFramebuffer.texture)

      drawTexture(gl, parentWidth, parentHeight, true)

      // 释放
      gl.bindTexture(gl.TEXTURE_2D, null)
      gl.uniform1i(gl.uniforms.maskMode, 0)
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    } else {
      // 设置透明度
      gl.uniform1f(gl.uniforms.opacity, opcaity)
      const matrix = m4.multiply(parentMatrix, localMatrix)
      drawer.draw(gl, matrix, frameInfo, parentFramebuffer)
    }
  }

  destroy(gl?: ThisWebGLContext) {
    if (this._drawFramebuffer) {
      gl?.deleteFramebuffer(this._drawFramebuffer)
      gl?.deleteTexture(this._drawFramebuffer.texture)
      this._drawFramebuffer = null
    }
    if (this._trackFramebuffer) {
      gl?.deleteFramebuffer(this._trackFramebuffer)
      gl?.deleteTexture(this._trackFramebuffer.texture)
      this._trackFramebuffer = null
    }

    this.drawer.destroy(gl)
  }
}

export function createLayer(props: LayerProps, playData: PlayData) {
  const {id, type, ...other} = props
  if (type === PreComposition) {
    const compProps = playData.getLayerByComps(id)
    if (!compProps) return undefined
    props = {...compProps, ...other}
  }

  const curType = props.type
  switch (curType) {
    case LayerType.Image:
      return new Layer(new ImageDrawer(props as LayerImageProps, playData))
    case LayerType.Video:
      return new Layer(new VideoDrawer(props as LayerVideoProps, playData))
    case LayerType.Text:
      return new Layer(new TextDrawer(props as LayerTextProps, playData))
    case LayerType.Vector:
      return new Layer(new VectorDrawer(props as LayerVectorProps, playData))
    case LayerType.ShapeLayer:
      return new Layer(new ShapeDrawer(props as LayerShapeProps, playData))
  }

  return undefined
}
