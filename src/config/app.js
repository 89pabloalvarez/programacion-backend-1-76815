import express from 'express'
import { loggerRequest, loggerResponse } from '../middlewares/logger.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(loggerRequest)
app.use(loggerResponse)

export default app