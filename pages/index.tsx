import Head from "next/head";
import SpreadSheet from "@rowsncolumns/spreadsheet";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Sheetpad</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SpreadSheet
        className="sheet"
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
