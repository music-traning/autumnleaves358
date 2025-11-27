// Autumn Leaves Chord Progression Data
const autumnLeavesChords = [
    // Section A (01-08 bars)
    { bar: 1, chord: "Cm7", degree: "ii/Bb" },
    { bar: 2, chord: "F7", degree: "V/Bb" },
    { bar: 3, chord: "Bbmaj7", degree: "I/Bb" },
    { bar: 4, chord: "Ebmaj7", degree: "IV/Bb" },
    { bar: 5, chord: "Am7(b5)", degree: "ii/Gm" },
    { bar: 6, chord: "D7", degree: "V/Gm" },
    { bar: 7, chord: "Gm6", degree: "i/Gm" },
    { bar: 8, chord: "Gm6", degree: "i/Gm" },
    // Section A (09-16 bars) - Repeat
    { bar: 9, chord: "Cm7", degree: "ii/Bb" },
    { bar: 10, chord: "F7", degree: "V/Bb" },
    { bar: 11, chord: "Bbmaj7", degree: "I/Bb" },
    { bar: 12, chord: "Ebmaj7", degree: "IV/Bb" },
    { bar: 13, chord: "Am7(b5)", degree: "ii/Gm" },
    { bar: 14, chord: "D7", degree: "V/Gm" },
    { bar: 15, chord: "Gm6", degree: "i/Gm" },
    { bar: 16, chord: "Gm6", degree: "i/Gm" },
    // Section B (17-24 bars) - Bridge
    { bar: 17, chord: "Am7(b5)", degree: "ii/Gm" },
    { bar: 18, chord: "D7", degree: "V/Gm" },
    { bar: 19, chord: "Gm6", degree: "i/Gm" },
    { bar: 20, chord: "Gm6", degree: "i/Gm" },
    { bar: 21, chord: "Cm7", degree: "ii/Bb" },
    { bar: 22, chord: "F7", degree: "V/Bb" },
    { bar: 23, chord: "Bbmaj7", degree: "I/Bb" },
    { bar: 24, chord: "Ebmaj7", degree: "IV/Bb" },
    // Section C (25-32 bars) - Ending
    { bar: 25, chord: "Am7(b5)", degree: "ii/Gm" },
    { bar: 26, chord: "D7", degree: "V/Gm" },
    { bar: 27, chord: "Gm7", beat: [1, 2], next: "C7", beat_next: [3, 4] }, // 2 beats each
    { bar: 28, chord: "Fm7", beat: [1, 2], next: "Bb7", beat_next: [3, 4] }, // 2 beats each
    { bar: 29, chord: "Ebmaj7", degree: "IV/Bb" },
    { bar: 30, chord: "D7", degree: "V/Gm" },
    { bar: 31, chord: "Gm6", degree: "i/Gm" },
    { bar: 32, chord: "Gm6", degree: "i/Gm" }
];

// Note Definitions
const NOTES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

// Map for input parsing (handling flats and sharps)
const NOTE_INDEX = {
    "C": 0, "C#": 1, "Db": 1,
    "D": 2, "D#": 3, "Eb": 3,
    "E": 4,
    "F": 5, "F#": 6, "Gb": 6,
    "G": 7, "G#": 8, "Ab": 8,
    "A": 9, "A#": 10, "Bb": 10,
    "B": 11
};

/**
 * Parses a chord name and returns its constituent notes and guide tones (3rd, 7th).
 * @param {string} chordName - e.g., "Cm7", "F7", "Am7(b5)"
 * @returns {object} - { root, third, fifth, seventh, tones: [] }
 */
function getChordInfo(chordName) {
    // 1. Parse Root and Quality
    let root, quality;
    if (chordName.length > 1 && (chordName[1] === 'b' || chordName[1] === '#')) {
        root = chordName.substring(0, 2);
        quality = chordName.substring(2);
    } else {
        root = chordName.substring(0, 1);
        quality = chordName.substring(1);
    }

    const rootIdx = NOTE_INDEX[root];
    if (rootIdx === undefined) {
        console.error(`Unknown root note: ${root}`);
        return null;
    }

    // 2. Define Intervals based on Quality
    // Intervals are semitones from root: [Root, 3rd, 5th, 7th]
    let intervals = [];
    let intervalNames = ["R", "3", "5", "7"]; // Default labels

    switch (quality) {
        case "m7":
            intervals = [0, 3, 7, 10]; // R, m3, P5, m7
            intervalNames = ["R", "b3", "5", "b7"];
            break;
        case "7":
            intervals = [0, 4, 7, 10]; // R, M3, P5, m7
            intervalNames = ["R", "3", "5", "b7"];
            break;
        case "maj7":
            intervals = [0, 4, 7, 11]; // R, M3, P5, M7
            intervalNames = ["R", "3", "5", "7"];
            break;
        case "m7(b5)":
            intervals = [0, 3, 6, 10]; // R, m3, dim5, m7
            intervalNames = ["R", "b3", "b5", "b7"];
            break;
        case "m6":
            intervals = [0, 3, 7, 9];  // R, m3, P5, M6
            intervalNames = ["R", "b3", "5", "6"];
            break;
        case "6":
            intervals = [0, 4, 7, 9];  // R, M3, P5, M6
            intervalNames = ["R", "3", "5", "6"];
            break;
        case "dim7":
            intervals = [0, 3, 6, 9];  // R, m3, dim5, dim7 (M6)
            intervalNames = ["R", "b3", "b5", "bb7"];
            break;
        default:
            // Fallback for triads or unknown
            intervals = [0, 4, 7];
            intervalNames = ["R", "3", "5"];
            break;
    }

    // 3. Calculate Notes
    // Use Flat notation for Jazz keys (Gm, Bb) generally, or context dependent.
    // For simplicity, we'll use the Flat array as default for this key.
    const noteArray = NOTES_FLAT;

    const tones = intervals.map(interval => {
        const noteIdx = (rootIdx + interval) % 12;
        return noteArray[noteIdx];
    });

    // 4. Identify 3rd and 7th (or 6th for m6)
    const result = {
        chord: chordName,
        root: tones[0],
        third: tones[1],
        fifth: tones[2],
        seventh: tones[3] || null, // Might be null for triads
        tones: tones,
        intervalNames: intervalNames
    };

    return result;
}

// --- Fretboard Mapping (Standard Tuning) ---
// String 1 (High E) -> String 6 (Low E)
// 0 = Open, 1-12 = Frets
const STRING_TUNING = ["E", "B", "G", "D", "A", "E"]; // 1 to 6
const FRET_COUNT = 12;

// Helper to find all positions of a note on the fretboard
function findNotePositions(targetNote) {
    const positions = [];
    const targetIdx = NOTE_INDEX[targetNote];

    // Iterate strings (1 to 6)
    for (let s = 0; s < 6; s++) {
        const openNote = STRING_TUNING[s];
        const openIdx = NOTE_INDEX[openNote];

        // Iterate frets (0 to 12) - 0 is open string (usually not marked with dot, but we can if needed)
        // We usually mark frets 1-12.
        for (let f = 1; f <= FRET_COUNT; f++) {
            const currentIdx = (openIdx + f) % 12;
            if (currentIdx === targetIdx) {
                // Found match
                // Calculate CSS positions
                // String Top: 10% + (s * 16%)
                // Fret Left: (f - 0.5) * 8.33% (approx center of fret)
                const top = 10 + (s * 16);
                const left = (f - 0.5) * 8.3333;

                positions.push({ string: s + 1, fret: f, top, left });
            }
        }
    }
    return positions;
}

// --- UI & Playback Logic ---

let isPlaying = false;
let currentBar = 1; // 1-32
let currentBeat = 1; // 1-4
let bpm = 80;
let displayMode = "note"; // "note" or "degree"
let countInBeats = 0;

// Loop State
let isLooping = false;
let loopStart = 1;
let loopEnd = 32;

// Tone.js Instruments
let polySynth, membrane, metal;
let loopId = null;

// DOM Elements
const elCurrentChord = document.getElementById("current-chord-name");
const elNextChord = document.getElementById("next-chord-name");
const elChordTones = document.getElementById("chord-tones-display");
const elMarkersContainer = document.getElementById("note-markers-container");
const elBpmSlider = document.getElementById("bpm-slider");
const elBpmDisplay = document.getElementById("bpm-display");
const elVolumeSlider = document.getElementById("volume-slider");
const elMetronomeMode = document.getElementById("metronome-mode");
const btnStart = document.getElementById("btn-start");
const btnPause = document.getElementById("btn-pause");
const btnStop = document.getElementById("btn-stop");
const btnToggleDisplay = document.getElementById("btn-toggle-display");

// Loop Elements
const elLoopStart = document.getElementById("loop-start");
const elLoopEnd = document.getElementById("loop-end");
const btnLoopToggle = document.getElementById("btn-loop-toggle");

// Initialize
function init() {
    generateChordChart();
    updateUI(1, 1);

    // Event Listeners
    if (elBpmSlider) {
        elBpmSlider.addEventListener("input", (e) => {
            bpm = parseInt(e.target.value);
            if (elBpmDisplay) elBpmDisplay.textContent = bpm;
            if (Tone.Transport.state === "started") {
                Tone.Transport.bpm.rampTo(bpm, 0.1);
            }
        });
    }

    if (elVolumeSlider) {
        // Set initial volume
        Tone.Destination.volume.value = parseInt(elVolumeSlider.value);

        elVolumeSlider.addEventListener("input", (e) => {
            const vol = parseInt(e.target.value);
            Tone.Destination.volume.rampTo(vol, 0.1);
        });
    }

    if (btnStart) btnStart.addEventListener("click", startPractice);
    if (btnPause) btnPause.addEventListener("click", pausePractice);
    if (btnStop) btnStop.addEventListener("click", stopPractice);

    if (btnToggleDisplay) {
        btnToggleDisplay.addEventListener("click", () => {
            displayMode = displayMode === "note" ? "degree" : "note";
            btnToggleDisplay.textContent = displayMode === "note" ? "Show Degrees" : "Show Notes";
            updateUI(currentBar, currentBeat);
        });
    }

    // Loop Listeners
    if (elLoopStart) {
        elLoopStart.addEventListener("change", (e) => {
            let val = parseInt(e.target.value);
            if (val < 1) val = 1;
            if (val > 32) val = 32;
            if (val > loopEnd) val = loopEnd; // Enforce Start <= End
            loopStart = val;
            elLoopStart.value = loopStart;
            updateLoopVisuals();
        });
    }

    if (elLoopEnd) {
        elLoopEnd.addEventListener("change", (e) => {
            let val = parseInt(e.target.value);
            if (val < 1) val = 1;
            if (val > 32) val = 32;
            if (val < loopStart) val = loopStart; // Enforce End >= Start
            loopEnd = val;
            elLoopEnd.value = loopEnd;
            updateLoopVisuals();
        });
    }

    if (btnLoopToggle) {
        btnLoopToggle.addEventListener("click", () => {
            isLooping = !isLooping;
            btnLoopToggle.textContent = isLooping ? "Loop: ON" : "Loop: OFF";
            btnLoopToggle.classList.toggle("loop-active", isLooping);
            updateLoopVisuals();
        });
    }
}

function updateLoopVisuals() {
    const bars = document.querySelectorAll(".chord-bar");
    bars.forEach(bar => {
        const barNum = parseInt(bar.querySelector(".bar-num").textContent);
        if (isLooping && barNum >= loopStart && barNum <= loopEnd) {
            bar.classList.add("in-loop-range");
        } else {
            bar.classList.remove("in-loop-range");
        }
    });
}

function generateChordChart() {
    const chartContainer = document.getElementById("chord-chart");
    if (!chartContainer) return;

    chartContainer.innerHTML = "";

    for (let i = 1; i <= 32; i++) {
        const barData = autumnLeavesChords.find(c => c.bar === i);
        let chordDisplay = "";

        if (barData) {
            if (barData.next) {
                // Split bar
                chordDisplay = `${barData.chord} / ${barData.next}`;
            } else {
                chordDisplay = barData.chord;
            }
        }

        const barEl = document.createElement("div");
        barEl.className = "chord-bar";
        barEl.id = `bar-${i}`;
        barEl.innerHTML = `
            <span class="bar-num">${i}</span>
            <span class="chord-text">${chordDisplay}</span>
        `;

        // Click to Select (Set Position)
        barEl.addEventListener("click", () => {
            // Stop if playing
            if (isPlaying || Tone.Transport.state !== "stopped") {
                isPlaying = false;
                Tone.Transport.stop();
                countInBeats = 0; // Reset count-in for fresh start
            }

            currentBar = i;
            currentBeat = 1;
            updateUI(currentBar, currentBeat);
        });

        chartContainer.appendChild(barEl);
    }
    updateLoopVisuals(); // Apply visuals if needed
}

async function startPractice() {
    if (isPlaying) return;

    await Tone.start();

    // Setup Instruments if not exists
    if (!polySynth) {
        polySynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle" },
            envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
        }).toDestination();
        polySynth.volume.value = -12;

        membrane = new Tone.MembraneSynth().toDestination();
        membrane.volume.value = -10;

        metal = new Tone.MetalSynth({
            envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5
        }).toDestination();
        metal.volume.value = -15;
    }

    // Resume if paused
    if (Tone.Transport.state === "paused") {
        isPlaying = true;
        Tone.Transport.start();
        return;
    }

    isPlaying = true;
    countInBeats = 4; // Start with 4 count-in
    Tone.Transport.bpm.value = bpm;

    // Enforce Loop Start
    if (isLooping) {
        currentBar = loopStart;
        currentBeat = 1;
        updateUI(currentBar, currentBeat);
    }

    // Schedule Loop
    if (loopId !== null) {
        Tone.Transport.clear(loopId);
    }

    loopId = Tone.Transport.scheduleRepeat(repeatLoop, "4n");
    Tone.Transport.start();
}

function pausePractice() {
    if (!isPlaying) return;
    isPlaying = false;
    Tone.Transport.pause();
    // Do NOT reset countInBeats or clear UI here
}

function stopPractice() {
    isPlaying = false;
    Tone.Transport.stop();
    countInBeats = 0;
    currentBar = 1;
    currentBeat = 1;
    updateUI(currentBar, currentBeat);

    // Clear any visual count-in text if stopped during count-in
    elCurrentChord.textContent = "Cm7"; // Reset to start
    elNextChord.textContent = "F7";
}

function repeatLoop(time) {
    // 0. Count-in Logic
    if (countInBeats > 0) {
        // Play click (MetalSynth)
        metal.triggerAttackRelease("32n", time);

        // Visual Feedback
        Tone.Draw.schedule(() => {
            elCurrentChord.textContent = `Count: ${countInBeats}`;
            elNextChord.textContent = "Ready...";
            elChordTones.innerHTML = "";
            elMarkersContainer.innerHTML = "";
            document.querySelectorAll(".chord-bar").forEach(el => el.classList.remove("active"));
        }, time);

        countInBeats--;
        return;
    }

    // 1. Metronome Logic
    const mode = elMetronomeMode ? elMetronomeMode.value : "on";

    if (mode === "on") {
        // 1-2-3-4
        // User requested same sound as off-beat (MetalSynth)
        metal.triggerAttackRelease("32n", time);
    } else {
        // Off-beat (2-4)
        if (currentBeat === 2 || currentBeat === 4) {
            metal.triggerAttackRelease("32n", time);
        }
    }

    // 2. Chord Logic
    const chordData = autumnLeavesChords.find(c => c.bar === currentBar);
    if (chordData) {
        let chordName = chordData.chord;
        let duration = "1m"; // Default 1 measure (4 beats)

        // Split Bar Logic
        if (chordData.next) {
            if (currentBeat === 1) {
                chordName = chordData.chord;
                duration = "2n"; // 2 beats
                triggerChord(chordName, duration, time);
            } else if (currentBeat === 3) {
                chordName = chordData.next;
                duration = "2n";
                triggerChord(chordName, duration, time);
            }
        } else {
            // Normal Bar
            if (currentBeat === 1) {
                triggerChord(chordName, duration, time);
            }
        }
    }

    // 3. Update UI
    Tone.Draw.schedule(() => {
        updateUI(currentBar, currentBeat);
    }, time);

    // 4. Advance
    currentBeat++;
    if (currentBeat > 4) {
        currentBeat = 1;
        currentBar++;

        // Loop Logic
        if (isLooping) {
            if (currentBar > loopEnd) {
                currentBar = loopStart;
            }
        } else {
            if (currentBar > 32) {
                currentBar = 1;
            }
        }
    }
}

function triggerChord(chordName, duration, time) {
    const info = getChordInfo(chordName);
    if (!info) return;

    // Construct notes with octave (e.g., 3 or 4)
    // Simple logic: Root at 3, others above
    // We need to parse note names to frequencies or just append octave
    // info.tones has ["C", "Eb", "G", "Bb"]

    const notes = [
        info.root + "3",
        info.third + "3",
        info.fifth + "3",
        (info.seventh || info.root) + "3" // Fallback
    ];

    // Voicing refinement could be done here (e.g. guide tones shell)
    // For now, simple block chord
    polySynth.triggerAttackRelease(notes, duration, time);
}

function updateUI(bar, beat) {
    // Highlight Current Bar in Chart
    document.querySelectorAll(".chord-bar").forEach(el => el.classList.remove("active"));
    const currentBarEl = document.getElementById(`bar-${bar}`);
    if (currentBarEl) {
        currentBarEl.classList.add("active");
    }

    // Find chord data for current bar
    const chordData = autumnLeavesChords.find(c => c.bar === bar);
    if (!chordData) return;

    // Handle Split Bars (27, 28)
    let currentChordName = chordData.chord;
    let nextChordName = ""; // Need to look ahead

    if (chordData.beat && chordData.next) {
        // Split bar logic
        if (chordData.beat_next.includes(beat)) {
            currentChordName = chordData.next;
        }
    }

    // Determine Next Chord (Look ahead)
    // Simple lookahead: Next bar's first chord
    // Or if split bar, next part of split
    let nextBar = bar;
    let nextBeat = beat + 1;
    if (nextBeat > 4) {
        nextBar++;
        if (nextBar > 32) nextBar = 1;
        nextBeat = 1;
    }

    // Logic to find next chord name for display
    // If we are in first half of split bar, next is second half
    if (chordData.beat && chordData.next && chordData.beat.includes(beat)) {
        nextChordName = chordData.next;
    } else {
        // Look at next bar
        const nextData = autumnLeavesChords.find(c => c.bar === nextBar);
        nextChordName = nextData ? nextData.chord : "???";
    }

    // Update Text
    elCurrentChord.textContent = currentChordName;
    elNextChord.textContent = nextChordName;

    // Get Chord Info
    const info = getChordInfo(currentChordName);

    // Update Tones Text
    // 3rd and 7th (or 6th)
    const guideTone1 = info.third;
    const guideTone2 = info.seventh || info.tones[3]; // Fallback if 7th is null (e.g. triad)
    const label2 = info.intervalNames[3] || "7"; // "7" or "6"

    elChordTones.innerHTML = `
        <span class="tone tone-3rd">${guideTone1} (3rd)</span>
        <span class="tone tone-7th">${guideTone2} (${label2}th)</span>
    `;

    // Render Fretboard
    renderFretboard(info);
}

function renderFretboard(info) {
    elMarkersContainer.innerHTML = ""; // Clear existing

    // We want to show 3rd and 7th (or 6th)
    const tone3 = info.third;
    const tone7 = info.seventh;

    // Labels based on displayMode
    let label3 = tone3;
    let label7 = tone7;

    if (displayMode === "degree") {
        label3 = info.intervalNames[1]; // 3rd
        label7 = info.intervalNames[3] || info.intervalNames[2]; // 7th or 6th
    }

    const targets = [
        { note: tone3, type: "tone-3rd", label: label3 },
        { note: tone7, type: "tone-7th", label: label7 }
    ];

    targets.forEach(t => {
        if (!t.note) return;
        const positions = findNotePositions(t.note);

        positions.forEach(pos => {
            const el = document.createElement("div");
            el.className = `note-marker ${t.type}`;
            el.style.top = `${pos.top}%`;
            el.style.left = `${pos.left}%`;
            el.textContent = t.label;
            elMarkersContainer.appendChild(el);
        });
    });
}

// Start
init();
