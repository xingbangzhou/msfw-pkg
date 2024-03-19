import {ThisWebGLContext, createTexture, drawVideo, m4} from '../base'
import {FrameInfo, LayerVideoProps} from '../types'
import AbstractDrawer from './AbstractDrawer'

export default class VideoDrawer extends AbstractDrawer<LayerVideoProps> {
  private _video?: HTMLVideoElement
  private _texture: WebGLTexture | null = null
  private _currentTime = 0
  private _playing = false

  get url() {
    return this.props.content || ''
  }

  async init(gl: ThisWebGLContext) {
    this._texture = createTexture(gl)

    this.load()
  }

  async draw(gl: ThisWebGLContext, matrix: m4.Mat4, frameInfo: FrameInfo) {
    if (!this._video) return

    if (!this._playing) {
      this.restart()
    }

    const texture = this._texture
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._video)
    if (this.props.isAlpha) gl.uniform1i(gl.uniforms.maskMode, 3)
    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)

    const width = this.width
    const height = this.height
    drawVideo(gl, width, height, this.props.isAlpha)

    gl.uniform1i(gl.uniforms.maskMode, 0)
  }

  destroy(gl?: ThisWebGLContext | undefined) {
    gl?.deleteTexture(this._texture)
    this._texture = null

    this._video?.parentNode?.removeChild(this._video)
    this._video = undefined
  }

  private load() {
    const video = (this._video = document.createElement('video'))
    video.crossOrigin = 'anonymous'
    video.autoplay = false
    video.preload = 'auto'
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    video.muted = true
    video.volume = 0

    video.style.display = 'none'

    video.src = this.url
    document.body.appendChild(video)
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
    if (!this._video) return

    this._video.currentTime = 0
    const prom = this._video?.play()
    prom?.catch(() => {
      this._video?.play().catch(error => {
        console.error('play, error: ', error, this.url)
      })
    })
    this._playing = true
  }

  private onLoadedData = () => {}

  private onTimeUpdate = () => {
    this._currentTime = this._video?.currentTime || 0
  }

  private onPlaying = () => {}

  private onPause = () => {
    // console.log('[Video]: pause', this.url)
  }

  private onEnded = () => {
    // console.log('[Video]: ended', this.url)
    this._playing = false
  }

  private onCanplay = () => {
    // console.log('[Video]: canplay', this.url)
  }

  private onError = (err: unknown) => {
    // console.error('[Video]: play error: ', this.url, err)
  }
}
