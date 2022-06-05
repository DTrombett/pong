import { stdout } from "node:process";

enum Colors {
	Reset = 0,
	Bright = 1,
	Dim = 2,
	Underscore = 4,
	Blink = 5,
	Reverse = 7,
	Hidden = 8,
	FgBlack = 30,
	FgRed = 31,
	FgGreen = 32,
	FgYellow = 33,
	FgBlue = 34,
	FgMagenta = 35,
	FgCyan = 36,
	FgWhite = 37,
	BgBlack = 40,
	BgRed = 41,
	BgGreen = 42,
	BgYellow = 43,
	BgBlue = 44,
	BgMagenta = 45,
	BgCyan = 46,
	BgWhite = 47,
}

const color = (text: string, code: Colors): string =>
	`\x1b[${code}m${text}\u200b\x1b[m`;
const rows = 25;
const columns = 90;
const pingPongTable = new Array<string[]>(rows);
const render = (): void => {
	stdout.write(pingPongTable.map((row) => row.join("")).join("\n"));
};

for (let i = 0; i < rows; i++) {
	pingPongTable[i] = new Array<string>(columns);
	if (i === 0 || i === rows - 1)
		pingPongTable[i].fill(color(" ", Colors.BgWhite));
	else {
		pingPongTable[i][0] =
			pingPongTable[i][1] =
			pingPongTable[i][columns - 2] =
			pingPongTable[i][columns - 1] =
			pingPongTable[i][columns / 2] =
			pingPongTable[i][columns / 2 + 1] =
				color(" ", Colors.BgWhite);
		for (let j = 2; j < columns - 2; j++) {
			const middle = columns / 2;

			if (j !== middle && j !== middle + 1)
				pingPongTable[i][j] = color(" ", Colors.BgGreen);
		}
	}
}

render();

export {};
