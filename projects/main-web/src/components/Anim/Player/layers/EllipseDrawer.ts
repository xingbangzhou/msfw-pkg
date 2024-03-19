import PData from '../PlayData'
import {ThisWebGLContext, createTexture, drawTexture} from '../base'
import {Mat4} from '../base/m4'
import {FrameInfo, LayerEllipseProps} from '../types'
import AbstractDrawer from './AbstractDrawer'

function drawRoundedRect(ctx: CanvasRenderingContext2D, width: number, height: number, radius: number) {
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.lineTo(width - radius, 0)
  ctx.arcTo(width, 0, width, 0 + radius, radius)
  ctx.lineTo(width, 0 + height - radius)
  ctx.arcTo(width, 0 + height, width - radius, 0 + height, radius)
  ctx.lineTo(radius, 0 + height)
  ctx.arcTo(0, 0 + height, 0, 0 + height - radius, radius)
  ctx.lineTo(0, 0 + radius)
  ctx.arcTo(0, 0, radius, 0, radius)
  ctx.closePath()
  ctx.fill()
}

export default class EllipseDrawer extends AbstractDrawer<LayerEllipseProps> {
  constructor(props: LayerEllipseProps, pdata: PData) {
    super(props, pdata)
    this.props.width = props.elements.ellipseInfo.size[0] || 0
    this.props.height = props.elements.ellipseInfo.size[1] || 0
  }

  private _texture: WebGLTexture | null = null

  async init(gl: ThisWebGLContext) {
    let ellipseCanvas: HTMLCanvasElement | null = document.createElement('canvas')
    ellipseCanvas.width = this.props.width
    ellipseCanvas.height = this.props.height
    let context = ellipseCanvas.getContext('2d')
    if (context && this.props.elements) {
      const color = this.props.elements.fillInfo?.color || [0, 0, 0, 1]
      const opacity = this.props.elements.fillInfo?.opacity || 100
      context.fillStyle = `rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, ${
        color[3] * 255 * (opacity / 100)
      })`
      context.beginPath()
      context.ellipse(
        this.props.width / 2,
        this.props.height / 2,
        this.props.width / 2,
        this.props.height / 2,
        0,
        0,
        Math.PI * 2,
      )
      context.closePath()
      context.fill()
      // 生成纹理
      this._texture = createTexture(gl)
      gl.bindTexture(gl.TEXTURE_2D, this._texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ellipseCanvas)
    }
    // 用完就可以删了
    context = null
    ellipseCanvas = null

    // x、y的偏移值
    let eX = 0
    if (this.props.elements?.ellipseInfo?.position) {
      eX = this.props.elements?.ellipseInfo?.position[0]
    }
    let eY = 0
    if (this.props.elements?.ellipseInfo?.position) {
      eY = this.props.elements?.ellipseInfo?.position[1]
    }

    this.setAnchorOffXY(this.width * 0.5 - eX, this.height * 0.5 - eY)
    this.setOffXY(eX, eY)
  }

  draw(gl: ThisWebGLContext, matrix: Mat4, frameInfo: FrameInfo, parentFramebuffer: WebGLFramebuffer | null) {
    if (!this._texture) return

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this._texture)
    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)

    const width = this.width
    const height = this.height
    drawTexture(gl, width, height)
  }

  destroy(gl?: ThisWebGLContext | undefined): void {
    gl?.deleteTexture(this._texture || null)
    this._texture = null
  }
}
