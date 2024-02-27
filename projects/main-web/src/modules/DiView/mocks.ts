import {DiPlayProps} from 'src/components/DiAnim'

export const mocks: DiPlayProps = {
  width: 900,
  height: 1000,
  duration: 4000,
  frameRate: 30,
  layers: [
    // {
    //   type: 'video',
    //   name: '6_bmp',
    //   content: 'http://localhost:5002/6_bmp.mov',
    //   transform: {
    //     anchorPoint: [
    //       {
    //         inFrame: 0,
    //         value: [350, 350, 0],
    //       },
    //     ],
    //     position: [
    //       {
    //         inFrame: 0,
    //         value: [689, 660, 0],
    //       },
    //     ],
    //     scale: [
    //       {
    //         inFrame: 0,
    //         value: [59, 59, 100],
    //       },
    //     ],
    //     opacity: [
    //       {
    //         inFrame: 0,
    //         value: 100,
    //       },
    //     ],
    //     rotationZ: [
    //       {
    //         inFrame: 0,
    //         value: 0,
    //       },
    //     ],
    //   },
    // },
    {
      type: 'image',
      content: 'http://localhost:5002/avatar.png',
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
        rotationX: [
          {
            inFrame: 0,
            value: -329.169929224771,
          },
        ],
        rotationY: [
          {
            inFrame: 0,
            value: 0, // 46.6296703424972,
          },
        ],
        rotationZ: [
          {
            inFrame: 0,
            value: 0, //350.789429689493,
          },
          // {
          //   inFrame: 40,
          //   value: 75,
          // },
        ],
      },
    },
    {
      type: 'image',
      content: 'http://localhost:5002/a9a19f6699b64c942931cdfdf52c15e3598d0e1271ec54-TdcBeD_fw1200.png',
      name: 'a9a19f6699b64c942931cdfdf52c15e3598d0e1271ec54-TdcBeD_fw1200.png',
      transform: {
        anchorPoint: [
          {
            inFrame: 0,
            value: [600, 400.5, 0],
          },
        ],
        position: [
          {
            inFrame: 0,
            value: [275, 669, 0],
          },
        ],
        scale: [
          {
            inFrame: 0,
            value: [46.1666666666667, 70.9144057732713, 100],
          },
        ],
        opacity: [
          {
            inFrame: 0,
            value: 100,
          },
        ],
        rotationZ: [
          {
            inFrame: 0,
            value: 0,
          },
        ],
      },
    },
    {
      type: 'video',
      content: 'http://localhost:5002/temp_change_264_mid.mp4',
      name: 'temp_change_264_mid.mp4',
      transform: {
        anchorPoint: [
          {
            inFrame: 0,
            value: [540, 960, 0],
          },
        ],
        position: [
          {
            inFrame: 0,
            value: [450, 500, 0],
          },
        ],
        scale: [
          {
            inFrame: 0,
            value: [100, 100, 100],
          },
        ],
        opacity: [
          {
            inFrame: 0,
            value: 100,
          },
        ],
        rotationZ: [
          {
            inFrame: 0,
            value: 0,
          },
        ],
      },
    },
  ],
}
