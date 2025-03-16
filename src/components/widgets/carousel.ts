const container = document.querySelector(".container")!;
const widgets: HTMLElement[] = Array.from(container.querySelectorAll(".widget"));
const left = document.querySelector("#left")!;
const right = document.querySelector("#right")!;

let index = 0;

function updateWidgets() {
    widgets.forEach((widget, localIndex) => {
        widget.style.display = index == localIndex ? "flex" : "none";
    });
}

left.addEventListener("click", () => {
    index = (index == 0) ? widgets.length - 1 : index - 1;
    updateWidgets();
});

right.addEventListener("click", () => {
    index = (index == widgets.length - 1) ? 0 : index + 1;
    updateWidgets();
});

updateWidgets();