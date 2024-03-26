import {FrameInfo, LayerProps} from '../types'
import {ThisWebGLContext, createProgram, resizeCanvasToDisplaySize} from '../base/glapi'
import {FragmentShader, VertexShader} from './shaders'
import * as m4 from '../base/m4'
import Layer, {createLayer} from '../layers/Layer'
import PlayContext from '../PlayContext'
import {alpha} from '@mui/system'

export default class WebGLRender {
  protected playContext?: PlayContext

  private container?: HTMLElement
  private _canvas?: HTMLCanvasElement
  private _gl?: ThisWebGLContext

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

  async load(playContext: PlayContext) {
    this.playContext = playContext

    const width = playContext.width
    const height = playContext.height

    if (!this._canvas) {
      const canvas = (this._canvas = document.createElement('canvas'))
      canvas.width = width
      canvas.height = height

      const gl = (this._gl = canvas.getContext('webgl') as ThisWebGLContext)
      this.container?.appendChild(this._canvas)

      // 混合
      // gl.enable(gl.BLEND)
      // gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)

      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

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

    this._camera = m4.perspectiveCamera(width, height)

    if (this._gl) {
      const layerPropsList = playContext.rootLayers
      await this.resetLayers(this._gl, playContext, layerPropsList || [])
    }

    return true
  }

  async render(frameInfo: FrameInfo) {
    const gl = this._gl
    if (!gl) return

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.clear(gl.COLOR_BUFFER_BIT)
    const rootLayers = this._rootLayers
    if (rootLayers) {
      for (let i = 0, l = rootLayers?.length || 0; i < l; i++) {
        const layer = rootLayers?.[i]
        if (!layer.verifyTime(frameInfo.frameId)) continue
        layer.render(gl, this._camera, frameInfo)
      }
    }
  }

  destroy() {
    this.clearLayers()

    this._canvas?.parentNode?.removeChild(this._canvas)
    this._canvas = undefined
    this.container = undefined
  }

  private async resetLayers(gl: ThisWebGLContext, playContext: PlayContext, layerPropsList: LayerProps[]) {
    this._rootLayers?.forEach(layer => layer.destroy(gl))
    this._rootLayers = []

    for (let i = layerPropsList.length - 1; i >= 0; i--) {
      const props = layerPropsList[i]
      // 遮罩过滤
      if (props.isTrackMatte) continue
      // 创建图层
      const layer = createLayer(props, playContext)
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
