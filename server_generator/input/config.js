/** ===================
 * REQUIRES AND CONFIGS
 * ====================
 */
const fs = require('fs');

const dir = process.env.PWD;
const width = 1000;
const height = 1000;
const rarity = [
  {
    key: '',
    val: 'common',
  },
  {
    key: '_r',
    val: 'rare',
  },
  {
    key: '_sr', val: 'super rare',
  },
  {
    key: '_epic',
    val: 'epic',
  },
  {
    key: '_legendary',
    val: 'legendary',
  },
];

/** ====================
 *  FILESYSTEM FUNCTIONS
 *  ====================
 */
const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  rarity.forEach((item) => {
    name = name.replace(item.key, '');
  });
  return name;
};

const addRarity = (_str) => {
  let itemRarity;
  rarity.forEach((item) => {
    if (_str.includes(item.key)) {
      itemRarity = item.val;
    }
  });
  return itemRarity;
};

const getElements = (path) => fs
  .readdirSync(path)
  .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
  .map((img, index) => ({
    id: index + img,
    name: cleanName(img),
    fileName: img,
    rarity: addRarity(img),
  }));

/** ============
 *  FILE SYSTEM
 *  ============
 */
const layers = [
  {
    id: 1,
    name: 'Background',
    location: `${dir}/Background`,
    elements: getElements(`${dir}/Background`),
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width,
      height,
    },
  },
  {
    id: 1,
    name: 'Body',
    location: `${dir}/Body`,
    elements: getElements(`${dir}/Body`),
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width,
      height,
    },
  },
  {
    id: 1,
    name: 'Eyes',
    location: `${dir}/Eyes`,
    elements: getElements(`${dir}/Eyes`),
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width,
      height,
    },
  },
  {
    id: 1,
    name: 'Head',
    location: `${dir}/Head`,
    elements: getElements(`${dir}/Head`),
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width,
      height,
    },
  },
  {
    id: 1,
    name: 'Headwear',
    location: `${dir}/Headwear`,
    elements: getElements(`${dir}/Headwear`),
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width,
      height,
    },
  },
  {
    id: 1,
    name: 'Mouth',
    location: `${dir}/Mouth`,
    elements: getElements(`${dir}/Mouth`),
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width,
      height,
    },
  },
  {
    id: 1,
    name: 'Nose',
    location: `${dir}/Nose`,
    elements: getElements(`${dir}/Nose`),
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width,
      height,
    },
  },
  {
    id: 1,
    name: 'Outfit',
    location: `${dir}/Outfit`,
    elements: getElements(`${dir}/Outfit`),
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width,
      height,
    },
  },
  {
    id: 1,
    name: 'Sunglasses',
    location: `${dir}/Sunglasses`,
    elements: getElements(`${dir}/Sunglasses`),
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width,
      height,
    },
  },
];

console.log(layers);
