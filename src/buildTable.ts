import type { PingPongTable } from "./types";
import { Colors } from "./types";

const buildTable = (
	columns: number,
	middle: number,
	pingPongTable: PingPongTable,
	rows: number
) => {
	for (let i = 0; i < rows; i++) {
		pingPongTable[i] = new Array(columns);
		if (i === 0 || i === rows - 1) {
			pingPongTable[i].fill(Colors.BgWhite);
			continue;
		}
		pingPongTable[i][0] =
			pingPongTable[i][columns - 1] =
			pingPongTable[i][middle] =
				Colors.BgWhite;
		for (let j = 1; j < columns - 1; j++) {
			if (j === middle) continue;
			pingPongTable[i][j] = 0;
		}
	}
};

export default buildTable;
