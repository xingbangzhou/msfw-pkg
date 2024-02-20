export type DiGLRenderingContext = WebGLRenderingContext & {
  program?: WebGLProgram
  aPositionLocation: number
  aTexcoordLocation: number
  uMatrixLocation: WebGLUniformLocation
  uTexMatrixLocation: WebGLUniformLocation
  uLayerTypeLocation: WebGLUniformLocation
}

export interface DiLayerTransform {
  anchorPoint: {
    inFrame: number
    value: number[]
  }[]

  position: {
    inFrame: number
    value: number[]
  }[]

  scale: {
    inFrame: number
    value: number[]
  }[]

  opacity: {
    inFrame: number
    value: number
  }[]

  rotation?: {
    inFrame: number
    value: number
  }[]
}

export enum DiLayerType {
  Image = 'image',
  MP4x = 'mp4x', // 透明mp4
}

export interface DiLayerInfo {
  type: string
  name: string
  content: string
  transform: DiLayerTransform
}

export interface DiRenderInfo {
  width: number
  height: number
  frameRate: number
  duration: number
  layers: DiLayerInfo[]
}

export enum DiPlayState {
  None = 0,
  Play,
}

export interface DiFrameInfo {
  frameId: number
  width: number
  height: number
  isEnd?: boolean
}
