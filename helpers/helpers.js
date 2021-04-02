const diffMinutes = (dt2, dt1) => {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}

function getTimeToPlay(horaAJugar){
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

function getTimeWait(fechaJuego){
    // Devuelve la fecha con 5 minutos menos 
    const minutosAntes = 5
    return new Date( fechaJuego - minutosAntes * 60000 );    
}

export const validateHour = (hora) => {
    //eslint-disable-next-line 
    return /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(hora)
}

export async function sleep(time){
    return new Promise(resolve => setTimeout(resolve, time * 60000));
}

export async function alert5MinutesBeforeStart(bot){
    let fechaJuego = getTimeToPlay(bot.getStartTime())
    if(fechaJuego === undefined){
        return ctx.reply("No hay hora de juego definida")
    }
    let horaAEsperar = getTimeWait(fechaJuego)
    let minutosEspera = diffMinutes(horaAEsperar, new Date())
    await sleep(minutosEspera)
    return ctx.reply(`En ${diffMinutes(fechaJuego, new Date())} arranca la partida. Vayan activando perris`)
}

