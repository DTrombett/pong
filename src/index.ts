import { exit, stdin, stdout } from "node:process";
import { clearScreenDown, cursorTo, emitKeypressEvents } from "node:readline";

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

class Queue {
	promises: {
		promise: Promise<void>;
		resolve(): void;
	}[] = [];

	wait() {
		let resolve!: () => void;
		const next = this.promises.at(-1)?.promise ?? Promise.resolve();
		const promise = new Promise<void>((res) => {
			resolve = res;
		});

		this.promises.push({ resolve, promise });
		return next;
	}

	next() {
		this.promises.shift()?.resolve();
	}
}

const rows = 50;
const columns = 92;
const middle = Math.round(columns / 2);
const racketHeight = 4;
const rackets: [[number, number], [number, number]] = [
	[Math.round(middle / 4), Math.round(rows / 2)],
	[Math.round((middle * 7) / 4), Math.round(rows / 2)],
];
const ball: [number, number] = [Math.round(columns / 2), 1];
const speed = 50;
const direction = [1, 1];
const keys = ["w", "s", "up", "down"];
const pingPongTable = new Array<Colors[]>(rows);
const queue = new Queue();
const render = async (): Promise<void> => {
	await queue.wait();
	cursorTo(stdout, 0, 0, () => {
		stdout.write(
			pingPongTable
				.map((row, line) =>
					row
						.map(
							(code, i) =>
								`\x1b[${
									code ||
									(rackets.some(
										([x, y]) =>
											i === x &&
											line > y - racketHeight &&
											line < y + racketHeight
									)
										? Colors.BgRed
										: line === ball[1] && i === ball[0]
										? Colors.BgYellow
										: Colors.BgGreen)
								}m  \x1b[m`
						)
						.join("")
				)
				.join("\n"),
			queue.next.bind(queue)
		);
	});
};

for (let i = 0; i < rows; i++) {
	pingPongTable[i] = new Array(columns);
	if (i === 0 || i === rows - 1) {
		pingPongTable[i].fill(Colors.BgWhite);
		continue;
	}
	pingPongTable[i][0] =
		pingPongTable[i][columns - 1] =
		pingPongTable[i][middle] =
			Colors.BgWhite;
	for (let j = 1; j < columns - 1; j++) {
		if (j === middle) continue;
		pingPongTable[i][j] = 0;
	}
}

emitKeypressEvents(stdin);
stdin.setRawMode(true);
stdin.on(
	"keypress",
	(
		_: undefined,
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
				if (rackets[0][1] < rows - racketHeight - 1) {
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
				if (rackets[1][1] < rows - racketHeight - 1) {
					rackets[1][1]++;
					modified = true;
				}
				break;
			default:
				break;
		}
		if (modified) void render();
	}
);
cursorTo(stdout, 0, 0, () => {
	clearScreenDown(stdout);
});
stdout.write(`\x1b[?25l`);
void render();
setInterval(() => {
	ball[0] += direction[0];
	ball[1] += direction[1];
	if (ball[0] === 1 || ball[0] === columns - 2) direction[0] *= -1;
	if (ball[1] === 1 || ball[1] === rows - 2) direction[1] *= -1;
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
}, speed);

export {};
