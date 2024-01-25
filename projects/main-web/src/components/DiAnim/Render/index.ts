import ImageModel from './models/ImageModel'
import VideoModel from './models/VideoModel'
import {fragmenShaderSrc, vertexShaderSrc} from './shaders'
import AvatarJPG from 'src/assets/img/avatar.jpg'
import {ShaderType, createProgram} from './utils/programs'
import DiModel from './models/DiModel'
import {DiRenderOptions, DiModelType, DiGLRenderingContext, DiFrameInfo, DiPlayState} from './types'

export default class DiRender {
  constructor(container: HTMLElement, opts: DiRenderOptions) {
    this.container = container
    opts.fps = this.fps = opts.fps || 30
    this.opts = opts

    this.requestAnim = this.requestAnimFunc()

    this.init()
  }

  protected container: HTMLElement
  protected fps: number
  protected opts: DiRenderOptions

  protected frameAnimId: any
  protected requestAnim: (cb: () => void) => any
  private frameIndex = -1
  private playState = DiPlayState.None

  private canvas?: HTMLCanvasElement
  private gl?: DiGLRenderingContext

  protected models: DiModel[] = []

  play() {
    if (this.playState === DiPlayState.None) {
      this.render()
    }
  }

  clear() {
    this.cancelRequestAnimation()

    const {gl, canvas} = this

    this.models.forEach(model => model.clear(gl))

    canvas?.parentNode && canvas.parentNode.removeChild(canvas)
    this.canvas = undefined

    this.playState = DiPlayState.None
  }

  protected render = (_?: unknown, info?: any) => {
    const {gl} = this
    if (!gl) return

    gl.clear(gl.COLOR_BUFFER_BIT)

    this.frameIndex++
    if (this.frameIndex === this.opts.frames) {
      this.frameIndex = 0
    }

    const frameInfo = {frame: this.frameIndex, width: this.opts.width, height: this.opts.height}
    for (let i = 0; i < this.models.length; i++) {
      const model = this.models[i]
      if (this.frameIndex >= model.layerInfo.startFrame && this.frameIndex <= model.layerInfo.endFrame) {
        model.render(gl, frameInfo)
      }
    }

    this.frameAnimId = this.requestAnim(this.render)
  }

  private init() {
    const canvas = (this.canvas = document.createElement('canvas'))
    canvas.width = this.opts.width
    canvas.height = this.opts.height
    this.container.appendChild(canvas)

    this.gl = canvas.getContext('webgl') as DiGLRenderingContext

    if (!this.gl) {
      console.error("[DiRender] getContext('webgl')", 'null')
      return
    }

    this.initWebGL()
    this.loadModel()
  }

  private initWebGL() {
    const {gl, canvas} = this
    if (!gl || !canvas) return

    // 基本设置
    gl.enable(gl.BLEND)
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const program = (gl.program = createProgram(gl, {
      [ShaderType.Vertex]: vertexShaderSrc,
      [ShaderType.Fragment]: fragmenShaderSrc,
    }))
    if (program) {
      // 设置参数
      gl.aPositionLocation = gl.getAttribLocation(program, 'a_position')
      gl.aTexcoordLocation = gl.getAttribLocation(program, 'a_texcoord')
      gl.uFragTypeLocation = gl.getUniformLocation(program, 'u_fragType') || undefined
    }
  }

  private loadModel() {
    this.models = []

    // 初始化layers
    this.opts.layers.forEach(layer => {
      if (layer.type === DiModelType.MP4) {
        this.models.push(new VideoModel(layer))
      } else if (layer.type === DiModelType.IMAGE) {
        this.models.push(new ImageModel(layer))
      }
    })

    if (this.gl) {
      for (let i = 0; i < this.models.length; i++) {
        this.models[i].init(this.gl)
      }
    }
  }

  private requestAnimFunc = () => {
    return (cb: () => void) => {
      return setTimeout(cb, 1000 / this.fps)
    }
  }

  private cancelRequestAnimation() {
    if (!this.frameAnimId) return
    clearTimeout(this.frameAnimId)
    this.frameAnimId = null
  }
}
