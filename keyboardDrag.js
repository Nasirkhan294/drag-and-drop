document.addEventListener("DOMContentLoaded", () => {
	const draggables = document.querySelectorAll(".btn-draggable");
	const droppables = document.querySelectorAll(".droppable");
	const errorElement = document.getElementById("error-message");

	let currentDraggable = null;
	let isClone = false;

	// Add tabindex to make draggables and droppables focusable
	draggables.forEach((item) => item.setAttribute("tabindex", "0"));
	droppables.forEach((zone) => zone.setAttribute("tabindex", "0"));

	// Handle keydown events for draggables
	draggables.forEach((draggable) => {
		draggable.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "Enter": // Pick up or drop the item
					if (!currentDraggable) {
						currentDraggable = draggable.cloneNode(true);
						isClone = true;
						currentDraggable.classList.add("dragging");
						currentDraggable.setAttribute("tabindex", "0");
						errorElement.textContent = "Use arrow keys to navigate to a drop zone. Press Enter to drop.";
					} else if (currentDraggable === draggable || isClone) {
						errorElement.textContent = "Item already picked up! Navigate to a drop zone.";
					}
					break;

				case "ArrowRight": // Navigate to the next draggable or drop zone
				case "ArrowLeft": {
					const allFocusable = [...document.querySelectorAll(".btn-draggable"), ...droppables];
					const currentIndex = allFocusable.indexOf(draggable);
					const nextIndex = e.key === "ArrowRight" ? currentIndex + 1 : currentIndex - 1;
					const target = allFocusable[nextIndex];
					if (target) target.focus();
					break;
				}

				case "Escape": // Cancel drag
					if (currentDraggable) {
						currentDraggable.classList.remove("dragging");
						currentDraggable = null;
						isClone = false;
						errorElement.textContent = "Drag canceled.";
					}
					break;
			}
		});
	});

	// Handle keydown events for droppables
	droppables.forEach((droppable) => {
		droppable.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "Enter": // Drop the item into the drop zone
					if (currentDraggable) {
						// Append clone to the drop zone
						droppable.appendChild(currentDraggable);
						currentDraggable.classList.remove("dragging");

						// Reset variables
						currentDraggable = null;
						isClone = false;

						errorElement.textContent = "Item dropped successfully!";

						// Add event listeners to the clone
						const clones = droppable.querySelectorAll(".btn-draggable");
						clones.forEach((clone) => {
							clone.setAttribute("tabindex", "0");
							clone.addEventListener("keydown", (e) => {
								handleCloneKeydown(e, clone);
							});
						});
					} else {
						errorElement.textContent = "No item selected for dropping.";
					}
					break;

				case "ArrowRight": // Navigate to the next droppable
				case "ArrowLeft": {
					const allFocusable = [...draggables, ...droppables];
					const currentIndex = allFocusable.indexOf(droppable);
					const nextIndex = e.key === "ArrowRight" ? currentIndex + 1 : currentIndex - 1;
					const target = allFocusable[nextIndex];
					if (target) target.focus();
					break;
				}
			}
		});
	});

	// Handle keydown for clones
	function handleCloneKeydown(e, clone) {
		switch (e.key) {
			case "Enter": // Pick up the clone
				if (!currentDraggable) {
					currentDraggable = clone;
					isClone = true;
					clone.classList.add("dragging");
					errorElement.textContent = "Use arrow keys to navigate to a drop zone. Press Enter to drop.";
				}
				break;

			case "ArrowRight": // Navigate to the next draggable or drop zone
			case "ArrowLeft": {
				const allFocusable = [...document.querySelectorAll(".btn-draggable"), ...droppables];
				const currentIndex = allFocusable.indexOf(clone);
				const nextIndex = e.key === "ArrowRight" ? currentIndex + 1 : currentIndex - 1;
				const target = allFocusable[nextIndex];
				if (target) target.focus();
				break;
			}

			case "Escape": // Cancel drag
				if (currentDraggable) {
					currentDraggable.classList.remove("dragging");
					currentDraggable = null;
					isClone = false;
					errorElement.textContent = "Drag canceled.";
				}
				break;
		}
	}
});
