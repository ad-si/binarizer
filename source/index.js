import gm from 'gm'
import cv from 'opencv'


export default class {

	static binarize (callback) {
		cv.readImage(this.inputPath, (error, image) => {
			if (error) {
				callback(error)
				return
			}

			if (image.width() < 1 || image.height() < 1)
				callback(new Error('Image has no size'))

			image.convertGrayscale()
			let binarizedImage = image.threshold(
				0, 255, 'Binary', 'Otsu', 'asdf'
			)
			binarizedImage.save(this.outputPath)
			callback()
		})
	}


	static inputPath (path) {
		if (path) {
			this.inputPath = path
			this.grayscalePath = path.replace(/^(.*)\.(jpg|png)$/i, '$1-gray.$2')
			this.outputPath = this.outputPath || path
				.replace(/^(.*)\.(jpg|png)$/i, '$1-bw.$2')
			return this
		}
		else {
			return this.inputPath
		}
	}

	static outputPath (path) {
		if (path) {
			this.outputPath = path
			return this
		}
		else
			return this.outputPath
	}
}
