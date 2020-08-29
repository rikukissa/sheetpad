import React, { useState } from "react";
import ReactDataGrid from "react-data-grid";

const defaultColumnProperties = {
  sortable: true,
  width: 120,
};

const columns = [
  {
    key: "a",
    name: "a",
    sortDescendingFirst: true,
  },
  {
    key: "b",
    name: "b",
  },
  {
    key: "c",
    name: "c",
  },
].map((c) => ({ ...c, ...defaultColumnProperties }));

const ROW_COUNT = 50;

function Example({ rows }) {
  return (
    <div>
      <ReactDataGrid
        columns={columns}
        rowGetter={(i) => rows[i]}
        rowsCount={ROW_COUNT}
        minHeight={500}
        cellRangeSelection={{
          onStart: (args) => console.log(rows),
          onUpdate: (args) => console.log(rows),
          onComplete: (args) => console.log(rows),
        }}
      />
    </div>
  );
}
function createRowData(count) {
  return Array(count)
    .fill(null)
    .map((_, i) => ({ a: 1, b: 3, c: 4 }));
}

export default function Sheet() {
  return <Example rows={createRowData(50)} />;
}
