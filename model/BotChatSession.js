import {validateHour,alert5MinutesBeforeStart} from '../helpers/helpers.js'

class BotChatSession {
    constructor(idSession){
        this.listaSesiones = {}
        this.idSession = idSession
        this._initialize()
    }

    _initialize(){
        this.listaSesiones[this.idSession] = {}
        this.listaSesiones[this.idSession]["activos"] = []
        this.listaSesiones[this.idSession]["suplentes"] = []
        this.listaSesiones[this.idSession]["hora_activos"] = undefined
    }

    setStartTime(hora){
        if (hora === undefined){
            return undefined
        }
        if(!validateHour(hora)) return null
        this.listaSesiones[this.idSession]["hora_activos"] = hora
        return hora
    }

    getStartTime(){
        return this.listaSesiones[idSession]["hora_activos"]
    }

    _printList(typeOfPlayer){
        /* 
            Print type of player list 
        */
        function list(lista){
            let nuevaLista = ""
            lista.map((userName,idUser) => nuevaLista += `${++idUser}. ${userName} \n`)
            return nuevaLista
        }
        return list(this.listaSesiones[this.idSession][typeOfPlayer])
    }
    
    printAll(ctx){
        /* 
            Print all the list of all types of players 
        */
        if (this.listaSesiones[this.idSession]["activos"].length == 0){
            return "No hay nadie"
        }
        let listado = `${this.getStartTime(ctx)} \n`
        listado += "Listado activos: \n"
        listado += `${printList(ctx,"activos")} \n`
        if (this.listaSesiones[this.idSession]["suplentes"].length > 0){
            listado += "Listado suplentes: \n"
            listado += `${printList(ctx,"suplentes")} \n`
        }
        return listado
    }

    cleanSession(idSession){
        this._initialize()
        return "Limpiada padre!"
    }

    addUser(userName,ctx) {
        /* 
            Add a user to play. If a list is full, push him into sustitutes list
        */
        if (!this.listaSesiones[this.idSession]["activos"].includes(userName)){    
            if (this.listaSesiones[this.idSession]["activos"].length >= 5){
                this.printAll(ctx)
                this.listaSesiones[this.idSession]["suplentes"].push(userName)
                return "Ya esta llena la lista, dormiste. Entras como suplente"
            }
            this.listaSesiones[this.idSession]["activos"].push(userName)
            return `Adentro ${userName}`            
        }
        return "Ya estas en la lista pa."
    }

    _getFirstSustitute(){
        return this.listaSesiones[this.idSession]["suplentes"].shift()
    }

    removeUser(userName){
        /*
            Remove a user of actives players list. If are sustitutes, push the first into the actives
        */
         let index = this.listaSesiones[this.idSession]["activos"].indexOf(userName)
        if (index > -1) {
            // checks user existence in active list, then removes him.
            this.listaSesiones[this.idSession]["activos"].splice(index, 1);
            if (this.listaSesiones[this.idSession]["suplentes"].length > 0){
                // Add the first substitute to the active players list
                this.listaSesiones[this.idSession]["activos"].push(this._getFirstSustitute(this.idSession))
            }
            return "Sos tremendo gil, chau."
        }
        // User is not in any list
        return "De donde queres salir vos, banana."
    }

    timePlay(hora){
        /*
            Set the start time to play and start a promise that alert 5 minutes before game the start of it. 
        */
        if(this.setStartTime(hora) === null){
            return "El formato de hora debe ser HH:MM"
        }
        ctx.reply(`Se juega a las ${hora}`)
        // Aca ya me asegure que la hora no es undefined y que el formato es valido
        alert5MinutesBeforeStart(this)
    }
}

export default { BotChatSession }