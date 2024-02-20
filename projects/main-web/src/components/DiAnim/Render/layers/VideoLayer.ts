import {DiFrameInfo, DiGLRenderingContext, DiLayerInfo} from '../types'
import {createTexture} from '../utils/glutils'
// import {ortho, scale, scaling, translate} from '../utils/m4'
import DiLayer from './DiLayer'

export default class VideoLayer extends DiLayer {
  constructor(info: DiLayerInfo) {
    super(info)

    this.load()
  }

  private video?: HTMLVideoElement
  private texture: WebGLTexture | null = null
  private texture0: WebGLTexture | null = null
  private currentTime = 0
  private played = false

  get url() {
    return this.info.content
  }

  async init(gl: DiGLRenderingContext) {
    this.texture = createTexture(gl)
  }

  render(gl: DiGLRenderingContext, frameInfo: DiFrameInfo) {
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

    // Vertex
    // setVertexBufferInfo(gl, {
    //   position: {
    //     data: [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0],
    //   },
    //   texcoord: {
    //     data: [0.0, 1.0, 0.5, 1.0, 0.0, 0.0, 0.5, 0.0],
    //   },
    // })

    // const drawInfo = {
    //   x: 0 * gl.canvas.width,
    //   y: 0 * gl.canvas.height,
    //   xScale: 1.0,
    //   yScale: 1.0,
    //   offX: 0,
    //   offY: 0,
    //   rotation: 0 * Math.PI,
    //   width: 1,
    //   height: 1,
    //   textureInfo: {
    //     width: this.video.videoWidth * 0.5,
    //     height: this.video.videoHeight,
    //   },
    // }

    // const dstX = drawInfo.x
    // const dstY = drawInfo.y
    // const dstWidth = drawInfo.textureInfo.width * drawInfo.xScale
    // const dstHeight = drawInfo.textureInfo.height * drawInfo.yScale

    // const srcX = drawInfo.textureInfo.width * drawInfo.offX
    // const srcY = drawInfo.textureInfo.height * drawInfo.offY
    // const srcWidth = drawInfo.textureInfo.width * drawInfo.width
    // const srcHeight = drawInfo.textureInfo.height * drawInfo.height
    // const texWidth = drawInfo.textureInfo.width
    // const texHeight = drawInfo.textureInfo.height
    // const rotation = drawInfo.rotation

    // gl.activeTexture(gl.TEXTURE0)
    // gl.bindTexture(gl.TEXTURE_2D, texture)

    // setVertexBufferInfo(gl, {
    //   position: {
    //     data: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1],
    //   },
    //   texcoord: {
    //     data: [0, 0, 0, 0.5, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0.5],
    //   },
    // })

    // if (!noNeedTexImage) {
    //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.video)
    // }

    // // gl.uLa && gl.uniform1i(gl.uFragTypeLocation, 0)

    // let matrix = ortho(0, gl.canvas.width, gl.canvas.height, 0)

    // // this matrix will translate our quad to dstX, dstY
    // // matrix = translate(matrix, dstX, dstY, 0)

    // // this matrix will scale our 1 unit quad
    // // from 1 unit to texWidth, texHeight units
    // matrix = scale(matrix, dstWidth, dstHeight, 1)

    // // Set the matrix.
    // gl.uMatrixLocation && gl.uniformMatrix4fv(gl.uMatrixLocation, false, matrix)

    // let texMatrix = scaling(1 / texWidth, 1 / texHeight, 1)

    // // We need to pick a place to rotate around
    // // We'll move to the middle, rotate, then move back
    // // texMatrix = translate(texMatrix, texWidth * 0.5, texHeight * 0.5, 0)
    // // texMatrix = zRotate(texMatrix, rotation)
    // texMatrix = translate(texMatrix, texWidth * -0.5, texHeight * -0.5, 0)

    // // // because were in pixel space
    // // // the scale and translation are now in pixels
    // // texMatrix = translate(texMatrix, srcX, srcY, 0)
    // texMatrix = scale(texMatrix, srcWidth, srcHeight, 1)

    // gl.uTexMatrixLocation && gl.uniformMatrix4fv(gl.uTexMatrixLocation, false, texMatrix)

    // gl.drawArrays(gl.TRIANGLES, 0, 6)
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
    console.log('[Video]: timeupdate', this.currentTime, this.url)
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
