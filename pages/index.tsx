import Head from "next/head";
import SpreadSheet, {
  CellConfig,
  defaultSheets,
  Sheet,
} from "@rowsncolumns/spreadsheet";
import { useEffect, useState } from "react";
import lzString from "lz-string";
import jsonpack from "jsonpack";

function encodeCells(cells: Record<string, Record<string, CellConfig>>) {
  return lzString.compressToEncodedURIComponent(jsonpack.pack(cells));
}

function decodeCells(cellsString: string) {
  return jsonpack.unpack(
    lzString.decompressFromEncodedURIComponent(cellsString)
  );
}

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

  const persistSheet = (sheet: Sheet[]) => {
    window.history.pushState(null, null, "#" + encodeCells(sheet[0].cells));
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
