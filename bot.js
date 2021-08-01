

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
    let player = ctx.from.username ? ctx.from.username : ctx.from.first_name
    let feedback = bot.addUser(player,ctx)
    //bot.printAll()
    return ctx.reply(feedback)
})

bot_listas.command('soySuplente', (ctx) => {
    let player = ctx.from.username ? ctx.from.username : ctx.from.first_name
    let feedback = bot.addSustitute(player,ctx)
    //bot.printAll()
    return ctx.reply(feedback)
})

bot_listas.command('agregar', (ctx) => {
    let aditionalPlayer = ctx.message.text.split(" ")[1] // At first position is located hour parameter
    if (aditionalPlayer != undefined){
        let player = (aditionalPlayer.split("@")[1])
         if(player.trim() == ""){
            return ctx.reply("Capo, no pongas @ y despues vacio")   
        }
        return ctx.reply(bot.addUser(player,ctx))
    }
    //Si estas aca te mandaron '/agregar ', es decir, con un vacio.
    return ctx.reply("Emmm... pero deci a quien queres agregar pá")
})

bot_listas.command('sacar', (ctx) => {
    let deletedPlayer = ctx.message.text.split("@")[1] // At first position is located hour parameter
    if (deletedPlayer != undefined){
        let feedback = bot.removeUser(deletedPlayer)
        return ctx.reply(feedback)
    }
    //Si estas aca te mandaron '/agregar ', es decir, con un vacio.
    return ctx.reply("Emmm... pero deci a quien queres sacar pá")
})


bot_listas.command('limpiar', (ctx) =>{
    let feedback = bot.cleanSession()
    ctx.reply(feedback)
})

bot_listas.command('salir', (ctx) => {
    let feedback = bot.removeUser(ctx.from.username)
    ctx.reply(feedback)
})

bot_listas.command(['lista','listita'], (ctx)=>{
    let usersList = bot.printAll()
    ctx.reply(usersList)

})

bot_listas.command(['ayuda','help','comandos'],(ctx)=>{
    let ayuda = '- Comandos - \n'+
    '/start - Inicia el Bot \n' + 
    '/toy - Entras en la lista \n'+ 
    '/salir - Salis de la lista \n'+
    '/agregar [@user] - Agregar a un usuario de la lista\n'+
    '/sacar [@user] - Sacar a un usuario de la lista\n'+
    '/lista - Muestra la lista \n' +
    '/limpiar - Limpia la lista \n'+
    '/hora [string]- Devuelve/establece un horario \n'+
    '/ayuda - Ayuda para uso del bot'
    return ctx.reply(ayuda)
})

bot_listas.command('hora',(ctx)=>{
    let horaJuego = ctx.message.text.split(" ")[1] // At first position is located hour parameter
    if(horaJuego === undefined){
        let horaAJugar = bot.getStartTime()
        if (horaAJugar === "ya") {
            return ctx.reply("Se juega yaaa papa dale entra (igual fijate si ya arrancaron estos giles)")
        }
        return ctx.reply(horaAJugar ? `Se juega a las ${horaAJugar}` : "No hay hora seteada")
    }
    bot.timePlay(horaJuego,ctx)
})

bot_listas.hears(['cs','csgo'], (ctx) =>{
    return ctx.reply('AAAAH PICARON, nombraste la palabra mágica. Sale ese?')
})

bot_listas.launch({
     webhook: {
        domain: `${URL}+/bot${API_TOKEN}`,
        port: PORT
      } 
})
