import path from 'path'

import gm from 'gm'
import cv from 'opencv'
import fsp from 'fs-promise'

let imageRegex = /^(.*)\.(jpg|png)$/i


export default class {

	static convertAndSave (inputPath, outputPath) {

		return new Promise((resolve, reject) => {

			cv.readImage(inputPath, (error, image) => {
				if (error)
					return reject(error)

				if (image.width() < 1 || image.height() < 1)
					return reject(new Error('Image has no size'))

				image.convertGrayscale()
				image
					.threshold(0, 255, 'Binary', 'Otsu')
					.save(outputPath)

				console.log(' ✔')

				resolve(outputPath)
			})
		})
	}


	static setInputPath (path) {

		if (typeof path !== 'string')
			throw new TypeError(
				`Path must be of type "string" instead of ${typeof path}`
			)

		this.inputPath = path
		this.outputPath = this.outputPath || path.replace(
			imageRegex,
			'$1-bw.png'
		)
		return this
	}


	static setOutputPath (path) {

		if (typeof path !== 'string' && typeof path !== 'undefined')
			throw new TypeError(
				`Path must be of type "string" instead of ${typeof path}`
			)

		this.outputPath = path || this.outputPath
		return this
	}


	static binarize () {

		function mapFileName (fileName) {
			let outputFileName = fileName.replace(imageRegex, '$1-bw.png')

			let inputFilePath = path.join(this.inputPath, fileName)
			let outputFilePath = path.join(this.inputPath, outputFileName)

			process.stdout.write(path.join(
				this.inputPath,
				'{' + fileName + ' -> ' + outputFileName + '}'
			))

			return this.convertAndSave(inputFilePath, outputFilePath)
		}

		return fsp
			.stat(this.inputPath)
			.then(stats => {
				if (stats.isDirectory())
					return fsp.readdir(this.inputPath)
				else {
					process.stdout.write(
						this.inputPath + ' -> ' + this.outputPath
					)
					return this.convertAndSave(this.inputPath, this.outputPath)
				}
			})
			.then(files => {
				if (Array.isArray(files))
					return Promise.all(files
						.filter(fileName => imageRegex.test(fileName))
						.map((fileName) => mapFileName.call(this, fileName))
					)
			})
	}
}
