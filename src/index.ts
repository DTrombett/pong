import { stdin, stdout } from "node:process";
import { clearScreenDown, cursorTo, emitKeypressEvents } from "node:readline";
import buildTable from "./buildTable";
import handleKey from "./handleKey";
import moveBall from "./moveBall";
import toRender from "./render";
import type { Coordinates, PingPongTable, Rackets } from "./types";

let columns = Math.floor(
	(stdout.columns % 2 === 1 ? stdout.columns : stdout.columns - 1) / 2
);
let rows = Math.ceil(columns / 2);
while (rows > stdout.rows) {
	columns -= 2;
	rows = Math.ceil(columns / 2);
}
const racketHeight = 4 as const;
const speed = 50 as const;
const scores: Coordinates = [0, 0];
const ball: Coordinates = [Math.round(columns / 2), 1];
const direction: Coordinates = [1, 1];
const pingPongTable: PingPongTable = new Array(rows);
const middle = Math.round(columns / 2);
const rackets: Rackets = [
	[Math.round(middle / 4), Math.round(rows / 2)],
	[Math.round((middle * 7) / 4), Math.round(rows / 2)],
];
const render = toRender(pingPongTable, rackets, ball, columns, racketHeight);

cursorTo(stdout, 0, 0, () => {
	clearScreenDown(stdout);
});
buildTable(pingPongTable, columns);
emitKeypressEvents(stdin);
stdin.setRawMode(true);
stdout.write(`\x1b[?25l`);
stdin.on(
	"keypress",
	handleKey(pingPongTable, rackets, ball, columns, racketHeight)
);
setTimeout(
	() =>
		setInterval(
			moveBall(
				pingPongTable,
				rackets,
				ball,
				direction,
				scores,
				columns,
				middle,
				racketHeight
			),
			speed
		),
	1000
);

await render();
