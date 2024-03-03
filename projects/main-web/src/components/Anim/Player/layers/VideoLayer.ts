import {FrameInfo, LayerProps} from '../types'
import {ThisWebGLContext, createTexture} from '../base/glapi'
import BaseLayer from './BaseLayer'
import * as m4 from '../base/m4'
import {drawTexRect} from '../base/primitives'

export default class VideoLayer extends BaseLayer {
  constructor(props: LayerProps) {
    super(props)

    this.load()
  }

  private video?: HTMLVideoElement
  private texture: WebGLTexture | null = null
  private texture0: WebGLTexture | null = null
  private currentTime = 0
  private played = false

  get url() {
    return this.props.content || ''
  }

  async init(gl: ThisWebGLContext) {
    this.texture = createTexture(gl)
  }

  render(gl: ThisWebGLContext, parentMatrix: m4.Mat4, frameInfo: FrameInfo) {
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
    if (frameInfo.isEnd) {
      this.stop()
    }

    const localMatrix = this.getLocalMatrix(frameInfo)
    if (!localMatrix) return

    const matrix = m4.multiply(parentMatrix, localMatrix)

    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    if (!noNeedTexImage) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.video)
    }

    const texWidth = this.video.videoWidth
    const texHeight = this.video.videoHeight
    drawTexRect(gl, texWidth, texHeight)
  }

  clear(gl?: WebGLRenderingContext) {
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
        console.error('catch error: ', this.url, error)
      })
    })
    this.played = true
  }

  private stop() {
    this.video?.pause()
    this.played = false
  }

  private onLoadedData = () => {
    console.log('[Video]: loadeddata', this.url)
  }

  private onTimeUpdate = () => {
    this.currentTime = this.video?.currentTime || 0
    // console.log('[Video]: timeupdate', this.currentTime, this.url)
  }

  private onPlaying = () => {
    console.log('[Video]: playing', this.url)
  }

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
