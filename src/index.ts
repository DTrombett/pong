import { stdin, stdout } from "node:process";
import { clearScreenDown, cursorTo, emitKeypressEvents } from "node:readline";
import buildTable from "./buildTable";
import handleKey from "./handleKey";
import moveBall from "./moveBall";
import Queue from "./Queue";
import toRender from "./render";
import type { Coordinates, PingPongTable, Rackets } from "./types";

const rows = 50;
const columns = 92;
const middle = Math.round(columns / 2);
const racketHeight = 4;
const rackets: Rackets = [
	[Math.round(middle / 4), Math.round(rows / 2)],
	[Math.round((middle * 7) / 4), Math.round(rows / 2)],
];
const ball: Coordinates = [Math.round(columns / 2), 1];
const speed = 50;
const direction: Coordinates = [1, 1];
const pingPongTable: PingPongTable = new Array(rows);
const queue = new Queue();
const render = toRender(ball, pingPongTable, queue, racketHeight, rackets);

cursorTo(stdout, 0, 0, () => {
	clearScreenDown(stdout);
});
buildTable(columns, middle, pingPongTable, rows);
emitKeypressEvents(stdin);
stdin.setRawMode(true);
stdout.write(`\x1b[?25l`);
stdin.on(
	"keypress",
	handleKey(ball, pingPongTable, queue, racketHeight, rackets, rows)
);
setTimeout(
	() =>
		setInterval(
			moveBall(
				ball,
				pingPongTable,
				queue,
				columns,
				direction,
				racketHeight,
				rackets,
				rows
			),
			speed
		),
	1000
);

await render();
