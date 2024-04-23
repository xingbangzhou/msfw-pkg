import {LayerProps} from '../types'
import * as m4 from '../base/m4'
import Layer, {createLayer} from '../layers/Layer'
import PlayData from '../PlayData'
import {Framebuffer, ThisWebGLContext} from '../base/webgl'
import {setSimpleProgram} from '../layers/setPrograms'
import {drawSimpleTexture} from '../base/primitives'
import AttribBuffer from '../base/webgl/AttribBuffer'

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier?: number) {
  multiplier = multiplier || 1
  const width = (canvas.clientWidth * multiplier) | 0
  const height = (canvas.clientHeight * multiplier) | 0
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    return true
  }
  return false
}

export default class WebGLRender {
  protected playData?: PlayData

  private container?: HTMLElement
  private _canvas?: HTMLCanvasElement
  private _gl?: ThisWebGLContext
  private _framebuffer?: Framebuffer
  private _attribBuffer?: AttribBuffer

  private _camera = m4.identity()
  private _rootLayers?: Layer[]

  setContainer(container: HTMLElement) {
    if (container === this._canvas?.parentElement) return

    if (this._canvas) {
      this._canvas.parentNode?.removeChild(this._canvas)
      container.appendChild(this._canvas)
    }

    this.container = container
  }

  async load(playData: PlayData) {
    this.playData = playData

    const width = playData.width
    const height = playData.height

    if (!this._canvas) {
      const canvas = (this._canvas = document.createElement('canvas'))
      canvas.width = width
      canvas.height = height
      this.container?.appendChild(this._canvas)

      this._gl = canvas.getContext('webgl') as ThisWebGLContext
    }

    if (!this._gl) {
      console.error(`WebGLRender, getContext('webgl') is null`)
      return false
    }

    resizeCanvasToDisplaySize(this._canvas)

    this._camera = m4.perspectiveCamera(width, height)

    const layerPropsList = playData.rootLayers
    await this.resetLayers(this._gl, playData, layerPropsList || [])

    return true
  }

  async render() {
    const gl = this._gl
    if (!gl || !this.playData) return

    const {frames, frameId, width, height} = this.playData

    const framebuffer = this._framebuffer || new Framebuffer(gl)
    this._framebuffer = framebuffer

    const frameInfo = {
      frames,
      frameId,
      width,
      height,
      opacity: 1.0,
      framebuffer: framebuffer,
    }

    gl.enable(gl.BLEND)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    framebuffer.bind()
    framebuffer.viewport(width, height)

    const rootLayers = this._rootLayers
    if (rootLayers) {
      for (let i = 0, l = rootLayers?.length || 0; i < l; i++) {
        const layer = rootLayers?.[i]
        if (!layer.verifyTime(frameInfo.frameId)) continue
        layer.render(gl, this._camera, frameInfo)
      }
    }

    // 绘制到canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.disable(gl.BLEND)

    setSimpleProgram(gl)

    gl.activeTexture(gl.TEXTURE0)
    framebuffer.texture?.bind()

    const attribBuffer = this._attribBuffer || new AttribBuffer(gl)
    this._attribBuffer = attribBuffer

    drawSimpleTexture(attribBuffer)

    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  destroy() {
    this.clearLayers()
    this._framebuffer?.destory()
    this._framebuffer = undefined
    this._attribBuffer?.destroy()
    this._attribBuffer = undefined

    this._canvas?.parentNode?.removeChild(this._canvas)
    this._canvas = undefined
    this.container = undefined
  }

  private async resetLayers(gl: ThisWebGLContext, playData: PlayData, layerPropsList: LayerProps[]) {
    this._rootLayers?.forEach(layer => layer.destroy(gl))
    this._rootLayers = []

    for (let i = layerPropsList.length - 1; i >= 0; i--) {
      const props = layerPropsList[i]
      // 遮罩过滤
      if (props.isTrackMatte) continue
      // 创建图层
      const layer = createLayer(props, playData)
      if (!layer) continue
      this._rootLayers.push(layer)
      await layer.init(gl, layerPropsList)
    }
  }

  private clearLayers() {
    const {_gl} = this

    this._rootLayers?.forEach(layer => layer.destroy(_gl))
    this._rootLayers = undefined
  }
}
