import Head from "next/head";
import jsonpack from "jsonpack";
import SpreadSheet, {
  CellConfig,
  defaultSheets,
  produceState,
  Sheet,
} from "@rowsncolumns/spreadsheet";
import { useEffect, useState } from "react";

function encodeCells(cells: Record<string, Record<string, CellConfig>>) {
  return jsonpack.pack(cells);
}

function getPersistedState() {
  if (typeof window !== "undefined" && !window.location.hash) {
    return [
      {
        ...defaultSheets[0],
        cells: jsonpack.unpack(window.location.hash.substr(1)),
      },
    ];
  }

  return defaultSheets;
}

export default function Home() {
  const [sheets, setSheets] = useState(defaultSheets);

  useEffect(() => {
    if (window.location.hash) {
      return setSheets([
        {
          ...defaultSheets[0],
          cells: jsonpack.unpack(
            decodeURIComponent(window.location.hash.substr(1))
          ),
        },
      ]);
    }

    setSheets(defaultSheets);
  }, []);

  const persistSheet = (sheet: Sheet[]) => {
    window.history.pushState(
      null,
      null,
      "#" + encodeURIComponent(encodeCells(sheet[0].cells))
    );
    setSheets(sheet);
  };
  return (
    <div>
      <Head>
        <title>Sheetpad</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SpreadSheet
        sheets={sheets}
        onChange={persistSheet}
        showToolbar={false}
        showTabStrip={false}
        initialColorMode={"dark"}
        autoFocus={false}
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
