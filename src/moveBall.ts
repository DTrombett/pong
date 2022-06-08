import { exit } from "node:process";
import { setInterval } from "node:timers/promises";
import { trophy, trophyColumns } from "./pixelArts";
import toRender from "./render";
import type { Coordinates, PingPongTable, Rackets } from "./types";
import { Colors } from "./types";

let scored = false;
let lastDirection = true;

const moveBall = (
	pingPongTable: PingPongTable,
	rackets: Rackets,
	ball: Coordinates,
	direction: Coordinates,
	scores: Coordinates,
	columns: number,
	middle: number,
	racketHeight: number
) => {
	const render = toRender(pingPongTable, rackets, ball, columns, racketHeight);
	const rows = pingPongTable.length;
	const lastColumn = columns - 2;
	const lastRow = rows - 2;
	const maxPoints = Math.floor((columns - 5) / 4);

	return async () => {
		if (scored) return;
		ball[0] += direction[0];
		ball[1] += direction[1];
		if (ball[0] === 1 || ball[0] === lastColumn) {
			const playerNumber = Number(ball[0] === 1);

			pingPongTable[2][playerNumber * middle + ++scores[playerNumber] * 2] =
				Colors.BgBlack;
			scored = true;
			if (scores[playerNumber] === maxPoints) {
				let i = 0,
					j = 0;
				const distance = Math.round(rows / 2) - Math.round(trophy.length / 2);
				const halfMiddle =
					Math.round(middle / 2) - Math.round(trophy.length / 2);

				rackets[0] = rackets[1] = [NaN, NaN];
				ball[0] = ball[1] = NaN;
				for await (const _ of setInterval(10)) {
					pingPongTable[i + distance][j + halfMiddle + playerNumber * middle] =
						trophy[i]?.[j] ?? 0;
					do
						if (j === trophyColumns - 1) {
							j = 0;
							i++;
						} else j++;
					while (trophy[i]?.[j] === undefined && i < trophy.length);
					const isLast = i === trophy.length && j === 1;

					void render().then(() => {
						if (isLast) exit();
					});
					if (isLast) break;
				}
				return;
			}
			setTimeout(() => {
				scored = false;
			}, 1000);
			lastDirection = !lastDirection;
			direction[0] = lastDirection ? 1 : -1;
			direction[1] = 1;
			ball[0] = Math.round(columns / 2);
			ball[1] = 1;
			void render();
			return;
		}
		if (ball[1] === 1 || ball[1] === lastRow) direction[1] *= -1;
		if (
			rackets.some(
				([x, y]) =>
					ball[0] === x &&
					ball[1] > y - racketHeight &&
					ball[1] < y + racketHeight
			)
		)
			direction[0] *= -1;
		void render();
	};
};

export default moveBall;
