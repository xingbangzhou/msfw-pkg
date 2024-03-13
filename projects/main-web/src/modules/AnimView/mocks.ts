import {PlayProps} from 'src/components/Anim'

// export const mocks: PlayProps = {
//   width: 900,
//   height: 1000,
//   duration: 4000,
//   frameRate: 30,
//   layers: [
//     // {
//     //   type: 'precomposition',
//     //   name: 'vector',
//     //   width: 900,
//     //   height: 1000,
//     //   transform: {
//     //     anchorPoint: [
//     //       {
//     //         inFrame: 0,
//     //         value: [450, 500, 0],
//     //       },
//     //     ],
//     //     position: [
//     //       {
//     //         inFrame: 0,
//     //         value: [690, 500, 0],
//     //       },
//     //       {
//     //         inFrame: 30,
//     //         value: [700, 571, 1000],
//     //       },
//     //     ],
//     //     scale: [
//     //       {
//     //         inFrame: 0,
//     //         value: [45, 45, 100],
//     //       },
//     //     ],
//     //     opacity: [
//     //       {
//     //         inFrame: 0,
//     //         value: 100,
//     //       },
//     //     ],
//     //     rotationY: [
//     //       {
//     //         inFrame: 0,
//     //         value: 0,
//     //       },
//     //     ],
//     //     rotationZ: [
//     //       {
//     //         inFrame: 0,
//     //         value: 0,
//     //       },
//     //       {
//     //         inFrame: 30,
//     //         value: 90,
//     //       },
//     //     ],
//     //   },
//     //   layers: [
//     //     {
//     //       type: 'image',
//     //       width: 256,
//     //       height: 256,
//     //       content: 'http://localhost:5002/avatar.png',
//     //       name: 'avatar.png',
//     //       transform: {
//     //         anchorPoint: [
//     //           {
//     //             inFrame: 0,
//     //             value: [128, 128, 0],
//     //           },
//     //         ],
//     //         position: [
//     //           {
//     //             inFrame: 0,
//     //             value: [462, 450, 0],
//     //           },
//     //           {
//     //             inFrame: 30,
//     //             value: [426, 660, 0],
//     //           },
//     //         ],
//     //         scale: [
//     //           {
//     //             inFrame: 0,
//     //             value: [100, 100, 100],
//     //           },
//     //         ],
//     //         opacity: [
//     //           {
//     //             inFrame: 0,
//     //             value: 100,
//     //           },
//     //         ],
//     //         rotationZ: [
//     //           {
//     //             inFrame: 0,
//     //             value: 0,
//     //           },
//     //           {
//     //             inFrame: 30,
//     //             value: 360,
//     //           },
//     //         ],
//     //       },
//     //     },
//     //   ],
//     // },
//     // {
//     //   type: 'video',
//     //   width: 700,
//     //   height: 696,
//     //   name: '6_bmp',
//     //   content: 'http://localhost:5002/6_bmp.mp4',
//     //   transform: {
//     //     anchorPoint: [
//     //       {
//     //         inFrame: 0,
//     //         value: [350, 350, 0],
//     //       },
//     //     ],
//     //     position: [
//     //       {
//     //         inFrame: 0,
//     //         value: [689, 660, 0],
//     //       },
//     //     ],
//     //     scale: [
//     //       {
//     //         inFrame: 0,
//     //         value: [59, 59, 100],
//     //       },
//     //     ],
//     //     opacity: [
//     //       {
//     //         inFrame: 0,
//     //         value: 100,
//     //       },
//     //     ],
//     //     rotationZ: [
//     //       {
//     //         inFrame: 0,
//     //         value: 0,
//     //       },
//     //     ],
//     //   },
//     // },
//     {
//       type: 'image',
//       content: 'http://localhost:5002/avatar.png',
//       name: 'testpic',
//       width: 256,
//       height: 256,
//       transform: {
//         anchorPoint: [
//           {
//             inFrame: 0,
//             value: [128, 128, 0],
//           },
//         ],
//         position: [
//           {
//             inFrame: 0,
//             value: [275, 678, 510],
//           },
//         ],
//         scale: [
//           {
//             inFrame: 0,
//             value: [72.4072708213321, 101.525480507134, 100],
//           },
//         ],
//         opacity: [
//           {
//             inFrame: 0,
//             value: 100,
//           },
//         ],
//         rotationX: [
//           {
//             inFrame: 0,
//             value: 329.169929224771,
//           },
//         ],
//         rotationY: [
//           {
//             inFrame: 0,
//             value: 46.6296703424972,
//           },
//         ],
//         rotationZ: [
//           {
//             inFrame: 0,
//             value: 350.789429689493,
//           },
//         ],
//       },
//       maskLayer: {
//         type: 'image',
//         content: 'http://localhost:5002/mask.png',
//         name: 'testpic',
//         width: 256,
//         height: 256,
//         transform: {
//           anchorPoint: [
//             {
//               inFrame: 0,
//               value: [128, 128, 0],
//             },
//           ],
//           position: [
//             {
//               inFrame: 0,
//               value: [128, 128, 0],
//             },
//             // {
//             //   inFrame: 30,
//             //   value: [-128, 128, 0],
//             // },
//           ],
//           scale: [
//             {
//               inFrame: 0,
//               value: [100, 100, 100],
//             },
//           ],
//           opacity: [
//             {
//               inFrame: 0,
//               value: 100,
//             },
//           ],
//         },
//       },
//     },
//     {
//       type: 'image',
//       width: 1200,
//       height: 801,
//       content: 'http://localhost:5002/a9a19f6699b64c942931cdfdf52c15e3598d0e1271ec54-TdcBeD_fw1200.png',
//       name: 'a9a19f6699b64c942931cdfdf52c15e3598d0e1271ec54-TdcBeD_fw1200.png',
//       transform: {
//         anchorPoint: [
//           {
//             inFrame: 0,
//             value: [600, 400.5, 0],
//           },
//         ],
//         position: [
//           {
//             inFrame: 0,
//             value: [275, 669, 0],
//           },
//         ],
//         scale: [
//           {
//             inFrame: 0,
//             value: [46.1666666666667, 70.9144057732713, 100],
//           },
//         ],
//         opacity: [
//           {
//             inFrame: 0,
//             value: 100,
//           },
//         ],
//         rotationZ: [
//           {
//             inFrame: 0,
//             value: 0,
//           },
//         ],
//       },
//       maskLayer: {
//         type: 'precomposition',
//         name: 'vector',
//         width: 900,
//         height: 1000,
//         transform: {
//           anchorPoint: [
//             {
//               inFrame: 0,
//               value: [450, 500, 0],
//             },
//           ],
//           position: [
//             {
//               inFrame: 0,
//               value: [400, 500, 0],
//             },
//           ],
//           scale: [
//             {
//               inFrame: 0,
//               value: [300, 300, 100],
//             },
//           ],
//           opacity: [
//             {
//               inFrame: 0,
//               value: 100,
//             },
//           ],
//           rotationY: [
//             {
//               inFrame: 0,
//               value: 0,
//             },
//           ],
//           rotationZ: [
//             {
//               inFrame: 0,
//               value: 0,
//             },
//           ],
//         },
//         layers: [
//           {
//             type: 'image',
//             width: 256,
//             height: 256,
//             content: 'http://localhost:5002/mask1.png',
//             name: 'avatar.png',
//             transform: {
//               anchorPoint: [
//                 {
//                   inFrame: 0,
//                   value: [128, 128, 0],
//                 },
//               ],
//               position: [
//                 {
//                   inFrame: 0,
//                   value: [100, 450, 0],
//                 },
//                 {
//                   inFrame: 30,
//                   value: [662, 450, 0],
//                 },
//               ],
//               scale: [
//                 {
//                   inFrame: 0,
//                   value: [100, 100, 100],
//                 },
//               ],
//               opacity: [
//                 {
//                   inFrame: 0,
//                   value: 100,
//                 },
//               ],
//               rotationZ: [
//                 {
//                   inFrame: 0,
//                   value: 0,
//                 },
//               ],
//             },
//           },
//         ],
//       },
//     },
//     {
//       type: 'video',
//       width: 1080,
//       height: 1920,
//       content: 'http://localhost:5002/temp_change_264_mid.mp4',
//       name: 'temp_change_264_mid.mp4',
//       transform: {
//         anchorPoint: [
//           {
//             inFrame: 0,
//             value: [540, 960, 0],
//           },
//         ],
//         position: [
//           {
//             inFrame: 0,
//             value: [450, 500, 0],
//           },
//         ],
//         scale: [
//           {
//             inFrame: 0,
//             value: [100, 100, 100],
//           },
//         ],
//         opacity: [
//           {
//             inFrame: 0,
//             value: 100,
//           },
//         ],
//         rotationZ: [
//           {
//             inFrame: 0,
//             value: 0,
//           },
//         ],
//       },
//     },
//   ],
// }

export const mocks: PlayProps = {
  width: 500,
  height: 500,
  duration: 4000,
  frameRate: 30,
  layers: [
    {
      type: 'precomposition',
      width: 500,
      height: 500,
      inFrame: 0,
      outFrame: 120,
      transform: {
        anchorPoint: [
          {
            inFrame: 0,
            value: [244.250001224986, 264.000019646492, 5.16884013361127e-8],
          },
        ],
        position: [
          {
            inFrame: 0,
            value: [41.8501510620117, 277.217231750488, 2.06753605344451e-9],
          },
          {
            inFrame: 5,
            value: [40.8450677005197, 278.487358942566, 1.47905395271861e-9],
          },
          {
            inFrame: 8,
            value: [37.3664708484113, 280.413197323292, 1.05126373651142e-9],
          },
          {
            inFrame: 14,
            value: [34.2484442216474, 285.60249416087, 6.19004047758624e-10],
          },
          {
            inFrame: 20,
            value: [37.2256933361088, 292.93728613253, 2.99342160394503e-10],
          },
          {
            inFrame: 24,
            value: [46.9568761004919, 295.908401986133, 1.48253377648303e-10],
          },
          {
            inFrame: 27,
            value: [57.6406283518757, 297.464089458452, 9.74500983500555e-11],
          },
          {
            inFrame: 37,
            value: [99.1218798475226, 300.658365605623, 0],
          },
          {
            inFrame: 42,
            value: [121.628644063399, 301.732152768649, 0],
          },
          {
            inFrame: 54,
            value: [180.847310314727, 303.961626443221, 0],
          },
          {
            inFrame: 58,
            value: [200.109948009283, 303.824369153594, 0],
          },
          {
            inFrame: 68,
            value: [255.225151013012, 304.217230964629, 0],
          },
          {
            inFrame: 80,
            value: [324.820588923302, 304.641235336895, 0],
          },
          {
            inFrame: 89,
            value: [383.503674391474, 303.694602859839, 0],
          },
          {
            inFrame: 94,
            value: [419.827751207891, 300.68452042031, 0],
          },
          {
            inFrame: 99,
            value: [449.87093719135, 295.053183733602, 0],
          },
          {
            inFrame: 103,
            value: [464.350074954888, 289.650207826093, 0],
          },
          {
            inFrame: 104,
            value: [465.692430954721, 288.093264338817, 0],
          },
          {
            inFrame: 111,
            value: [472.704847753589, 280.870594555938, 0],
          },
          {
            inFrame: 115,
            value: [471.626701948455, 277.030518288734, 0],
          },
          {
            inFrame: 119,
            value: [469.725151013012, 274.717230964629, 0],
          },
        ],
        scale: [
          {
            inFrame: 0,
            value: [0.57869011068992, 4, 4],
          },
          {
            inFrame: 8,
            value: [1.67927979527892, 6.27192026811335, 5.62798092209857],
          },
          {
            inFrame: 14,
            value: [2.67578755317884, 7.97586046919836, 6.84896661367249],
          },
          {
            inFrame: 20,
            value: [4.20294745717122, 9.67980067028338, 8.06995230524642],
          },
          {
            inFrame: 27,
            value: [6.15181818834993, 10.441405238575, 9.49443561208267],
          },
          {
            inFrame: 37,
            value: [8.74739807572741, 11.5294117647059, 11.5294117647059],
          },
          {
            inFrame: 42,
            value: [9.79104133948495, 12.2504743833017, 12.2504743833017],
          },
          {
            inFrame: 54,
            value: [12.5589628562928, 12.5589628562928, 12.5589628562928],
          },
          {
            inFrame: 68,
            value: [12.6764418218518, 12.6764418218518, 12.6764418218518],
          },
          {
            inFrame: 89,
            value: [10.5604047810884, 12.6820122314194, 12.6764418218518],
          },
          {
            inFrame: 94,
            value: [8.69737216911194, 12.0045623586341, 12.6764418218518],
          },
          {
            inFrame: 104,
            value: [4.38479667842564, 9.35728962413241, 12.6764418218518],
          },
          {
            inFrame: 111,
            value: [2.59994660988316, 8.12213661452476, 12.6764418218518],
          },
          {
            inFrame: 115,
            value: [2.21297424858417, 7.41633489474895, 12.6764418218518],
          },
          {
            inFrame: 119,
            value: [2.31476044289616, 6.71053317497315, 12.6764418218518],
          },
        ],
        opacity: [
          {
            inFrame: 0,
            value: 0,
          },
          {
            inFrame: 6,
            value: 100,
          },
          {
            inFrame: 109,
            value: 100,
          },
          {
            inFrame: 119,
            value: 0,
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
      layers: [
        {
          id: 188,
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
                value: [250, 250, 0],
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
          width: 1080,
          height: 1920,
          inFrame: 0,
          outFrame: 120,
        },
      ],
      trackMatteLayer: {
        type: 'image',
        width: 500,
        height: 500,
        inFrame: 0,
        outFrame: 120,
        content: 'http://localhost:5002/q1_objmaskid2_1_0054.png',
        name: 'q1_objmaskid2_1_0000.png',
        transform: {
          anchorPoint: [
            {
              inFrame: 0,
              value: [250, 250, 0],
            },
          ],
          position: [
            {
              inFrame: 0,
              value: [250, 250, 0],
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
    },
    {
      type: 'image',
      width: 500,
      height: 500,
      inFrame: 0,
      outFrame: 120,
      name: 'q1_0000.png',
      content: 'http://localhost:5002/q1_0054.png',
      transform: {
        anchorPoint: [
          {
            inFrame: 0,
            value: [250, 250, 0],
          },
        ],
        position: [
          {
            inFrame: 0,
            value: [250, 250, 0],
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
            value: 0,
          },
          {
            inFrame: 6,
            value: 100,
          },
          {
            inFrame: 109,
            value: 100,
          },
          {
            inFrame: 119,
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
