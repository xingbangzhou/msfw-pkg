import DiEngine from './Engine'
import {createProgram, createShader, createTexture, loadImage} from './glFns'
import {fragmenShaderCode, vertextShaderCode} from './shaders'
import {DiOptions} from './types'
import AvatarJPG from 'src/assets/img/avatar.jpg'

export default class DiRender extends DiEngine {
  constructor(opts: DiOptions) {
    super(opts)

    if (this.useFrameCallback) {
      this.frameAnimId = this.video?.['requestVideoFrameCallback'](this.drawFrame.bind(this))
    }

    this.init()
  }

  private canvas!: HTMLCanvasElement
  private gl?: WebGLRenderingContext
  private program?: WebGLProgram
  private textures: WebGLTexture[] = []

  clear() {
    super.clear()

    const {gl, canvas} = this

    if (this.textures && this.textures.length) {
      for (let i = 0; i < this.textures.length; i++) {
        gl?.deleteTexture(this.textures[i])
      }
    }

    canvas.parentNode && canvas.parentNode.removeChild(canvas)
  }

  protected onLoaded() {
    super.onLoaded()

    const {gl, canvas, video} = this
    if (!gl || !canvas || !video) return

    canvas.width = Math.floor(video.videoWidth * 0.5)
    canvas.height = video.videoHeight
    gl.viewport(0, 0, canvas.width, canvas.height)
  }

  protected drawFrame(_?: unknown, info?: any) {
    const {gl, video} = this
    if (!gl || !video) {
      super.drawFrame(_, info)
      return
    }
    gl.clear(gl.COLOR_BUFFER_BIT)

    this.drawVideo()

    this.drawImage()

    // GPU开始绘制
    {
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    super.drawFrame(_, info)
  }

  private init() {
    this.createCanvas()
    this.initWebGL()
    this.play()
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
    gl.disable(gl.BLEND)
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)

    this.createProgram()

    this.createTexture()
  }

  private createVertexShader() {
    const {gl} = this
    if (!gl) return undefined

    return createShader(gl, gl.VERTEX_SHADER, vertextShaderCode)
  }

  private createFragmentShader() {
    const {gl} = this
    if (!gl) return undefined

    return createShader(gl, gl.FRAGMENT_SHADER, fragmenShaderCode)
  }

  private createProgram() {
    const {gl, canvas} = this
    if (!gl || !canvas) return

    const vertexShader = this.createVertexShader() as WebGLShader
    const fragmentShader = this.createFragmentShader() as WebGLShader
    this.program = createProgram(gl, vertexShader, fragmentShader)
  }

  private createTexture() {
    const {gl} = this
    if (!gl) return

    const texture = gl.createTexture() as WebGLTexture

    gl.bindTexture(gl.TEXTURE_2D, texture)
    // 对纹理图像进行y轴反转，因为WebGL纹理坐标系统的t轴（分为t轴和s轴）的方向和图片的坐标系统Y轴方向相反。因此将Y轴进行反转。
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    this.textures = [texture]

    gl.bindTexture(gl.TEXTURE_2D, texture)

    // Image Texture
    loadImage(AvatarJPG).then(image => {
      const imageTexture = createTexture(gl, 1, image)
      if (imageTexture) {
        this.textures?.push(imageTexture)
      }
    })
  }

  // 绘制视频
  private drawVideo() {
    const {gl, program} = this
    if (!gl || !program) return

    // Position Buffer
    const positionVertice = new Float32Array([-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0])
    const positionBuffer = gl.createBuffer()
    const aPosition = gl.getAttribLocation(program, 'a_position')
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positionVertice, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    // Texture Buffer
    const textureBuffer = gl.createBuffer()
    const textureVertice = new Float32Array([0.0, 1.0, 0.5, 1.0, 0.0, 0.0, 0.5, 0.0])
    const aTexCoord = gl.getAttribLocation(program, 'a_texCoord')
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, textureVertice, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aTexCoord)
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0)

    // 绘制纹理
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.textures[0])
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.video!)
  }

  // 绘制图片
  private drawImage() {}
}
