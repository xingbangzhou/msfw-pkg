import BaseLayer, {FragmenShader, VertexShader} from '../layers/BaseLayer'
import {newLayer} from '../layers/factories'
import {FrameInfo, LayerProps} from '../types'
import {degToRad} from '../base'
import {ThisWebGLContext, createProgram, resizeCanvasToDisplaySize} from '../base/glapi'
import * as m4 from '../base/m4'

function makeWorldMatrix(width: number, height: number) {
  // 透视矩阵
  const fieldOfViewRadians = degToRad(45)
  const aspect = width / height
  const zNear = 1
  const zFar = 20000
  const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar)

  // 相机坐标矩阵
  const zFlat = (height / Math.tan(fieldOfViewRadians * 0.5)) * 0.5
  const cameraPosition: m4.Vec3 = [width * 0.5, -height * 0.5, zFlat]
  const target: m4.Vec3 = [width * 0.5, -height * 0.5, 0]
  const up: m4.Vec3 = [0, 1, 0]
  const cameraMatrix = m4.lookAt(cameraPosition, target, up)
  // 当前视图矩阵
  const viewMatrix = m4.inverse(cameraMatrix)
  const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)

  return viewProjectionMatrix
}

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

      this.gl = canvas.getContext('webgl', {
        premultipliedAlpha: true, // 请求非预乘阿尔法通道
      }) as ThisWebGLContext
      this.container?.appendChild(this.canvas)

      this.initGL()
    }

    if (!this.gl) {
      throw `WebGLRender, getContext('webgl') is null`
    }

    resizeCanvasToDisplaySize(this.canvas)

    this.viewProjectionMatrix = makeWorldMatrix(width, height)

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

    this.layers?.forEach(layer => layer.clear(gl))
    this.layers = undefined

    canvas?.parentNode && canvas.parentNode.removeChild(canvas)
    this.canvas = undefined
  }

  private initGL() {
    const {gl, canvas} = this
    if (!gl || !canvas) return

    gl.enable(gl.BLEND)
    // gl.enable(gl.DEPTH_TEST)
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    const program = (gl.program = createProgram(gl, VertexShader, FragmenShader))
    if (program) {
      // 设置参数
      gl.attribs = {
        position: gl.getAttribLocation(program, 'a_position'),
        texcoord: gl.getAttribLocation(program, 'a_texcoord'),
      }
      gl.uniforms = {
        matrix: gl.getUniformLocation(program, 'u_matrix') as WebGLUniformLocation,
        texMatrix: gl.getUniformLocation(program, 'u_texMatrix') as WebGLUniformLocation,
      }
    }
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
