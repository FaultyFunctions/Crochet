const MIN_WIDTH = 300;
const DEFAULT_WIDTH = 500;
const COLLAPSE_THRESHOLD = 50;

export enum SidePanelStatus {
	EXPANDED = 'EXPANDED',
	COLLAPSING = 'COLLAPSING',
	COLLAPSED = 'COLLAPSED',
	EXPANDING = 'EXPANDING'
}

class SidePanelStore {
	#status = $state<SidePanelStatus>(SidePanelStatus.EXPANDED);
	#width = $state<number>(DEFAULT_WIDTH);
	#isTransitioning = $derived(
		this.#status === SidePanelStatus.COLLAPSING || this.#status === SidePanelStatus.EXPANDING
	);

	get status() {
		return this.#status;
	}

	get isTransitioning() {
		return this.#isTransitioning;
	}

	getWidth = (): number => {
		return this.#width;
	};

	setWidth = (px: number): void => {
		switch (this.#status) {
			case SidePanelStatus.EXPANDED: {
				if (px < COLLAPSE_THRESHOLD) {
					this.#status = SidePanelStatus.COLLAPSING;
					this.#width = 0;
				} else {
					const max = window.innerWidth * 0.8;
					this.#width = Math.min(max, Math.max(MIN_WIDTH, px));
				}
				return;
			}
			case SidePanelStatus.COLLAPSING: {
				return;
			}
			case SidePanelStatus.COLLAPSED: {
				if (px > COLLAPSE_THRESHOLD) {
					this.#status = SidePanelStatus.EXPANDING;
					this.#width = MIN_WIDTH;
				}
				return;
			}
			case SidePanelStatus.EXPANDING: {
				if (px > MIN_WIDTH) {
					this.completeTransition();
				}
				return;
			}
		}
	};

	completeTransition = (): void => {
		switch (this.#status) {
			case SidePanelStatus.COLLAPSING:
				this.#status = SidePanelStatus.COLLAPSED;
				return;
			case SidePanelStatus.EXPANDING:
				this.#status = SidePanelStatus.EXPANDED;
				return;
		}
	};
}

export const sidePanelStore = new SidePanelStore();
