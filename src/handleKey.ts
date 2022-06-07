import { exit } from "node:process";
import type Queue from "./Queue";
import toRender from "./render";
import type { Coordinates, PingPongTable, Rackets } from "./types";

export const keys = ["w", "s", "up", "down"];

const handleKey = (
	ball: Coordinates,
	pingPongTable: PingPongTable,
	queue: Queue,
	racketHeight: number,
	rackets: Rackets,
	rows: number
) => {
	const render = toRender(ball, pingPongTable, queue, racketHeight, rackets);

	const firstRow = rows - racketHeight - 1;
	const lastRow = rows - racketHeight - 1;
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
		let modified = false;

		switch (key.name) {
			case "w":
				if (rackets[0][1] > racketHeight) {
					rackets[0][1]--;
					modified = true;
				}
				break;
			case "s":
				if (rackets[0][1] < firstRow) {
					rackets[0][1]++;
					modified = true;
				}
				break;
			case "up":
				if (rackets[1][1] > racketHeight) {
					rackets[1][1]--;
					modified = true;
				}
				break;
			case "down":
				if (rackets[1][1] < lastRow) {
					rackets[1][1]++;
					modified = true;
				}
				break;
			default:
				break;
		}
		if (modified) void render();
	};
};

export default handleKey;
