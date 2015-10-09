#! /usr/bin/env babel-node

import binarizer from './index.js'

let inputFilePath = process.argv[2]
let outputFilePath = process.argv[3]


if (!inputFilePath) {
	console.log('Usage: binarize <path to input file> [path to output file]')
	process.exit(1)
}

binarizer
	.setInputPath(inputFilePath)
	.setOutputPath(outputFilePath)
	.binarize()
