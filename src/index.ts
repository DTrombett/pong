import { stdin, stdout } from "node:process";
import { clearScreenDown, cursorTo } from "node:readline";
import buildTable from "./buildTable";
import handleKey from "./handleKey";
import moveBall from "./moveBall";
import toRender from "./render";
import type { Coordinates, PingPongTable, Rackets } from "./types";

if (stdout.getColorDepth() < 4)
	throw new Error("Your terminal does not support required colors :(");
let columns = Math.floor(
	(stdout.columns % 2 === 1 ? stdout.columns : stdout.columns - 1) / 2
);
let rows = Math.ceil(columns / 2);
while (rows > stdout.rows) {
	columns -= 2;
	rows = Math.ceil(columns / 2);
}
const racketHeight = 4 as const;
const speed = Math.round(5_000 / columns);
const scores: Coordinates = [0, 0];
const ball: Coordinates = [Math.round(columns / 2), 1];
const direction: Coordinates = [1, 1];
const pingPongTable: PingPongTable = new Array(rows);
const middle = Math.round(columns / 2);
const rackets: Rackets = [
	[Math.round(middle / 4), Math.round(rows / 2)],
	[columns - Math.ceil(middle / 4), Math.round(rows / 2)],
];
const render = toRender(pingPongTable, rackets, ball, columns, racketHeight);

cursorTo(stdout, 0, 0, () => {
	clearScreenDown(stdout);
});
buildTable(pingPongTable, columns);
stdin.setRawMode(true);
stdout.write("\x1b[?25l");
stdin.on(
	"data",
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
