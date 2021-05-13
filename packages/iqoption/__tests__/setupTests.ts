import dotenv from 'dotenv'
import path from 'path'

jest.setTimeout(30000)

const envFileName = '.env.test.local'

dotenv.config({
  path: path.resolve(__dirname, '..', envFileName),
})
