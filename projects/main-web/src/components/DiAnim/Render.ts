import {createProgram, createShader} from './glutils'
import ImageMold from './molds/ImageMold'
import VideoMold from './molds/VideoMold'
import {fragmenShaderCode, vertextShaderCode} from './shaders'
import {DiOptions} from './types'
import AvatarJPG from 'src/assets/img/avatar.jpg'

export default class DiRender {
  constructor(opts: DiOptions) {
    this.opts = opts
    this.container = opts.container
    this.fps = opts.fps || 30

    this.requestAnim = this.requestAnimFunc()

    this.videoMold = new VideoMold({url: opts.video, texIndex: 0})
    this.imageMold = new ImageMold({url: AvatarJPG, texIndex: 0})
    this.subVideoMold = new VideoMold({
      url: 'http://lxcode.bs2cdn.yy.com/22c4c9e0-6319-4fea-b8a7-9d64d04e7e96.mp4',
      texIndex: 0,
      positons: [-0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5],
    })

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

  private videoMold: VideoMold
  private imageMold: ImageMold
  private subVideoMold: VideoMold

  private _playing?: boolean

  private canvas!: HTMLCanvasElement
  private gl?: WebGLRenderingContext
  private program?: WebGLProgram

  clear() {
    this.cancelRequestAnimation()

    const {gl, canvas} = this

    if (gl) {
      this.videoMold.clear(gl)
    }

    canvas.parentNode && canvas.parentNode.removeChild(canvas)
  }

  play() {
    this.videoMold.play()
    this.subVideoMold.play()
  }

  protected render = (_?: unknown, info?: any) => {
    const {gl, program} = this
    if (!gl || !program) return

    gl.clear(gl.COLOR_BUFFER_BIT)

    this.videoMold.render(gl, program)
    this.imageMold.render(gl, program)
    this.subVideoMold.render(gl, program)

    if (this.useFrameCallback) {
      this.frameAnimId = this.video?.['requestVideoFrameCallback'](this.render)
    } else {
      this.frameAnimId = this.requestAnim(this.render)
    }
  }

  private init() {
    this.createCanvas()
    this.initWebGL()
    this.initMolds()

    // Video Event
    this.video?.addEventListener('loadeddata', () => {
      const {gl, canvas, video} = this
      if (!gl || !canvas || !video) return

      canvas.width = Math.floor(video.videoWidth * 0.5)
      canvas.height = video.videoHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    })
    this.video?.addEventListener('playing', () => {
      if (!this._playing) {
        this._playing = true

        if (!this.useFrameCallback) {
          this.render(null, null)
        }
      }
    })
  }

  private get video() {
    return this.videoMold?.video
  }

  private createCanvas() {
    const {video} = this
    this.canvas = document.createElement('canvas')
    this.canvas.width = video ? Math.floor(video.videoWidth * 0.5) : 9
    this.canvas.height = video?.videoHeight || 0
    this.container.appendChild(this.canvas)
  }

  private initWebGL() {
    const {canvas} = this
    const gl = (this.gl = canvas.getContext('webgl') || undefined)
    if (!gl) {
      console.error("[DiRender] getContext('webgl')", 'null')
      return
    }

    // 基本设置
    gl.enable(gl.BLEND)
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)

    this.createProgram()
  }

  private createProgram() {
    const {gl, canvas} = this
    if (!gl || !canvas) return

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertextShaderCode) as WebGLShader
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmenShaderCode) as WebGLShader
    this.program = createProgram(gl, vertexShader, fragmentShader)
  }

  private initMolds() {
    const {gl, program} = this
    if (!gl || !program) return

    this.videoMold.init(gl, program)
    this.imageMold.init(gl, program)
    this.subVideoMold.init(gl, program)
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
}
