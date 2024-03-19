import PData from '../PlayData'
import {ThisWebGLContext, createTexture, drawTexRectangle} from '../base'
import {Mat4} from '../base/m4'
import {FrameInfo, LayerRectProps} from '../types'
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

export default class RectDrawer extends AbstractDrawer<LayerRectProps> {
  constructor(props: LayerRectProps, pdata: PData) {
    super(props, pdata)
    this.props.width = props.elements.rectInfo.size[0] || 0
    this.props.height = props.elements.rectInfo.size[1] || 0
  }

  private _texture: WebGLTexture | null = null

  async init(gl: ThisWebGLContext) {
    let rectCanvas: HTMLCanvasElement | null = document.createElement('canvas')
    rectCanvas.width = this.width
    rectCanvas.height = this.height
    let context = rectCanvas.getContext('2d')
    if (context && this.props.elements) {
      const color = this.props.elements.fillInfo?.color || [0, 0, 0, 1]
      const opacity = this.props.elements.fillInfo?.opacity || 100
      context.fillStyle = `rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, ${
        color[3] * 255 * (opacity / 100)
      })`
      if (this.props.elements.rectInfo?.roundness && this.props.elements.rectInfo?.roundness > 0) {
        let radius = this.props.elements.rectInfo?.roundness
        if (radius > this.props.height / 2) {
          radius = Math.floor(this.props.height / 2)
        }
        drawRoundedRect(context, this.props.width, this.props.height, radius)
      } else {
        context.fillRect(0, 0, this.props.width, this.props.height)
      }

      this._texture = createTexture(gl)
      gl.bindTexture(gl.TEXTURE_2D, this._texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rectCanvas)
    }
    // 用完就可以删了
    context = null
    rectCanvas = null

    // x、y的偏移值
    let eX = 0
    if (this.props.elements?.rectInfo?.position) {
      eX = this.props.elements?.rectInfo?.position[0]
    }
    let eY = 0
    if (this.props.elements?.rectInfo?.position) {
      eY = this.props.elements?.rectInfo?.position[1]
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
    drawTexRectangle(gl, width, height)
  }

  destroy(gl?: ThisWebGLContext | undefined): void {
    gl?.deleteTexture(this._texture || null)
    this._texture = null
  }
}
