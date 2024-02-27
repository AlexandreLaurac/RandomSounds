// Initialisation de l'audio
const audioContext = new AudioContext() ;
const oscillator = audioContext.createOscillator() ;
const gain = audioContext.createGain() ;
gain.gain.value = 0.0 ;
oscillator.connect(gain) ;
gain.connect(audioContext.destination) ;
oscillator.start() ;


// Fonctions de conversion

function freqToNote (frequency) {
    return Math.floor (12.0 * Math.log2 (frequency/440.0)) ;
}

function noteToFreq (note) {
    return 440.0 * Math.pow (2.0, note/12.0) ;
}


// Fonction de création de paramètres aléatoires
function createRandomSoundParams (freqRange = 440.0, ampRange = 1.0, typeRange = 'sine') {

    let frequency, amplitude, type ;
    
    // Frequency
    if (typeof freqRange === "number") {
        frequency = noteToFreq (freqToNote (freqRange)) ;
    }
    else if (typeof freqRange === "object" && freqRange.length === 2) {
        const noteMin = freqToNote (freqRange[0]) ;
        const noteMax = freqToNote (freqRange[1]) ;
        let note = Math.floor (Math.random()*(noteMax-noteMin)) + noteMin ;
        frequency = noteToFreq (note) ;
    }
    else {
        throw TypeError ("bad type for 'freqRange' argument") ;
    }

    // Amplitude
    if (typeof ampRange === "number") {
        amplitude = ampRange ;
    }
    else if (typeof ampRange === "object" && ampRange.length === 2) {
        const ampMin = ampRange[0] ;
        const ampMax = ampRange[1] ;
        amplitude = Math.random() * (ampMax - ampMin) + ampMin ;
    }
    else {
        throw TypeError ("bad type for 'ampRange' argument") ;
    }

    // Type of waveform
    if (typeof typeRange === "string") {
        type = typeRange ;
    }
    else if (typeof typeRange === "object" && typeRange.length >= 2 && typeRange.length <= 4) {
        type = typeRange[Math.floor (Math.random() * typeRange.length)] ;
    }
    else {
        throw TypeError ("bad type for 'typeRange' argument") ;
    }

    return { frequency : frequency, amplitude : amplitude, type : type } ;
}

// Fonction de jeu d'une note
const slopeDuration = 0.02 ;
function playSound (frequency, amplitude = 1.0, type = 'sine') {
    return new Promise ((resolve) => {
        oscillator.frequency.value = frequency ;
        oscillator.type = type ;
        //console.log("début : " + gain.gain.value) ;
        gain.gain.setValueAtTime(0.0, audioContext.currentTime) ;
        gain.gain.linearRampToValueAtTime(amplitude, audioContext.currentTime + slopeDuration) ;
        setTimeout(() => {
            //console.log("fin régime établi : " + gain.gain.value) ;
            gain.gain.setValueAtTime(amplitude, audioContext.currentTime) ;
            gain.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + slopeDuration) ;
            setTimeout(() => {
                //console.log("fin : " + gain.gain.value) ;
                resolve()
            }, slopeDuration*1000+5) ;
        }, 100) ;
    }) ;
}

// Jeu de l'ensemble des notes
const nbNotes = 100 ;
async function playSoundLoop() {
    audioContext.resume() ;
    for (i=0 ; i<nbNotes ; i++) {
        const { frequency, amplitude, type } = createRandomSoundParams ([1000, 4000], [0.0, 1.0], ["sine", "square", "sawtooth", "triangle"]) ;
        //console.log(frequency, amplitude, type) ;
        await playSound (frequency, amplitude, type) ;
    }
}

// Déclenchement du jeu des notes
const bouton = document.getElementById("bouton") ;
bouton.addEventListener('click', (e) => {
    bouton.disabled = true ;
    playSoundLoop().then((r) => { bouton.disabled = false ; }) ;
}) ;
