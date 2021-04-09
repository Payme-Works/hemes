const dotenv = require('dotenv')
const path = require('path')

const envFileName = '.env.local'

dotenv.config({
  path: path.resolve(__dirname, envFileName),
})
