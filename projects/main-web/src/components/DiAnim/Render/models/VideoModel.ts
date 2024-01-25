import {DiFrameInfo, DiGLRenderingContext, DiLayerInfo} from '../types'
import {createTexture, setVertexBufferInfo} from '../utils/textures'
import DiBaseMold from './DiModel'

export default class VideoModel extends DiBaseMold {
  constructor(layerInfo: DiLayerInfo) {
    super(layerInfo)

    this.load()
  }

  private video?: HTMLVideoElement
  private texture: WebGLTexture | null = null
  private duration = 0
  private currentTime = 0

  async init(gl: DiGLRenderingContext) {
    this.texture = createTexture(gl)
  }

  render(gl: DiGLRenderingContext, frameInfo: DiFrameInfo) {
    if (!this.video || !gl.program) return

    if (frameInfo.frame === this.layerInfo.startFrame) {
      this.restart()
      if (this.currentTime) return
    }

    this.render0(gl, frameInfo)
  }

  clear(gl?: WebGLRenderingContext) {
    gl?.deleteTexture(this.texture)
    this.texture = null

    this.video?.parentNode && this.video.parentNode.removeChild(this.video)
    this.video = undefined
  }

  private render0(gl: DiGLRenderingContext, frameInfo: DiFrameInfo) {
    if (!this.video) return

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.video)

    setVertexBufferInfo(gl, {
      position: {
        data: [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0],
      },
      texcoord: {
        data: [0.0, 1.0, 0.5, 1.0, 0.0, 0.0, 0.5, 0.0],
      },
      fragType: 0,
    })

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  private load() {
    const video = (this.video = document.createElement('video'))
    video.crossOrigin = 'anonymous'
    video.autoplay = false
    video.preload = 'auto'
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    if (!this.layerInfo.mute) {
      this.video.muted = true
      this.video.volume = 0
    } else {
      this.video.muted = false
      this.video.volume = this.layerInfo.mute
    }

    video.style.display = 'none'

    video.src = this.layerInfo.value
    document.body.appendChild(this.video)
    video.load()

    // 绑定事件
    video.addEventListener('playing', this.onPlaying)
    video.addEventListener('pause', this.onPause)
    video.addEventListener('ended', this.onEnded)
    video.addEventListener('canplay', this.onCanplay)
    video.addEventListener('error', this.onError)
    video.addEventListener('loadeddata', this.onLoadedData)
    video.addEventListener('timeupdate', this.onTimeUpdate)
  }

  private restart() {
    if (!this.video) return

    this.video.currentTime = this.duration
    const prom = this.video?.play()
    prom?.catch(() => {
      this.video?.play().catch(error => {
        console.error('VideoModel, error: ', this.layerInfo.id, error)
      })
    })
  }

  private onLoadedData = () => {
    console.log('[Video]: loadeddata', this.layerInfo.id)
    this.duration = this.video?.duration || 0
  }

  private onTimeUpdate = () => {
    this.currentTime = this.video?.currentTime || 0
    console.log('[Video]: loadeddata', this.layerInfo.id, this.currentTime)
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
