import {ThisWebGLContext, createTexture, drawVideo, m4} from '../base'
import {FrameInfo, LayerVideoProps} from '../types'
import AbstractDrawer from './AbstractDrawer'

export default class VideoDrawer extends AbstractDrawer<LayerVideoProps> {
  private _video?: HTMLVideoElement
  private _currentTime = 0
  private _playing = false
  private syncAnimId: any

  private gl?: ThisWebGLContext
  private _texture: WebGLTexture | null = null

  get url() {
    return this.props.content || ''
  }

  async init(gl: ThisWebGLContext) {
    this.gl = gl
    this._texture = createTexture(gl)
    this.load()
  }

  async draw(gl: ThisWebGLContext, matrix: m4.Mat4, frameInfo: FrameInfo) {
    if (!this._video) return

    if (!this._playing) {
      this.restart()
    }

    this.bindTexture(gl, this._video, frameInfo)
    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)
    if (this.props.isAlpha) gl.uniform1i(gl.uniforms.maskMode, 3)

    const width = this.width
    const height = this.height
    drawVideo(gl, width, height, this.props.isAlpha)

    gl.uniform1i(gl.uniforms.maskMode, 0)
  }

  destroy(gl?: ThisWebGLContext | undefined) {
    gl?.deleteTexture(this._texture)
    this._texture = null
    this.gl = undefined

    this._video?.parentNode?.removeChild(this._video)
    this._video = undefined

    clearTimeout(this.syncAnimId)
    this.syncAnimId = undefined
  }

  private bindTexture(gl: ThisWebGLContext, video: HTMLVideoElement, frameInfo: FrameInfo) {
    const texture = this._texture

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
  }

  private load() {
    const video = (this._video = document.createElement('video'))
    video.style.display = 'none'
    video.muted = true
    video.playsInline = true

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

    if (!this.syncAnimId) {
      const fn = (timeStamp?: number) => {
        timeStamp = timeStamp || performance.now()
        const frameId = this.playContext.frameId
        const frameStamp = this.playContext.frameStamp
        const frameInterval = this.playContext.frameInterval
        const durId = frameId - this.props.inFrame
        const currentTime = (durId * frameInterval + (timeStamp - frameStamp)) * 0.001
        if (this._video) this._video.currentTime = currentTime
        this.syncAnimId = setTimeout(fn, 100)
      }
      this.syncAnimId = setTimeout(fn, 100)
    }
  }

  private onLoadedData = () => {
    console.log('[Video]: loadeddata', this.url)
  }

  private onTimeUpdate = () => {
    if (!this.gl || !this._video) return

    this._currentTime = this._video.currentTime || 0
    if (this.url.includes('ship_bmp.mp4')) console.log('video, onTimeUpdate', 'currentTime: ', this._currentTime)
  }

  private onPlaying = () => {
    console.log('[Video]: playing', this.url)
  }

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
