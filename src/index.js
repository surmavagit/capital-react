import React from "react";
import ReactDOM from "react-dom/client";
import { useState } from "react";

const TypeSelection = () => {
  const [tableType, setTableType] = useState(0);
  const tableInfo = [
    {
      type: "Means of production and Articles of consumption",
      lables: [
        ["Dep.", "c", "(v + m)", "w", "n'"],
        ["I"],
        ["II + III"],
        ["Total"],
      ],
      description: "First description",
    },
    {
      type: "Articles of capitalists' consumption and All other commodities",
      lables: [
        ["Dep.", "m", "c + v", "w", "p'"],
        ["I + II"],
        ["III"],
        ["Total"],
      ],
      description: "Second description",
    },
    {
      type: "Articles of workers' consumption and All other commodities",
      lables: [
        ["Dep.", "c + m", "v", "w", "c' + m'"],
        ["II"],
        ["I + III"],
        ["Total"],
      ],
      description: "Third description",
    },
  ];
  return (
    <>
      <select value={tableType} onChange={(e) => setTableType(e.target.value)}>
        <option value={0}>{tableInfo[0].type}</option>
        <option value={1}>{tableInfo[1].type}</option>
        <option value={2}>{tableInfo[2].type}</option>
      </select>
      <TheTable lables={tableInfo[tableType].lables} />
      <TableDescription
        lables={tableInfo[tableType].lables}
        description={tableInfo[tableType].description}
      />
    </>
  );
};

const TheTable = ({ lables }) => {
  const [inputArray, setInputArray] = useState([
    {
      row: 1,
      column: 1,
      value: 100,
    },
    {
      row: 2,
      column: 2,
      value: 50,
    },
    {
      row: 3,
      column: 3,
      value: 200,
    },
  ]);
  const tableVals = [
    lables[0],
    [lables[1], undefined, undefined, undefined, undefined],
    [lables[2], undefined, undefined, undefined, undefined],
    [lables[3], undefined, undefined, undefined, undefined],
  ];
  const fillCounterpart = (a, b) => {
    tableVals[b][a] = tableVals[a][b];
  };
  inputArray.forEach((entry) => {
    tableVals[entry.row][entry.column] = entry.value;
    fillCounterpart(entry.row, entry.column);
  });
  if (inputArray.length === 3) {
    const specialCaseCheck = inputArray.reduce(
      (accumulator, entry) => accumulator && entry.row - entry.column === 0,
      true
    );
    if (specialCaseCheck) {
      tableVals[2][1] =
        (tableVals[3][3] - tableVals[2][2] - tableVals[1][1]) / 2;
      fillCounterpart(2, 1);
    }
  }
  console.groupCollapsed("Do...While Loop");
  if (inputArray.length > 1) {
    console.log("input length is " + inputArray.length);
    let changes = 0;
    do {
      console.groupCollapsed("Loop cycle");
      changes = 0;
      tableVals.forEach((row, rowIndex) => {
        const undefCounter = row.reduce(
          (accumulator, element, index) =>
            element === undefined
              ? index === 0
                ? console.error("Label is undefined")
                : accumulator + 1
              : accumulator,
          0
        );
        console.log(`${undefCounter} undefined slots in row ${rowIndex}`);
        if (undefCounter === 2 || undefCounter === 1) {
          const emptySlot = row.indexOf(undefined, 1);
          row[emptySlot] =
            emptySlot === 1
              ? row[3] - row[2]
              : emptySlot === 2
              ? row[3] - row[1]
              : emptySlot === 3
              ? row[1] + row[2]
              : console.log("Empty ratio");
          row[4] = Math.floor((row[1] * 100) / row[2]);
          emptySlot !== 4
            ? fillCounterpart(rowIndex, emptySlot)
            : console.log("No counterpart for ratio");
          changes++;
        }
      });
      console.groupEnd();
      console.log("Loop cycle changes " + changes);
    } while (changes > 0);
  }
  console.groupEnd();

  const findPossibleEntries = () => {
    const resultArr = [];
    tableVals.forEach((line, lineIndex) =>
      line.forEach((cell, cellIndex) =>
        cell === undefined ? resultArr.push([lineIndex, cellIndex]) : null
      )
    );
    return resultArr.filter((arr) => !arr.includes(4) && !arr.includes(0));
  };
  const possibleEntries = findPossibleEntries();
  console.log(possibleEntries);
  return (
    <>
      <table>
        <thead>
          <TableRow row={0} data={tableVals[0]} />
        </thead>
        <tbody>
          <TableRow row={1} data={tableVals[1]} />
          <TableRow row={2} data={tableVals[2]} />
          <TableRow row={3} data={tableVals[3]} />
        </tbody>
      </table>
      <div>
        <h4>User-defined variables</h4>
        {inputArray.map((element, index) => (
          <div>
            <p>{`${lables[element.row]} ${lables[0][element.column]} = ${
              element.value
            }`}</p>
            <button
              onClick={() =>
                setInputArray(inputArray.filter((input, ind) => ind !== index))
              }
            >
              X
            </button>
          </div>
        ))}
        {inputArray.length < 3 ? (
          <div>
            <select
              value={inputArray}
              onChange={(e) => setInputArray(e.target.value)}
            >
              {possibleEntries.map((entry) => (
                <option>{`${lables[entry[0]]} ${lables[0][entry[1]]}`}</option>
              ))}
            </select>
            <button>Enter data</button>
          </div>
        ) : null}
      </div>
    </>
  );
};

const TableDescription = ({ description }) => {
  return <article>{description}</article>;
};

const TableRow = ({ data, row }) => {
  return (
    <tr>
      {data.map((arrCell, cellIndex) =>
        row === 0 || cellIndex === 0 ? <th>{arrCell}</th> : <td>{arrCell}</td>
      )}
    </tr>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TypeSelection />
  </React.StrictMode>
);
