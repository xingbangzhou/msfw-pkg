import {FrameInfo, LayerProps} from '../types'
import {ThisWebGLContext, degToRad, drawTexRectangle} from '../base'
import * as m4 from '../base/m4'
import {Transform3D} from '../base/transforms'

export default abstract class BaseLayer {
  constructor(props: LayerProps) {
    this.props = props
    this.transform3D = new Transform3D(props.transform)
  }

  protected props: LayerProps
  protected transform3D: Transform3D

  private maskLayer?: BaseLayer

  setMaskLayer(maskLayer?: BaseLayer) {
    this.maskLayer = maskLayer
  }

  async init(gl: ThisWebGLContext) {
    await this.maskLayer?.init(gl)

    return await this.onInit(gl)
  }

  render(gl: ThisWebGLContext, parentMatrix: m4.Mat4, frameInfo: FrameInfo) {
    let matrix = this.getMatrix(frameInfo)
    if (!matrix) return

    matrix = m4.multiply(parentMatrix, matrix)

    // 遮罩
    let maskOpened = false
    if (this.maskLayer) {
      maskOpened = true

      // gl.enable(gl.STENCIL_TEST)
      // gl.stencilFunc(gl.ALWAYS, 1, 0xff)
      // gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE)

      // this.maskLayer.render(gl, matrix, frameInfo)

      // 测试----------
      // gl.activeTexture(gl.TEXTURE0)
      // const texture = gl.createTexture()
      // gl.bindTexture(gl.TEXTURE_2D, texture)

      // const maskMatix = m4.scale(matrix, 0.5, 0.5, 1.0)
      // gl.uniformMatrix4fv(gl.uniforms.matrix, false, maskMatix)

      // const level = 0
      // const internalFormat = gl.RGBA
      // const width = 1
      // const height = 1
      // const border = 0
      // const srcFormat = gl.RGBA
      // const srcType = gl.UNSIGNED_BYTE
      // const pixel = new Uint8Array([0, 0, 0, 0]) // opaque red
      // gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel)
      // drawTexRectangle(gl, 400, 400)

      // const maskMati1x = m4.translate(maskMatix, 100, 100, 0)
      // gl.uniformMatrix4fv(gl.uniforms.matrix, false, maskMati1x)
      // drawTexRectangle(gl, 400, 400)

      // 重新设置模版测试，等于1的模版才通过
      // gl.stencilFunc(gl.EQUAL, 1, 0xff)
      // 通过后不采取所有操作，保持原值
      // gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
    }

    // 绘制真正图元
    this.onDraw(gl, matrix, frameInfo)

    if (maskOpened) {
      // gl.disable(gl.STENCIL_TEST)
    }
  }

  destroy(gl?: ThisWebGLContext) {
    this.maskLayer?.destroy(gl)

    this.onDestroy(gl)
  }

  protected abstract onInit(gl: ThisWebGLContext): Promise<void>

  protected abstract onDraw(gl: ThisWebGLContext, matrix: m4.Mat4, frameInfo: FrameInfo): void

  protected abstract onDestroy(gl?: ThisWebGLContext): void

  protected getMatrix({frameId}: FrameInfo) {
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
}
