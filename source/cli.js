#! /usr/bin/env babel-node

const binarizer = require('..')

const inputFilePath = process.argv[2]
const outputFilePath = process.argv[3]


if (!inputFilePath) {
  console.info('Usage: binarize <path to input file> [path to output file]')
  process.exit(1)
}

binarizer
  .setInputPath(inputFilePath)
  .setOutputPath(outputFilePath)
  .binarize()
  .catch(error => {
    throw error
  })
