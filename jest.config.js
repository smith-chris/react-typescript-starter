const path = require('path')
const { resolve } = require('./config/webpack.common.js')

const SRC = path.resolve('src')
const CONFIG = path.resolve('config')

module.exports = {
  moduleDirectories: resolve.modules,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: `(${SRC}/.*(\\.|/)(test|spec))\\.(jsx?|tsx?)$`,
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `${CONFIG}/mock.js`,
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
}
