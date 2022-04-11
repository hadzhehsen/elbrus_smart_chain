/* eslint-disable consistent-return */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-shadow */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const { createCanvas, loadImage } = require('canvas');

const isLocal = typeof process.pkg === 'undefined';
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const buildDir = `${basePath}/build`;
const layersDir = `${basePath}/layers`;
const {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
} = require(path.join(basePath, '/src/config'));
const console = require('console');

const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext('2d');
const metadataList = [];
let attributesList = [];
const dnaList = [];

const buildSetup = () => {
  console.log(basePath);
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
};

const getRarityWeight = (_str) => {
  const nameWithoutExtension = _str.slice(0, -4);
  let nameWithoutWeight = Number(
    nameWithoutExtension.split(rarityDelimiter).pop(),
  );
  if (isNaN(nameWithoutWeight)) {
    nameWithoutWeight = 0;
  }
  return nameWithoutWeight;
};

const cleanDna = (_str) => {
  // console.log(_str);
  const dna = Number(_str.split(':').shift());
  return dna;
};

const cleanName = (_str) => {
  const nameWithoutExtension = _str.slice(0, -4);
  const nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift();
  return nameWithoutWeight;
};

const getElements = (path) => fs
  .readdirSync(path)
  // eslint-disable-next-line no-useless-escape
  .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
  .map((i, index) => ({
    id: index,
    name: cleanName(i),
    filename: i,
    path: `${path}${i}`,
    weight: getRarityWeight(i),
  }));

const layersSetup = (layersOrder) => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    blendMode:
      layerObj.blend !== undefined ? layerObj.blend : 'source-over',
    opacity: layerObj.opacity !== undefined ? layerObj.opacity : 1,
  }));
  return layers;
};

const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `${buildDir}/${_editionCount}.png`,
    canvas.toBuffer('image/png'),
  );
};

const genColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const pastel = `hsl(${hue}, 100%, ${background.brightness})`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = genColor();
  ctx.fillRect(0, 0, format.width, format.height);
};

const addMetadata = (_dna, _edition) => {
  const dateTime = Date.now();
  const tempMetadata = {
    dna: sha1(_dna.join('')),
    name: `#${_edition}`,
    description,
    image: `${baseUri}/${_edition}.png`,
    edition: _edition,
    date: dateTime,
    attributes: attributesList,
    compiler: 'ElbrusSmartChain Compiler',
  };
  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttributes = (_element) => {
  const { selectedElement } = _element.layer;
  attributesList.push({
    trait_type: _element.layer.name,
    value: selectedElement.name,
  });
};

// eslint-disable-next-line no-async-promise-executor
const loadLayerImg = async (_layer) => new Promise(async (resolve) => {
  const image = await loadImage(`${_layer.selectedElement.path}`);
  resolve({ layer: _layer, loadedImage: image });
});

const drawElement = (_renderObject) => {
  ctx.globalAlpha = _renderObject.layer.opacity;
  ctx.globalCompositeOperation = _renderObject.layer.blendMode;
  ctx.drawImage(_renderObject.loadedImage, 0, 0, format.width, format.height);
  addAttributes(_renderObject);
};

const constructLayerToDna = (_dna = [], _layers = []) => {
  const mappedDnaToLayers = _layers.map((layer, index) => {
    const selectedElement = layer.elements.find(
      (e) => e.id === cleanDna(_dna[index]),
    );
    return {
      name: layer.name,
      blendMode: layer.blendMode,
      opacity: layer.opacity,
      selectedElement,
    };
  });
  return mappedDnaToLayers;
};

const isDnaUnique = (_DnaList = [], _dna = []) => {
  const foundDna = _DnaList.find((i) => i.join('') === _dna.join(''));
  return foundDna === undefined;
};

const createDna = (_layers) => {
  const randNum = [];
  _layers.forEach((layer) => {
    let totalWeight = 0;
    layer.elements.forEach((element) => {
      totalWeight += element.weight;
    });
    // number between 0 - totalWeight
    let random = Math.floor(Math.random() * totalWeight);
    for (let i = 0; i < layer.elements.length; i += 1) {
      // subtract the current weight from the random weight until we reach a sub zero value.
      random -= layer.elements[i].weight;
      if (random < 0) {
        return randNum.push(
          `${layer.elements[i].id}:${layer.elements[i].filename}`,
        );
      }
    }
  });
  return randNum;
};

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/_metadata.json`, _data);
};

const saveMetaDataSingleFile = (_editionCount) => {
  fs.writeFileSync(
    `${buildDir}/${_editionCount}.json`,
    JSON.stringify(
      metadataList.find((meta) => meta.edition === _editionCount),
      null,
      2,
    ),
  );
};

const startCreating = async () => {
  let layerConfigIndex = 0;
  let editionCount = 1;
  let failedCount = 0;
  while (layerConfigIndex < layerConfigurations.length) {
    const layers = layersSetup(
      layerConfigurations[layerConfigIndex].layersOrder,
    );
    while (
      editionCount <= layerConfigurations[layerConfigIndex].growEditionSizeTo
    ) {
      const newDna = createDna(layers);
      if (isDnaUnique(dnaList, newDna)) {
        const results = constructLayerToDna(newDna, layers);
        const loadedElements = [];

        results.forEach((layer) => {
          loadedElements.push(loadLayerImg(layer));
        });

        await Promise.all(loadedElements).then((renderObjectArray) => {
          ctx.clearRect(0, 0, format.width, format.height);
          if (background.generate) {
            drawBackground();
          }
          renderObjectArray.forEach((renderObject) => {
            drawElement(renderObject);
          });
          saveImage(editionCount);
          addMetadata(newDna, editionCount);
          saveMetaDataSingleFile(editionCount);
          console.log(
            `Created edition: ${editionCount}, with DNA: ${sha1(
              newDna.join(''),
            )}`,
          );
        });
        dnaList.push(newDna);
        editionCount += 1;
      } else {
        console.log('DNA exists!');
        failedCount += 1;
        if (failedCount >= uniqueDnaTorrance) {
          console.log(
            `You need more layers or elements to grow your edition to ${layerConfigurations[layerConfigIndex].growEditionSizeTo} artworks!`,
          );
          process.exit();
        }
      }
    }
    layerConfigIndex += 1;
  }
  writeMetaData(JSON.stringify(metadataList, null, 2));
};

module.exports = { startCreating, buildSetup, getElements };
