const fse = require('fs-extra')


const copyFrom = './sampleCopy'
const copyTo = './copyHere'

async function copyFiles (from,to) {
    try {
      await fse.copy(from, to)
      console.log('success!')
    } catch (err) {
      console.error(err)
    }
  }
  
  copyFiles(copyFrom,copyTo)
