import MP4Box, {ISOFile, DataStream} from './mp4box.all'

export interface setStatusFn {
  (type: string, message: any): void
}

export interface onConfigFn {
  (config: {codec: string; codedWidth: number; codedHeight: number; description: any}): void
}

export interface onChunkFn {
  (chunk: EncodedVideoChunk): void
}

class MP4FileSink {
  constructor(file: ISOFile, setStatus: setStatusFn) {
    this.file = file
    this.setStatus = setStatus
  }

  private file: ISOFile
  private setStatus: setStatusFn
  private _offset = 0

  write(chunk: any) {
    const buffer = new ArrayBuffer(chunk.byteLength)
    new Uint8Array(buffer).set(chunk)
    ;(buffer as any).fileStart = this._offset
    this._offset += buffer.byteLength

    this.setStatus('fetch', (this._offset / 1024 ** 2).toFixed(1) + ' MiB')

    this.file.appendBuffer(buffer)
  }

  close() {
    this.setStatus('fetch', 'Done')
    this.file.flush()
  }
}

export default class MP4Demuxer {
  constructor(uri: string, handlers: {onConfig: onConfigFn; onChunk: onChunkFn; setStatus: setStatusFn}) {
    this.onConfig = handlers.onConfig
    this.onChunk = handlers.onChunk
    this.setStatus = handlers.setStatus

    this._file = MP4Box.createFile()
    this._file.onError = (error: unknown) => this.setStatus('demux', error)
    this._file.onReady = this.onReady
    this._file.onSamples = this.onSamples

    const fileSink = new MP4FileSink(this._file, this.setStatus)
    fetch(uri).then(response => {
      response.body?.pipeTo(new WritableStream(fileSink, {highWaterMark: 2}))
    })
  }

  private onConfig: onConfigFn
  private onChunk: onChunkFn
  private setStatus: setStatusFn
  private _file: ISOFile

  private description(track: any) {
    const trak = this._file.getTrackById(track.id)
    for (const entry of trak.mdia.minf.stbl.stsd.entries) {
      const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C
      if (box) {
        const stream = new (DataStream as any)(undefined, 0, DataStream.BIG_ENDIAN)
        box.write(stream)

        return new Uint8Array(stream.buffer, 8) // Remove the box header.
      }
    }
    this.setStatus('description', 'avcC, hvcC, vpcC, or av1C box not found')
    return undefined
  }

  private onReady = (info: any) => {
    this.setStatus('demux', 'Ready')
    const track = info.videoTracks[0]

    // Generate and emit an appropriate VideoDecoderConfig.
    this.onConfig({
      // Browser doesn't support parsing full vp8 codec (eg: `vp08.00.41.08`),
      // they only support `vp8`.
      codec: track.codec.startsWith('vp08') ? 'vp8' : track.codec,
      codedHeight: track.video.height,
      codedWidth: track.video.width,
      description: this.description(track),
    })

    // Start demuxing.
    this._file.setExtractionOptions(track.id)
    this._file.start()
  }

  private onSamples = (track_id: number, ref: any, samples: any[]) => {
    for (const sample of samples) {
      const chunk = new EncodedVideoChunk({
        type: sample.is_sync ? 'key' : 'delta',
        timestamp: (1e6 * sample.cts) / sample.timescale,
        duration: (1e6 * sample.duration) / sample.timescale,
        data: sample.data,
      })
      this.onChunk(chunk)
    }
  }
}
