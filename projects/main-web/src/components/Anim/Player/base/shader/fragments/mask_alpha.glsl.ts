export default `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform sampler2D u_maskTexture;

uniform float u_opacity;

void main(void) {
  vec4 texColor = texture2D(u_texture, v_texcoord);
  texColor = texColor * u_opacity;

  vec4 a = texture2D(u_maskTexture, v_texcoord.xy).a;
  
  gl_FragColor = texColor * a;
}
`
