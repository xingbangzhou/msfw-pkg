export enum DiModelType {
  MP4 = 0,
  IMAGE = 1,
}

export interface DiLayerInfo {
  id: string
  type: DiModelType
  value: string // MP4: url; IMAGE: url
  width: number
  height: number
  position: [number, number] // [x, y]
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
  uFragTypeLocation?: WebGLUniformLocation
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
