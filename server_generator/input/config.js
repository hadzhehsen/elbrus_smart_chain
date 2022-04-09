/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/** ************************************************************
 * UTILITY FUNCTIONS
 * - scroll to BEGIN CONFIG to provide the config values
 ************************************************************ */
const fs = require('fs');

const dir = __dirname;

// adds a rarity to the configuration.
// This is expected to correspond with a directory containing the rarity for each defined layer
// @param _id - id of the rarity
// @param _from - number in the edition to start this rarity from
// @param _to - number in the edition to generate this rarity to
// @return a rarity object used to dynamically generate the NFTs
const addRarity = (_id, _from, _to) => {
  const _rarityWeight = {
    value: _id,
    from: _from,
    to: _to,
    layerPercent: {},
  };
  return _rarityWeight;
};

// get the name without last 4 characters -> slice .png from the name
const cleanName = (_str) => {
  const name = _str.slice(0, -4);
  return name;
};

// reads the filenames of a given folder and returns it with its name and path
const getElements = (_path, _elementCount) => fs
  .readdirSync(_path)
  // eslint-disable-next-line no-useless-escape
  .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
  .map((i) => ({
    id: _elementCount,
    name: cleanName(i),
    path: `${_path}/${i}`,
  }));

// adds a layer to the configuration. The layer will hold information on all the defined parts and
// where they should be rendered in the image
// @param _id - id of the layer
// @param _position - on which x/y value to render this part
// @param _size - of the image
// @return a layer object used to dynamically generate the NFTs
const addLayer = (_id, _position, _size) => {
  if (!_id) {
    console.log('error adding layer, parameters id required');
    return null;
  }
  if (!_position) {
    _position = { x: 0, y: 0 };
  }
  if (!_size) {
    _size = { width, height };
  }
  // add two different dimension for elements:
  // - all elements with their path information
  // - only the ids mapped to their rarity
  const elements = [];
  let elementCount = 0;
  const elementIdsForRarity = {};
  rarityWeights.forEach((rarityWeight) => {
    const elementsForRarity = getElements(`${dir}/${_id}/${rarityWeight.value}`);

    elementIdsForRarity[rarityWeight.value] = [];
    elementsForRarity.forEach((_elementForRarity) => {
      _elementForRarity.id = `${editionDnaPrefix}${elementCount}`;
      elements.push(_elementForRarity);
      elementIdsForRarity[rarityWeight.value].push(_elementForRarity.id);
      elementCount += 1;
    });
    elements[rarityWeight.value] = elementsForRarity;
  });

  const elementsForLayer = {
    id: _id,
    position: _position,
    size: _size,
    elements,
    elementIdsForRarity,
  };
  return elementsForLayer;
};

// adds layer-specific percentages to use one vs another rarity
// @param _rarityId - the id of the rarity to specifiy
// @param _layerId - the id of the layer to specifiy
// @param _percentages -
// an object defining the rarities and the
// percentage with which a given rarity for this layer should be used
const addRarityPercentForLayer = (_rarityId, _layerId, _percentages) => {
  let _rarityFound = false;
  rarityWeights.forEach((_rarityWeight) => {
    if (_rarityWeight.value === _rarityId) {
      const _percentArray = [];
      for (const percentType in _percentages) {
        _percentArray.push({
          id: percentType,
          percent: _percentages[percentType],
        });
      }
      _rarityWeight.layerPercent[_layerId] = _percentArray;
      _rarityFound = true;
    }
  });
  if (!_rarityFound) {
    console.log(
      `rarity ${_rarityId} not found, failed to add percentage information`,
    );
  }
};

/** ************************************************************
 * BEGIN CONFIG
 ************************************************************ */

// image width in pixels
const width = 1000;
// image height in pixels
const height = 1000;
// description for NFT in metadata file
const description = 'Bloon is a NFT Collection';
// Layer2 url to use in metadata file
// the id of the nft will be added to this url, in the example e.g. https://blooncollection.com/nft/1 for NFT with id 1
const Layer2ImageUri = 'https://elbrussmartchain.com/nft';
// id for edition to start from
const startEditionFrom = 1;
// amount of NFTs to generate in edition
const editionSize = 50;
// prefix to add to edition dna ids
// (to distinguish dna counts from different generation processes for the same collection)
const editionDnaPrefix = 0;

// create required weights
// for each weight,
// call 'addRarity' with the id and from which to which element this rarity should be applied
let rarityWeights = [
  addRarity('legendary', 1, 4),
  addRarity('epic', 5, 9),
  addRarity('rare', 10, 29),
  addRarity('common', 30, 50),
];

// create required layers
// for each layer, call 'addLayer' with the id and optionally the positioning and size
// the id would be the name of the folder in your input directory, e.g. 'ball' for ./input/ball
const layers = [
  addLayer('Layer1', { x: 0, y: 0 }, { width, height }),
  addLayer('Layer2'),
  addLayer('Layer3'),
  addLayer('Layer4'),
  addLayer('Layer5'),
  addLayer('Layer6'),
  addLayer('Layer7'),
  addLayer('Layer8'),
  addLayer('Layer9'),
];

// provide any specific percentages tLayer5 are required for a given layer and rarity level
// all provided options are used Layer2d on their percentage values to decide which
// layer to select from
const prectntages = {
  legendary: 5,
  epic: 10,
  rare: 25,
  common: 60,
};

addRarityPercentForLayer('legendary', 'Layer1', prectntages);
addRarityPercentForLayer('epic', 'Layer1', prectntages);
addRarityPercentForLayer('rare', 'Layer1', prectntages);
addRarityPercentForLayer('original', 'Layer1', prectntages);

addRarityPercentForLayer('legendary', 'Layer2', prectntages);
addRarityPercentForLayer('epic', 'Layer2', prectntages);
addRarityPercentForLayer('rare', 'Layer2', prectntages);
addRarityPercentForLayer('original', 'Layer2', prectntages);

addRarityPercentForLayer('legendary', 'layer3', prectntages);
addRarityPercentForLayer('epic', 'layer3', prectntages);
addRarityPercentForLayer('rare', 'layer3', prectntages);
addRarityPercentForLayer('original', 'layer3', prectntages);

addRarityPercentForLayer('legendary', 'Layer4', prectntages);
addRarityPercentForLayer('epic', 'Layer4', prectntages);
addRarityPercentForLayer('rare', 'Layer4', prectntages);
addRarityPercentForLayer('original', 'Layer4', prectntages);

addRarityPercentForLayer('legendary', 'Layer5', prectntages);
addRarityPercentForLayer('epic', 'Layer5', prectntages);
addRarityPercentForLayer('rare', 'Layer5', prectntages);
addRarityPercentForLayer('original', 'Layer5', prectntages);

addRarityPercentForLayer('legendary', 'Layer6', prectntages);
addRarityPercentForLayer('epic', 'Layer6', prectntages);
addRarityPercentForLayer('rare', 'Layer6', prectntages);
addRarityPercentForLayer('original', 'Layer6', prectntages);

addRarityPercentForLayer('legendary', 'Layer7', prectntages);
addRarityPercentForLayer('epic', 'Layer7', prectntages);
addRarityPercentForLayer('rare', 'Layer7', prectntages);
addRarityPercentForLayer('original', 'Layer7', prectntages);

addRarityPercentForLayer('legendary', 'Layer8', prectntages);
addRarityPercentForLayer('epic', 'Layer8', prectntages);
addRarityPercentForLayer('rare', 'Layer8', prectntages);
addRarityPercentForLayer('original', 'Layer8', prectntages);

addRarityPercentForLayer('legendary', 'Layer9', prectntages);
addRarityPercentForLayer('epic', 'Layer9', prectntages);
addRarityPercentForLayer('rare', 'Layer9', prectntages);
addRarityPercentForLayer('original', 'Layer9', prectntages);

module.exports = {
  layers,
  width,
  height,
  description,
  Layer2ImageUri,
  editionSize,
  startEditionFrom,
  rarityWeights,
};
