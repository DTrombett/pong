import type Queue from "./Queue";
import toRender from "./render";
import type { Coordinates, PingPongTable, Rackets } from "./types";

const moveBall = (
	ball: Coordinates,
	pingPongTable: PingPongTable,
	queue: Queue,
	columns: number,
	direction: Coordinates,
	racketHeight: number,
	rackets: Rackets,
	rows: number
) => {
	const render = toRender(ball, pingPongTable, queue, racketHeight, rackets);
	const lastColumn = columns - 2;
	const lastRow = rows - 2;

	return () => {
		ball[0] += direction[0];
		ball[1] += direction[1];
		if (ball[0] === 1 || ball[0] === lastColumn) direction[0] *= -1;
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
