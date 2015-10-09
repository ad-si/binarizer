import path from 'path'
import binarizer from '../source/index.js'


let inputFilePath = path
	.resolve(__dirname, '../node_modules/ij-test/img/cat.jpg')
let outputFilePath = path.resolve(__dirname, './cat-bw.jpg')

binarizer
	.setInputPath(inputFilePath)
	.setOutputPath(outputFilePath)
	.binarize(console.error)
