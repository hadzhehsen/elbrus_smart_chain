const { MODE } = require('./blendMode');

const description = 'This is the description of your NFT project, remember to replace this';
const baseUri = 'https://elbrussmartchain/nft';

const layerConfigurations = [
  {
    growEditionSizeTo: 10,
    layersOrder: [
      { name: 'layer1' },
      { name: 'layer2' },
      { name: 'layer3' },
      { name: 'layer4' },
      { name: 'layer5' },
      { name: 'layer6' },
      // { name: 'layer7' },
      // { name: 'layer8' },
      // { name: 'layer9' },
    ],
  },
];

const format = {
  width: 1000,
  height: 1000,
};

const background = {
  generate: true,
  brightness: '80%',
};

const rarityDelimiter = '#';

const uniqueDnaTorrance = 10000;

module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
};
