import ImageModel from './models/ImageModel'
import VideoModel from './models/VideoModel'
import {fragmenShaderSrc, vertexShaderSrc} from './shaders'
import {DiOptions} from '../types'
import AvatarJPG from 'src/assets/img/avatar.jpg'
import {ShaderType, createProgram} from '../utils/programs'
import DiModel from './models/DiModel'

export default class DiRender {
  constructor(opts: DiOptions) {
    this.opts = opts
    this.container = opts.container
    this.fps = opts.fps || 30

    this.requestAnim = this.requestAnimFunc()

    this._vmodel = new VideoModel({url: opts.video, mute: opts.mute, loop: opts.loop})

    if (this.useFrameCallback) {
      this.frameAnimId = this.video?.['requestVideoFrameCallback'](this.render)
    }

    this.init()
  }

  opts: DiOptions
  fps: number
  container: HTMLElement

  requestAnim: (cb: () => void) => number
  frameAnimId?: any
  useFrameCallback?: boolean

  private _vmodel: VideoModel // 根部视频模块
  private _models: DiModel[] = []

  private canvas: HTMLCanvasElement | null = null
  private gl: WebGLRenderingContext | null = null
  private program: WebGLProgram | null = null

  clear() {
    this.cancelRequestAnimation()

    const {gl, canvas} = this

    if (gl) {
      this._vmodel.clear(gl)
      this._models.forEach(model => model.clear(gl))
    }

    canvas?.parentNode && canvas.parentNode.removeChild(canvas)
    this.canvas = null

    this._playing = false
  }

  play() {
    this._vmodel.play()
  }

  protected get video() {
    return this._vmodel?.video
  }

  protected render = (_?: unknown, info?: any) => {
    const {gl, program} = this
    if (!gl || !program) return

    gl.clear(gl.COLOR_BUFFER_BIT)

    this._vmodel.render(gl, program)
    this._models.forEach(model => model.render(gl, program))

    if (this.useFrameCallback) {
      this.frameAnimId = this.video?.['requestVideoFrameCallback'](this.render)
    } else {
      this.frameAnimId = this.requestAnim(this.render)
    }
  }

  private init() {
    // 创建Canvas
    const {video} = this
    const canvas = (this.canvas = document.createElement('canvas'))
    canvas.width = video ? Math.floor(video.videoWidth * 0.5) : 9
    canvas.height = video?.videoHeight || 0
    this.container.appendChild(canvas)

    this.gl = canvas.getContext('webgl')
    if (!this.gl) {
      console.error("[DiRender] getContext('webgl')", 'null')
      return
    }

    this.initWebGL()

    this.initModels()
  }

  private initWebGL() {
    const {gl, canvas} = this
    if (!gl || !canvas) return

    // 基本设置
    gl.enable(gl.BLEND)
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 创建GLSL Program
    this.program = createProgram(gl, {[ShaderType.Vertex]: vertexShaderSrc, [ShaderType.Fragment]: fragmenShaderSrc})
  }

  private initModels() {
    // 测试
    this._models = [new ImageModel({url: AvatarJPG, texIndex: 0})]
    // 模型加载初始化
    const {gl, program} = this
    if (!gl || !program) return

    // Init Video Model
    this._vmodel.init(gl, program)
    // Video Model Events
    this.video?.addEventListener('loadeddata', this.onLoadedData)
    this.video?.addEventListener('playing', this.onPlaying)

    // Init Other Models
    this._models.forEach(model => {
      model.init(gl, program)
    })
  }

  private requestAnimFunc() {
    const self = this
    return function (cb: () => void) {
      return setTimeout(cb, 1000 / self.fps)
    }
  }

  private cancelRequestAnimation() {
    if (!this.frameAnimId) return
    if (this.useFrameCallback) {
      try {
        this.video?.['cancelVideoFrameCallback'](this.frameAnimId)
      } catch (e) {}
    } else {
      clearTimeout(this.frameAnimId)
    }
  }

  private onLoadedData = () => {
    const {gl, canvas, video} = this
    if (!gl || !canvas || !video) return

    canvas.width = Math.floor(video.videoWidth * 0.5)
    canvas.height = video.videoHeight
    gl.viewport(0, 0, canvas.width, canvas.height)
  }

  private _playing = false
  private onPlaying = () => {
    if (!this._playing) {
      this._playing = true

      if (!this.useFrameCallback) {
        this.render(null, null)
      }
    }
  }
}
