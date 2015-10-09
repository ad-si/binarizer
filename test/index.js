import path from 'path'
import fsp from 'fs-promise'

import tape from 'tape'
import binarizer from '../source/index.js'


tape('It binarizes an image with otsu\'s method', (test) => {
	let inputFilePath = path
		.resolve(__dirname, '../node_modules/ij-test/img/cat.jpg')
	let outputFilePath = path.resolve(__dirname, './cat-bw.png')

	binarizer
		.setInputPath(inputFilePath)
		.setOutputPath(outputFilePath)
		.binarize(console.error)
		.then(() => fsp.stat(outputFilePath))
		.then(stat => test.true(stat, 'Binary image was created'))
		.then(() => fsp.unlink(outputFilePath))
		.then(test.end)
})


tape('It binarizes an image in-place', (test) => {

	let inputFilePath = path
		.resolve(__dirname, '../node_modules/ij-test/img/cat.jpg')
	let clonedInputFilePath = path.resolve(__dirname, './cat.jpg')
	let outputFilePath = path.resolve(__dirname, './cat-bw.png')

	fsp
		.readFile(inputFilePath)
		.then(fileBuffer => fsp.writeFile(clonedInputFilePath, fileBuffer))
		.then(() => {
			return binarizer
				.setInputPath(clonedInputFilePath)
				.binarize(console.error)
		})
		.then(() => fsp.stat(outputFilePath))
		.then(stat => test.true(stat, 'Binary image was created'))
		.then(() => fsp.unlink(outputFilePath))
		.then(() => fsp.unlink(clonedInputFilePath))
		.then(test.end)
})
