import Head from "next/head";
import SpreadSheet, {
  CellConfig,
  defaultSheets,
  FunctionArgument,
  Sheet,
  format as defaultFormatter,
} from "@rowsncolumns/spreadsheet";
import { useEffect, useState } from "react";
import lzString from "lz-string";
import jsonpack from "jsonpack";

import { parse, interpret } from "../lib/lisp";

function encodeCells(cells: Record<string, Record<string, CellConfig>>) {
  return lzString.compressToEncodedURIComponent(jsonpack.pack(cells));
}

function decodeCells(cellsString: string) {
  return jsonpack.unpack(
    lzString.decompressFromEncodedURIComponent(cellsString)
  );
}

function solveDependencies(forms, sheet) {
  return forms.map((value) => {
    if(Array.isArray(value)) {
      return solveDependencies(value, sheet)
    }

    if(value.type === "identifier" && /[A-Z]\d/.test(value.value)) {
      const [column, row] = value.value.split('')
      const cell = sheet.cells[row][column.charCodeAt(0) - 64]
      if(cell.datatype === 'number') {
        return {type: 'number', value: Number(cell.text)}
      }


      return {type: 'identifier', value: cell.text}
    }
    return value
  })
}

const formatter = (value, datatype, cellConfig, sheet: Sheet) => {


  if (value[0] === "=") {


    try {


      const forms = solveDependencies(parse(value.substr(1)), sheet)

      console.log(interpret(forms));

      return interpret(forms);
    } catch (error) {
      console.log(error);

      return "ERROR";
    }

    // console.log("tää2", parse("(+ 1 2 3)"));
    // console.log(closer.parse(value.substr(1)));
    // return escodegen.generate(closer.parse(value.substr(1)));
  }

  return defaultFormatter(value, datatype, cellConfig);
};

export default function Home() {
  const [sheets, setSheets] = useState(defaultSheets);

  useEffect(() => {
    if (window.location.hash) {
      const cells = decodeCells(window.location.hash.substr(1));

      if (!cells) {
        return;
      }

      return setSheets([
        {
          ...defaultSheets[0],
          cells: cells,
        },
      ]);
    }

    setSheets(defaultSheets);
  }, []);

  const persistSheet = (sheets: Sheet[]) => {
    let { cells } = sheets[0];

    // Object.entries(cells).forEach(([rowKey, row]) => {
    //   Object.entries(row).forEach(([columnKey, column]) => {
    //     if (column.text[0] === "=") {
    //       console.log(cells, rowKey, columnKey);
    //       console.log(cells[rowKey][columnKey]);

    //       cells = {
    //         ...row,
    //         [rowKey]: {
    //           ...column,
    //           [columnKey]: {
    //             ...cells[rowKey][columnKey],
    //             type: "formula",
    //             formula: cells[rowKey][columnKey].text[0],
    //             text: "calculation",
    //           },
    //         },
    //       };
    //     }
    //   });
    // });

    window.history.pushState(null, null, "#" + encodeCells(sheets[0].cells));
    setSheets(sheets);
  };
  return (
    <div>
      <Head>
        <title>Sheetpad</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SpreadSheet
        formatter={(...args) => formatter(...args, sheets[0])}
        sheets={sheets}
        onChange={persistSheet}
        showToolbar={false}
        showTabStrip={false}
        initialColorMode={"dark"}
        autoFocus={false}
        disableFormula={true}
      />
      <style jsx>
        {`
          :global(.rowsncolumns-spreadsheet) {
            height: 100vh;
          }
        `}
      </style>
    </div>
  );
}
