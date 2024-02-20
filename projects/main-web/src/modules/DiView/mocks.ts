import {DiLayerType, DiRenderInfo} from 'src/components/DiAnim'

export const mocks: DiRenderInfo = {
  width: 500,
  height: 600,
  duration: 4000,
  frameRate: 30,
  layers: [
    // {
    //   id: '背景视频',
    //   type: DiModelType.MP4,
    //   value: 'https://lxcode.bs2cdn.yy.com/858b3958-f03a-4bc9-b38c-1686cdc25827.mp4',
    //   position: [0, 0],
    //   width: 500,
    //   height: 500,
    //   startFrame: 0,
    //   endFrame: 20,
    // },
    {
      type: DiLayerType.Image,
      content: 'https://rhinosystem.bs2dl.yy.com/cont170601677162111file',
      name: 'testpic',
      transform: {
        anchorPoint: [
          {
            inFrame: 0,
            value: [128, 128, 0],
          },
        ],
        position: [
          {
            inFrame: 0,
            value: [272.978724406932, 678.224075197804, -51.3980988590675],
          },
        ],
        scale: [
          {
            inFrame: 0,
            value: [72.4072708213321, 101.525480507134, 100],
          },
        ],
        opacity: [
          {
            inFrame: 0,
            value: 100,
          },
        ],
      },
    },
  ],
}
