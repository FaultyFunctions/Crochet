export interface Command {
	execute(): Promise<void>;
	undo(): Promise<void>;
}

export class CommandHistory {
	#undoStack = $state<Command[]>([]);
	#redoStack = $state<Command[]>([]);

	execute = async (command: Command): Promise<void> => {
		await command.execute();
		this.#undoStack.push(command);
		this.#redoStack = [];
	};

	undo = async (): Promise<void> => {
		const command = this.#undoStack.pop();
		if (!command) return;

		await command.undo();
		this.#redoStack.push(command);
	};

	redo = async (): Promise<void> => {
		const command = this.#redoStack.pop();
		if (!command) return;

		await command.execute();
		this.#undoStack.push(command);
	};

	get canUndo(): boolean {
		return this.#undoStack.length > 0;
	}

	get canRedo(): boolean {
		return this.#redoStack.length > 0;
	}

	clear = (): void => {
		this.#undoStack = [];
		this.#redoStack = [];
	};
}
