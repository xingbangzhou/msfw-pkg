export enum LayerType {
  Image = 'image',
  Video = 'video',
  PreComposition = 'precomposition',
}

export enum PlayState {
  None = 0,
  Play,
}

export interface FrameInfo {
  frameId: number
  width: number
  height: number
  isEnd?: boolean
}

export interface LayerProps {
  type: string
  name: string
  content?: string
  transform: {
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
    rotationX?: {
      inFrame: number
      value: number
    }[]
    rotationY?: {
      inFrame: number
      value: number
    }[]
    rotationZ?: {
      inFrame: number
      value: number
    }[]
  }
  layers?: LayerProps[]
  width?: number
  height?: number
  maskLayer?: LayerProps
}

export interface PlayProps {
  width: number
  height: number
  frameRate: number
  duration: number // 秒
  layers: LayerProps[]
}
