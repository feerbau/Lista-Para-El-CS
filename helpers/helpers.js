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
    let fechaJuego = new Date()
    fechaJuego.setHours(horaJuego)
    fechaJuego.setMinutes(minutosJuego)
    fechaJuego.setSeconds(0)
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
    fechaActual.setHours(fechaActual.getHours() - 3)
    console.log(fechaActual + " / " + horaAEsperar)
    const minutosEspera = diffMinutes(horaAEsperar, fechaActual ,ctx)
    console.log(minutosEspera)
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