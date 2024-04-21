export default `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform sampler2D u_maskTexture;

void main(void) {
  vec4 texColor = texture2D(u_texture, v_texcoord);
  vec4 maskColor = texture2D(u_maskTexture, v_texcoord);

  float alpha = maskColor.a;
  
  gl_FragColor = texColor * (1.0 - alpha);
}
`
