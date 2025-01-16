export  const menuData = [
  {
    name: '语音技术',
    category: [
      {
        name: '语音识别（ASR）',
        category: [
          {
            name: '短语音识别',
          },
          {
            name: '音频文件转写',
          },
        ],
      },
      {
        name: '语音合成（TTS）',
        category: [
          {
            name: '语音文本在线合成',
          },
          {
            name: '语音文本离线合成',
          },
          {
            name: '情感语音合成',
          },
        ],
      },
      {
        name: '相关产品',
        category: [
          {
            name: '数字人',
          },
        ],
      },
    ],
  },
  {
    name: '文字识别',
    category: [
      {
        name: '通用场景文字识别',
        category: [
          {
            name: '通用文字识别',
          },
        ],
      },
      {
        name: '交通场景文字识别',
        category: [
          {
            name: '车牌识别',
            path: '/openTech/lpr',
          },
        ],
      },
      {
        name: 'OCR自定义模板识别',
        category: [],
      },
    ],
  },
  {
    name: '图像技术',
    category: [
      {
        name: '图像识别',
        category: [
          {
            name: '通用物体识别',
            path: '/openTech/object',
          },
          {
            name: '小球识别',
          },
          {
            name: '指定物体识别',
          },
        ],
      },
    ],
  },
  {
    name: '人脸和人体',
    category: [
      {
        name: '人脸识别',
        category: [
          {
            name: '多人脸检测',
            path: '/open/faceCheck',
          },
          {
            name: '多人体检测',
          },
          {
            name: '人脸比对',
          },
        ],
      },
      {
        name: '人体与行为分析',
        category: [
          {
            name: '手势识别',
            path: '/open/webCam',
          },
          {
            name: '人体关键点分析',
          },
        ],
      },
    ],
  },
  {
    name: '语言与知识',
    category: [
      {
        name: '语言生成',
        category: [
          {
            name: '文章分类',
          },
          {
            name: '新闻摘要',
          },
        ],
      },
      {
        name: '语言理解',
        category: [
          {
            name: '声纹识别',
          },
          {
            name: '语音评测',
          },
        ],
      },
      {
        name: 'AIGC',
        category: [
          {
            name: '文学创作',
          },
          {
            name: 'AI作画',
          },
          {
            name: '图生图',
          },
        ],
      },
    ],
  },
];