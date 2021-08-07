const helpers = require("../helpers/helpers.js");
const db = require("../model/FirebaseRepository.js");


class BotChatFBase {
    constructor(idSession){
    }

    async setStartTime(hora){
        if(helpers.validateHour(hora) || hora === "ya"){
            await db.setTime(hora)
            return hora
        }
        return null   
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

    _printListV2(listPlayes){
        let nuevaLista = ""
        listPlayes.map((userName,idUser) => nuevaLista += `${++idUser}. ${userName} \n`)
        return nuevaLista
    }
    
    async printAll(){
        if((await db.getHeadlines().length === 0) && (await db.getSustitutes().length === 0)){
            return "No hay nadie"
        }
        let timePlay = await this.getStartTime() 
        let listado = (timePlay === undefined ? "No hay hora \n" : `${timePlay} \n`)
        listado += "Listado activos: \n"
        listado += `${this._printListV2(await db.getHeadlines())} \n`
        let sustitutesList = await db.getSustitutes()
        if (sustitutesList.length > 0){
            listado += "Listado suplentes: \n"
            listado += `${this._printListV2(sustitutesList)} \n`          
        }
        return listado
    }

    cleanFirebase(){
        //TODO limpiar la coleccion Sustitutes, Headlines, Time
        db.cleanFirebase()
        return "Limpiada padre!"
    }

    async addUser(userName) {
        /* 
            Add a user to play. If a list is full, push him into sustitutes list
        */
        if(await db.getHeadlines().length < 5){
            // Si estaba de suplente, lo sacamos de suplente y va como activo
            if(await db.getSustitutes().includes(userName)){
                await db.removeSustitute(userName)
                await db.addHeadline(userName)
                return `Adentro como titular ${userName}`   
            }
            // Si no era suplente, va de una como titular
            await db.addHeadline(userName)
            return `Adentro ${userName}`   
        }

        // Si esta llena, y no es sustituto,lo agregamos
        if(await db.getSustitutes().includes(userName)){
            return "Ya estas de sustituto manija"
        }
        await db.addSustitute(userName)
        return `Adentro ${userName} como sustituto`   
        /*
        if (!await db.getHeadlines().includes(userName)){
            let sustitutes = await db.getSustitutes()
            if (sustitutes.includes(userName)){
                let firstSustitute = sustitutes[0] 
                await db.removeSustitute(firstSustitute)
            }    
            if (await db.getHeadlines().length >= 5){
                await db.addSustitutes(userName)
                return "Ya esta llena la lista, dormiste. Entras como suplente"
            }
            await db.addHeadlines(userName)
            return `Adentro ${userName}`            
        }
        return "Ya estas en la lista pa."
        */
    }

    async addSustitute(userName) {
        /* 
            Add a user as a sustitute.
        */
       if (userName === undefined){
           return 'Hubo un error al querer agregar a la lista, parece que el nombre de usuario que llego no está definido. Fijate usando el "@" '
       }
        if (!await db.getSustitutes().includes(userName)){   
            if (await db.getHeadlines().includes(userName)){
                await db.removeHeadline(userName)
            }
            return await db.addHeadline(userName)            
        }
        return "Ya estas en la lista pa."
    }

    async removeUser(userName){
        /*
            Remove a user of actives players list. If are sustitutes, push the first into the actives
        */
        if (await db.getHeadlines.includes(userName)){
            //checks user existence in active list, then removes him.
            await db.removeHeadline(userName)
            if (await db.getSustitutes.length > 0){
                // Add the first substitute to the active players list and notify him
                let firstSustitute = sustitutes[0]
                await db.removeSustitute(firstSustitute)
                await db.addHeadline(firstSustitute)
                return `Bue que gil, safas porque hay suplente nomás. @${sustitute} mira que entraste en la lista...`
            }
            else{
                return "Sos tremendo gil, chau."
            }
        }
        else if(await db.getSustitutes.includes(userName)) {
            await db.removeSustitute(userName)
            return "Bue flaco, bancate ser suplente... ok dale andate... gil"
        }
        
        // User is not in any list
        return "De donde queres salir vos, banana."
    }

    async timePlay(hora,ctx){
        /*
            Set the start time to play and start a promise that alert 5 minutes before game the start of it. 
        */
        
        if(hora && this.setStartTime(hora) === null){
            return ctx.reply("El formato de hora debe ser HH:MM capo, qué flasheas? O en su defecto pone un 'ya' ")
        }
        await db.setTime(hora);

        if (horaJuego)
            helpers.alert5MinutesBeforeStart(this,ctx)
            
        //ctx.reply(horaJuego ? `Se juega a las ${horaJuego}` : 'No hay hora seteada');
        // Aca ya me asegure que la hora no es undefined y que el formato es valido
        
    }
}

module.exports = {
    BotChatSession: BotChatSession
}
