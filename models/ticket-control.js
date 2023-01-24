import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import data from "../db/data.json" assert { type: "json" };

class Ticket {
    constructor(numero, escritorio){
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor(){
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        this.init();
    }

    //Getter que nos sirve para serializar la informacion a la hora de guardar en BD
    get toJson(){
        return{
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
        }
    }

    //Inicializar la clase
    init(){
        const {hoy, tickets, ultimo, ultimos4} = data;

        //Verificamos si el server se reinicio en el mismo dia o es un nuevo dia y reiniciamos los datos
        if (hoy === this.hoy){
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        }
        else{
            this.guardarDB();
        }
    }

    guardarDB(){
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    siguiente(){
        //Asignamos el siguiente ticket y lo agregamos a la cola de espera
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.guardarDB();
        
        return 'Ticket: ' + ticket.numero;
    }

    atenderTicket(escritorio){
        //Ya no hay tickets
        if (this.tickets.length === 0) {
            return null;
        }

        //Obtenemos la ficha que esta delante y la eliminamos de la cola
        const ticket = this.tickets.shift();
        
        ticket.escritorio = escritorio;

        //Agregamos el ticket al principio de la cola para desplegarla en pantalla
        this.ultimos4.unshift(ticket);
        if (this.ultimos4.length > 4 ) {
            //Borramos el quinto elemento de la cola en pantalla
            this.ultimos4.splice(-1, 1);
        }

        this.guardarDB();

        //Retornamos el ticket que el escritorio tiene que atender
        return ticket;
    }
}

export default TicketControl;