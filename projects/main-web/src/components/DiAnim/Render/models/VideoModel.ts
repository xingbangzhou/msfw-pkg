import DiBaseMold from './DiModel'

interface VideoModelProps {
  url: string
  mute?: number
  loop?: boolean
  positons?: number[]
}

export default class VideoModel extends DiBaseMold {
  constructor(props: VideoModelProps) {
    super()

    this.props = props
    this.load()
  }

  private props: VideoModelProps

  video?: HTMLVideoElement

  private texture!: WebGLTexture

  async init(gl: WebGLRenderingContext, program: WebGLProgram) {
    const texture = (this.texture = gl.createTexture() as WebGLTexture)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    // 对纹理图像进行y轴反转，因为WebGL纹理坐标系统的t轴（分为t轴和s轴）的方向和图片的坐标系统Y轴方向相反。因此将Y轴进行反转。
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  }

  render(gl: WebGLRenderingContext, program: WebGLProgram) {
    // Position Vertex
    const positionVertice = new Float32Array(this.props.positons || [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0])
    const positionBuffer = gl.createBuffer()
    const aPositionLocation = gl.getAttribLocation(program, 'a_position')
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positionVertice, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aPositionLocation)
    gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0)

    // Texture Vertex
    const textureBuffer = gl.createBuffer()
    const textureVertice = new Float32Array([0.0, 1.0, 0.5, 1.0, 0.0, 0.0, 0.5, 0.0])
    const aTexcoordLocation = gl.getAttribLocation(program, 'a_texcoord')
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, textureVertice, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aTexcoordLocation)
    gl.vertexAttribPointer(aTexcoordLocation, 2, gl.FLOAT, false, 0, 0)

    const uTexmodeLocation = gl.getUniformLocation(program, 'u_moldType')
    gl.uniform1i(uTexmodeLocation, 0)

    // 绘制
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.video!)
    gl.generateMipmap(gl.TEXTURE_2D)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  clear(gl: WebGLRenderingContext) {
    gl.deleteTexture(this.texture)

    this.video?.parentNode && this.video.parentNode.removeChild(this.video)
    this.video = undefined
  }

  play() {
    const prom = this.video?.play()
    prom?.catch(() => {
      if (!this.video) return

      if (!this.props.mute) {
        this.video.muted = true
        this.video.volume = 0
      }

      this.video.play().catch(err => {
        console.error(err)
      })
    })
  }

  private load() {
    const video = (this.video = document.createElement('video'))
    video.crossOrigin = 'anonymous'
    video.autoplay = false
    video.preload = 'auto'
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    if (!this.props.mute) {
      this.video.muted = true
      this.video.volume = 0
    } else {
      this.video.muted = true
      this.video.volume = this.props.mute
    }

    video.style.display = 'none'
    video.loop = this.props.loop || false

    video.src = this.props.url
    document.body.appendChild(this.video)
    video.load()

    // 绑定事件
    video.addEventListener('playing', this.onPlaying)
    video.addEventListener('pause', this.onPause)
    video.addEventListener('ended', this.onEnded)
    video.addEventListener('canplay', this.onCanplay)
    video.addEventListener('error', this.onError)
    video.addEventListener('loadeddata', () => {
      console.log('[Video]: loadeddata', this.props.url, video.videoWidth, video.videoHeight)
    })
  }

  private onPlaying = () => {
    console.log('[Video]: playing')
  }

  private onPause = () => {
    console.log('[Video]: pause')
  }

  private onEnded = () => {
    console.log('[Video]: ended')
  }

  private onCanplay = () => {
    console.log('[Video]: canplay')
  }

  private onError = (err: unknown) => {
    console.error('[Video]: play error: ', err)
  }
}
