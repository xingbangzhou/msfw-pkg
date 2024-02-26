import {DiPlayProps} from 'src/components/DiAnim'

export const mocks: DiPlayProps = {
  width: 900,
  height: 1000,
  duration: 4000,
  frameRate: 30,
  layers: [
    {
      type: 'video',
      content: 'http://localhost:5002/video.mp4',
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
            value: 0,
          },
        ],
        rotationY: [
          {
            inFrame: 0,
            value: 0,
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
