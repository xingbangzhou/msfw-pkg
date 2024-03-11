import BaseLayer from '../layers/BaseLayer'
import {newLayer} from '../layers/factories'
import {FrameInfo, LayerProps} from '../types'
import {ThisWebGLContext, createProgram, resizeCanvasToDisplaySize} from '../base/glapi'
import {FragmentShader, VertexShader} from '../layers/shaders'
import * as m4 from '../base/m4'

export default class WebGLRender {
  private container?: HTMLElement
  private canvas?: HTMLCanvasElement
  private gl?: ThisWebGLContext

  private viewProjectionMatrix = m4.identity()
  private layers?: BaseLayer[]

  setContainer(container: HTMLElement) {
    if (this.container === container) return
    this.container = container

    if (this.canvas) {
      this.canvas.parentNode?.removeChild(this.canvas)
      this.container.appendChild(this.canvas)
    }
  }

  setRenderInfo(width: number, height: number, layerPropss: LayerProps[]) {
    if (!this.canvas) {
      const canvas = (this.canvas = document.createElement('canvas'))
      canvas.width = width
      canvas.height = height

      const gl = (this.gl = canvas.getContext('webgl', {
        premultipliedAlpha: false, // 请求非预乘阿尔法通道
      }) as ThisWebGLContext)
      this.container?.appendChild(this.canvas)

      // 初始化webgl
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
          test: gl.getUniformLocation(program, 'u_test') as WebGLUniformLocation,
        }

        // 纹理位置
        const uTextureLocation = gl.getUniformLocation(program, 'u_texture')
        const uTexture1Location = gl.getUniformLocation(program, 'u_texture1')
        gl.uniform1i(uTextureLocation, 0)
        gl.uniform1i(uTexture1Location, 1)
      }
    }

    if (!this.gl) {
      throw `WebGLRender, getContext('webgl') is null`
    }

    resizeCanvasToDisplaySize(this.canvas)

    this.viewProjectionMatrix = m4.worldProjection(width, height)

    this.loadLayers(layerPropss)
  }

  render(frameInfo: FrameInfo) {
    const gl = this.gl
    if (!gl) return

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    this.layers?.forEach(layer => {
      layer.render(gl, this.viewProjectionMatrix, frameInfo)
    })
  }

  clear() {
    const {gl, canvas} = this

    this.layers?.forEach(layer => layer.destroy(gl))
    this.layers = undefined

    canvas?.parentNode && canvas.parentNode.removeChild(canvas)
    this.canvas = undefined
  }

  private loadLayers(layerPropss: LayerProps[]) {
    this.layers = []

    // 初始化layers
    for (let i = layerPropss.length - 1; i >= 0; i--) {
      const layer = newLayer(layerPropss[i])
      if (layer) {
        this.layers.push(layer)
      }
    }

    if (this.gl) {
      for (let i = 0; i < this.layers.length; i++) {
        this.layers[i].init(this.gl)
      }
    }
  }
}
