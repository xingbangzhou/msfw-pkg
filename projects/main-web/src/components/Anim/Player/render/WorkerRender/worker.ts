import {drawSimpleTexture, Framebuffer, m4} from '../../base'
import AttribBuffer from '../../base/webgl/AttribBuffer'
import {ThisWebGLContext} from '../../base/webgl/types'
import Layer, {createLayer} from '../../layers/Layer'
import {setSimpleProgram} from '../../layers/setPrograms'
import PlayData from '../../PlayData'
import {LayerProps, PlayProps, PlayState} from '../../types'
import {WorkerFunctionMap} from './types'

class WorkerRenderProxy {
  constructor(id: number, canvas: OffscreenCanvas) {
    this.id = id
    this._canvas = canvas
    this._gl = canvas.getContext('webgl2') as ThisWebGLContext
    if (!this._gl) {
      console.error(`WebGLRender, getContext('webgl') is null`)
    }
    this._playData = new PlayData()
  }

  readonly id: number
  private _canvas: OffscreenCanvas
  private _gl?: ThisWebGLContext

  private _playState = PlayState.None
  private _playData: PlayData
  protected frameAnimId: any
  protected requestAnim?: (cb: () => void) => any

  private _camera = m4.identity()
  private _framebuffer?: Framebuffer
  private _attribBuffer?: AttribBuffer
  private _rootLayers?: Layer[]

  load(props: PlayProps) {
    const playData = this._playData
    playData.setProps(props)

    const width = playData.width
    const height = playData.height

    this._camera = m4.perspectiveCamera(width, height)

    const layerPropsList = playData.rootLayers
    this.resetLayers(this._gl as ThisWebGLContext, playData, layerPropsList || [])

    this.requestAnim = this.requestAnimFunc()
  }

  play() {
    if (this._playState === PlayState.None) {
      this._playState = PlayState.Play
      this.render()
    }
  }

  replay() {
    this.stop()
    this.play()
  }

  stop() {
    this.cancelRequestAnimation()
    this._playState = PlayState.None
  }

  destroy() {
    this.cancelRequestAnimation()
    this._playState = PlayState.None

    this.clearLayers()
    this._framebuffer?.destory()
    this._framebuffer = undefined
    this._attribBuffer?.destroy()
    this._attribBuffer = undefined
  }

  resizeCanvasToDisplaySize(width: number, height: number, multiplier?: number) {
    this._canvas.width = width
    this._canvas.height = height
  }

  protected render = () => {
    if (this._playData.frameId === -1) {
      this._playData.frameId = 0
    } else {
      this._playData.frameId = this._playData.frameId + 1
      if (this._playData.frameId >= this._playData.frames) {
        this._playData.frameId = 0
      }
    }

    this.render0()

    this.frameAnimId = this.requestAnim?.(this.render)
  }

  private render0() {
    const gl = this._gl
    if (!gl) return

    const {frames, frameId, width, height} = this._playData

    const framebuffer = this._framebuffer || new Framebuffer(gl)
    this._framebuffer = framebuffer

    const frameInfo = {
      frames,
      frameId,
      width,
      height,
      opacity: 1.0,
      framebuffer: framebuffer,
    }

    gl.enable(gl.BLEND)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    framebuffer.bind()
    framebuffer.viewport(width, height)

    const rootLayers = this._rootLayers
    if (rootLayers) {
      for (let i = 0, l = rootLayers?.length || 0; i < l; i++) {
        const layer = rootLayers?.[i]
        if (!layer.verifyTime(frameInfo.frameId)) continue
        layer.render(gl, this._camera, frameInfo)
      }
    }

    // 绘制到canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.disable(gl.BLEND)

    setSimpleProgram(gl)

    gl.activeTexture(gl.TEXTURE0)
    framebuffer.texture?.bind()

    const attribBuffer = this._attribBuffer || new AttribBuffer(gl)
    this._attribBuffer = attribBuffer

    drawSimpleTexture(attribBuffer)

    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  private async resetLayers(gl: ThisWebGLContext, playData: PlayData, layerPropsList: LayerProps[]) {
    this.clearLayers()
    this._rootLayers = []

    for (let i = layerPropsList.length - 1; i >= 0; i--) {
      const props = layerPropsList[i]
      // 遮罩过滤
      if (props.isTrackMatte) continue
      // 创建图层
      const layer = createLayer(props, playData)
      if (!layer) continue
      this._rootLayers.push(layer)
      await layer.init(gl, layerPropsList)
    }
  }

  private clearLayers() {
    const {_gl} = this

    this._rootLayers?.forEach(layer => layer.destroy(_gl))
    this._rootLayers = undefined
  }

  private requestAnimFunc = () => {
    return (cb: () => void) => {
      return setTimeout(cb, this._playData.frameTime)
    }
  }

  private cancelRequestAnimation() {
    if (!this.frameAnimId) return
    clearTimeout(this.frameAnimId)
    this.frameAnimId = null
  }
}

// 全局对象管理
const mapRenderProxys: Record<number, WorkerRenderProxy> = {}

const workerFnHandlers: Record<keyof WorkerFunctionMap, (params: any) => void> = {
  instance: ({id, canvas}: {id: number; canvas: OffscreenCanvas}) => {
    mapRenderProxys[id] = new WorkerRenderProxy(id, canvas)
  },

  load: ({id, props}: {id: number; props: PlayProps}) => {
    const renderProxy = mapRenderProxys[id]
    renderProxy?.load(props)
  },

  resizeCanvasToDisplaySize: ({
    id,
    width,
    height,
    multiplier,
  }: {
    id: number
    width: number
    height: number
    multiplier?: number
  }) => {
    const renderProxy = mapRenderProxys[id]
    renderProxy?.resizeCanvasToDisplaySize(width, height, multiplier)
  },

  play: ({id}: {id: number}) => {
    const renderProxy = mapRenderProxys[id]
    renderProxy?.play()
  },

  replay: ({id}: {id: number}) => {
    const renderProxy = mapRenderProxys[id]
    renderProxy?.replay()
  },

  stop: ({id}: {id: number}) => {
    const renderProxy = mapRenderProxys[id]
    renderProxy?.stop()
  },

  destroy: ({id}: {id: number}) => {
    const renderProxy = mapRenderProxys[id]
    renderProxy?.destroy()
    delete mapRenderProxys[id]
  },
}

function onFunctionMessage<F extends keyof WorkerFunctionMap>(
  event: MessageEvent<{fn: F; params: WorkerFunctionMap[F]}>,
) {
  console.log('[Worker]onFunctionMessage', event)

  workerFnHandlers[event.data.fn]?.(event.data.params)
}

self.onmessage = onFunctionMessage
