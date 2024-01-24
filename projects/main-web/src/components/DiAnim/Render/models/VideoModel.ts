import {activeTexImage2D, createTexture, setVertexBufferInfo} from '../../utils/textures'
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

  video?: HTMLVideoElement

  private props: VideoModelProps

  private _texture: WebGLTexture | null = null

  async init(gl: WebGLRenderingContext, program: WebGLProgram) {
    this._texture = createTexture(gl)
  }

  render(gl: WebGLRenderingContext, program: WebGLProgram) {
    if (!this.video) return

    activeTexImage2D(gl, this._texture, this.video)

    setVertexBufferInfo(gl, program, {
      position: {
        data: this.props.positons || [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0],
      },
      texcoord: {
        data: [0.0, 1.0, 0.5, 1.0, 0.0, 0.0, 0.5, 0.0],
      },
      fragType: 0,
    })

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  clear(gl: WebGLRenderingContext) {
    gl.deleteTexture(this._texture)
    this._texture = null

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
        console.error('VideoModel, error: ', err)
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
