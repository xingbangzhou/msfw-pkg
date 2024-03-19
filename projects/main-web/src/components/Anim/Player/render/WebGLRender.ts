import {FrameInfo, LayerProps} from '../types'
import {ThisWebGLContext, createProgram, resizeCanvasToDisplaySize} from '../base/glapi'
import {FragmentShader, VertexShader} from './shaders'
import * as m4 from '../base/m4'
import Layer, {createLayer} from '../layers/Layer'
import PlayBus from '../PlayBus'

export default class WebGLRender {
  protected playBus?: PlayBus

  private container?: HTMLElement
  private _canvas?: HTMLCanvasElement
  private _gl?: ThisWebGLContext

  private _worldMatrix = m4.identity()
  private _rootLayers?: Layer[]

  setContainer(container: HTMLElement) {
    if (container === this._canvas?.parentElement) return

    if (this._canvas) {
      this._canvas.parentNode?.removeChild(this._canvas)
      container.appendChild(this._canvas)
    }

    this.container = container
  }

  async load(playBus: PlayBus) {
    this.playBus = playBus

    const width = playBus.width
    const height = playBus.height

    if (!this._canvas) {
      const canvas = (this._canvas = document.createElement('canvas'))
      canvas.width = width
      canvas.height = height

      const gl = (this._gl = canvas.getContext('webgl', {
        premultipliedAlpha: true, // 请求非预乘阿尔法通道
      }) as ThisWebGLContext)
      this.container?.appendChild(this._canvas)

      // Init WebGL
      gl.enable(gl.BLEND)
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      const program = (gl.program = createProgram(gl, VertexShader, FragmentShader))
      if (program) {
        // 设置参数
        gl.attribs = {
          position: gl.getAttribLocation(program, 'a_position'),
          texcoord: gl.getAttribLocation(program, 'a_texcoord'),
        }
        gl.uniforms = {
          matrix: gl.getUniformLocation(program, 'u_matrix') as WebGLUniformLocation,
          texMatrix: gl.getUniformLocation(program, 'u_texMatrix') as WebGLUniformLocation,
          maskMode: gl.getUniformLocation(program, 'u_maskMode') as WebGLUniformLocation,
          opacity: gl.getUniformLocation(program, 'u_opacity') as WebGLUniformLocation,
        }
        // 纹理位置
        const uTextureLocation = gl.getUniformLocation(program, 'u_texture')
        const uMaskTextureLocation = gl.getUniformLocation(program, 'u_maskTexture')
        gl.uniform1i(uTextureLocation, 0)
        gl.uniform1i(uMaskTextureLocation, 1)
      }
    }

    if (!this._gl) {
      console.error(`WebGLRender, getContext('webgl') is null`)
      return false
    }

    resizeCanvasToDisplaySize(this._canvas)

    this._worldMatrix = m4.worldProjection(width, height)

    if (this._gl) {
      const layerPropsList = playBus.rootLayers
      await this.resetLayers(this._gl, playBus, layerPropsList || [])
    }

    return true
  }

  async render(frameInfo: FrameInfo) {
    const gl = this._gl
    if (!gl) return

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    const rootLayers = this._rootLayers
    if (rootLayers) {
      for (let i = 0, l = rootLayers?.length || 0; i < l; i++) {
        const layer = rootLayers?.[i]
        if (!layer.verifyTime(frameInfo.frameId)) continue
        layer.render(gl, this._worldMatrix, frameInfo)
      }
    }
  }

  destroy() {
    this.clearLayers()

    this._canvas?.parentNode?.removeChild(this._canvas)
    this._canvas = undefined
    this.container = undefined
  }

  private async resetLayers(gl: ThisWebGLContext, playBus: PlayBus, layerPropsList: LayerProps[]) {
    this._rootLayers?.forEach(layer => layer.destroy(gl))
    this._rootLayers = []

    for (let i = layerPropsList.length - 1; i >= 0; i--) {
      const props = layerPropsList[i]
      // 遮罩过滤
      if (props.isTrackMatte) continue
      // 创建图层
      const layer = createLayer(props, playBus)
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
