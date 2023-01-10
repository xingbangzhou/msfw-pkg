const path = require('path')

const rootPath = path.resolve('./')
const {name} = require(path.join(rootPath, 'package.json'))

module.exports = ({chain, mode, options}) => {
  const devPort = 5001
  chain.devServer.port(devPort)

  // chain.output.set('chunkFormat', 'array-push')

  chain.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        title: name,
      },
    }
    return args
  })
}
