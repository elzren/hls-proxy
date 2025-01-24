import express, { Request, Response } from 'express';
import { proxy } from './proxy';

const app = express();
const port = 8080;

app.get('/', (req: Request, res: Response) => {
    res.send('hls-proxy');
});

app.get('/proxy', proxy);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app