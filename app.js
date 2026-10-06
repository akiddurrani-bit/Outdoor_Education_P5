const canvas =
  document.getElementById("drawingCanvas");

const shapeLayer =
  document.getElementById("shapeLayer");

const temporaryLayer =
  document.getElementById("temporaryLayer");

const gridLayer =
  document.getElementById("gridLayer");

const selectTool =
  document.getElementById("selectTool");

const rectangleTool =
  document.getElementById("rectangleTool");

const circleTool =
  document.getElementById("circleTool");

const triangleTool =
  document.getElementById("triangleTool");

const deleteButton =
  document.getElementById("deleteButton");

const clearButton =
  document.getElementById("clearButton");

const symbolMeaning =
  document.getElementById("symbolMeaning");

const landmarkName =
  document.getElementById("landmarkName");

const legendList =
  document.getElementById("legendList");

const statusBar =
  document.getElementById("statusBar");

const referenceContainer =
  document.getElementById("referenceMapContainer");

const toggleReferenceButton =
  document.getElementById("toggleReferenceButton");


const SVG_NS =
  "http://www.w3.org/2000/svg";


let currentTool = "select";

let shapes = [];

let selectedShapeId = null;

let drawing = false;

let moving = false;

let startPoint = null;

let temporaryShape = null;

let movingOffset = null;

let shapeCounter = 1;


/* =========================================
   GRID
========================================= */

function createGrid() {

  for (let x = 50; x < 1000; x += 50) {

    const line =
      document.createElementNS(
        SVG_NS,
        "line"
      );

    line.setAttribute("x1", x);
    line.setAttribute("y1", 0);

    line.setAttribute("x2", x);
    line.setAttribute("y2", 650);

    line.setAttribute(
      "class",
      "grid-line"
    );

    gridLayer.appendChild(line);
  }


  for (let y = 50; y < 650; y += 50) {

    const line =
      document.createElementNS(
        SVG_NS,
        "line"
      );

    line.setAttribute("x1", 0);
    line.setAttribute("y1", y);

    line.setAttribute("x2", 1000);
    line.setAttribute("y2", y);

    line.setAttribute(
      "class",
      "grid-line"
    );

    gridLayer.appendChild(line);
  }

}


/* =========================================
   TOOL SELECTION
========================================= */

function setTool(tool) {

  currentTool = tool;

  selectTool.classList.remove("active");
  rectangleTool.classList.remove("active");
  circleTool.classList.remove("active");
  triangleTool.classList.remove("active");


  if (tool === "select") {

    selectTool.classList.add("active");

    canvas.style.cursor = "default";

    statusBar.textContent =
      "Select a shape to move or delete it.";

  }


  if (tool === "rectangle") {

    rectangleTool.classList.add("active");

    canvas.style.cursor = "crosshair";

    statusBar.textContent =
      "Drag on the map to create a rectangle.";

  }


  if (tool === "circle") {

    circleTool.classList.add("active");

    canvas.style.cursor = "crosshair";

    statusBar.textContent =
      "Drag on the map to create a circle.";

  }


  if (tool === "triangle") {

    triangleTool.classList.add("active");

    canvas.style.cursor = "crosshair";

    statusBar.textContent =
      "Drag on the map to create a triangle.";

  }

}


selectTool.addEventListener(
  "click",
  function () {

    setTool("select");

  }
);


rectangleTool.addEventListener(
  "click",
  function () {

    setTool("rectangle");

  }
);


circleTool.addEventListener(
  "click",
  function () {

    setTool("circle");

  }
);


triangleTool.addEventListener(
  "click",
  function () {

    setTool("triangle");

  }
);


/* =========================================
   GET SVG COORDINATES
========================================= */

function getCanvasPoint(event) {

  const point =
    canvas.createSVGPoint();

  point.x = event.clientX;
  point.y = event.clientY;


  const transformed =
    point.matrixTransform(
      canvas
        .getScreenCTM()
        .inverse()
    );


  return {

    x: Math.max(
      0,
      Math.min(
        1000,
        transformed.x
      )
    ),

    y: Math.max(
      0,
      Math.min(
        650,
        transformed.y
      )
    )

  };

}


/* =========================================
   START POINTER
========================================= */

canvas.addEventListener(
  "pointerdown",
  function (event) {

    const point =
      getCanvasPoint(event);


    /* SELECT / MOVE */

    if (currentTool === "select") {

      const target =
        event.target.closest(
          ".map-shape"
        );


      if (!target) {

        selectedShapeId = null;

        renderShapes();

        return;
      }


      selectedShapeId =
        Number(
          target.dataset.shapeId
        );


      const shape =
        shapes.find(
          function (item) {

            return (
              item.id ===
              selectedShapeId
            );

          }
        );


      if (!shape) {
        return;
      }


      moving = true;

      movingOffset = {

        x:
          point.x -
          shape.x,

        y:
          point.y -
          shape.y

      };


      canvas.setPointerCapture(
        event.pointerId
      );


      renderShapes();

      return;
    }


    /* DRAW */

    drawing = true;

    startPoint = point;


    temporaryShape =
      document.createElementNS(
        SVG_NS,
        "rect"
      );


    temporaryShape.setAttribute(
      "fill",
      "rgba(60, 120, 200, 0.25)"
    );

    temporaryShape.setAttribute(
      "stroke",
      "#2267b5"
    );

    temporaryShape.setAttribute(
      "stroke-width",
      "4"
    );

    temporaryShape.setAttribute(
      "stroke-dasharray",
      "10 6"
    );


    temporaryLayer.appendChild(
      temporaryShape
    );


    canvas.setPointerCapture(
      event.pointerId
    );

  }
);


/* =========================================
   POINTER MOVE
========================================= */

canvas.addEventListener(
  "pointermove",
  function (event) {

    const point =
      getCanvasPoint(event);


    /* MOVE EXISTING */

    if (
      currentTool === "select" &&
      moving &&
      selectedShapeId !== null
    ) {

      const shape =
        shapes.find(
          function (item) {

            return (
              item.id ===
              selectedShapeId
            );

          }
        );


      if (!shape) {
        return;
      }


      shape.x =
        point.x -
        movingOffset.x;

      shape.y =
        point.y -
        movingOffset.y;


      keepShapeInsideCanvas(
        shape
      );


      renderShapes();

      return;
    }


    /* DRAW NEW */

    if (
      !drawing ||
      !startPoint
    ) {

      return;
    }


    const x =
      Math.min(
        startPoint.x,
        point.x
      );

    const y =
      Math.min(
        startPoint.y,
        point.y
      );

    const width =
      Math.abs(
        point.x -
        startPoint.x
      );

    const height =
      Math.abs(
        point.y -
        startPoint.y
      );


    temporaryShape.setAttribute(
      "x",
      x
    );

    temporaryShape.setAttribute(
      "y",
      y
    );

    temporaryShape.setAttribute(
      "width",
      width
    );

    temporaryShape.setAttribute(
      "height",
      height
    );

  }
);


/* =========================================
   POINTER UP
========================================= */

canvas.addEventListener(
  "pointerup",
  function (event) {

    if (moving) {

      moving = false;

      movingOffset = null;

      return;
    }


    if (
      !drawing ||
      !startPoint
    ) {

      return;
    }


    const point =
      getCanvasPoint(event);


    const x =
      Math.min(
        startPoint.x,
        point.x
      );

    const y =
      Math.min(
        startPoint.y,
        point.y
      );

    const width =
      Math.abs(
        point.x -
        startPoint.x
      );

    const height =
      Math.abs(
        point.y -
        startPoint.y
      );


    temporaryLayer.innerHTML =
      "";


    drawing = false;

    temporaryShape = null;


    if (
      width < 25 ||
      height < 25
    ) {

      statusBar.textContent =
        "Shape too small. Drag a larger area.";

      startPoint = null;

      return;
    }


    const name =
      landmarkName.value.trim();


    const newShape = {

      id: shapeCounter++,

      type: currentTool,

      meaning:
        symbolMeaning.value,

      name:
        name ||
        symbolMeaning.value,

      x: x,

      y: y,

      width: width,

      height: height

    };


    shapes.push(
      newShape
    );


    selectedShapeId =
      newShape.id;


    landmarkName.value =
      "";


    startPoint = null;


    renderShapes();

    renderLegend();


    statusBar.textContent =
      newShape.name +
      " added to your map.";

  }
);


/* =========================================
   KEEP SHAPE INSIDE MAP
========================================= */

function keepShapeInsideCanvas(
  shape
) {

  shape.x =
    Math.max(
      0,
      Math.min(
        1000 -
        shape.width,
        shape.x
      )
    );


  shape.y =
    Math.max(
      0,
      Math.min(
        650 -
        shape.height,
        shape.y
      )
    );

}


/* =========================================
   RENDER SHAPES
========================================= */

function renderShapes() {

  shapeLayer.innerHTML = "";


  shapes.forEach(
    function (shape) {

      let element;


      if (
        shape.type ===
        "rectangle"
      ) {

        element =
          document.createElementNS(
            SVG_NS,
            "rect"
          );


        element.setAttribute(
          "x",
          shape.x
        );

        element.setAttribute(
          "y",
          shape.y
        );

        element.setAttribute(
          "width",
          shape.width
        );

        element.setAttribute(
          "height",
          shape.height
        );

      }


      if (
        shape.type ===
        "circle"
      ) {

        element =
          document.createElementNS(
            SVG_NS,
            "ellipse"
          );


        element.setAttribute(
          "cx",
          shape.x +
          shape.width / 2
        );

        element.setAttribute(
          "cy",
          shape.y +
          shape.height / 2
        );

        element.setAttribute(
          "rx",
          shape.width / 2
        );

        element.setAttribute(
          "ry",
          shape.height / 2
        );

      }


      if (
        shape.type ===
        "triangle"
      ) {

        element =
          document.createElementNS(
            SVG_NS,
            "polygon"
          );


        const p1 =
          (
            shape.x +
            shape.width / 2
          ) +
          "," +
          shape.y;


        const p2 =
          shape.x +
          "," +
          (
            shape.y +
            shape.height
          );


        const p3 =
          (
            shape.x +
            shape.width
          ) +
          "," +
          (
            shape.y +
            shape.height
          );


        element.setAttribute(
          "points",
          p1 +
          " " +
          p2 +
          " " +
          p3
        );

      }


      element.setAttribute(
        "fill",
        getMeaningColour(
          shape.meaning
        )
      );


      element.setAttribute(
        "class",
        "map-shape"
      );


      element.dataset.shapeId =
        shape.id;


      if (
        shape.id ===
        selectedShapeId
      ) {

        element.classList.add(
          "selected"
        );

      }


      shapeLayer.appendChild(
        element
      );


      const text =
        document.createElementNS(
          SVG_NS,
          "text"
        );


      text.setAttribute(
        "x",
        shape.x +
        shape.width / 2
      );


      text.setAttribute(
        "y",
        shape.y +
        shape.height / 2
      );


      text.setAttribute(
        "class",
        "shape-label"
      );


      text.textContent =
        shape.name;


      shapeLayer.appendChild(
        text
      );

    }
  );

}


/* =========================================
   SYMBOL COLOURS
========================================= */

function getMeaningColour(
  meaning
) {

  if (
    meaning ===
    "Building"
  ) {

    return "#d9d9d9";

  }


  if (
    meaning ===
    "Open Space"
  ) {

    return "#cfe8cf";

  }


  if (
    meaning ===
    "Facility"
  ) {

    return "#cfe0f3";

  }


  if (
    meaning ===
    "Landmark"
  ) {

    return "#f3ddaa";

  }


  if (
    meaning ===
    "Walkway"
  ) {

    return "#e2d5ef";

  }


  return "#dddddd";

}


/* =========================================
   DELETE
========================================= */

deleteButton.addEventListener(
  "click",
  function () {

    if (
      selectedShapeId === null
    ) {

      statusBar.textContent =
        "Select a shape first.";

      return;
    }


    shapes =
      shapes.filter(
        function (shape) {

          return (
            shape.id !==
            selectedShapeId
          );

        }
      );


    selectedShapeId =
      null;


    renderShapes();

    renderLegend();


    statusBar.textContent =
      "Shape deleted.";

  }
);


/* =========================================
   CLEAR MAP
========================================= */

clearButton.addEventListener(
  "click",
  function () {

    if (
      shapes.length === 0
    ) {

      statusBar.textContent =
        "Your map is already empty.";

      return;
    }


    const confirmed =
      confirm(
        "Clear your entire map?"
      );


    if (!confirmed) {
      return;
    }


    shapes = [];

    selectedShapeId = null;


    renderShapes();

    renderLegend();


    statusBar.textContent =
      "Map cleared.";

  }
);


/* =========================================
   LEGEND
========================================= */

function renderLegend() {

  legendList.innerHTML = "";


  if (
    shapes.length === 0
  ) {

    legendList.innerHTML =
      '<p class="empty-legend">' +
      'No symbols yet.' +
      "</p>";

    return;
  }


  const usedMeanings =
    [];


  shapes.forEach(
    function (shape) {

      const alreadyUsed =
        usedMeanings.find(
          function (item) {

            return (
              item.meaning ===
              shape.meaning &&
              item.type ===
              shape.type
            );

          }
        );


      if (!alreadyUsed) {

        usedMeanings.push({

          meaning:
            shape.meaning,

          type:
            shape.type

        });

      }

    }
  );


  usedMeanings.forEach(
    function (item) {

      const row =
        document.createElement(
          "div"
        );


      row.className =
        "legend-item";


      const symbol =
        document.createElement(
          "div"
        );


      symbol.className =
        "legend-symbol";


      if (
        item.type ===
        "rectangle"
      ) {

        symbol.textContent =
          "▭";

      }


      if (
        item.type ===
        "circle"
      ) {

        symbol.textContent =
          "○";

      }


      if (
        item.type ===
        "triangle"
      ) {

        symbol.textContent =
          "△";

      }


      const text =
        document.createElement(
          "div"
        );


      text.className =
        "legend-text";


      text.textContent =
        item.meaning;


      row.appendChild(
        symbol
      );


      row.appendChild(
        text
      );


      legendList.appendChild(
        row
      );

    }
  );

}


/* =========================================
   REFERENCE MAP
========================================= */

toggleReferenceButton.addEventListener(
  "click",
  function () {

    const hidden =
      referenceContainer.style.display ===
      "none";


    if (hidden) {

      referenceContainer.style.display =
        "block";

      toggleReferenceButton.textContent =
        "Hide Reference";

    } else {

      referenceContainer.style.display =
        "none";

      toggleReferenceButton.textContent =
        "Show Reference";

    }

  }
);


/* =========================================
   START
========================================= */

createGrid();

renderLegend();

renderShapes();

setTool("select");