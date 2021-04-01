const {Telegraf} = require('telegraf')
// const express = require('express');
// const expressApp = express();

const bot_listas = new Telegraf('1752245041:AAGTaDOnPG5ndTYAUnQISoSxJAPQ0aRNfkc')

const API_TOKEN = process.env.API_TOKEN || '1752245041:AAGTaDOnPG5ndTYAUnQISoSxJAPQ0aRNfkc';
const PORT = process.env.PORT || 5000;
const URL = process.env.URL || 'https://bot-csgo-lists.herokuapp.com/';

// bot_listas.telegram.setWebhook(`${URL}/bot${API_TOKEN}`)
// expressApp.use(bot.webhookCallback(`/bot${API_TOKEN}`));

var listas = {};

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
/*         return `Sale ese a las ${listas[ctx.chat.id]["hora_activos"]}` */
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

async function sleep(time){
    return new Promise(resolve => {
        const interval = setInterval(() => {
        	resolve('foo')
        	clearInterval(interval)
        }, time * 60000)
    })
}

async function p(){
  await sleep(1);  console.log("termine")
}

function getTimeToPlay(hora){
        let horarioSplitteado = hora.split(":")
        // 19:55
        let horaJuego = parseInt(horarioSplitteado[0]) // 19
        let minutosJuego = parseInt(horarioSplitteado[1]) /// 55
        let fechaJuego = new Date()
        fechaJuego.setHours(horaJuego)
        fechaJuego.setMinutes(minutosJuego)
        fechaJuego.setSeconds(0)
        return fechaJuego
}

function obtenerHoraEspera(fechaJuego){
    const minutosAntes = 5
    // Asumo que siempre entre la hora actual y de juego va a haber 5 mins o mas de diferencia
    return new Date( fechaJuego - minutosAntes * 1000 * 60 ); // Devuelve la fecha con 5 minutos menos    
}

async function alert5MinutesBeforeStart(hora){

    const fechaJuego = getTimeToPlay(hora)
    const horaAEsperar = obtenerHoraEspera(fechaJuego)
    const minutosEspera = diffMinutes(horaAEsperar, new Date())
    await sleep(minutosEspera)
    return console.log(`En ${diffMinutes(fechaJuego, new Date())} arranca`)
}
*/


function diffMinutes(dt2, dt1){
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}
  
async function sleep(time){
    return new Promise(resolve => {
        const interval = setInterval(() => {
            resolve('foo')
            clearInterval(interval)
        }, time * 60000)
    })
}

function getTimeToPlay(id){
    let horarioSplitteado = listas[id]["hora_activos"].split(":")
    let horaJuego = parseInt(horarioSplitteado[0]) 
    let minutosJuego = parseInt(horarioSplitteado[1]) 
    let fechaJuego = new Date()
    fechaJuego.setHours(horaJuego)
    fechaJuego.setMinutes(minutosJuego)
    fechaJuego.setSeconds(0)
    return fechaJuego
}

async function alert5MinutesBeforeStart(ctx){
    function obtenerHoraEspera(fechaJuego){
        // Devuelve la fecha con 5 minutos menos 
        const minutosAntes = 5
        return new Date( fechaJuego - minutosAntes * 60000 );    
    }
    let fechaJuego = getTimeToPlay(ctx.chat.id)
    let horaAEsperar = obtenerHoraEspera(fechaJuego)
    let minutosEspera = diffMinutes(horaAEsperar, new Date())
    await sleep(minutosEspera)
    return ctx.reply(`En ${diffMinutes(fechaJuego, new Date())} arranca`)
}

bot_listas.start((ctx) => {
    ctx.reply('PASAME TU LISTITA PA');
    exists_group(ctx.chat.id)
})

bot_listas.command('toy', (ctx) => {
    exists_group(ctx.chat.id)
    if (!listas[ctx.chat.id]["activos"].includes(ctx.from.first_name)){    
        add_to_list(ctx,ctx.from.first_name,listas[ctx.chat.id])
        return
    }
    return ctx.reply('Ya estas en la lista pa.')
})

bot_listas.command('limpiar', (ctx) =>{
    create_lists(ctx.chat.id)
    ctx.reply('Limpiada padre!')
})

bot_listas.command('salir', (ctx) => {
    exists_group(ctx.chat.id)
    let index = listas[ctx.chat.id]["activos"].indexOf(ctx.from.first_name)
    if (index > -1) {
        // checks user existence in active list, then removes him.
        listas[ctx.chat.id]["activos"].splice(index, 1);
        if (listas[ctx.chat.id]["suplentes"].length > 0){
            // Add the first substitute to the active players list
            listas[ctx.chat.id]["activos"].push(getFirstSustitute(ctx.chat.id))
        }
        return ctx.reply('Sos tremendo gil, chau.');
    }
    // User is not in any list
    return ctx.reply('De donde queres salir vos, banana.');  
})

bot_listas.command(['lista','listita'], (ctx)=>{
   printAll(ctx)
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
    ctx.reply(get_start_time(ctx))
    alert5MinutesBeforeStart(ctx)
})

bot_listas.hears(['cs','csgo'],ctx =>{
    ctx.reply('AAAAH PICARON, nombraste la palabra mágica. Sale ese?')
})


// expressApp.get('/', (req, res) => {
//     res.send('Hello World!');
//   });
//   expressApp.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });

bot_listas.launch({
    webhook: {
        domain: `${URL}+/bot${API_TOKEN}`,
        port: PORT
      }
})