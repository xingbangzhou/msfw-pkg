import {createTexture, drawTexture, m4, ThisWebGLContext} from '../base'
import {Property} from '../base/transforms'
import {FrameInfo, LayerEllipseProps, LayerPathProps, LayerRectProps, LayerShapeProps} from '../types'
import AbstractDrawer from './AbstractDrawer'

const LineCap: CanvasLineCap[] = ['butt', 'round', 'square']
const LineJoin: CanvasLineJoin[] = ['bevel', 'miter', 'round']

function rgba(color: number[], opacity?: number) {
  opacity = opacity ?? 100
  return `rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, ${(color[3] ?? 1.0) * opacity * 0.01})`
}

export default abstract class ElementDrawer<
  Props extends LayerRectProps | LayerEllipseProps | LayerPathProps,
> extends AbstractDrawer<Props> {
  private _texture: WebGLTexture | null = null
  private _ctx: CanvasRenderingContext2D | null = null
  private _lineDashOffset?: Property<number>
  private _lastDashOffset = 0

  async init(gl: ThisWebGLContext) {
    this._texture = createTexture(gl)

    const strokeInfo = this.props.elements.strokeInfo
    if (strokeInfo?.dashesInfo) {
      this._lineDashOffset = new Property<number>(strokeInfo.dashesInfo.offset)
    }
  }

  draw(gl: ThisWebGLContext, matrix: m4.Mat4, frameInfo: FrameInfo, parentFramebuffer: WebGLFramebuffer | null) {
    if (!this._texture) return

    this.drawShape(gl, frameInfo)

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
    this._ctx = null
  }

  protected abstract getDrawPath(ctx: CanvasRenderingContext2D): Path2D

  private drawShape(gl: ThisWebGLContext, frameInfo: FrameInfo) {
    const width = this.width
    const height = this.height
    let hasTexture = true
    if (!this._ctx) {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      this._ctx = canvas.getContext('2d')
      hasTexture = false
    }
    if (!this._ctx) return

    const lineDashOffset = (this._lineDashOffset?.getValue(frameInfo.frameId) || 0) as number

    if (!hasTexture || lineDashOffset !== this._lastDashOffset) {
      this._lastDashOffset = lineDashOffset
      this._ctx?.clearRect(0, 0, width, height)

      // 设置参数
      const fillInfo = this.props.elements.fillInfo
      if (fillInfo) {
        this._ctx.fillStyle = rgba(fillInfo.color, fillInfo.opacity)
      }
      const strokeInfo = this.props.elements.strokeInfo
      if (strokeInfo) {
        this._ctx.strokeStyle = rgba(strokeInfo.color, strokeInfo.opacity)
        this._ctx.lineCap = LineCap[strokeInfo.lineCap]
        this._ctx.lineWidth = strokeInfo.width
        this._ctx.lineJoin = LineJoin[strokeInfo.lineJoin]
        this._ctx.miterLimit = strokeInfo.miterLimit
        if (strokeInfo.dashesInfo) {
          this._ctx.setLineDash(strokeInfo.dashesInfo.dash)
          const dashOffset = (this._lineDashOffset?.getValue(frameInfo.frameId) || 0) as number
          this._ctx.lineDashOffset = dashOffset
        }
      }

      const path = this.getDrawPath(this._ctx)
      if (fillInfo) {
        this._ctx.fill(path)
      }
      if (strokeInfo) {
        this._ctx.stroke(path)
      }

      gl.bindTexture(gl.TEXTURE_2D, this._texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._ctx.canvas)
    }
  }
}
