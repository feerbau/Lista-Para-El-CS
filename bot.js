const {Telegraf} = require('telegraf')

const bot_listas = new Telegraf('1752245041:AAGTaDOnPG5ndTYAUnQISoSxJAPQ0aRNfkc')

var listas = {};

function exists_group(id){
    if (!listas[id])
        listas[id] = []
}

function add_to_list(ctx,name, list){
    if (list.length > 4)
        return ctx.reply('Ya esta llena la lista, dormiste.')
    list.push(name)
}
bot_listas.start((ctx) => {
    ctx.reply('PASAME TU LISTITA PA');
    listas[ctx.chat.id] = []
})

bot_listas.command('toy', (ctx) => {
    exists_group(ctx.chat.id)
    if (!listas[ctx.chat.id].includes(ctx.from.first_name)){    
        add_to_list(ctx,ctx.from.first_name,listas[ctx.chat.id])
        return ctx.reply('Adentro '+ctx.from.first_name)
    }else{
        return ctx.reply('Ya estas en la lista pa.')
    }
    })

bot_listas.command('limpiar', (ctx) =>{
    exists_group(ctx.chat.id)
    listas[ctx.chat.id] = []
    ctx.reply('Limpiada padre!')
})
bot_listas.command('salir', (ctx) => {
    exists_group(ctx.chat.id)
    let index = listas[ctx.chat.id].indexOf(ctx.from.first_name)
    if (index > -1) {
        listas[ctx.chat.id].splice(index, 1);
        return ctx.reply('Sos tremendo gil, chau.');
    }else{
        return ctx.reply('De donde queres salir vos, banana.');
    }
})

bot_listas.command('lista', (ctx)=>{
    exists_group(ctx.chat.id);
    (listas[ctx.chat.id] && listas[ctx.chat.id].length > 0) ? ctx.reply("La lista es \n"+list(listas[ctx.chat.id])): ctx.reply("No hay nadie")
})

bot_listas.command('ayuda',(ctx)=>{
    return ctx.reply('Bote es el dios, el unico. El inigualable. \nSi queres ayuda, Bote es el unico que puede dartela.\n Larga vida al dios Bote')
})
function list(lista){
    return lista.map((u,i) => ++i+". "+u+'\n')
}
bot_listas.launch()