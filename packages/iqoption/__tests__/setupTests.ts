import dotenv from 'dotenv'
import path from 'path'

const envFileName = '.env.test.local'

dotenv.config({
  path: path.resolve(__dirname, '..', envFileName),
})
