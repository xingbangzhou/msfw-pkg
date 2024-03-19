import {ThisWebGLContext} from '../base'
import {m4} from '../base'
import {FrameInfo, LayerEllipseProps, LayerRectProps, LayerShapeProps, LayerType} from '../types'
import AbstractDrawer from './AbstractDrawer'
import EllipseDrawer from './EllipseDrawer'
import Layer from './Layer'
import RectDrawer from './RectDrawer'

export default class ShapeDrawer extends AbstractDrawer<LayerShapeProps> {
  private subLayers?: Layer[]

  async init(gl: ThisWebGLContext) {
    this.subLayers = []
    const shapeElements = this.props.content
    if (shapeElements) {
      for (let i = shapeElements.length - 1; i >= 0; i--) {
        const element = shapeElements[i]
        if (element.type === LayerType.Rect) {
          const props = {...element, inFrame: this.props.inFrame, outFrame: this.props.outFrame}
          const rectLayer = new Layer(new RectDrawer(props as LayerRectProps, this.pdata))
          await rectLayer.init(gl)
          this.subLayers.push(rectLayer)
        } else if (element.type === LayerType.Ellipse) {
          const props = {...element, inFrame: this.props.inFrame, outFrame: this.props.outFrame}
          const ellipseLayer = new Layer(new EllipseDrawer(props as LayerEllipseProps, this.pdata))
          await ellipseLayer.init(gl)
          this.subLayers.push(ellipseLayer)
        }
      }
    }
  }

  draw(gl: ThisWebGLContext, matrix: m4.Mat4, frameInfo: FrameInfo, parentFramebuffer: WebGLFramebuffer | null) {
    const subLayers = this.subLayers || []
    for (let i = 0, l = subLayers.length; i < l; i++) {
      const layer = subLayers[i]
      layer.render(gl, matrix, frameInfo)
    }
  }

  destroy(gl?: ThisWebGLContext | undefined) {
    this.subLayers?.forEach(el => el.destroy(gl))
    this.subLayers = undefined
  }
}
