//------------------------------ Frequencies ------------------------------//

// Values
let absoluteMinFreq = 100 ;
let absoluteMaxFreq = 4000 ;
let minFreq = absoluteMinFreq ;
let maxFreq = absoluteMaxFreq ;
let freqRangeForPlay = [minFreq, maxFreq] ;

// Initialization regarding minimum frequency
const minFreqElt = document.getElementById("min_freq_elt") ;
minFreqElt.textContent = "min : " + minFreq ;

const absoluteMinFreqElt = document.getElementById("absolute_min_freq_elt") ;
absoluteMinFreqElt.textContent = absoluteMinFreq ;

const minFreqSlider = document.getElementById("min_freq_slider") ;
minFreqSlider.min = absoluteMinFreq ;
minFreqSlider.max = absoluteMaxFreq ;
minFreqSlider.value = minFreq ;
minFreqSlider.addEventListener("input", (e) => {
    const minTarget = Number(e.target.value) ;
    if (minTarget < maxFreq) {
        minFreq = minTarget ;
    }
    else { // minTarget >= maxFreq
        minFreq = maxFreq ;
        minFreqSlider.value = maxFreq ;
    }
    minFreqElt.textContent = "min : " + minFreq ;
    freqRangeForPlay[0] = minFreq ;
}) ;

// Initialization regarding maximum frequency
const maxFreqElt = document.getElementById("max_freq_elt") ;
maxFreqElt.textContent = "max : " + maxFreq ;

const absoluteMaxFreqElt = document.getElementById("absolute_max_freq_elt") ;
absoluteMaxFreqElt.textContent = absoluteMaxFreq ;

const maxFreqSlider = document.getElementById("max_freq_slider") ;
maxFreqSlider.min = absoluteMinFreq ;
maxFreqSlider.max = absoluteMaxFreq ;
maxFreqSlider.value = maxFreq ;
maxFreqSlider.addEventListener("input", (e) => {
    const maxTarget = Number(e.target.value) ;
    if (maxTarget > minFreq) {
        maxFreq = maxTarget ;
    }
    else {  // maxTarget <= minFreq
        maxFreq = minFreq ;
        maxFreqSlider.value = minFreq ;
    }
    maxFreqElt.textContent = "max : " + maxFreq ;
    freqRangeForPlay[1] = maxFreq ;
}) ;


//------------------------------ Amplitudes ------------------------------//

// Values
let absoluteMinAmp = 0.0 ;
let absoluteMaxAmp = 1.0 ;
let minAmp = absoluteMinAmp ;
let maxAmp = absoluteMaxAmp ;
let ampRangeForPlay = [minAmp, maxAmp] ;

// Initialization regarding minimum amplitude
const minAmpElt = document.getElementById("min_amp_elt") ;
minAmpElt.textContent = "min : " + minAmp ;

const absoluteMinAmpElt = document.getElementById("absolute_min_amp_elt") ;
absoluteMinAmpElt.textContent = absoluteMinAmp ;

const minAmpSlider = document.getElementById("min_amp_slider") ;
minAmpSlider.min = absoluteMinAmp ;
minAmpSlider.max = absoluteMaxAmp ;
minAmpSlider.value = minAmp ;
minAmpSlider.addEventListener("input", (e) => {
    const minTarget = Number(e.target.value) ;
    if (minTarget < maxAmp) {
        minAmp = minTarget ;
    }
    else { // minTarget >= maxAmp
        minAmp = maxAmp ;
        minAmpSlider.value = maxAmp ;
    }
    minAmpElt.textContent = "min : " + minAmp.toFixed(2) ;
    ampRangeForPlay[0] = minAmp ;
}) ;

// Initialization regarding maximum amplitude
const maxAmpElt = document.getElementById("max_amp_elt") ;
maxAmpElt.textContent = "max : " + maxAmp ;

const absoluteMaxAmpElt = document.getElementById("absolute_max_amp_elt") ;
absoluteMaxAmpElt.textContent = absoluteMaxAmp ;

const maxAmpSlider = document.getElementById("max_amp_slider") ;
maxAmpSlider.min = absoluteMinAmp ;
maxAmpSlider.max = absoluteMaxAmp ;
maxAmpSlider.value = maxAmp ;
maxAmpSlider.addEventListener("input", (e) => {
    const maxTarget = Number(e.target.value) ;
    if (maxTarget > minAmp) {
        maxAmp = maxTarget ;
    }
    else {  // maxTarget <= minAmp
        maxAmp = minAmp ;
        maxAmpSlider.value = minAmp ;
    }
    maxAmpElt.textContent = "max : " + maxAmp.toFixed(2) ;
    ampRangeForPlay[1] = maxAmp ;
}) ;


//------------------------------ Waveforms ------------------------------//

// Values
let checkedNumber = 1 ;
let typeRangeForPlay = ["sine"] ;

// Sine checkbox
const sineCheckbox = document.getElementById("sine_checkbox") ;
sineCheckbox.checked = true ;
sineCheckbox.addEventListener("click", (event) => { onClickCheckbox(event, sineCheckbox, "sine") }) ;

// Triangle checkbox
const triangleCheckbox = document.getElementById("triangle_checkbox") ;
triangleCheckbox.checked = false ;
triangleCheckbox.addEventListener("click", (event) => { onClickCheckbox(event, triangleCheckbox, "triangle") }) ;

// Sawtooth checkbox
const sawtoothCheckbox = document.getElementById("sawtooth_checkbox") ;
sawtoothCheckbox.checked = false ;
sawtoothCheckbox.addEventListener("click", (event) => { onClickCheckbox(event, sawtoothCheckbox, "sawtooth") }) ;

// Square checkbox
const squareCheckbox = document.getElementById("square_checkbox") ;
squareCheckbox.checked = false ;
squareCheckbox.addEventListener("click", (event) => { onClickCheckbox(event, squareCheckbox, "square") }) ;

// Callback
function onClickCheckbox (event, checkbox, string) { // Careful ! When this function is called, checkbox state has already changed
    if (checkbox.checked === true) {  // so here we've just clicked the checkbox and it has become checked
        checkedNumber++ ;
        typeRangeForPlay.push(string) ;
    }
    else {  // here the checkbox was checked and we've just clicked on it to uncheck it
        if (checkedNumber > 1) {
            checkedNumber-- ;
            typeRangeForPlay = typeRangeForPlay.filter((type) => type !== string) ;
        }
        else {  // but we don't want to uncheck it if there are no other checkbox checked, so we check it back
            checkbox.checked = true ;
        }
    }
}


//------------------------------ Audio ------------------------------//

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
function createRandomSoundParams (freqRange, ampRange, typeRange) {

    // Frequency
    const noteMin = freqToNote (freqRange[0]) ;
    const noteMax = freqToNote (freqRange[1]) ;
    let note = Math.floor (Math.random()*(noteMax-noteMin)) + noteMin ;
    let frequency = noteToFreq (note) ;

    // Amplitude
    const ampMin = ampRange[0] ;
    const ampMax = ampRange[1] ;
    let amplitude = Math.random() * (ampMax - ampMin) + ampMin ;

    // Type of waveform
    let type = typeRange[Math.floor (Math.random() * typeRange.length)] ;

    return { frequency : frequency, amplitude : amplitude, type : type } ;
}

// Fonction de jeu d'une note
const soundDuration = 100 ;   // ms
const slopeDuration = 0.02 ;  // s
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
        }, soundDuration) ;
    }) ;
}

// Jeu de l'ensemble des notes
let playing = false ;
async function playSoundLoop() {
    audioContext.resume() ;
    while (playing) {
        const { frequency, amplitude, type } = createRandomSoundParams (freqRangeForPlay, ampRangeForPlay, typeRangeForPlay) ;
        //console.log(frequency, amplitude, type) ;
        await playSound (frequency, amplitude, type) ;
    }
}

// Déclenchement du jeu des notes
const bouton = document.getElementById("bouton") ;
bouton.addEventListener('click', (e) => {
    // audio not playing
    if (playing === false) {
        playing = true ;
        bouton.style.backgroundColor = "#e95420" ;
        bouton.style.color = "white" ;
        bouton.textContent = "Stop" ;
        playSoundLoop() ;
    }
    // Audio playing
    else {
        playing = false ;
        bouton.style.backgroundColor = "white" ;
        bouton.style.color = "black" ;
        bouton.textContent = "Start" ;
    }
}) ;
