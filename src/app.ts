 
 
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import routeNotFound from './app/middlewares/routeNotFound'
import router from './app/routes'
const app: Application = express()

app.use(express.json())

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}))

app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello developer!')
})

// global error handler
app.use(globalErrorHandler)

// handle api route not found
app.use(routeNotFound)

export default app
