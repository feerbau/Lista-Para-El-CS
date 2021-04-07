require('dotenv').config() // Import .env variables

const { Telegraf } = require('telegraf')
const { BotChatSession } = require('./model/BotChatSession.js')

const URL = process.env.URL 
const PORT = process.env.PORT
const API_TOKEN = process.env.API_TOKEN
const bot_listas = new Telegraf(API_TOKEN)

let bot

bot_listas.start((ctx) => {
    ctx.reply('PASAME TU LISTITA PA');
    bot = new BotChatSession(ctx.chat.id)
})

bot_listas.command('toy', (ctx) => {
    let feedback = bot.addUser(ctx.from.first_name,ctx)
    bot.printAll()
    return ctx.reply(feedback)
})

bot_listas.command('limpiar', (ctx) =>{
    let feedback = bot.cleanSession()
    ctx.reply(feedback)
})

bot_listas.command('salir', (ctx) => {
    let feedback = bot.removeUser(ctx.from.first_name)
    ctx.reply(feedback)
})

bot_listas.command(['lista','listita'], (ctx)=>{
    let usersList = bot.printAll(ctx)
    ctx.reply(usersList)
})

bot_listas.command(['ayuda','help','comandos'],(ctx)=>{
    let ayuda = '- Comandos - \n'+
    '/start - Inicia el Bot \n' + 
    '/toy - Entras en la lista \n'+ 
    '/salir - Salis de la lista \n'+
    '/lista - Muestra la lista \n' +
    '/limpiar - Limpia la lista \n'+
    '/hora [string]- Devuelve/establece un horario \n'+
    '/ayuda - Ayuda para uso del bot'
    return ctx.reply(ayuda)
})

bot_listas.command('hora',(ctx)=>{
    let horaJuego = ctx.message.text.split(" ")[1] // At first position is located hour parameter
    bot.timePlay(horaJuego,ctx)

})

bot_listas.hears(['cs','csgo'],ctx =>{
    ctx.reply('AAAAH PICARON, nombraste la palabra mágica. Sale ese?')
})

bot_listas.launch({
     webhook: {
        domain: `${URL}+/bot${API_TOKEN}`,
        port: PORT
      } 
})

/*
function validarHora(hora){
    //eslint-disable-next-line 
    return /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(hora)
}

function exists_group(id){
    if (!listas[id]){
        // If a group doesn´t exist, creates an empty one.
        create_lists(id)
    }
}

function add_to_list(ctx,name, list){
    if (list["activos"].length >= 5){
        printAll(ctx)
        listas[ctx.chat.id]["suplentes"].push(name)
        return ctx.reply('Ya esta llena la lista, dormiste. Entras como suplente')
    }
    list["activos"].push(name)
    return ctx.reply('Adentro ' + ctx.from.first_name)
}

function getFirstSustitute(chatId){
    return listas[chatId]["suplentes"].shift()
}

function list(lista){
    let nuevaLista = ""
    lista.map((u,i) => nuevaLista += `${++i}. ${u} \n`)
    return nuevaLista
}

function get_start_time(ctx){
    let hora = ctx.message.text.split(' ')[1]
    if (hora != undefined){
        listas[ctx.chat.id]["hora_activos"] = hora
    }
    if (listas[ctx.chat.id]["hora_activos"] == ''){
        return `No hay hora.`
    }
    return `Se juega a las ${listas[ctx.chat.id]["hora_activos"]}`
}

function printList(ctx,typeOfPlayer){
    exists_group(ctx.chat.id);
    return list(listas[ctx.chat.id][typeOfPlayer])
}

function printAll(ctx){
    exists_group(ctx.chat.id)
    if (listas[ctx.chat.id]["activos"].length == 0){
        return ctx.reply("No hay nadie")
    }
    
    let listado = `${get_start_time(ctx)} \n`
    listado += "Listado activos: \n"
    listado += `${printList(ctx,"activos")} \n`
    if (listas[ctx.chat.id]["suplentes"].length > 0){
        listado += "Listado suplentes: \n"
        listado += `${printList(ctx,"suplentes")} \n`
    }
    return ctx.reply(listado)
}

function create_lists(id){
    listas[id] = {}
    listas[id]["activos"] = []
    listas[id]["hora_activos"] = ''
    listas[id]["suplentes"] = []
}

/*
function diffMinutes(dt2, dt1){
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}
  
async function sleep(ctx, time){
    return new Promise(resolve => setTimeout(resolve, time * 60000));
}

function getTimeToPlay(ctx){
    let horarioSplitteado = listas[ctx.chat.id]["hora_activos"].split(":")
    let horaJuego = parseInt(horarioSplitteado[0]) 
    let minutosJuego = parseInt(horarioSplitteado[1]) 
    let fechaJuego = new Date()
    fechaJuego.setHours(horaJuego)
    fechaJuego.setMinutes(minutosJuego)
    fechaJuego.setSeconds(0)
    return fechaJuego
}

function obtenerHoraEspera(fechaJuego){
    // Devuelve la fecha con 5 minutos menos 
    const minutosAntes = 5
    return new Date( fechaJuego - minutosAntes * 60000 );    
}

async function alert5MinutesBeforeStart(ctx){
    let fechaJuego = getTimeToPlay(ctx)
    let horaAEsperar = obtenerHoraEspera(fechaJuego)
    let minutosEspera = diffMinutes(horaAEsperar, new Date())
    await sleep(ctx, minutosEspera)
    return ctx.reply(`En ${diffMinutes(fechaJuego, new Date())} arranca la partida. Vayan activando perris`)
}
*/
