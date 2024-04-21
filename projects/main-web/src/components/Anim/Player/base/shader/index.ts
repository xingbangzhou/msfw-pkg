import VertexGlsl from './vertex.glsl'
import FragmentGlsl from './fragment.glsl'
import MaskAlphaGlsl from './fragments/mask_alpha.glsl'
import MaskAlphaInvertedGlsl from './fragments/mask_alpha_inverted.glsl'
import MaskLumaGlsl from './fragments/mask_luma.glsl'
import MaskLumaInvertedGlsl from './fragments/mask_luma_inverted.glsl'

export const shaderGlsls = {
  vertexGlsl: VertexGlsl,
  fragmentGlsl: FragmentGlsl,
  // 遮罩
  maskAlphaGlsl: MaskAlphaGlsl,
  maskAlphaInvertedGlsl: MaskAlphaInvertedGlsl,
  maskLumaGlsl: MaskLumaGlsl,
  maskLumaInvertedGlsl: MaskLumaInvertedGlsl,
}
