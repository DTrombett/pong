import type { PingPongTable } from "./types";
import { Colors } from "./types";

/**
 * Build a table with the given number of columns.
 * The number of rows is parsed from the array length.
 * @param pingPongTable - The table to build
 * @param columns - The number of columns in the table
 */
const buildTable = (pingPongTable: PingPongTable, columns: number) => {
	for (let i = 0; i < pingPongTable.length; i++)
		pingPongTable[i] = new Array(columns).fill(
			// The first and last rows are white and represent the wall where the ball will bounce
			i === 0 || i === pingPongTable.length - 1 ? Colors.BgWhite : 0
		);
};

export default buildTable;
