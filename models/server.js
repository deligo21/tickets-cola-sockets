import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socketController } from '../sockets/controller.js';


class Servidor{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app); //Instacia del server
        this.io = new Server(this.server); // Almacena toda la informacion de los sockets conectados
        this.paths = {
        
        }

        //Middlewares: funciones que anaden otras funcionalidades al webserver
        this.middlewares();

        //Rutas de la aplicacion
        this.routes();

        //Configuracion de sockets
        this.sockets();
    }

    middlewares(){
        //CORS
        this.app.use( cors() );

        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes(){
        // this.app.use(this.paths.auth, auth);

    }

    sockets(){
        this.io.on('connection', socketController);
    }

    listen(){
        this.server.listen(this.port, ()=>{
            console.log('Servidor corriendo en el puerto ', this.port);
        });

        this.app.use((err,req,res,next)=>{
            if(!err)return next();
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Peticion no valida',
                    err: 'BAD_REQUEST'
                }
            });
        });
    }
}

export default Servidor;