import {Framebuffer, ThisWebGLContext, createFramebuffer, createTexture, degToRad, drawTexRectangle, m4} from '../base'
import {str$m4} from '../base/m4'
import {Transform3D} from '../base/transforms'
import {FrameInfo, LayerProps, LayerType} from '../types'
import Drawer from './AbstractDrawer'
import ImageDrawer from './ImageDrawer'
import PreComposeDrawer from './PreComposeDrawer'
import VideoDrawer from './VideoDrawer'

function newDrawer(props: LayerProps, layerRef: Layer) {
  const type = props.type
  switch (type) {
    case LayerType.Video:
      return new VideoDrawer(layerRef)
    case LayerType.Image:
      return new ImageDrawer(layerRef)
    case LayerType.PreComposition:
      return new PreComposeDrawer(layerRef)
  }

  return undefined
}

export default class Layer {
  constructor(props: LayerProps) {
    this._props = props
    this._transform3D = new Transform3D(props.transform)

    this._drawer = newDrawer(props, this)
    if (props.trackMatteLayer) {
      this._trackMatteLayer = new Layer(props.trackMatteLayer)
    }
  }

  private _props: LayerProps
  private _transform3D: Transform3D
  private _drawer?: Drawer
  private _projectionMatrix?: m4.Mat4

  // 遮罩
  private _trackMatteLayer?: Layer
  private _trackFramebuffer?: Framebuffer | null = null
  private _framebuffer: Framebuffer | null = null

  get props() {
    return this._props
  }

  get transform3D() {
    return this._transform3D
  }

  get width() {
    return this._props.width
  }

  get height() {
    return this._props.height
  }

  getFrameMatrix({frameId}: FrameInfo) {
    const anchorPoint = this.transform3D.getAnchorPoint(frameId)
    const position = this.transform3D.getPosition(frameId)
    const scale = this.transform3D.getScale(frameId)
    const rotation = this.transform3D.getRotation(frameId)

    if (!anchorPoint || !position) return null

    const [x, y, z] = position
    let matrix = m4.translation(x, -y, -z)

    if (rotation) {
      rotation[0] && (matrix = m4.xRotate(matrix, degToRad(rotation[0])))
      rotation[1] && (matrix = m4.yRotate(matrix, degToRad(360 - rotation[1])))
      rotation[2] && (matrix = m4.zRotate(matrix, degToRad(360 - rotation[2])))
    }
    if (scale) {
      matrix = m4.scale(matrix, (scale[0] || 100) * 0.01, (scale[1] || 100) * 0.01, (scale[2] || 100) * 0.01)
    }

    const moveOrighMatrix = m4.translation(-anchorPoint[0], anchorPoint[1], 0)
    matrix = m4.multiply(matrix, moveOrighMatrix)

    return matrix
  }

  async init(gl: ThisWebGLContext) {
    if (this._trackMatteLayer) {
      await this._trackMatteLayer?.init(gl)
    }
    await this._drawer?.init(gl)
  }

  async render(
    gl: ThisWebGLContext,
    parentMatrix: m4.Mat4,
    frameInfo: FrameInfo,
    parentFramebuffer: WebGLFramebuffer | null = null,
  ) {
    if (!this._drawer) return
    const localMatrix = this.getFrameMatrix(frameInfo)
    if (!localMatrix) return

    const {width: parentWidth, height: parentHeight} = frameInfo

    // 设置透明度
    const opcaity = this.transform3D.getOpacity(frameInfo.frameId)
    gl.uniform1f(gl.uniforms.opacity, opcaity)

    // 处理遮罩
    if (this._trackMatteLayer) {
      const framebuffer = this._framebuffer || createFramebuffer(gl, parentWidth, parentHeight)

      const trackFramebuffer = this._trackFramebuffer || createFramebuffer(gl, parentWidth, parentHeight)
      if (!framebuffer || !trackFramebuffer) return

      // 纹理渲染
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
      gl.viewport(0, 0, parentWidth, parentHeight)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      const viewMatrix = m4.worldProjection(parentWidth, parentHeight)
      const matrix = m4.multiply(viewMatrix, localMatrix)
      await this._drawer.draw(gl, matrix, frameInfo, framebuffer)

      // 遮罩渲染
      gl.bindFramebuffer(gl.FRAMEBUFFER, trackFramebuffer)
      gl.viewport(0, 0, parentWidth, parentHeight)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      await this._trackMatteLayer.render(gl, parentMatrix, frameInfo, trackFramebuffer)

      gl.bindFramebuffer(gl.FRAMEBUFFER, parentFramebuffer || null)

      // 上屏
      gl.viewport(
        0,
        0,
        parentFramebuffer ? frameInfo.width : gl.canvas.width,
        parentFramebuffer ? frameInfo.height : gl.canvas.height,
      )

      gl.uniform1i(gl.uniforms.enableMask, 1)
      gl.uniformMatrix4fv(gl.uniforms.matrix, false, parentMatrix)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, trackFramebuffer.texture)

      drawTexRectangle(gl, parentWidth, parentHeight, true)

      // 释放
      gl.bindTexture(gl.TEXTURE_2D, null)
      gl.bindFramebuffer(gl.FRAMEBUFFER, parentFramebuffer || null)
      gl.uniform1i(gl.uniforms.enableMask, 0)
    } else {
      const matrix = m4.multiply(parentMatrix, localMatrix)
      await this._drawer.draw(gl, matrix, frameInfo, parentFramebuffer)
    }
  }

  destroy(gl?: ThisWebGLContext) {
    if (this._framebuffer) {
      gl?.deleteFramebuffer(this._framebuffer)
      gl?.deleteTexture(this._framebuffer.texture)
      this._framebuffer = null
    }
    if (this._trackFramebuffer) {
      gl?.deleteFramebuffer(this._trackFramebuffer)
      gl?.deleteTexture(this._trackFramebuffer.texture)
      this._trackFramebuffer = null
    }

    this._drawer?.destroy(gl)
  }
}
