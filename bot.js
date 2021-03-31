const {Telegraf} = require('telegraf')

const bot_listas = new Telegraf('1752245041:AAGTaDOnPG5ndTYAUnQISoSxJAPQ0aRNfkc')

var listas = {};

function exists_group(id){
    if (!listas[id]){
        // If not exist an grup, create it empty.
        listas[id] = {}
        listas[id]["activos"] = []
        listas[id]["suplentes"] = []
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

function printList(ctx,typeOfPlayer){
    exists_group(ctx.chat.id);
    return list(listas[ctx.chat.id][typeOfPlayer])
}

function printAll(ctx){
    exists_group(ctx.chat.id)
    if (listas[ctx.chat.id]["activos"].length == 0){
        return ctx.reply("No hay nadie")
    }
    let listado = "Listado activos: \n"
    listado += `${printList(ctx,"activos")} \n`
    if (listas[ctx.chat.id]["suplentes"].length > 0){
        listado += "Listado suplentes: \n"
        listado += `${printList(ctx,"suplentes")} \n`
    }
    return ctx.reply(listado)
}

bot_listas.start((ctx) => {
    ctx.reply('PASAME TU LISTITA PA');
    listas[ctx.chat.id] = []
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
    exists_group(ctx.chat.id)
    listas[ctx.chat.id] = []
    ctx.reply('Limpiada padre!')
})

bot_listas.command('salir', (ctx) => {
    exists_group(ctx.chat.id)
    let index = listas[ctx.chat.id]["activos"].indexOf(ctx.from.first_name)
    if (index > -1) {
        // Exist the user. Then remove it
        listas[ctx.chat.id]["activos"].splice(index, 1);
        if (listas[ctx.chat.id]["suplentes"].length > 0){
            // Add the first suplent in the actives players list
            listas[ctx.chat.id]["activos"].push(getFirstSustitute(ctx.chat.id))
        }
        return ctx.reply('Sos tremendo gil, chau.');
    }

    // Don't exist that user
    return ctx.reply('De donde queres salir vos, banana.');  
})

bot_listas.command('lista', (ctx)=>{
   printAll(ctx)
})

bot_listas.command('ayuda',(ctx)=>{
    return ctx.reply('Fer,colgate de esta.')
})

bot_listas.launch()