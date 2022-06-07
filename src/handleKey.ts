import { exit } from "node:process";
import type Queue from "./Queue";
import toRender from "./render";
import type { Coordinates, PingPongTable, Rackets } from "./types";

export const keys = ["w", "s", "up", "down"];

const actions: Record<
	string,
	| ((
			rackets: Rackets,
			others: { racketHeight: number; lastRow: number }
	  ) => boolean)
	| undefined
> = {
	w: (rackets, { racketHeight }) => {
		if (rackets[0][1] > racketHeight) {
			rackets[0][1]--;
			return true;
		}
		return false;
	},
	s: (rackets, { lastRow }) => {
		if (rackets[0][1] < lastRow) {
			rackets[0][1]++;
			return true;
		}
		return false;
	},
	up: (rackets, { racketHeight }) => {
		if (rackets[1][1] > racketHeight) {
			rackets[1][1]--;
			return true;
		}
		return false;
	},
	down: (rackets, { lastRow }) => {
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
	queue: Queue,
	columns: number,
	racketHeight: number
) => {
	const render = toRender(
		pingPongTable,
		rackets,
		ball,
		queue,
		columns,
		racketHeight
	);
	const lastRow = pingPongTable.length - racketHeight - 1;

	return (
		_: string | undefined,
		key: {
			sequence: string;
			name: string;
			ctrl: boolean;
			meta: boolean;
			shift: boolean;
			code?: string;
		}
	) => {
		if (key.ctrl && key.name === "c") exit(0);
		if (!keys.includes(key.name)) return;
		if (actions[key.name]?.(rackets, { racketHeight, lastRow }) === true)
			void render();
	};
};

export default handleKey;
