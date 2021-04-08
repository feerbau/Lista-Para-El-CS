const diffMinutes = (dt2, dt1,ctx) => {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    //return Math.abs(diff)
    return diff
}

function getTimeToPlay(horaAJugar,ctx){
    // Parse horaAJugar into a Date object
    let horarioSplitteado = horaAJugar.split(":")
    let horaJuego = parseInt(horarioSplitteado[0]) 
    let minutosJuego = parseInt(horarioSplitteado[1]) 
    let fechaJuego = new Date(new Date().toLocaleString("es-AR"),  { timeZone: "UTC" })
    ctx.reply("Fecha juego antes: " + fechaJuego + " Hora: " + horaJuego + " Minutos: " + minutosJuego)
    fechaJuego.setHours(horaJuego)
    fechaJuego.setMinutes(minutosJuego)
    fechaJuego.setSeconds(0)
    ctx.reply("Fecha Juego Despues: " + fechaJuego)
    return fechaJuego
}

function getTimeWait(horaJuego){
    // Devuelve la fecha con 5 minutos menos 
    const minutosAntes = 5
    let horaAEsperar = new Date( horaJuego - minutosAntes * 60000 )
    horaAEsperar.setSeconds(0)
    return horaAEsperar 
}

const validateHour = (hora) => {
    //eslint-disable-next-line 
    return /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(hora)
}

async function sleep(time){
    return new Promise(resolve => setTimeout(resolve, time * 60000));
}

async function alert5MinutesBeforeStart(bot,ctx){
    const horaJuego = getTimeToPlay(bot.getStartTime(),ctx)
    const horaAEsperar = getTimeWait(horaJuego)
    let fechaActual = new Date()
    date.setHours(date.getHours() - 3)
    console.log(date)
    const minutosEspera = diffMinutes(horaAEsperar, fechaActual ,ctx)
    if(minutosEspera >= 0 ){
        // Queda tiempo para que lleguemos a que falten 5 minutos
        await sleep(minutosEspera)
        return ctx.reply("En 5 arranca")
    }
    // Ya falta menos de 5 minutos
    let tiempoFaltante = Math.round(diffMinutes(horaJuego, new Date(),ctx))
    if(tiempoFaltante > 0){
        // Todavia falta, pero faltan menos de 5 minutos
        return ctx.reply(`En ${tiempoFaltante} arranca la partida. Vayan activando perris`)
    }
    // Ya deberia haber arrancado
    return ctx.reply("Ya deberia haber arrancado")
}

module.exports = {
    alert5MinutesBeforeStart: alert5MinutesBeforeStart,
    validateHour: validateHour
}