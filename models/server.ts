import express, { Application } from 'express';
import cors from 'cors';

class Server {

    private app: Application;
    private port: string;
    private apiPaths = { polygon: '/api/polygon' }

    constructor() {
        this.app = express()
        this.port = process.env.PORT || '7777'
        this.middlewares();
        this.routes()
    }

    middlewares() {
        this.app.use(cors())
        this.app.use(express.json())
    }

    routes() {
        
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        })
    }
}

export default Server;