export default class Queue {
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
