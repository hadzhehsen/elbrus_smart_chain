/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable no-console */
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

/** ==========================
 * IMPORTED DATA AND ARGUMENTS
 * ===========================
 */
const myArgs = process.argv.slice(2);
const {
  layers,
  width,
  height,
} = require('./input/config');

const edition = myArgs.length > 0 ? Number(myArgs[0]) : 1;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d'); // - our context to basically draw shit lol

/** ====================
 *  METADATA LOGIC
 *  ====================
 */
// VARIABLES
var metadata = [];
var attributes = [];
var hash = [];
var decodedHash = [];

const addMetadata = (_edition) => {
  let dataTime = Date.now();
  let tempMetadata = {
    hash: hash.join(''),
    // eslint-disable-next-line object-shorthand
    decodedHash: decodedHash,
    edition: _edition,
    date: dataTime,
    attributes,
  };
  metadata.push(tempMetadata);
  attributes = [];
  hash = [];
  decodedHash = [];
};

const addAttributes = (_element, _layer) => {
  let tempAttributes = {
    id: _element.id,
    layers: _layer.name,
    name: _element.name,
    rarity: _element.rarity,
  };
  attributes.push(tempAttributes);
  hash.push(_layer.id);
  hash.push(_element.id);
  decodedHash.push({
    [_layer.id]: _element.id,
  });
};
// -----------------------//

/** =========================
 *  CANVAS LAYER LOGIC - DRAW
 *  =========================
 * @param {*} _canvas - our canvas where we draw our NFT
 * @param {*} _edition - an eddition of an NFT
 */
const saveLayer = (_canvas, _edition) => {
  fs.writeFileSync(`./output/${_edition}.png`, _canvas.toBuffer('image/png'));
  console.log('Image created');
};

const drawLayer = async (_layer, _edition) => {
  const element = _layer.elements[Math.floor(Math.random() * _layer.elements.length)];
  console.log(element);
  addAttributes(element, _layer);
  const image = await loadImage(`${_layer.location}/${element.fileName}`);
  ctx.drawImage(
    image,
    _layer.position.x,
    _layer.position.y,
    _layer.size.width,
    _layer.size.height,
  );
  console.log(`Created layer: ${_layer.name}`);
  console.log(`Chose element: ${element.name}`);
  saveLayer(canvas, _edition);
};

for (let i = 1; i <= edition; i += 1) {
  layers.forEach((layer) => {
    drawLayer(layer, i);
  });
  addMetadata(i);
  console.log(`Created edition ${i}`);
}
// -----------------------------------------//
const pathToJson = './output/_metadata.json';
fs.readFile(pathToJson, (err, data) => {
  if (err) throw err;
  fs.writeFileSync(pathToJson, JSON.stringify(metadata));
});
