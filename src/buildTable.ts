import type { PingPongTable } from "./types";
import { Colors } from "./types";

const buildTable = (pingPongTable: PingPongTable, columns: number) => {
	for (let i = 0; i < pingPongTable.length; i++)
		pingPongTable[i] = new Array(columns).fill(
			i === 0 || i === pingPongTable.length - 1 ? Colors.BgWhite : 0
		);
};

export default buildTable;
