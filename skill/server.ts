
import express from 'express'
import * as Adapter from './adapter'

const app = express()

const PORT = 80;
const HOST = '0.0.0.0';

// スキルのリクエスト
app.post('/', Adapter.getAdapter().getRequestHandlers());

// Application Load Balancer の ヘルスチェックを受けるために HTTP GET をリッスンしておく
app.get('/', (req: express.Request, res: express.Response) => {
  console.log(req)
  res.send('health check OK');
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
