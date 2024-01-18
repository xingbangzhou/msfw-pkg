import {DiOptions} from './types'

export default class DiEngine {
  constructor(opts: DiOptions) {
    this.opts = opts
    this.container = opts.container
    this.fps = opts.fps || 30
    this.requestAnim = this.requestAnimFunc()

    this.load()
  }

  opts: DiOptions
  fps: number
  container: HTMLElement
  video?: HTMLVideoElement

  requestAnim: (cb: () => void) => number
  frameAnimId?: any
  useFrameCallback?: boolean

  play() {
    const prom = this.video?.play()
    prom?.catch(() => {
      if (!this.video) return

      this.video.muted = true
      this.video.volume = 0
      this.video.play().catch(err => {
        console.error(err)
      })
    })
  }

  clear() {
    this.cancelRequestAnimation()
    this.video?.parentNode && this.video.parentNode.removeChild(this.video)
    this.video = undefined
  }

  protected onLoaded() {
    console.log('[Video]: loaded', this.video?.width, this.video?.height)
  }

  private _drawFrame?: DiEngine['drawFrame']
  protected drawFrame(_?: unknown, info?: any) {
    this._drawFrame = this._drawFrame || this.drawFrame.bind(this, _, info)
    if (this.useFrameCallback) {
      this.frameAnimId = this.video?.['requestVideoFrameCallback'](this.drawFrame.bind(this))
    } else {
      this.frameAnimId = this.requestAnim(this._drawFrame)
    }
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

  private load() {
    const video = (this.video = document.createElement('video'))
    video.crossOrigin = 'anonymous'
    video.autoplay = false
    video.preload = 'auto'
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    if (this.opts.mute) {
      video.muted = true
      video.volume = 0
    }
    video.style.display = 'none'
    video.loop = !!this.opts.loop

    video.src = this.opts.video
    document.body.appendChild(this.video)
    video.load()

    this.useFrameCallback = 'requestVideoFrameCallback' in video ? true : false

    // 绑定事件
    video.addEventListener('playing', this.onPlaying)
    video.addEventListener('pause', this.onPause)
    video.addEventListener('ended', this.onEnded)
    video.addEventListener('canplay', this.onCanplay)
    video.addEventListener('error', this.onError)
    video.addEventListener('loadeddata', () => {
      console.log('[Video]: loadeddata', video.videoWidth, video.videoHeight)
      this.onLoaded()
    })
  }

  private _playing?: boolean
  private onPlaying = () => {
    console.log('[Video]: playing')

    if (!this._playing) {
      this._playing = true

      if (!this.useFrameCallback) {
        this.drawFrame(null, null)
      }
    }
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
