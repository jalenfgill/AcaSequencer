import { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Song, Track, Instrument } from "reactronica";

// Simplified Piano Roll
const PianoRollExample = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const [tempo, setTempo] = useState(90);
  const [noteArray, setNotes] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [steps, setSteps] = useState([]);

  const notes = [
    "C5",
    "B4",
    "Bb4",
    "A4",
    "Ab4",
    "G4",
    "Gb4",
    "F4",
    "E4",
    "Eb4",
    "D4",
    "Db4",
    "C4",
    "B3",
    "Bb3",
    "A3",
    "Ab3",
    "G3",
    "Gb3",
    "F3",
    "E3",
    "Eb3",
    "D3",
    "Db3",
    "C3",
  ];

  useEffect(() => {
    const defaultNotes = () => {
      const initialNoteArray = [];
      for (let i = 0; i < notes.length; i++) {
        const noteSubArray = [];
        for (let j = 0; j < 8; j++) {
          noteSubArray.push(0);
        }
        initialNoteArray.push(noteSubArray);
      }
      setNotes(initialNoteArray);
    };
    const defaultSteps = () => {
      const initialStepsArray = [];
      for (let i = 0; i < 8; i++) {
        initialStepsArray.push(null);
      }
      setSteps(initialStepsArray);
    };
    defaultNotes();
    defaultSteps();
  }, []);

  const noteTracker = noteArray[0]?.map((note, index) => {
    const nullNote = <div className="note note-name-null"></div>;
    return (
      <div className="tracker-row">
        {index === 0 ? nullNote : null}
        <div
          key={index}
          className={
            index === currentStepIndex
              ? "note tracker-active text-light"
              : "note tracker-note text-light"
          }
        ></div>
      </div>
    );
  });

  const noteList = notes.map((note, row) => {
    return (
      <>
        <div className="note-row" key={row}>
          <div
            className={
              note.length === 2
                ? "note note-name-natural"
                : "note note-name-flat text-light"
            }
          >
            {note}
          </div>
          {noteArray[row]?.map((notePos, col) => {
            let classString = "";
            if (notePos === 1) {
              if (col === currentStepIndex) {
                classString = "note tracker-active text-light";
              } else {
                classString = "note note-active text-light";
              }
            } else {
              classString = "note text-light";
            }

            return (
              <div
                className={classString}
                onClick={() => {
                  addStep(note, col);
                  activateNote(row, col);
                }}
                key={col}
              ></div>
            );
          })}
        </div>
      </>
    );
  });

  const activateNote = (row, col) => {
    const newNoteArray = [];
    for (let i = 0; i < noteArray.length; i++) {
      const subArray = [];
      for (let j = 0; j < noteArray[i].length; j++) {
        if (i === row && j === col) {
          if (noteArray[i][j] === 1) {
            subArray.push(0);
          } else {
            subArray.push(1);
          }
        } else {
          subArray.push(noteArray[i][j]);
        }
      }
      newNoteArray.push(subArray);
    }

    setNotes(newNoteArray);
    console.log("completed");
  };

  const addStep = (note, col) => {
    const newStepArray = [];
    for (let i = 0; i < steps.length; i++) {
      let subArray = null;
      if (i === col) {
        if (steps[i] === null) {
          subArray = [];
          subArray.push(note);
        } else {
          subArray = steps[i];
          if (!subArray.includes(note)) {
            subArray.push(note);
          } else {
            const index = subArray.indexOf(note);
            subArray.splice(index, 1);
            if (subArray.length === 0) {
              subArray = null;
            }
          }
        }
      } else {
        if (steps[i] !== null) {
          subArray = steps[i];
        }
      }
      newStepArray.push(subArray);
    }
    setSteps(newStepArray);
  };

  const startUpCounter = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTempo((prevTempo) => (prevTempo < 240 ? prevTempo + 1 : 240));
    }, 50);
  };

  const startDownCounter = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTempo((prevTempo) => (prevTempo > 20 ? prevTempo - 1 : 20));
    }, 50);
  };

  const stopCounter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const addNotes = () => {
    const noteArrayCopy = [...noteArray];
    for (let i = 0; i < noteArrayCopy.length; i++) {
      for (let j = 0; j < 30; j++) {
        noteArray[i].push(0);
      }
    }
    const newSteps = [...steps];
    while (noteArrayCopy[0].length > newSteps.length) {
      newSteps.push(null);
    }
    setNotes(noteArrayCopy);
    setSteps(newSteps);
  };

  const removeNotes = () => {
    const noteArrayCopy = [...noteArray];
    for (let i = 0; i < noteArrayCopy.length; i++) {
      for (let j = 0; j < 30; j++) {
        noteArray[i].pop();
      }
    }

    const newSteps = [...steps];
    while (noteArrayCopy[0].length < newSteps.length) {
      newSteps.pop();
    }
    setNotes(noteArrayCopy);
    setSteps(newSteps);
  };

  return (
    <div className="sequencer">
      <div className="option-bar">
        <div className="m-3">
          <Button
            variant="success"
            size="lg"
            onClick={() => {
              if (isPlaying === true) {
                setCurrentStepIndex(null);
              }
              setIsPlaying(!isPlaying);
            }}
          >
            {isPlaying ? "Stop" : "Play"}
          </Button>
        </div>
        <div className="">
          <p>Select the tempo: {tempo}</p>
          <div className="d-flex justify-content-center">
            <Button
              variant="light"
              className="m-2"
              onMouseDown={() => {
                if (tempo > 20) {
                  startDownCounter();
                }
              }}
              onMouseUp={stopCounter}
              onMouseLeave={stopCounter}
            >
              -1
            </Button>
            <Button
              variant="light"
              className="m-2"
              onMouseDown={() => {
                if (tempo < 240) {
                  startUpCounter();
                }
              }}
              onMouseUp={stopCounter}
              onMouseLeave={stopCounter}
            >
              +1
            </Button>
          </div>
        </div>
        <div className="m-3">
          <Button onClick={addNotes} variant="primary">
            Add notes
          </Button>
        </div>
        <div className="m-3">
          <Button onClick={removeNotes} variant="secondary">
            Remove notes
          </Button>
        </div>
        <div className="m-3">
          <Button onClick={removeNotes} variant="danger">
            Clear Notes
          </Button>
        </div>
      </div>

      <div className="tracker-grid mb-4">
        <div>{noteTracker}</div>
      </div>
      <div className="note-grid">{noteList}</div>

      {/* Reactronica Components */}
      <Song isPlaying={isPlaying} bpm={tempo}>
        <Track
          steps={isPlaying ? steps : []}
          // Callback triggers on every step
          onStepPlay={(stepNotes, index) => {
            console.log(stepNotes, index);
            setCurrentStepIndex(index);
          }}
        >
          <Instrument type="synth" />
        </Track>
      </Song>
    </div>
  );
};
export default PianoRollExample;
