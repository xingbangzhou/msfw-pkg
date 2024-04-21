import {ThisWebGLContext, createTexture, drawTexture, m4, rgba} from '../base'
import {FrameInfo, LayerTextProps} from '../types'
import AbstractDrawer from './AbstractDrawer'

const alignMap: CanvasTextAlign[] = ['left', 'center', 'right', 'left', 'left', 'left', 'left', 'left']

function drawHorizText(ctx: CanvasRenderingContext2D, text: string, textDocAttr: LayerTextProps['textDocAttr']) {
  // 设置字体
  ctx.font = `${textDocAttr.fontSize || 24}px ${textDocAttr.fontFamily || 'Arial'}`

  const metrics = ctx.measureText(text)
  const width = metrics.width
  const height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent

  ctx.canvas.width = width
  ctx.canvas.height = height

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // 设置字体
  ctx.fillStyle = rgba(textDocAttr.textColor)
  ctx.font = `${textDocAttr.fauxBold ? 'bold' : 'normal'} ${textDocAttr.fontSize || 24}px ${
    textDocAttr.fontFamily || 'Arial'
  }`

  ctx.fillText(text, width * 0.5, height * 0.5)
}

function drawVertiText(ctx: CanvasRenderingContext2D, text: string, textDocAttr: LayerTextProps['textDocAttr']) {
  // 设置字体
  ctx.font = `${textDocAttr.fontSize || 24}px ${textDocAttr.fontFamily || 'Arial'}`
  const metrics = ctx.measureText('国')
  const width = metrics.width
  const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent

  ctx.canvas.width = width
  ctx.canvas.height = fontHeight * text.length

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // 设置字体
  ctx.fillStyle = rgba(textDocAttr.textColor)
  ctx.font = `${textDocAttr.fauxBold ? 'bold' : 'normal'} ${textDocAttr.fontSize || 24}px ${
    textDocAttr.fontFamily || 'Arial'
  }`

  const x = width * 0.5
  let y = -fontHeight * 0.5
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], x, y + fontHeight)
    y += fontHeight
  }
}

export default class TextDrawer extends AbstractDrawer<LayerTextProps> {
  private _texture: WebGLTexture | null = null

  get text() {
    return this.props.textDocAttr.text || ''
  }

  async init(gl: ThisWebGLContext) {
    let canvas: HTMLCanvasElement | null = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    if (ctx && this.props.textDocAttr) {
      const textDocAttr = this.props.textDocAttr
      // 横向画字
      if (textDocAttr.orientation) {
        drawVertiText(ctx, this.text, textDocAttr)
        // 此处记住锚点偏移
        if (textDocAttr.textAligment !== undefined) {
          const align = alignMap[textDocAttr.textAligment]
          if (align === 'left') {
            this.setAnchorOffXY(canvas.width * 0.5, 0)
          } else if (align === 'center') {
            this.setAnchorOffXY(canvas.width * 0.5, canvas.height * 0.5)
          } else {
            this.setAnchorOffXY(canvas.width * 0.5, canvas.height)
          }
        }
      } else {
        // 水平画字
        drawHorizText(ctx, this.text, textDocAttr)
        if (textDocAttr.textAligment !== undefined) {
          const align = alignMap[textDocAttr.textAligment]
          if (align === 'left') {
            this.setAnchorOffXY(0, canvas.height)
          } else if (align === 'center') {
            this.setAnchorOffXY(canvas.width * 0.5, canvas.height)
          } else {
            this.setAnchorOffXY(canvas.width, canvas.height)
          }
        }
      }

      // 指定宽高
      this.props.width = canvas.width
      this.props.height = canvas.height
      // 生成纹理
      this._texture = createTexture(gl)
      gl.bindTexture(gl.TEXTURE_2D, this._texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas)
    }
    // 清理
    ctx = null
    canvas = null
  }

  async draw(gl: ThisWebGLContext, matrix: m4.Mat4, frameInfo: FrameInfo) {
    if (!this._texture) return

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this._texture)
    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)

    const width = this.width
    const height = this.height
    drawTexture(gl, width, height)

    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  destroy(gl?: ThisWebGLContext | undefined) {
    gl?.deleteTexture(this._texture || null)
    this._texture = null
  }
}
