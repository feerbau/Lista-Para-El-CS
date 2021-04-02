import {validateHour,alert5MinutesBeforeStart} from '../helpers/helpers'

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
        let hora = hora.split(' ')[1] // At first position is located hour parameter
        if (hora != undefined){
            if(!validateHour(hora)) return false
            this.listaSesiones[idSession]["hora_activos"] = hora
            return true
        }
    }

    getStartTime(){
        return (this.listaSesiones[idSession]["hora_activos"] === undefined ) ? `No hay hora.` : `Se juega a las ${this.listaSesiones[idSession]["hora_activos"]}`
    }

    _printList(typeOfPlayer){
        function list(lista){
            let nuevaLista = ""
            lista.map((userName,idUser) => nuevaLista += `${++idUser}. ${userName} \n`)
            return nuevaLista
        }
        return list(this.listaSesiones[this.idSession][typeOfPlayer])
    }
    
    printAll(ctx){
        if (this.listaSesiones[this.idSession]["activos"].length == 0){
            return "No hay nadie"
        }
        let listado = `${this.getStartTime(ctx)} \n`
        listado += "Listado activos: \n"
        listado += `${printList(ctx,"activos")} \n`
        if (listas[ctx.chat.id]["suplentes"].length > 0){
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
        if (!this.listaSesiones[this.idSession]["activos"].includes(userName)){    
            if (this.listaSesiones[this.idSession]["activos"].length >= 5){
                this.printAll(ctx)
                this.listaSesiones[this.idSession]["suplentes"].push(name)
                return "Ya esta llena la lista, dormiste. Entras como suplente"
            }
            this.listaSesiones[this.idSession]["activos"].push(name)
            return `Adentro ${username}`            
        }
        return "Ya estas en la lista pa."
    }

    _getFirstSustitute(){
        return this.listaSesiones[this.idSession]["suplentes"].shift()
    }

    removeUser(userName){
        let index = this.listaSesiones[this.idSession]["activos"].indexOf(userName)
        if (index > -1) {
            // checks user existence in active list, then removes him.
            this.listaSesiones[this.idSession]["activos"].splice(index, 1);
            if (this.listaSesiones[this.idSession]["suplentes"].length > 0){
                // Add the first substitute to the active players list
                this.listaSesiones[this.idSession]["activos"].push(this.getFirstSustitute(this.idSession))
            }
            return "Sos tremendo gil, chau."
        }
        // User is not in any list
        return "De donde queres salir vos, banana."
    }

    timePlay(hora){
        if(!this.setStartTime(hora)){
            return "El formato de hora debe ser HH:MM"
        }
        ctx.reply(`Se juega a las ${hora}`)
        if (hora != undefined){
            alert5MinutesBeforeStart(bot)
        }
    }
}

export default {BotChatSession}