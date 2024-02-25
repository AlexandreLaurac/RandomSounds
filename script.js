// Initialisation de l'audio
const audioContext = new AudioContext() ;
const oscillator = audioContext.createOscillator() ;
const gain = audioContext.createGain() ;
oscillator.connect(gain) ;
gain.connect(audioContext.destination) ;
oscillator.start() ;

// Initialisation des fréquences
function createFrequencies (nbNotes) {
    //const freqMin = 100.0 ;
    //const freqMax = 5000.0 ;
    let nmax = 3*12 ;
    let nmin = -2*12 ;
    let frequencies = [] ;
    for (let i=0 ; i<nbNotes ; i++) {
        //let freq = Math.random() * (freqMax - freqMin) + freqMin ;
        let n = Math.ceil(Math.random()*(nmax-nmin)) + nmin ;
        let freq = 440.0 * Math.pow(2, n/12) ;
        frequencies.push(freq) ;
    }
    return frequencies ;
}

// Initialisation des amplitudes
function createAmplitudes (nbNotes) {
    let amplitudes = [] ;
    for (let i=0 ; i<nbNotes ; i++) {
        amplitudes.push(Math.random()) ;
        //amplitudes.push(1.0) ;
    }
    return amplitudes ;
}

// Initialisation des types
function createTypes (nbNotes) {
    let types = [] ;
    const tableauTypes = ["sine", "square", "sawtooth", "triangle"] ;
    for (i=0 ; i<nbNotes ; i++) {
        types.push(tableauTypes[Math.floor(Math.random() * tableauTypes.length)]) ;
    }
    return types ;
}

// Fonction de jeu d'une note
function note (frequency, amplitude, type) {
    return new Promise ((resolve) => {
        oscillator.frequency.value = frequency ;
        oscillator.type = type ;
        gain.gain.linearRampToValueAtTime(amplitude, audioContext.currentTime + 0.01) ;
        setTimeout(() => {
            gain.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + 0.01) ;
            resolve() ;
        }, 100) ;
    }) ;
}

// Jeu de l'ensemble des notes
const nbNotes = 100 ;
async function jeuNotes() {
    audioContext.resume() ;
    const frequencies = createFrequencies(nbNotes) ;
    const amplitudes = createAmplitudes(nbNotes) ;
    const types = createTypes(nbNotes) ;
    for (i=0 ; i<nbNotes ; i++) {
        await note(frequencies[i], amplitudes[i], types[i]) ;
    }
}

// Déclenchement du jeu des notes
const bouton = document.getElementById("bouton") ;
bouton.addEventListener('click', jeuNotes) ;
