export enum DiModelType {
  MP4 = 'mp4',
  IMAGE = 'image',
}

export interface DiLayerInfo {
  id: string
  type: DiModelType
  value: string // MP4: url; IMAGE: url
  width: number
  height: number
  position: number[] // [x, y]
  startFrame: number
  endFrame: number
  // MP4
  mute?: number
}

export interface DiRenderOptions {
  width: number
  height: number
  fps?: number
  frames: number
  layers: DiLayerInfo[]
}

export type DiGLRenderingContext = WebGLRenderingContext & {
  program?: WebGLProgram
  aPositionLocation: number
  aTexcoordLocation: number
  uMatrixLocation: WebGLUniformLocation | null
  uTexMatrixLocation: WebGLUniformLocation | null
  uFragTypeLocation: WebGLUniformLocation | null
}

export enum DiPlayState {
  None = 0,
  Play,
}

export interface DiFrameInfo {
  frame: number
  width: number
  height: number
}
