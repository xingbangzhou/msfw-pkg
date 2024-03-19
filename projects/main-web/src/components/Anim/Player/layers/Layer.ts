import PData from '../PlayData'
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
  private trackMatteLayer?: Layer
  private trackFramebuffer?: Framebuffer | null = null
  private framebuffer: Framebuffer | null = null

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
        this.trackMatteLayer = createLayer(trackProps, this.drawer.pdata)
      }
    }
    // 初始化
    await this.drawer.init(gl)
    await this.trackMatteLayer?.init(gl)
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
    const trackMatteLayer = this.trackMatteLayer
    if (trackMatteLayer) {
      const framebuffer = this.framebuffer || createFramebuffer(gl, parentWidth, parentHeight)
      this.framebuffer = framebuffer
      const trackFramebuffer = this.trackFramebuffer || createFramebuffer(gl, parentWidth, parentHeight)
      this.trackFramebuffer = trackFramebuffer
      if (!framebuffer || !trackFramebuffer) return

      // 纹理渲染
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
      gl.viewport(0, 0, parentWidth, parentHeight)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      const viewMatrix = m4.worldProjection(parentWidth, parentHeight)
      const matrix = m4.multiply(viewMatrix, localMatrix)
      drawer.draw(gl, matrix, frameInfo, framebuffer)

      // 遮罩渲染
      gl.bindFramebuffer(gl.FRAMEBUFFER, trackFramebuffer)
      gl.viewport(0, 0, parentWidth, parentHeight)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      trackMatteLayer.render(gl, parentMatrix, frameInfo, trackFramebuffer)

      gl.bindFramebuffer(gl.FRAMEBUFFER, parentFramebuffer || null)

      // 上屏
      gl.viewport(
        0,
        0,
        parentFramebuffer ? frameInfo.width : gl.canvas.width,
        parentFramebuffer ? frameInfo.height : gl.canvas.height,
      )

      // 设置透明度
      gl.uniform1f(gl.uniforms.opacity, opcaity)
      gl.uniform1i(gl.uniforms.maskMode, 1)
      gl.uniformMatrix4fv(gl.uniforms.matrix, false, parentMatrix)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, trackFramebuffer.texture)

      drawTexture(gl, parentWidth, parentHeight, true)

      // 释放
      gl.bindTexture(gl.TEXTURE_2D, null)
      gl.bindFramebuffer(gl.FRAMEBUFFER, parentFramebuffer || null)
      gl.uniform1i(gl.uniforms.maskMode, 0)
    } else {
      // 设置透明度
      gl.uniform1f(gl.uniforms.opacity, opcaity)
      const matrix = m4.multiply(parentMatrix, localMatrix)
      drawer.draw(gl, matrix, frameInfo, parentFramebuffer)
    }
  }

  destroy(gl?: ThisWebGLContext) {
    if (this.framebuffer) {
      gl?.deleteFramebuffer(this.framebuffer)
      gl?.deleteTexture(this.framebuffer.texture)
      this.framebuffer = null
    }
    if (this.trackFramebuffer) {
      gl?.deleteFramebuffer(this.trackFramebuffer)
      gl?.deleteTexture(this.trackFramebuffer.texture)
      this.trackFramebuffer = null
    }

    this.drawer.destroy(gl)
  }
}

export function createLayer(props: LayerProps, pdata: PData) {
  const {id, type, ...other} = props
  if (type === LayerType.PreComposition) {
    const compProps = pdata.getLayerByComps(id)
    if (!compProps) return undefined
    props = {...compProps, ...other}
  }

  const curType = props.type
  switch (curType) {
    case LayerType.Image:
      return new Layer(new ImageDrawer(props as LayerImageProps, pdata))
    case LayerType.Video:
      return new Layer(new VideoDrawer(props as LayerVideoProps, pdata))
    case LayerType.Text:
      return new Layer(new TextDrawer(props as LayerTextProps, pdata))
    case LayerType.Vector:
      return new Layer(new VectorDrawer(props as LayerVectorProps, pdata))
    case LayerType.ShapeLayer:
      return new Layer(new ShapeDrawer(props as LayerShapeProps, pdata))
  }

  return undefined
}
