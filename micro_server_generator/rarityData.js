/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');

const isLocal = typeof process.pkg === 'undefined';
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const layersDir = `${basePath}/layers`;

const { layerConfigurations } = require('./src/config');

const { getElements } = require('./src/main');

// read json data
const rawdata = fs.readFileSync('build/_metadata.json');
const data = JSON.parse(rawdata);
const editionSize = data.length;

const rarityData = [];

// intialize layers to chart
layerConfigurations.forEach((config) => {
  const layers = config.layersOrder;

  layers.forEach((layer) => {
    // get elements for each layer
    const elementsForLayer = [];
    const elements = getElements(`${layersDir}/${layer.name}/`);
    elements.forEach((element) => {
      // just get name and weight for each element
      const rarityDataElement = {
        trait: element.name,
        chance: element.weight.toFixed(0),
        occurrence: 0, // initialize at 0
      };
      elementsForLayer.push(rarityDataElement);
    });

    // don't include duplicate layers
    if (!rarityData.includes(layer.name)) {
      // add elements for each layer to chart
      rarityData[layer.name] = elementsForLayer;
    }
  });
});

// fill up rarity chart with occurrences from metadata
data.forEach((element) => {
  const { attributes } = element;

  attributes.forEach((attribute) => {
    const traitType = attribute.trait_type;
    const { value } = attribute;

    const rarityDataTraits = rarityData[traitType];
    rarityDataTraits.forEach((rarityDataTrait) => {
      if (rarityDataTrait.trait == value) {
        // keep track of occurrences
        rarityDataTrait.occurrence += 1;
      }
    });
  });
});

// convert occurrences to percentages
for (const layer in rarityData) {
  for (const attribute in rarityData[layer]) {
    // convert to percentage
    rarityData[layer][attribute].occurrence = (rarityData[layer][attribute].occurrence / editionSize) * 100;

    // show two decimal places in percent
    rarityData[layer][attribute].occurrence = rarityData[layer][attribute].occurrence.toFixed(0);
  }
}

// print out rarity data
for (const layer in rarityData) {
  console.log(`Trait type: ${layer}`);
  for (const trait in rarityData[layer]) {
    console.log(rarityData[layer][trait]);
  }
  console.log();
}
