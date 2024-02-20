import {fragmenShaderSrc, vertexShaderSrc} from './shaders'
import {createProgram, resizeCanvasToDisplaySize} from './utils/glutils'
import DiLayer from './layers/DiLayer'
import {DiRenderInfo, DiGLRenderingContext, DiPlayState} from './types'
import {createLayer} from './layers/createLayer'

export default class DiRender {
  constructor(container: HTMLElement, info: DiRenderInfo) {
    this.container = container
    info.frameRate = this.frameRate = info.frameRate || 30
    this.info = info
    this.frames = Math.ceil(info.duration / info.frameRate)

    this.requestAnim = this.requestAnimFunc()

    this.init()
  }

  protected container: HTMLElement
  protected frameRate: number
  protected frames: number
  protected info: DiRenderInfo

  protected frameAnimId: any
  protected requestAnim: (cb: () => void) => any
  private frameIndex = -1
  private playState = DiPlayState.None

  private canvas?: HTMLCanvasElement
  private gl?: DiGLRenderingContext

  protected layers: DiLayer[] = []

  play() {
    if (this.playState === DiPlayState.None) {
      this.render()
    }
  }

  clear() {
    this.cancelRequestAnimation()

    const {gl, canvas} = this

    this.layers.forEach(layer => layer.clear(gl))

    canvas?.parentNode && canvas.parentNode.removeChild(canvas)
    this.canvas = undefined

    this.playState = DiPlayState.None
  }

  protected render = (_?: unknown, info?: any) => {
    const {gl} = this
    if (!gl) return

    gl.clear(gl.COLOR_BUFFER_BIT)

    this.frameIndex++
    if (this.frameIndex === this.frames) {
      this.frameIndex = 0
    }

    const frameInfo = {frameId: this.frameIndex, width: this.info.width, height: this.info.height}
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i]
      layer.render(gl, frameInfo)
    }

    this.frameAnimId = this.requestAnim(this.render)
  }

  private init() {
    const canvas = (this.canvas = document.createElement('canvas'))
    canvas.width = this.info.width
    canvas.height = this.info.height
    this.container.appendChild(canvas)

    this.gl = canvas.getContext('webgl') as DiGLRenderingContext

    if (!this.gl) {
      console.error("[DiRender] getContext('webgl')", 'null')
      return
    }

    this.initWebGL()
    this.loadLayer()
  }

  private initWebGL() {
    const {gl, canvas} = this
    if (!gl || !canvas) return

    // 基本设置
    gl.enable(gl.BLEND)
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    resizeCanvasToDisplaySize(canvas)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const program = (gl.program = createProgram(gl, vertexShaderSrc, fragmenShaderSrc))
    if (program) {
      // 设置参数
      gl.aPositionLocation = gl.getAttribLocation(program, 'a_position')
      gl.aTexcoordLocation = gl.getAttribLocation(program, 'a_texcoord')
      gl.uMatrixLocation = gl.getUniformLocation(program, 'u_matrix') as WebGLUniformLocation
      gl.uTexMatrixLocation = gl.getUniformLocation(program, 'u_texMatrix') as WebGLUniformLocation
      gl.uLayerTypeLocation = gl.getUniformLocation(program, 'u_layerType') as WebGLUniformLocation
    }
  }

  private loadLayer() {
    this.layers = []

    // 初始化layers
    this.info.layers.forEach(el => {
      const layer = createLayer(el)
      if (layer) {
        this.layers.push(layer)
      }
    })

    if (this.gl) {
      for (let i = 0; i < this.layers.length; i++) {
        this.layers[i].init(this.gl)
      }
    }
  }

  private requestAnimFunc = () => {
    return (cb: () => void) => {
      return setTimeout(cb, 1000 / this.frameRate)
    }
  }

  private cancelRequestAnimation() {
    if (!this.frameAnimId) return
    clearTimeout(this.frameAnimId)
    this.frameAnimId = null
  }
}
