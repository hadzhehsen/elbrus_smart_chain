/* eslint-disable no-useless-escape */
/** ===================
 * REQUIRES AND CONFIGS
 * ====================
 */
const fs = require('fs');

const dir = __dirname;
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

// Cleans file name from .png extension || ONLY ACCEPTS PNG!!!
const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  rarity.forEach((item) => {
    name = name.replace(item.key, '');
  });
  return name;
};

// Adds rarity to the NFT
const addRarity = (_str) => {
  let itemRarity;
  rarity.forEach((item) => {
    if (_str.includes(item.key)) {
      itemRarity = item.val;
    }
  });
  return itemRarity;
};
// Writes elements into the config
const getElements = (path) => fs
  .readdirSync(path)
  .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
  .map((img, index) => ({
    id: index + 1,
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

module.exports = {
  layers,
  width,
  height,
};
