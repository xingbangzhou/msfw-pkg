import MP4Demuxer from '../demuxer/MP4Demuxer'
import {ThisWebGLContext} from '../glapi'

export default class MP4Decoder {
  constructor(uri: string) {
    this.decoder = new VideoDecoder({
      output: videoFrame => {
        if (videoFrame.timestamp - this.currentTime >= 0) {
          this.videoFrames.push(videoFrame)
        } else {
          videoFrame.close()
        }
      },
      error: error => {
        this.setStatus('decode', error)
      },
    })

    this.demuxer = new MP4Demuxer(uri, {
      onConfig: this.onConfig,
      onChunk: this.onChunk,
      setStatus: this.setStatus,
    })
  }

  private decoder: VideoDecoder
  private demuxer: MP4Demuxer
  private chunksList: EncodedVideoChunk[][] = []
  private currentTime = 0
  private videoFrames: VideoFrame[] = []

  rendVideoFrame(gl: ThisWebGLContext, texture: WebGLTexture) {
    const videoFrame = this.videoFrames[0]
    if (!videoFrame) return false

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoFrame)
    videoFrame.close()
    this.videoFrames = this.videoFrames.slice(1)

    return true
  }

  // time: ms
  seek(time: number) {
    this.currentTime = time * 1000
    this.videoFrames = this.videoFrames.filter(el => {
      if (el.timestamp - this.currentTime >= 0) return true
      el.close()
    })
  }

  private onConfig = (config: any) => {
    this.decoder.configure(config)
  }

  private onChunk = (chunk: EncodedVideoChunk) => {
    if (chunk.type === 'key') {
      this.chunksList.push([chunk])
    } else {
      const kl = this.chunksList.length
      const chunks = this.chunksList[kl - 1]
      if (chunks) {
        chunks.push(chunk)
      }
    }
    this.decoder.decode(chunk)
  }

  private setStatus = (type: string, message: any) => {
    console.log('MP4Decoder', 'setStatus', type, message)
  }
}
