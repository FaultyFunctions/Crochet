<!-- # SCRIPT # -->
<script lang="ts">
	type TreeContext = {
		getSelectedIds: () => Set<string>;
		getExpandedIds: () => Set<string>;
		getDraggedId: () => string | undefined;
		setDraggedId: (value: string | undefined) => void;
		getDropDestinationId: () => string | undefined;
		setDropDestinationId: (value: string | undefined) => void;
	};
</script>

<!-- # MARKUP # -->
