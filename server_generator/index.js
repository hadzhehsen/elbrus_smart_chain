/* eslint-disable no-console */
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const canvas = createCanvas(1000, 1000);
const ctx = canvas.getContext('2d'); // - our context to basically draw shit lol
const {
  layers,
  width,
  height,
} = require('./input/config');

const edition = 20;

const saveLayer = (_canvas, _edition) => {
  fs.writeFileSync(`./output/${_edition}.png`, _canvas.toBuffer('image/png'));
  console.log('Image created');
};

const drawLayer = async (_layer, _edition) => {
  const element = _layer.elements[Math.floor(Math.random() * _layer.elements.length)];
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
  console.log(`Created edition ${i}`);
}
