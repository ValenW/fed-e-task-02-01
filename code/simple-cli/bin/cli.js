#!/usr/bin/env node

const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

const cwd = process.cwd();
const tmpPath = path.join(__dirname, '../templates')
let config = {
  name: 'default-project-name',
  distPath: 'dist'
}

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    default: path.basename(cwd),
    message: 'Project\'s name',
  }, {
    type: 'input',
    name: 'distPath',
    default: 'dist',
    message: 'path to place render result'
  }
]).then(inputs => {
  Object.assign(config, inputs)

  const distPath = path.join(cwd, config.distPath)
  render(tmpPath, distPath)
})

const render = (tmpPath, distPath) => {
  fs.readdir(tmpPath, (err, fileNames) => {
    if (err) throw err

    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath)
    }
    fileNames.forEach(fileName => {
      const fullTmpPath = path.join(tmpPath, fileName)
      const fullDistPath = path.join(distPath, fileName)
      fs.stat(fullTmpPath, (err, stats) => {
        if (err) throw err

        if (stats.isFile()) {
          ejs.renderFile(fullTmpPath, config, (err, result) => {
            if (err) throw err
            fs.writeFileSync(fullDistPath, result)
          })
        } else if (stats.isDirectory()) {
          render(fullTmpPath, fullDistPath)
        }
      })
    })
  })
}
