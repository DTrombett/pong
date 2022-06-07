import { stdin, stdout } from "node:process";
import { clearScreenDown, cursorTo, emitKeypressEvents } from "node:readline";
import buildTable from "./buildTable";
import handleKey from "./handleKey";
import moveBall from "./moveBall";
import Queue from "./Queue";
import toRender from "./render";
import type { Coordinates, PingPongTable, Rackets } from "./types";

const columns = 92 as const;
const racketHeight = 4 as const;
const rows = 50 as const;
const speed = 50 as const;
const queue = new Queue();
const ball: Coordinates = [Math.round(columns / 2), 1];
const direction: Coordinates = [1, 1];
const pingPongTable: PingPongTable = new Array(rows);
const middle = Math.round(columns / 2);
const rackets: Rackets = [
	[Math.round(middle / 4), Math.round(rows / 2)],
	[Math.round((middle * 7) / 4), Math.round(rows / 2)],
];
const render = toRender(
	pingPongTable,
	rackets,
	ball,
	queue,
	columns,
	racketHeight
);

cursorTo(stdout, 0, 0, () => {
	clearScreenDown(stdout);
});
buildTable(pingPongTable, columns);
emitKeypressEvents(stdin);
stdin.setRawMode(true);
stdout.write(`\x1b[?25l`);
stdin.on(
	"keypress",
	handleKey(pingPongTable, rackets, ball, queue, columns, racketHeight)
);
setTimeout(
	() =>
		setInterval(
			moveBall(
				pingPongTable,
				rackets,
				ball,
				direction,
				queue,
				columns,
				racketHeight
			),
			speed
		),
	1000
);

await render();
