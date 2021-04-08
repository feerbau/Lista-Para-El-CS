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
    ctx.reply("Fuera de seerivicio. Porfavor, intente mas tarde. Bue flasheaba contestadora")
})

bot_listas.command('salir', (ctx) => {
    let feedback = bot.removeUser(ctx.from.first_name)
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
