const path = require('path')

const cv = require('opencv')
const fsp = require('fs-promise')

const imageRegex = /^(.*)\.(jpg|png)$/i


export default class {
  static convertAndSave (inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      cv.readImage(inputPath, (error, image) => {
        if (error) {
          return reject(error)
        }
        if (image.width() < 1 || image.height() < 1) {
          return reject(new Error('Image has no size'))
        }

        image.convertGrayscale()
        image
          .threshold(0, 255, 'Binary', 'Otsu')
          .save(outputPath)

        console.info(' ✔')

        resolve(outputPath)
      })
    })
  }


  static setInputPath (inputPath) {
    if (typeof inputPath !== 'string') {
      throw new TypeError(
        `Path must be of type "string" instead of ${typeof inputPath}`
      )
    }
    this.inputPath = inputPath
    this.outputPath = this.outputPath || inputPath.replace(
      imageRegex,
      '$1-bw.png'
    )
    return this
  }


  static setOutputPath (outputPath) {
    if (typeof outputPath !== 'string' && typeof outputPath !== 'undefined') {
      throw new TypeError(
        `Path must be of type "string" instead of ${typeof outputPath}`
      )
    }
    this.outputPath = outputPath || this.outputPath
    return this
  }


  static binarize () {

    function mapFileName (fileName) {
      const outputFileName = fileName.replace(imageRegex, '$1-bw.png')

      const inputFilePath = path.join(this.inputPath, fileName)
      const outputFilePath = path.join(this.inputPath, outputFileName)

      process.stdout.write(path.join(
        this.inputPath,
        '{' + fileName + ' -> ' + outputFileName + '}'
      ))

      return this.convertAndSave(inputFilePath, outputFilePath)
    }

    return fsp
      .stat(this.inputPath)
      .then(stats => {
        if (stats.isDirectory()) {
          return fsp.readdir(this.inputPath)
        }
        else {
          process.stdout.write(
            this.inputPath + ' -> ' + this.outputPath
          )
          return this.convertAndSave(this.inputPath, this.outputPath)
        }
      })
      .then(files => {
        if (Array.isArray(files)) {
          return Promise.all(files
            .filter(fileName => imageRegex.test(fileName))
            .map((fileName) => mapFileName.call(this, fileName))
          )
        }
      })
  }
}
