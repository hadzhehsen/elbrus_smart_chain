/* eslint-disable no-await-in-loop */
/* eslint-disable no-async-promise-executor */
/* eslint-disable default-param-last */
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

const editionSize = myArgs.length > 0 ? Number(myArgs[0]) : 1;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d'); // - our context to basically draw shit lol

/** ====================
 *  METADATA LOGIC
 *  ====================
 */
// VARIABLES
let metadataList = [];
let attributesList = [];
let hashList = [];
let dnaList = [];

const signImage = (_sig) => {
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 30pt Courier';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(_sig, 40, 40);
};

const addMetadata = (_dna, _edition) => {
  let dataTime = Date.now();
  let tempMetadata = {
    dna: _dna,
    edition: _edition,
    date: dataTime,
    attributes: attributesList,
  };
  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttributes = (_element) => {
  let { selectedElement } = _element.layer;
  attributesList.push({
    name: selectedElement.name,
    rarity: selectedElement.rarity,
  });
};
// -----------------------//

/** =========================
 *  CANVAS LAYER LOGIC - DRAW
 *  =========================
 * @param {*} _canvas - our canvas where we draw our NFT
 * @param {*} _edition - an eddition of an NFT
 */
const saveImage = (_editionCount) => {
  fs.writeFileSync(`./output/${_editionCount}.png`, canvas.toBuffer('image/png'));
  console.log('Image created');
};

const loadLayerImg = async (_layer) => new Promise(async (resolve) => {
  const image = await loadImage(`${_layer.location}/${_layer.selectedElement.fileName}`);
  resolve({ layer: _layer, loadedImage: image });
});

const drawElement = (_element) => {
  console.log(_element);
  ctx.drawImage(
    _element.loadedImage,
    _element.layer.position.x,
    _element.layer.position.y,
    _element.layer.size.width,
    _element.layer.size.height,
  );
  addAttributes(_element);
};

const constructLayerToDna = (_dna, _layers) => {
  let DnaSegment = _dna.toString().match(/.{1,2}/g);
  let mappedDnaToLayers = _layers.map((layer) => {
    let selectedElement = layer.elements[parseInt(DnaSegment, 10) % layer.elements.length];
    return {
      location: layer.location,
      elements: layer.elements,
      position: layer.position,
      size: layer.size,
      selectedElement,
    };
  });
  return mappedDnaToLayers;
};

const isDnaUnique = (_DnaList = [], _dna) => {
  let foundDna = _DnaList.find((item) => item === _dna);
  // eslint-disable-next-line no-unneeded-ternary
  let validation = foundDna === undefined ? true : false; // ne rugaites, ono rabotaet
  return validation;
};

const createDna = (_length) => {
  let randNumber = Math.floor(Number(`1e${_length}`) + Math.random() * Number(`9e${_length}`));
  // umno navernoe, such mathematics, so wow!
  // - e17 is a number of zeroes after the initial integer,
  // - we neeed to have number of integer that is equeal to the number of layer dirs x 2
  return randNumber;
};

// -----------------------------------------//
const pathToJson = './output/_metadata.json';

const writeMetaData = (_data) => {
  fs.writeFileSync(pathToJson, _data);
};
// YBEITE MENYA NAHUI!
const startCreating = async () => {
  writeMetaData('');
  let editionCount = 1;
  while (editionCount <= editionSize) {
    let newDna = createDna(layers.length * 2 - 1);
    if (isDnaUnique(dnaList, newDna)) {
      let results = constructLayerToDna(newDna, layers);
      let loadedElements = []; // promise array
      results.forEach((layer) => {
        loadedElements.push(loadLayerImg(layer));
      });
      // eslint-disable-next-line no-loop-func
      await Promise.all(loadedElements).then((elementArray) => {
        elementArray.forEach((element) => {
          drawElement(element);
        });
        signImage(`#${editionCount}`);
        saveImage(editionCount);
        addMetadata(newDna, editionCount);
        console.log('Created edition:', editionCount, 'with DNA', newDna);
      });
      dnaList.push(newDna);
      // VIGLYAFIT STREMNO, ZATO RABOCHEE!
      editionCount += 1;
    } else {
      console.log('DNA elready present!');
    }
  }
  writeMetaData(JSON.stringify(metadataList));
};

startCreating();
