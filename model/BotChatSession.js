const helpers = require("../helpers/helpers.js");

class BotChatSession {
    constructor(idSession){
        this.listaSesiones = {}
        this.idSession = idSession
        this.nachoWasInTheList= false
        this._initialize()
    }

    _initialize(){
        this.listaSesiones[this.idSession] = {}
        this.listaSesiones[this.idSession]["activos"] = []
        this.listaSesiones[this.idSession]["suplentes"] = []
        this.listaSesiones[this.idSession]["hora_activos"] = undefined
    }

    setStartTime(hora){
        if(helpers.validateHour(hora)){
            this.listaSesiones[this.idSession]["hora_activos"] = hora
            return hora
        }
        else{
            if (hora === "ya"){
                this.listaSesiones[this.idSession]["hora_activos"] = hora
                return hora
            }
            else {
                return null
            }
        }
    }

    getStartTime(){
        return this.listaSesiones[this.idSession]["hora_activos"]
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
    
    printAll(){
        /* 
            Print all the list of all types of players 
        */
        if ((this.listaSesiones[this.idSession]["activos"].length == 0) && (this.listaSesiones[this.idSession]["suplentes"].length == 0)){
            return "No hay nadie"
        }
        let listado = (this.getStartTime() === undefined ? "No hay hora \n" : `${this.getStartTime()} \n`)
        listado += "Listado activos: \n"
        listado += `${this._printList("activos")} \n`
        if (this.listaSesiones[this.idSession]["suplentes"].length > 0){
            listado += "Listado suplentes: \n"
            listado += `${this._printList("suplentes")} \n`
        }
        return listado
    }

    cleanSession(){
        this._initialize()
        return "Limpiada padre!"
    }

    checkNachoOrFer(userName){
        if (((this.listaSesiones[this.idSession]["activos"].includes("feerbau")) && (userName == "nachoborrelli")) ||
            ((this.listaSesiones[this.idSession]["activos"].includes("nachoborrelli")) && (userName == "feerbau"))){
                this.nachoWasInTheList= true
                this.removeUser("nachoborrelli")
                return "Notificaci??n: a pedido de Nacho, si Fermin juega, ??l automaticamente cede su lugar... "
        }
        
    }

    addUser(userName) {
        /* 
            Add a user to play. If a list is full, push him into sustitutes list
        */
       if (userName === undefined){
           return 'Hubo un error al querer agregar a la lista, parece que el nombre de usuario que llego no est?? definido. Fijate usando el "@" '
       }
        if (!this.listaSesiones[this.idSession]["activos"].includes(userName)){
            
            if (this.listaSesiones[this.idSession]["suplentes"].includes(userName)){
                this.listaSesiones[this.idSession]["suplentes"].shift()
            }  
            
            if (this.listaSesiones[this.idSession]["activos"].length >= 5){
                this.listaSesiones[this.idSession]["suplentes"].push(userName)
                return "Ya esta llena la lista, dormiste. Entras como suplente"
            }

            this.listaSesiones[this.idSession]["activos"].push(userName)
            let msgNF= this.checkNachoOrFer(userName)
            return msgNF? msgNF: `Adentro ${userName}`   
        }
        return "Ya estas en la lista pa."
    }

    addSustitute(userName) {
        /* 
            Add a user as a sustitute.
        */
       if (userName === undefined){
           return 'Hubo un error al querer agregar a la lista, parece que el nombre de usuario que llego no est?? definido. Fijate usando el "@" '
       }
        if (!this.listaSesiones[this.idSession]["suplentes"].includes(userName)){   
            if (this.listaSesiones[this.idSession]["activos"].includes(userName)){
                this.listaSesiones[this.idSession]["activos"].shift()
            }
            this.listaSesiones[this.idSession]["suplentes"].push(userName)
            return `Adentro ${userName} como suplente`            
        }
        return "Ya estas en la lista pa."
    }

    _getFirstSustitute(){
        return this.listaSesiones[this.idSession]["suplentes"].shift()
    }

    addNachoByFer(userName){
        if ((userName == "feerbau")&&(this.nachoWasInTheList)){
            this.addUser("nachoborrelli")
            return `Se fue fer? uh, entonces si entras @nachoborrelli !`
        }
    }

    removeUser(userName){
        /*
            Remove a user of actives players list. If are sustitutes, push the first into the actives
        */
         let index = this.listaSesiones[this.idSession]["activos"].indexOf(userName)
        if (index > -1) {
            // checks user existence in active list, then removes him.
            this.listaSesiones[this.idSession]["activos"].splice(index, 1);
            let msgNF = this.addNachoByFer(userName)
            if (this.listaSesiones[this.idSession]["suplentes"].length > 0){
                // Add the first substitute to the active players list and notify him
                var sustitute = this._getFirstSustitute(this.idSession)
                this.listaSesiones[this.idSession]["activos"].push(sustitute)
                return `Bue que gil, safas porque hay suplente nom??s. @${sustitute} mira que entraste en la lista...`
            }
            else{
                return msgNF? msgNF: "Sos tremendo gil, chau."
            }
            
        }
        // User is not in any list
        return "De donde queres salir vos, banana."
    }

    timePlay(hora,ctx){
        /*
            Set the start time to play and start a promise that alert 5 minutes before game the start of it. 
        */
        
        if(hora && this.setStartTime(hora) === null){
            return ctx.reply("El formato de hora debe ser HH:MM capo, qu?? flasheas? O en su defecto pone un 'ya' ")
        }
        let horaJuego = this.getStartTime();

        if (horaJuego)
            helpers.alert5MinutesBeforeStart(this,ctx)
            
        //ctx.reply(horaJuego ? `Se juega a las ${horaJuego}` : 'No hay hora seteada');
        // Aca ya me asegure que la hora no es undefined y que el formato es valido
        
    }
}

module.exports = {
    BotChatSession: BotChatSession
}
