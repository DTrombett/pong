import type { Buffer } from "node:buffer";
import { platform } from "node:os";
import { exit, stdout } from "node:process";
import toRender from "./render";
import type { Coordinates, PingPongTable, Rackets } from "./types";

const isAndroid = platform() === "android";
export const keys = [
	isAndroid ? "\u001b" : "w",
	isAndroid ? "\t" : "s",
	"\x1b[A",
	"\x1b[B",
];

const actions: Record<
	string,
	| ((
			rackets: Rackets,
			others: { racketHeight: number; lastRow: number }
	  ) => boolean)
	| undefined
> = {
	[keys[0]]: (rackets, { racketHeight }) => {
		if (rackets[0][1] > racketHeight) {
			rackets[0][1]--;
			return true;
		}
		return false;
	},
	[keys[1]]: (rackets, { lastRow }) => {
		if (rackets[0][1] < lastRow) {
			rackets[0][1]++;
			return true;
		}
		return false;
	},
	[keys[2]]: (rackets, { racketHeight }) => {
		if (rackets[1][1] > racketHeight) {
			rackets[1][1]--;
			return true;
		}
		return false;
	},
	[keys[3]]: (rackets, { lastRow }) => {
		if (rackets[1][1] < lastRow) {
			rackets[1][1]++;
			return true;
		}
		return false;
	},
};

const handleKey = (
	pingPongTable: PingPongTable,
	rackets: Rackets,
	ball: Coordinates,
	columns: number,
	racketHeight: number
) => {
	const render = toRender(pingPongTable, rackets, ball, columns, racketHeight);
	const lastRow = pingPongTable.length - racketHeight - 1;

	return (key: Buffer | string) => {
		key = key.toString();
		if (key === "\u0003") stdout.write("\x1b[?25h", (err) => exit(err ? 1 : 0));
		if (!keys.includes(key)) return;
		if (actions[key]?.(rackets, { racketHeight, lastRow }) === true)
			void render();
	};
};

export default handleKey;
