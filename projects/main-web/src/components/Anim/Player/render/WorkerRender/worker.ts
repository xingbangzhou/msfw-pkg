import {drawSimpleTexture, Framebuffer, m4} from '../../base'
import AttribBuffer from '../../base/webgl/AttribBuffer'
import {ThisWebGLContext} from '../../base/webgl/types'
import Layer, {createLayer} from '../../layers/Layer'
import {setSimpleProgram} from '../../layers/setPrograms'
import PlayStore from '../../PlayStore'
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
    this._playStore = new PlayStore()
  }

  readonly id: number
  private _canvas: OffscreenCanvas
  private _gl?: ThisWebGLContext

  private _playState = PlayState.None
  private _playStore: PlayStore
  private _frameAnimId: any

  private _camera = m4.identity()
  private _framebuffer?: Framebuffer
  private _attribBuffer?: AttribBuffer
  private _rootLayers?: Layer[]

  load(props: PlayProps) {
    const playStore = this._playStore
    playStore.setProps(props)

    const width = playStore.width
    const height = playStore.height

    this._camera = m4.perspectiveCamera(width, height)

    const layerPropsList = playStore.rootLayers
    this.resetLayers(this._gl as ThisWebGLContext, playStore, layerPropsList || [])
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
    clearInterval(this._frameAnimId)
    this._frameAnimId = undefined
    this._playState = PlayState.None
  }

  destroy() {
    this.stop()

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
    if (this._frameAnimId) {
      clearInterval(this._frameAnimId)
      this._frameAnimId = undefined
    }

    this._frameAnimId = setInterval(this.render0, this._playStore.frameTime)

    this.render0()
  }

  private render0 = () => {
    const {frames, width, height} = this._playStore
    let frameId = this._playStore.frameId

    frameId = frameId + 1
    if (frameId >= frames) {
      frameId = 0
    }
    this._playStore.frameId = frameId

    const gl = this._gl
    if (!gl) return

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

  private async resetLayers(gl: ThisWebGLContext, playStore: PlayStore, layerPropsList: LayerProps[]) {
    this.clearLayers()
    this._rootLayers = []

    for (let i = layerPropsList.length - 1; i >= 0; i--) {
      const props = layerPropsList[i]
      // 遮罩过滤
      if (props.isTrackMatte) continue
      // 创建图层
      const layer = createLayer(props, playStore)
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
