import React, { useState, useEffect } from "react";
import { ParamKeyValuePair, useSearchParams } from "react-router-dom";
import { Timer } from "./Timer";
import { timer } from "./utils";

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(inputArray: [string, string][]): [string, string][] {
  const array = [...inputArray]
  for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

export function App(): React.ReactElement {
  const [timers, setTimers] = useState<timer[]>([]);
  let [searchParams, setSearchParams] = useSearchParams();

  const [runningTimer, setRunningTimer] = useState(-1);

  useEffect(() => {
    try {
      const qsTimers = [...searchParams];
      setTimers(
        shuffleArray(qsTimers).map((timer) => ({ time: parseInt(timer[1]), name: timer[0] }))
      );
    } catch (e) {
      setTimers([]);
    }
  }, [setTimers]);

  const addTimer = (timer: timer): void => {
    updateTimers([...timers, timer]);
  };

  const updateTimers = (newTimers: timer[]): void => {
    setTimers(newTimers);
    const timersArray: ParamKeyValuePair[] = newTimers.map((t) => [
      t.name,
      t.time.toString(),
    ]);
    setSearchParams(timersArray, { replace: true });
  };

  return (
    <>
      <h2>Standup Timers</h2>
      <div>
        {timers.map((t, i) => (
          <Timer
            name={t.name}
            time={t.time}
            key={i}
            isRunning={runningTimer === i}
            toggleTimer={() => setRunningTimer(runningTimer === i ? -1 : i)}
          />
        ))}
      </div>
    </>
  );
}
