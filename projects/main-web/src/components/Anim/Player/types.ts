export enum LayerType {
  PreComposition = 'precomposition',
  Image = 'image',
  Video = 'video',
  Text = 'text',
  Vector = 'vector',
  ShapeLayer = 'ShapeLayer',
  Ellipse = 'Ellipse',
  Rect = 'Rect',
}

export enum PlayState {
  None = 0,
  Play,
}

export interface FrameInfo {
  frames: number
  frameId: number
  width: number
  height: number
  opacity: number // 父级的透明度
}

export interface TransformProps {
  anchorPoint: {
    inFrame: number
    value: number[]
    timeFunc?: number
  }[]
  position: {
    inFrame: number
    value: number[]
    timeFunc?: number
  }[]
  scale: {
    inFrame: number
    value: number[]
    timeFunc?: number
  }[]
  opacity: {
    inFrame: number
    value: number
    timeFunc?: number
  }[]
  rotationX?: {
    inFrame: number
    value: number
    timeFunc?: number
  }[]
  rotationY?: {
    inFrame: number
    value: number
    timeFunc?: number
  }[]
  rotationZ?: {
    inFrame: number
    value: number
    timeFunc?: number
  }[]
  orientation?: {
    inFrame: number
    value: number[]
    timeFunc?: number
  }[]
}

export interface LayerBaseProps {
  id: number
  type: LayerType
  name?: string
  transform: TransformProps
  width: number
  height: number
  inFrame: number
  outFrame: number
  isTrackMatte?: boolean
  trackMatteLayer?: number
}

export type LayerRectProps = {
  name?: string
  blendMode?: number
  elements: {
    rectInfo: {
      direction?: number
      size: [number, number]
      position: [number, number]
      roundness?: number
    }
    strokeInfo: {
      blendMode?: number
      color: string
      opacity?: number
      width?: number
      lineCap?: number
      lineJoin?: number
      miterLimit?: number
    }
    fillInfo: {
      blendMode?: number
      color: [number, number, number, number]
      opacity: number
    }
  }
  transform: TransformProps
} & LayerBaseProps

export type LayerEllipseProps = {
  name?: string
  blendMode?: number
  elements: {
    ellipseInfo: {
      direction?: number
      size: [number, number]
      position: [number, number]
    }
    fillInfo: {
      blendMode?: number
      color: [number, number, number, number]
      opacity: number
    }
  }
} & LayerBaseProps

export type LayerImageProps = {
  content: string
  fillMode?: number
} & LayerBaseProps

export type LayerVideoProps = {
  content: string
  isAlpha?: boolean
} & LayerBaseProps

export type LayerTextProps = {
  textDocAttr: {
    text: string
    textColor: {r: number; g: number; b: number}
    font: string
    fontFamily: string
    fontSize: number
    fontStyle: string
    fauxBold?: boolean
    fauxItalic?: boolean
    lineSpacing?: number
    wordSpacing?: number
    textAligment?: number
    orientation?: number
  }
  content: string
} & LayerBaseProps

export type LayerShapeProps = {
  content: Array<LayerRectProps | LayerEllipseProps>
} & LayerBaseProps

export type LayerVectorProps = {
  layers: LayerProps[]
} & LayerBaseProps

export type LayerProps =
  | LayerImageProps
  | LayerVideoProps
  | LayerTextProps
  | LayerShapeProps
  | LayerVectorProps
  | LayerRectProps
  | LayerEllipseProps

export interface PlayProps {
  width: number
  height: number
  duration: number // 秒
  frameRate: number
  targetComp: {
    layers: LayerProps[]
  }
  comps: LayerProps[]
}
