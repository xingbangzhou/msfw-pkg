import {DiModelType} from 'src/components/DiAnim'

export const mocks = {
  width: 500,
  height: 600,
  frames: 60,
  fps: 12,
  layers: [
    {
      id: '背景视频',
      type: DiModelType.MP4,
      value: 'https://lxcode.bs2cdn.yy.com/858b3958-f03a-4bc9-b38c-1686cdc25827.mp4',
      position: [0, 0],
      width: 500,
      height: 500,
      startFrame: 0,
      endFrame: 20,
    },
    {
      id: '头像',
      type: DiModelType.IMAGE,
      value: 'https://rhinosystem.bs2dl.yy.com/cont170601677162111file',
      position: [0, 0],
      width: 320,
      height: 320,
      startFrame: 20,
      endFrame: 60,
    },
  ],
}
