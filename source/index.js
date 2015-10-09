import gm from 'gm'
import cv from 'opencv'


export default class {

	static binarize (callback) {

		cv.readImage(this.inputPath, (error, image) => {
			if (error) {
				if (typeof callback === 'function')
					callback(error)
				return
			}

			if (image.width() < 1 || image.height() < 1)
				callback(new Error('Image has no size'))

			image.convertGrayscale()
			let binarizedImage = image.threshold(0, 255, 'Binary', 'Otsu')
			binarizedImage.save(this.outputPath)

			if (typeof callback === 'function')
				callback()
		})
	}


	static setInputPath (path) {

		if (typeof path !== 'string')
			throw TypeError()

		this.inputPath = path
		this.outputPath = this.outputPath || path.replace(
			/^(.*)\.(jpg|png)$/i,
			'$1-bw.png'
		)
		return this
	}

	static setOutputPath (path) {

		if (typeof path !== 'string' && typeof path !== 'undefined')
			throw TypeError(typeof path + ' instead of "string"')

		this.outputPath = path || this.outputPath
		return this
	}
}
