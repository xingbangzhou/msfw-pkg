import {ThisWebGLContext, createTexture, drawTexRectangle, m4} from '../base'
import {FrameInfo} from '../types'
import AbstractDrawer from './AbstractDrawer'
import Layer from './Layer'

export default class VideoDrawer extends AbstractDrawer {
  constructor(layerRef: Layer) {
    super(layerRef)
  }

  private video?: HTMLVideoElement
  private texture: WebGLTexture | null = null
  private texture0: WebGLTexture | null = null
  private currentTime = 0
  private played = false

  get url() {
    return this.layerRef.props.content || ''
  }

  async init(gl: ThisWebGLContext) {
    this.texture = createTexture(gl)

    this.load()
  }

  async draw(gl: ThisWebGLContext, matrix: m4.Mat4, frameInfo: FrameInfo) {
    if (!this.video) return

    let texture = this.texture
    let noNeedTexImage = false

    if (!this.played) {
      this.restart()
      if (!this.texture0) {
        this.texture0 = gl.createTexture()
      } else {
        noNeedTexImage = true
      }
      texture = this.texture0
    }
    if (frameInfo.frames === frameInfo.frameId + 1) {
      this.stop()
    }

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    if (!noNeedTexImage) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.video)
    }

    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)

    const width = this.layerRef.width || this.video.videoWidth
    const height = this.layerRef.height || this.video.videoHeight
    drawTexRectangle(gl, width, height)
  }

  destroy(gl?: ThisWebGLContext | undefined) {
    gl?.deleteTexture(this.texture)
    gl?.deleteTexture(this.texture0)
    this.texture = null
    this.texture0 = null

    this.video?.parentNode && this.video.parentNode.removeChild(this.video)
    this.video = undefined
  }

  private load() {
    const video = (this.video = document.createElement('video'))
    video.crossOrigin = 'anonymous'
    video.autoplay = false
    video.preload = 'auto'
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    this.video.muted = true
    this.video.volume = 0

    video.style.display = 'none'

    video.src = this.url
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

    this.video.currentTime = 0
    const prom = this.video?.play()
    prom?.catch(() => {
      this.video?.play().catch(error => {
        console.error('play, error: ', error, this.url)
      })
    })
    this.played = true
  }

  private stop() {
    this.video?.pause()
    this.played = false
  }

  private onLoadedData = () => {}

  private onTimeUpdate = () => {
    this.currentTime = this.video?.currentTime || 0
  }

  private onPlaying = () => {}

  private onPause = () => {
    console.log('[Video]: pause', this.url)
  }

  private onEnded = () => {
    console.log('[Video]: ended', this.url)
  }

  private onCanplay = () => {
    console.log('[Video]: canplay', this.url)
  }

  private onError = (err: unknown) => {
    console.error('[Video]: play error: ', this.url, err)
  }
}
