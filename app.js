/* =========================================================
   OUTDOOR EDUCATION MAP MAKER
   Student + Teacher build
   ========================================================= */

const SVG_NS = "http://www.w3.org/2000/svg";
const HTML_NS = "http://www.w3.org/1999/xhtml";

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 675;

const MIN_SHAPE_SIZE = 30;

const DEFAULT_SHAPE_FILL = "#c7d2df";

const LOCAL_SAVE_KEY = "oeMapMakerLocalV9";

const MAX_HISTORY = 60;


/* =========================================================
   SUPABASE CONNECTION

   Paste the two values from:
   Supabase → Connect → .env.local

   1. NEXT_PUBLIC_SUPABASE_URL
   2. NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
========================================================= */

const APP_CONFIG = {
  supabaseUrl: "https://rdchyopkpbphcefkcnqs.supabase.co",
  supabaseAnonKey: "sb_publishable_t5MAatZBfgjK0ldu-TTKzw_6Fexkgcf",
  referenceBucket: "reference-maps"
};


const BACKEND_READY =
  !APP_CONFIG.supabaseUrl.includes("PASTE_") &&
  !APP_CONFIG.supabaseAnonKey.includes("PASTE_");


const sb =
  BACKEND_READY
    ? window.supabase.createClient(
        APP_CONFIG.supabaseUrl,
        APP_CONFIG.supabaseAnonKey
      )
    : null;


const FIXED_SHAPES = [
  "rectangle",
  "square",
  "circle",
  "oval",
  "triangle",
  "semicircle",
  "diamond",
  "hexagon"
];


const DEFAULT_ALLOWED_TOOLS = {
  move: true,
  shapes: true,
  freehand: true,
  path: true,
  road: true,
  colour: true,
  transform: true,
  layers: true,
  reference: true,
  download: true
};


const $ = id =>
  document.getElementById(id);


/* =========================================================
   DOM
========================================================= */

const studentWorkspace = $("studentWorkspace");
const teacherDashboard = $("teacherDashboard");

const taskIntro = $("taskIntro");
const taskTitle = $("taskTitle");
const taskInstructions = $("taskInstructions");
const taskMembers = $("taskMembers");

const studentProfilePage = $("studentProfilePage");
const profileStudentName = $("profileStudentName");
const profileClassName = $("profileClassName");
const switchStudentButton = $("switchStudentButton");
const studentTaskCode = $("studentTaskCode");
const openStudentTaskButton = $("openStudentTaskButton");
const studentTaskError = $("studentTaskError");
const refreshStudentProjectsButton = $("refreshStudentProjectsButton");
const studentProjectsList = $("studentProjectsList");

const cloudStatus = $("cloudStatus");
const studentBadge = $("studentBadge");
const teacherPortalButton = $("teacherPortalButton");

const canvas = $("drawingCanvas");
const canvasWrap = $("canvasWrap");

const gridLayer = $("gridLayer");
const shapeLayer = $("shapeLayer");
const routeLayer = $("routeLayer");
const annotationLayer = $("annotationLayer");
const selectionLayer = $("selectionLayer");
const temporaryLayer = $("temporaryLayer");

const referenceOverlay = $("referenceOverlay");
const statusBar = $("statusBar");

const northIndicator = $("northIndicator");
const northArrowInner = $("northArrowInner");

const floatingToolbar = $("floatingToolbar");

const selectTool = $("selectTool");
const shapeMenuButton = $("shapeMenuButton");
const freehandTool = $("freehandTool");
const pathMenuButton = $("pathMenuButton");
const roadMenuButton = $("roadMenuButton");
const transformTool = $("transformTool");
const colourMenuButton = $("colourMenuButton");

const sendBackwardToolbarButton =
  $("sendBackwardToolbarButton");

const bringForwardToolbarButton =
  $("bringForwardToolbarButton");

const undoButton = $("undoButton");
const redoButton = $("redoButton");
const deleteButton = $("deleteButton");
const moreMenuButton = $("moreMenuButton");

const shapeFlyout = $("shapeFlyout");
const pathFlyout = $("pathFlyout");
const roadFlyout = $("roadFlyout");
const moreFlyout = $("moreFlyout");

const flyouts = [
  shapeFlyout,
  pathFlyout,
  roadFlyout,
  moreFlyout
];

const shapeButtons =
  document.querySelectorAll(".shape-choice");

const pathColour = $("pathColour");
const pathWidth = $("pathWidth");
const startPathButton = $("startPathButton");

const roadColour = $("roadColour");
const roadWidth = $("roadWidth");
const startRoadButton = $("startRoadButton");

const editSelectedButton = $("editSelectedButton");
const duplicateButton = $("duplicateButton");
const saveNowButton = $("saveNowButton");
const submitButton = $("submitButton");
const downloadButton = $("downloadButton");
const backToProfileButton = $("backToProfileButton");
const clearButton = $("clearButton");

const referenceButton = $("referenceButton");

const legendList = $("legendList");

const colourPanel = $("colourPanel");
const colourSwatches = $("colourSwatches");
const fillColour = $("fillColour");
const closeColourPanel = $("closeColourPanel");

const startupModal = $("startupModal");
const startupClassSelect = $("startupClassSelect");
const startupStudentSelect = $("startupStudentSelect");
const startupError = $("startupError");
const studentLoginButton = $("studentLoginButton");
const startupTeacherLink = $("startupTeacherLink");

const groupModal = $("groupModal");
const groupTaskTitle = $("groupTaskTitle");
const groupMembersList = $("groupMembersList");
const groupError = $("groupError");
const cancelGroupButton = $("cancelGroupButton");
const startGroupTaskButton = $("startGroupTaskButton");

const teacherLoginModal = $("teacherLoginModal");
const teacherEmail = $("teacherEmail");
const teacherPassword = $("teacherPassword");
const teacherLoginError = $("teacherLoginError");
const teacherLoginButton = $("teacherLoginButton");
const cancelTeacherLogin = $("cancelTeacherLogin");

const objectModal = $("objectModal");
const objectNameInput = $("objectNameInput");
const objectCategorySelect = $("objectCategorySelect");
const objectError = $("objectError");
const saveObjectDetailsButton = $("saveObjectDetailsButton");
const discardObjectButton = $("discardObjectButton");

const routeModal = $("routeModal");
const routeModalLabel = $("routeModalLabel");
const routeModalTitle = $("routeModalTitle");
const routeNameInput = $("routeNameInput");
const routeError = $("routeError");
const saveRouteDetailsButton = $("saveRouteDetailsButton");
const discardRouteButton = $("discardRouteButton");

const editModal = $("editModal");
const editNameInput = $("editNameInput");
const editCategoryWrap = $("editCategoryWrap");
const editCategorySelect = $("editCategorySelect");
const editError = $("editError");
const saveEditButton = $("saveEditButton");
const cancelEditButton = $("cancelEditButton");

const createTaskButton = $("createTaskButton");
const teacherSignOutButton = $("teacherSignOutButton");
const teacherTasksList = $("teacherTasksList");
const noTaskSelected = $("noTaskSelected");
const taskEditor = $("taskEditor");

const teacherTasksTabButton = $("teacherTasksTabButton");
const teacherClassesTabButton = $("teacherClassesTabButton");
const teacherTasksPanel = $("teacherTasksPanel");
const teacherClassesPanel = $("teacherClassesPanel");

const taskAssignedClasses = $("taskAssignedClasses");

const createClassButton = $("createClassButton");
const teacherClassesList = $("teacherClassesList");
const noClassSelected = $("noClassSelected");
const classEditor = $("classEditor");
const teacherClassHeading = $("teacherClassHeading");
const teacherClassCount = $("teacherClassCount");
const teacherClassName = $("teacherClassName");
const saveClassNameButton = $("saveClassNameButton");
const archiveClassButton = $("archiveClassButton");
const classListFile = $("classListFile");
const classImportPreview = $("classImportPreview");
const importClassListButton = $("importClassListButton");
const newStudentName = $("newStudentName");
const addStudentButton = $("addStudentButton");
const classRosterList = $("classRosterList");

const teacherTaskHeading = $("teacherTaskHeading");
const teacherTaskCode = $("teacherTaskCode");
const teacherTaskTitle = $("teacherTaskTitle");
const teacherTaskInstructions = $("teacherTaskInstructions");

const saveTaskSettingsButton =
  $("saveTaskSettingsButton");

const teacherReferenceFile =
  $("teacherReferenceFile");

const removeReferenceButton =
  $("removeReferenceButton");

const teacherReferencePreview =
  $("teacherReferencePreview");

const refreshSubmissionsButton =
  $("refreshSubmissionsButton");

const submissionList = $("submissionList");

const permissionInputs = {
  move: $("allowMove"),
  shapes: $("allowShapes"),
  freehand: $("allowFreehand"),
  path: $("allowPath"),
  road: $("allowRoad"),
  colour: $("allowColour"),
  transform: $("allowTransform"),
  layers: $("allowLayers"),
  reference: $("allowReference"),
  download: $("allowDownload")
};

const teacherReviewToolbar =
  $("teacherReviewToolbar");

const annotationPenButton =
  $("annotationPenButton");

const clearAnnotationsButton =
  $("clearAnnotationsButton");

const backToDashboardButton =
  $("backToDashboardButton");

const teacherFeedbackPanel =
  $("teacherFeedbackPanel");

const reviewStudentName =
  $("reviewStudentName");

const teacherFeedbackText =
  $("teacherFeedbackText");

const saveTeacherFeedbackButton =
  $("saveTeacherFeedbackButton");


/* =========================================================
   STATE
========================================================= */

let appMode = "student";

let currentTool = "select";

let shapes = [];
let routes = [];
let annotations = [];

let nextShapeId = 1;
let nextRouteId = 1;

let selectedItem = null;

let pendingDraftId = null;
let pendingRouteId = null;

let draftOriginState = null;

let pointerActive = false;
let startPoint = null;
let currentPoints = [];
let lastMovePoint = null;

let transformAction = null;
let interactionBeforeState = null;

let undoStack = [];
let redoStack = [];

let northAngle = 0;
let northDragging = false;
let northStartAngle = 0;
let northStartRotation = 0;
let northBeforeState = null;

let referenceHoldActive = false;

let colourBeforeState = null;

let saveTimer = null;
let toolbarWakeTimer = null;

let annotationDrawing = false;
let currentAnnotationPoints = [];

let studentInfo = {
  name: "",
  className: "",
  group: ""
};

let currentStudentProfile = null;
let currentStudentRoster = [];
let currentStudentProjects = [];
let pendingTaskLookup = null;

let currentTask = null;
let currentSubmission = null;
let currentReferenceUrl = "";

let allowedTools = {
  ...DEFAULT_ALLOWED_TOOLS
};

let currentTeacherUser = null;
let teacherTasks = [];
let selectedTeacherTask = null;
let reviewSubmission = null;
let teacherLoginReturnView = "startup";

let teacherClasses = [];
let selectedTeacherClass = null;
let selectedClassRoster = [];
let pendingClassImportNames = [];


/* =========================================================
   UTILITIES
========================================================= */

function deepClone(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
}


function stateString(value) {
  return JSON.stringify(value);
}


function clamp(value, minimum, maximum) {
  return Math.max(
    minimum,
    Math.min(
      maximum,
      value
    )
  );
}


function distanceBetween(first, second) {
  return Math.hypot(
    first.x - second.x,
    first.y - second.y
  );
}


function dot(first, second) {
  return (
    first.x * second.x +
    first.y * second.y
  );
}


function add(first, second) {
  return {
    x: first.x + second.x,
    y: first.y + second.y
  };
}


function sub(first, second) {
  return {
    x: first.x - second.x,
    y: first.y - second.y
  };
}


function scale(vector, number) {
  return {
    x: vector.x * number,
    y: vector.y * number
  };
}


function normaliseRotation(angle) {
  while (angle > 180) {
    angle -= 360;
  }

  while (angle < -180) {
    angle += 360;
  }

  return Math.round(angle);
}


function rotatePoint(point, centre, degrees) {
  const radians =
    degrees * Math.PI / 180;

  const cosine =
    Math.cos(radians);

  const sine =
    Math.sin(radians);

  const differenceX =
    point.x - centre.x;

  const differenceY =
    point.y - centre.y;

  return {
    x:
      centre.x +
      differenceX * cosine -
      differenceY * sine,

    y:
      centre.y +
      differenceX * sine +
      differenceY * cosine
  };
}


function getBasis(rotation) {
  const radians =
    rotation * Math.PI / 180;

  return {
    u: {
      x: Math.cos(radians),
      y: Math.sin(radians)
    },

    v: {
      x: -Math.sin(radians),
      y: Math.cos(radians)
    }
  };
}


function pointsToString(points) {
  return points
    .map(
      point =>
        `${point.x},${point.y}`
    )
    .join(" ");
}


function setCloudStatus(text, state = "") {
  cloudStatus.textContent = text;

  cloudStatus.className =
    `cloud-status ${state}`.trim();
}


function safeFileName(name) {
  return name.replace(
    /[^a-zA-Z0-9._-]+/g,
    "_"
  );
}


function randomTaskCode() {
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  return Array.from(
    {
      length: 6
    },
    () =>
      characters[
        Math.floor(
          Math.random() *
          characters.length
        )
      ]
  ).join("");
}


function isStudentEditingAllowed() {
  return appMode === "student";
}


function getCanvasPoint(event) {
  const rectangle =
    canvas.getBoundingClientRect();

  return {
    x:
      clamp(
        (
          (
            event.clientX -
            rectangle.left
          ) /
          rectangle.width
        ) *
        CANVAS_WIDTH,
        0,
        CANVAS_WIDTH
      ),

    y:
      clamp(
        (
          (
            event.clientY -
            rectangle.top
          ) /
          rectangle.height
        ) *
        CANVAS_HEIGHT,
        0,
        CANVAS_HEIGHT
      )
  };
}


/* =========================================================
   PERMANENT GRID
========================================================= */

function createGrid() {
  gridLayer.innerHTML = "";

  const spacing = 50;

  for (
    let x = spacing;
    x < CANVAS_WIDTH;
    x += spacing
  ) {
    const line =
      document.createElementNS(
        SVG_NS,
        "line"
      );

    line.setAttribute("x1", x);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", x);
    line.setAttribute("y2", CANVAS_HEIGHT);
    line.setAttribute("class", "grid-line");

    gridLayer.appendChild(line);
  }

  for (
    let y = spacing;
    y < CANVAS_HEIGHT;
    y += spacing
  ) {
    const line =
      document.createElementNS(
        SVG_NS,
        "line"
      );

    line.setAttribute("x1", 0);
    line.setAttribute("y1", y);
    line.setAttribute("x2", CANVAS_WIDTH);
    line.setAttribute("y2", y);
    line.setAttribute("class", "grid-line");

    gridLayer.appendChild(line);
  }
}


/* =========================================================
   HISTORY
========================================================= */

function captureMapState() {
  return deepClone({
    shapes,
    routes,
    nextShapeId,
    nextRouteId,
    selectedItem,
    pendingDraftId,
    pendingRouteId,
    currentTool,
    northAngle
  });
}


function restoreMapState(state) {
  if (!state) {
    return;
  }

  shapes =
    deepClone(
      state.shapes || []
    );

  routes =
    deepClone(
      state.routes || []
    );

  nextShapeId =
    state.nextShapeId || 1;

  nextRouteId =
    state.nextRouteId || 1;

  selectedItem =
    state.selectedItem || null;

  pendingDraftId =
    state.pendingDraftId ?? null;

  pendingRouteId =
    state.pendingRouteId ?? null;

  currentTool =
    state.currentTool || "select";

  northAngle =
    state.northAngle || 0;

  draftOriginState = null;

  resetInteractionState();

  renderAll();

  scheduleSave();
}


function commitHistory(before) {
  if (!before) {
    return;
  }

  const after =
    captureMapState();

  if (
    stateString(before) ===
    stateString(after)
  ) {
    return;
  }

  undoStack.push(
    deepClone(before)
  );

  if (
    undoStack.length >
    MAX_HISTORY
  ) {
    undoStack.shift();
  }

  redoStack = [];

  updateHistoryButtons();

  scheduleSave();
}


function performUndo() {
  if (!undoStack.length) {
    return;
  }

  const current =
    captureMapState();

  const previous =
    undoStack.pop();

  redoStack.push(current);

  restoreMapState(previous);

  statusBar.textContent =
    "Undo complete.";
}


function performRedo() {
  if (!redoStack.length) {
    return;
  }

  const current =
    captureMapState();

  const next =
    redoStack.pop();

  undoStack.push(current);

  restoreMapState(next);

  statusBar.textContent =
    "Redo complete.";
}


function updateHistoryButtons() {
  undoButton.disabled =
    !undoStack.length;

  redoButton.disabled =
    !redoStack.length;
}


/* =========================================================
   MAP SAVE / LOAD
========================================================= */

function serialiseMap() {
  return {
    version: 9,

    shapes:
      deepClone(
        shapes.filter(
          shape =>
            !shape.draft
        )
      ),

    routes:
      deepClone(
        routes.filter(
          route =>
            !route.draft &&
            route.kind !== "boundary"
        )
      ),

    nextShapeId,
    nextRouteId,
    northAngle
  };
}


function loadMapData(data) {
  const stored = data || {};

  shapes =
    Array.isArray(
      stored.shapes
    )
      ? deepClone(stored.shapes)
      : [];

  routes =
    Array.isArray(
      stored.routes
    )
      ? deepClone(
          stored.routes.filter(
            route =>
              route.kind !==
              "boundary"
          )
        )
      : [];

  nextShapeId =
    Number(
      stored.nextShapeId
    ) ||
    Math.max(
      0,
      ...shapes.map(
        shape =>
          Number(shape.id) || 0
      )
    ) +
    1;

  nextRouteId =
    Number(
      stored.nextRouteId
    ) ||
    Math.max(
      0,
      ...routes.map(
        route =>
          Number(route.id) || 0
      )
    ) +
    1;

  northAngle =
    Number(
      stored.northAngle
    ) || 0;

  selectedItem = null;
  pendingDraftId = null;
  pendingRouteId = null;

  undoStack = [];
  redoStack = [];

  resetInteractionState();

  renderAll();
}


function saveLocalBackup() {
  try {
    localStorage.setItem(
      LOCAL_SAVE_KEY,
      JSON.stringify({
        taskId:
          currentTask?.id || null,

        studentInfo,

        mapData:
          serialiseMap()
      })
    );
  }

  catch (error) {
    console.warn(error);
  }
}


function scheduleSave() {
  clearTimeout(saveTimer);

  saveLocalBackup();

  if (
    appMode !== "student"
  ) {
    return;
  }

  saveTimer =
    setTimeout(
      () =>
        saveStudentMap(false),
      900
    );
}


async function saveStudentMap(
  showMessage = true
) {
  if (
    appMode !== "student"
  ) {
    return;
  }

  saveLocalBackup();

  if (
    !BACKEND_READY ||
    !currentSubmission ||
    !currentStudentProfile
  ) {
    if (showMessage) {
      statusBar.textContent =
        "Saved on this device.";
    }

    return;
  }

  try {
    setCloudStatus(
      "Saving…",
      "busy"
    );

    const {
      data,
      error
    } =
      await sb.rpc(
        "student_save_project",
        {
          p_submission_id:
            currentSubmission.id,

          p_student_id:
            currentStudentProfile.student_id,

          p_map_data:
            serialiseMap(),

          p_submit:
            false
        }
      );

    if (error) {
      throw error;
    }

    currentSubmission.status =
      data ||
      currentSubmission.status ||
      "draft";

    setCloudStatus(
      "Saved",
      "good"
    );

    if (showMessage) {
      statusBar.textContent =
        "✓ Saved to your project.";
    }
  }

  catch (error) {
    console.error(error);

    setCloudStatus(
      "Save failed",
      "bad"
    );

    if (showMessage) {
      statusBar.textContent =
        "Save failed. Your work is still kept on this device.";
    }
  }
}


async function submitToTeacher() {
  if (
    !currentSubmission ||
    !currentStudentProfile ||
    !BACKEND_READY
  ) {
    statusBar.textContent =
      "This project is not connected yet.";

    return;
  }

  try {
    const {
      data,
      error
    } =
      await sb.rpc(
        "student_save_project",
        {
          p_submission_id:
            currentSubmission.id,

          p_student_id:
            currentStudentProfile.student_id,

          p_map_data:
            serialiseMap(),

          p_submit:
            true
        }
      );

    if (error) {
      throw error;
    }

    currentSubmission.status =
      data || "submitted";

    setCloudStatus(
      "Submitted",
      "good"
    );

    statusBar.textContent =
      "✓ Map submitted to your teacher.";
  }

  catch (error) {
    console.error(error);

    setCloudStatus(
      "Submit failed",
      "bad"
    );

    statusBar.textContent =
      "Could not submit the map. Please try again.";
  }
}


/* =========================================================
   REFERENCE MAP
========================================================= */

async function getSignedReferenceUrl(path) {
  if (
    !BACKEND_READY ||
    !path
  ) {
    return "";
  }

  const {
    data,
    error
  } =
    await sb
      .storage
      .from(
        APP_CONFIG.referenceBucket
      )
      .createSignedUrl(
        path,
        3600
      );

  if (error) {
    console.error(error);
    return "";
  }

  return (
    data?.signedUrl || ""
  );
}


async function loadCurrentTaskReference() {
  currentReferenceUrl = "";

  referenceOverlay.hidden = true;

  referenceOverlay.removeAttribute(
    "src"
  );

  if (
    !currentTask?.reference_path
  ) {
    applyToolPermissions();
    return;
  }

  currentReferenceUrl =
    await getSignedReferenceUrl(
      currentTask.reference_path
    );

  if (currentReferenceUrl) {
    referenceOverlay.src =
      currentReferenceUrl;
  }

  applyToolPermissions();
}


function showReferenceOverlay() {
  if (
    !currentReferenceUrl ||
    pointerActive ||
    transformAction
  ) {
    return;
  }

  referenceHoldActive = true;

  referenceOverlay.hidden = false;

  referenceButton.classList.add(
    "holding"
  );

  statusBar.textContent =
    "Reference preview — release to return to your map.";
}


function hideReferenceOverlay() {
  referenceHoldActive = false;

  referenceOverlay.hidden = true;

  referenceButton.classList.remove(
    "holding"
  );
}


function endReferencePreview() {
  if (!referenceHoldActive) {
    return;
  }

  hideReferenceOverlay();

  statusBar.textContent =
    "Reference hidden. Continue building your map.";
}


referenceButton.addEventListener(
  "pointerdown",
  event => {
    event.preventDefault();
    event.stopPropagation();

    referenceButton.setPointerCapture(
      event.pointerId
    );

    showReferenceOverlay();
  }
);


referenceButton.addEventListener(
  "pointerup",
  event => {
    event.preventDefault();

    endReferencePreview();
  }
);


referenceButton.addEventListener(
  "pointercancel",
  endReferencePreview
);


referenceButton.addEventListener(
  "lostpointercapture",
  endReferencePreview
);


referenceButton.addEventListener(
  "contextmenu",
  event =>
    event.preventDefault()
);


/* =========================================================
   TEACHER TOOL PERMISSIONS
========================================================= */

function applyToolPermissions() {
  const settings =
    allowedTools ||
    DEFAULT_ALLOWED_TOOLS;

  selectTool.hidden =
    !settings.move;

  shapeMenuButton.hidden =
    !settings.shapes;

  freehandTool.hidden =
    !settings.freehand;

  pathMenuButton.hidden =
    !settings.path;

  roadMenuButton.hidden =
    !settings.road;

  transformTool.hidden =
    !settings.transform;

  colourMenuButton.hidden =
    !settings.colour;

  sendBackwardToolbarButton.hidden =
    !settings.layers;

  bringForwardToolbarButton.hidden =
    !settings.layers;

  referenceButton.hidden =
    !(
      settings.reference &&
      currentReferenceUrl
    );

  downloadButton.hidden =
    !settings.download;
}


/* =========================================================
   TOOLBAR / FLYOUTS
========================================================= */

function wakeToolbar() {
  floatingToolbar.classList.add(
    "recently-used"
  );

  clearTimeout(toolbarWakeTimer);

  toolbarWakeTimer =
    setTimeout(
      () =>
        floatingToolbar
          .classList
          .remove(
            "recently-used"
          ),
      1200
    );
}


floatingToolbar.addEventListener(
  "pointerdown",
  wakeToolbar
);


function closeFlyouts() {
  flyouts.forEach(
    flyout =>
      flyout.hidden = true
  );

  floatingToolbar
    .classList
    .remove("open");
}


function toggleFlyout(target) {
  const shouldOpen =
    target.hidden;

  closeFlyouts();

  if (shouldOpen) {
    target.hidden = false;

    floatingToolbar
      .classList
      .add("open");
  }

  wakeToolbar();
}


document
  .querySelectorAll(
    "[data-close-flyouts]"
  )
  .forEach(
    button =>
      button.addEventListener(
        "click",
        closeFlyouts
      )
  );


function updateToolbarActiveState() {
  document
    .querySelectorAll(
      ".toolbar-button"
    )
    .forEach(
      button =>
        button
          .classList
          .remove("active")
    );

  if (
    currentTool === "select"
  ) {
    selectTool
      .classList
      .add("active");
  }

  else if (
    FIXED_SHAPES.includes(
      currentTool
    )
  ) {
    shapeMenuButton
      .classList
      .add("active");
  }

  else if (
    currentTool === "freehand"
  ) {
    freehandTool
      .classList
      .add("active");
  }

  else if (
    currentTool === "path"
  ) {
    pathMenuButton
      .classList
      .add("active");
  }

  else if (
    currentTool === "road"
  ) {
    roadMenuButton
      .classList
      .add("active");
  }

  else if (
    currentTool === "transform"
  ) {
    transformTool
      .classList
      .add("active");
  }
}


function setTool(tool) {
  hideColourPanel();

  currentTool = tool;

  if (
    tool !== "transform"
  ) {
    transformAction = null;
  }

  const messages = {
    select:
      "Select and drag an item to move it.",

    transform:
      "Select a landmark to resize or rotate it.",

    freehand:
      "Draw the outline of your landmark.",

    path:
      "Draw your path. You will name it after drawing.",

    road:
      "Draw your road. You will name it after drawing."
  };

  statusBar.textContent =
    messages[tool] ||
    "Drag on the map to create your landmark.";

  canvas.style.cursor =
    [
      "freehand",
      "path",
      "road",
      ...FIXED_SHAPES
    ].includes(tool)
      ? "crosshair"
      : "default";

  updateToolbarActiveState();

  renderAll();

  wakeToolbar();
}


shapeMenuButton.addEventListener(
  "click",
  () => {
    if (
      !blockWhileDraftExists()
    ) {
      toggleFlyout(
        shapeFlyout
      );
    }
  }
);


freehandTool.addEventListener(
  "click",
  () => {
    if (
      !blockWhileDraftExists()
    ) {
      closeFlyouts();

      setTool("freehand");
    }
  }
);


pathMenuButton.addEventListener(
  "click",
  () => {
    if (
      !blockWhileDraftExists()
    ) {
      toggleFlyout(
        pathFlyout
      );
    }
  }
);


roadMenuButton.addEventListener(
  "click",
  () => {
    if (
      !blockWhileDraftExists()
    ) {
      toggleFlyout(
        roadFlyout
      );
    }
  }
);


transformTool.addEventListener(
  "click",
  () => {
    closeFlyouts();
    setTool("transform");
  }
);


selectTool.addEventListener(
  "click",
  () => {
    if (
      !blockWhileDraftExists()
    ) {
      closeFlyouts();
      setTool("select");
    }
  }
);


moreMenuButton.addEventListener(
  "click",
  () => {
    hideColourPanel();

    toggleFlyout(
      moreFlyout
    );
  }
);


shapeButtons.forEach(
  button =>
    button.addEventListener(
      "click",
      () => {
        if (
          !blockWhileDraftExists()
        ) {
          closeFlyouts();

          setTool(
            button.dataset.shapeTool
          );
        }
      }
    )
);


startPathButton.addEventListener(
  "click",
  () => {
    if (
      !blockWhileDraftExists()
    ) {
      closeFlyouts();
      setTool("path");
    }
  }
);


startRoadButton.addEventListener(
  "click",
  () => {
    if (
      !blockWhileDraftExists()
    ) {
      closeFlyouts();
      setTool("road");
    }
  }
);


/* =========================================================
   DRAFT SAFETY
========================================================= */

function getPendingDraft() {
  let draft =
    pendingDraftId !== null
      ? shapes.find(
          shape =>
            shape.id ===
            pendingDraftId &&
            shape.draft
        )
      : null;

  if (!draft) {
    draft =
      shapes.findLast
        ? shapes.findLast(
            shape =>
              shape.draft
          )
        : [...shapes]
            .reverse()
            .find(
              shape =>
                shape.draft
            );

    pendingDraftId =
      draft?.id ?? null;
  }

  return draft || null;
}


function getPendingRoute() {
  let route =
    pendingRouteId !== null
      ? routes.find(
          item =>
            item.id ===
            pendingRouteId &&
            item.draft
        )
      : null;

  if (!route) {
    route =
      routes.findLast
        ? routes.findLast(
            item =>
              item.draft
          )
        : [...routes]
            .reverse()
            .find(
              item =>
                item.draft
            );

    pendingRouteId =
      route?.id ?? null;
  }

  return route || null;
}


function blockWhileDraftExists() {
  const draft =
    getPendingDraft();

  if (draft) {
    selectedItem = {
      kind: "shape",
      id: draft.id
    };

    currentTool = "transform";

    renderAll();

    statusBar.textContent =
      "Finish the current landmark first, then press ✓ Done.";

    return true;
  }

  if (
    getPendingRoute()
  ) {
    statusBar.textContent =
      "Name or discard the current path/road first.";

    return true;
  }

  return false;
}


function resetInteractionState() {
  pointerActive = false;

  startPoint = null;

  currentPoints = [];

  lastMovePoint = null;

  transformAction = null;

  interactionBeforeState = null;

  temporaryLayer.innerHTML = "";
}


/* =========================================================
   SHAPES
========================================================= */

function getDragBounds(
  type,
  start,
  end
) {
  let width =
    Math.abs(
      end.x - start.x
    );

  let height =
    Math.abs(
      end.y - start.y
    );

  if (
    type === "square" ||
    type === "circle"
  ) {
    const size =
      Math.min(
        width,
        height
      );

    return {
      x:
        end.x >= start.x
          ? start.x
          : start.x - size,

      y:
        end.y >= start.y
          ? start.y
          : start.y - size,

      width: size,
      height: size
    };
  }

  return {
    x:
      Math.min(
        start.x,
        end.x
      ),

    y:
      Math.min(
        start.y,
        end.y
      ),

    width,
    height
  };
}


function pointArrayToString(points) {
  return points
    .map(
      point =>
        `${point[0]},${point[1]}`
    )
    .join(" ");
}


function createFixedShapeElement(
  type,
  x,
  y,
  width,
  height
) {
  let element;

  if (
    type === "rectangle" ||
    type === "square"
  ) {
    element =
      document.createElementNS(
        SVG_NS,
        "rect"
      );

    element.setAttribute("x", x);
    element.setAttribute("y", y);
    element.setAttribute("width", width);
    element.setAttribute("height", height);
  }

  else if (
    type === "circle" ||
    type === "oval"
  ) {
    element =
      document.createElementNS(
        SVG_NS,
        "ellipse"
      );

    element.setAttribute(
      "cx",
      x + width / 2
    );

    element.setAttribute(
      "cy",
      y + height / 2
    );

    element.setAttribute(
      "rx",
      width / 2
    );

    element.setAttribute(
      "ry",
      height / 2
    );
  }

  else if (
    type === "triangle"
  ) {
    element =
      document.createElementNS(
        SVG_NS,
        "polygon"
      );

    element.setAttribute(
      "points",
      pointArrayToString([
        [
          x + width / 2,
          y
        ],
        [
          x,
          y + height
        ],
        [
          x + width,
          y + height
        ]
      ])
    );
  }

  else if (
    type === "diamond"
  ) {
    element =
      document.createElementNS(
        SVG_NS,
        "polygon"
      );

    element.setAttribute(
      "points",
      pointArrayToString([
        [
          x + width / 2,
          y
        ],
        [
          x + width,
          y + height / 2
        ],
        [
          x + width / 2,
          y + height
        ],
        [
          x,
          y + height / 2
        ]
      ])
    );
  }

  else if (
    type === "hexagon"
  ) {
    element =
      document.createElementNS(
        SVG_NS,
        "polygon"
      );

    element.setAttribute(
      "points",
      pointArrayToString([
        [
          x + width * .25,
          y
        ],
        [
          x + width * .75,
          y
        ],
        [
          x + width,
          y + height / 2
        ],
        [
          x + width * .75,
          y + height
        ],
        [
          x + width * .25,
          y + height
        ],
        [
          x,
          y + height / 2
        ]
      ])
    );
  }

  else if (
    type === "semicircle"
  ) {
    element =
      document.createElementNS(
        SVG_NS,
        "path"
      );

    element.setAttribute(
      "d",
      `
      M ${x} ${y + height}
      A ${width / 2} ${height}
      0 0 1
      ${x + width} ${y + height}
      L ${x} ${y + height}
      Z
      `
    );
  }

  return element;
}


function getPointsBounds(points) {
  if (
    !points?.length
  ) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }

  const xs =
    points.map(
      point => point.x
    );

  const ys =
    points.map(
      point => point.y
    );

  const minimumX =
    Math.min(...xs);

  const maximumX =
    Math.max(...xs);

  const minimumY =
    Math.min(...ys);

  const maximumY =
    Math.max(...ys);

  return {
    x: minimumX,
    y: minimumY,

    width:
      maximumX -
      minimumX,

    height:
      maximumY -
      minimumY
  };
}


function getShapeBounds(shape) {
  return (
    shape.type === "freehand"
  )
    ? getPointsBounds(
        shape.points
      )
    : {
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height
      };
}


function getShapeCentre(shape) {
  const bounds =
    getShapeBounds(shape);

  return {
    x:
      bounds.x +
      bounds.width / 2,

    y:
      bounds.y +
      bounds.height / 2
  };
}


function getSelectedShape() {
  return (
    selectedItem?.kind === "shape"
  )
    ? shapes.find(
        shape =>
          shape.id ===
          selectedItem.id
      ) || null
    : null;
}


function getSelectedRoute() {
  return (
    selectedItem?.kind === "route"
  )
    ? routes.find(
        route =>
          route.id ===
          selectedItem.id
      ) || null
    : null;
}


function getVisualBounds(shape) {
  const bounds =
    getShapeBounds(shape);

  const centre =
    getShapeCentre(shape);

  return getPointsBounds(
    [
      {
        x: bounds.x,
        y: bounds.y
      },

      {
        x:
          bounds.x +
          bounds.width,

        y: bounds.y
      },

      {
        x:
          bounds.x +
          bounds.width,

        y:
          bounds.y +
          bounds.height
      },

      {
        x: bounds.x,

        y:
          bounds.y +
          bounds.height
      }
    ]
      .map(
        point =>
          rotatePoint(
            point,
            centre,
            shape.rotation || 0
          )
      )
  );
}


function constrainShapeMovement(
  shape,
  dx,
  dy
) {
  const bounds =
    getVisualBounds(shape);

  let x = dx;
  let y = dy;

  if (
    bounds.width <= CANVAS_WIDTH
  ) {
    if (
      bounds.x + x < 0
    ) {
      x = -bounds.x;
    }

    if (
      bounds.x +
      bounds.width +
      x >
      CANVAS_WIDTH
    ) {
      x =
        CANVAS_WIDTH -
        (
          bounds.x +
          bounds.width
        );
    }
  }

  if (
    bounds.height <= CANVAS_HEIGHT
  ) {
    if (
      bounds.y + y < 0
    ) {
      y = -bounds.y;
    }

    if (
      bounds.y +
      bounds.height +
      y >
      CANVAS_HEIGHT
    ) {
      y =
        CANVAS_HEIGHT -
        (
          bounds.y +
          bounds.height
        );
    }
  }

  return {
    dx: x,
    dy: y
  };
}


function constrainPointMovement(
  points,
  dx,
  dy
) {
  const bounds =
    getPointsBounds(points);

  let x = dx;
  let y = dy;

  if (
    bounds.width <= CANVAS_WIDTH
  ) {
    if (
      bounds.x + x < 0
    ) {
      x = -bounds.x;
    }

    if (
      bounds.x +
      bounds.width +
      x >
      CANVAS_WIDTH
    ) {
      x =
        CANVAS_WIDTH -
        (
          bounds.x +
          bounds.width
        );
    }
  }

  if (
    bounds.height <= CANVAS_HEIGHT
  ) {
    if (
      bounds.y + y < 0
    ) {
      y = -bounds.y;
    }

    if (
      bounds.y +
      bounds.height +
      y >
      CANVAS_HEIGHT
    ) {
      y =
        CANVAS_HEIGHT -
        (
          bounds.y +
          bounds.height
        );
    }
  }

  return {
    dx: x,
    dy: y
  };
}


function moveSelectedItem(dx, dy) {
  if (!selectedItem) {
    return;
  }

  if (
    selectedItem.kind === "shape"
  ) {
    const shape =
      getSelectedShape();

    if (!shape) {
      return;
    }

    const movement =
      constrainShapeMovement(
        shape,
        dx,
        dy
      );

    if (
      shape.type === "freehand"
    ) {
      shape.points.forEach(
        point => {
          point.x += movement.dx;
          point.y += movement.dy;
        }
      );
    }

    else {
      shape.x += movement.dx;
      shape.y += movement.dy;
    }
  }

  else {
    const route =
      getSelectedRoute();

    if (!route) {
      return;
    }

    const movement =
      constrainPointMovement(
        route.points,
        dx,
        dy
      );

    route.points.forEach(
      point => {
        point.x += movement.dx;
        point.y += movement.dy;
      }
    );
  }
}


function renderTemporaryFixedShape(
  type,
  bounds
) {
  temporaryLayer.innerHTML = "";

  const element =
    createFixedShapeElement(
      type,
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height
    );

  if (!element) {
    return;
  }

  element.setAttribute(
    "fill",
    DEFAULT_SHAPE_FILL
  );

  element.setAttribute(
    "fill-opacity",
    ".5"
  );

  element.setAttribute(
    "stroke",
    "#246fc1"
  );

  element.setAttribute(
    "stroke-width",
    "4"
  );

  element.setAttribute(
    "stroke-dasharray",
    "10 6"
  );

  temporaryLayer.appendChild(
    element
  );
}


function renderTemporaryFreehand() {
  temporaryLayer.innerHTML = "";

  if (
    currentPoints.length < 2
  ) {
    return;
  }

  const polygon =
    document.createElementNS(
      SVG_NS,
      "polygon"
    );

  polygon.setAttribute(
    "points",
    pointsToString(
      currentPoints
    )
  );

  polygon.setAttribute(
    "fill",
    DEFAULT_SHAPE_FILL
  );

  polygon.setAttribute(
    "fill-opacity",
    ".5"
  );

  polygon.setAttribute(
    "stroke",
    "#246fc1"
  );

  polygon.setAttribute(
    "stroke-width",
    "4"
  );

  temporaryLayer.appendChild(
    polygon
  );
}


function createFreehandDraft() {
  const bounds =
    getPointsBounds(
      currentPoints
    );

  if (
    currentPoints.length < 5 ||
    bounds.width < 15 ||
    bounds.height < 15
  ) {
    statusBar.textContent =
      "Draw a larger freehand outline.";

    currentPoints = [];

    draftOriginState = null;

    return;
  }

  const shape = {
    id: nextShapeId++,
    type: "freehand",
    name: "",
    meaning: "",
    fill: DEFAULT_SHAPE_FILL,
    rotation: 0,
    draft: true,

    points:
      currentPoints.map(
        point => ({
          ...point
        })
      )
  };

  shapes.push(shape);

  pendingDraftId =
    shape.id;

  selectedItem = {
    kind: "shape",
    id: shape.id
  };

  currentPoints = [];

  setTool("transform");
}


/* =========================================================
   PATHS + ROADS
========================================================= */

function renderTemporaryRoute(kind) {
  temporaryLayer.innerHTML = "";

  if (
    currentPoints.length < 2
  ) {
    return;
  }

  if (
    kind === "path"
  ) {
    const line =
      document.createElementNS(
        SVG_NS,
        "polyline"
      );

    line.setAttribute(
      "points",
      pointsToString(
        currentPoints
      )
    );

    line.setAttribute(
      "fill",
      "none"
    );

    line.setAttribute(
      "stroke",
      pathColour.value
    );

    line.setAttribute(
      "stroke-width",
      pathWidth.value
    );

    line.setAttribute(
      "stroke-dasharray",
      "16 10"
    );

    line.setAttribute(
      "stroke-linecap",
      "round"
    );

    temporaryLayer.appendChild(
      line
    );
  }

  else {
    const width =
      Number(
        roadWidth.value
      );

    const edge =
      document.createElementNS(
        SVG_NS,
        "polyline"
      );

    edge.setAttribute(
      "points",
      pointsToString(
        currentPoints
      )
    );

    edge.setAttribute(
      "fill",
      "none"
    );

    edge.setAttribute(
      "stroke",
      "#474943"
    );

    edge.setAttribute(
      "stroke-width",
      width + 7
    );

    edge.setAttribute(
      "stroke-linecap",
      "round"
    );

    edge.setAttribute(
      "stroke-linejoin",
      "round"
    );

    temporaryLayer.appendChild(edge);

    const core =
      document.createElementNS(
        SVG_NS,
        "polyline"
      );

    core.setAttribute(
      "points",
      pointsToString(
        currentPoints
      )
    );

    core.setAttribute(
      "fill",
      "none"
    );

    core.setAttribute(
      "stroke",
      roadColour.value
    );

    core.setAttribute(
      "stroke-width",
      width
    );

    core.setAttribute(
      "stroke-linecap",
      "round"
    );

    core.setAttribute(
      "stroke-linejoin",
      "round"
    );

    temporaryLayer.appendChild(core);
  }
}


function finishRoute(kind) {
  if (
    currentPoints.length < 2
  ) {
    currentPoints = [];
    interactionBeforeState = null;
    return;
  }

  const route = {
    id: nextRouteId++,
    kind,
    name: "",
    draft: true,

    colour:
      kind === "path"
        ? pathColour.value
        : roadColour.value,

    width:
      Number(
        kind === "path"
          ? pathWidth.value
          : roadWidth.value
      ),

    points:
      currentPoints.map(
        point => ({
          ...point
        })
      )
  };

  routes.push(route);

  pendingRouteId =
    route.id;

  selectedItem = {
    kind: "route",
    id: route.id
  };

  currentPoints = [];

  pointerActive = false;

  temporaryLayer.innerHTML = "";

  openRouteModal(route);
}


function routeMidpoint(points) {
  if (!points?.length) {
    return {
      x: 0,
      y: 0
    };
  }

  if (
    points.length === 1
  ) {
    return points[0];
  }

  const segments = [];

  let total = 0;

  for (
    let i = 1;
    i < points.length;
    i++
  ) {
    const length =
      distanceBetween(
        points[i - 1],
        points[i]
      );

    segments.push(length);

    total += length;
  }

  const target =
    total / 2;

  let accumulated = 0;

  for (
    let i = 1;
    i < points.length;
    i++
  ) {
    const length =
      segments[i - 1];

    if (
      accumulated +
      length >=
      target
    ) {
      const proportion =
        (
          target -
          accumulated
        ) /
        (
          length || 1
        );

      return {
        x:
          points[i - 1].x +
          (
            points[i].x -
            points[i - 1].x
          ) *
          proportion,

        y:
          points[i - 1].y +
          (
            points[i].y -
            points[i - 1].y
          ) *
          proportion
      };
    }

    accumulated += length;
  }

  return points[
    Math.floor(
      points.length / 2
    )
  ];
}


/* =========================================================
   TRANSFORM
========================================================= */

function handleSigns(handle) {
  const map = {
    tl: [-1, -1],
    tr: [1, -1],
    br: [1, 1],
    bl: [-1, 1],
    left: [-1, 0],
    right: [1, 0],
    top: [0, -1],
    bottom: [0, 1]
  };

  const [
    hx,
    hy
  ] =
    map[handle] ||
    [0, 0];

  return {
    hx,
    hy
  };
}


function beginRotation(
  point,
  pointerId
) {
  const shape =
    getSelectedShape();

  if (!shape) {
    return;
  }

  if (!shape.draft) {
    interactionBeforeState =
      captureMapState();
  }

  const centre =
    getShapeCentre(shape);

  transformAction = {
    type: "rotate",
    shapeId: shape.id,
    centre,

    startAngle:
      Math.atan2(
        point.y - centre.y,
        point.x - centre.x
      ) *
      180 /
      Math.PI,

    startRotation:
      shape.rotation || 0
  };

  canvas.setPointerCapture(
    pointerId
  );
}


function beginResize(
  handle,
  pointerId
) {
  const shape =
    getSelectedShape();

  if (!shape) {
    return;
  }

  if (!shape.draft) {
    interactionBeforeState =
      captureMapState();
  }

  const bounds =
    getShapeBounds(shape);

  const centre =
    getShapeCentre(shape);

  const basis =
    getBasis(
      shape.rotation || 0
    );

  const {
    hx,
    hy
  } =
    handleSigns(handle);

  const anchor =
    add(
      centre,

      add(
        scale(
          basis.u,
          -hx *
          bounds.width / 2
        ),

        scale(
          basis.v,
          -hy *
          bounds.height / 2
        )
      )
    );

  transformAction = {
    type: "resize",
    shapeId: shape.id,
    handle,
    hx,
    hy,
    anchor,
    u: basis.u,
    v: basis.v,

    originalBounds: {
      ...bounds
    },

    originalPoints:
      shape.type === "freehand"
        ? shape.points.map(
            point => ({
              ...point
            })
          )
        : null
  };

  canvas.setPointerCapture(
    pointerId
  );
}


function resizeSelectedShape(
  shape,
  pointer
) {
  const action =
    transformAction;

  const delta =
    sub(
      pointer,
      action.anchor
    );

  const original =
    action.originalBounds;

  let width =
    original.width;

  let height =
    original.height;

  if (
    action.hx !== 0
  ) {
    width =
      Math.max(
        MIN_SHAPE_SIZE,

        action.hx *
        dot(
          delta,
          action.u
        )
      );
  }

  if (
    action.hy !== 0
  ) {
    height =
      Math.max(
        MIN_SHAPE_SIZE,

        action.hy *
        dot(
          delta,
          action.v
        )
      );
  }

  const isCorner =
    action.hx !== 0 &&
    action.hy !== 0;

  if (
    isCorner &&
    (
      shape.type === "square" ||
      shape.type === "circle"
    )
  ) {
    const size =
      Math.max(
        MIN_SHAPE_SIZE,
        Math.max(
          width,
          height
        )
      );

    width = size;
    height = size;
  }

  else if (
    !isCorner &&
    shape.type === "square"
  ) {
    shape.type = "rectangle";
  }

  else if (
    !isCorner &&
    shape.type === "circle"
  ) {
    shape.type = "oval";
  }

  let centre = {
    ...action.anchor
  };

  if (
    action.hx !== 0
  ) {
    centre =
      add(
        centre,
        scale(
          action.u,
          action.hx *
          width / 2
        )
      );
  }

  if (
    action.hy !== 0
  ) {
    centre =
      add(
        centre,
        scale(
          action.v,
          action.hy *
          height / 2
        )
      );
  }

  const x =
    centre.x -
    width / 2;

  const y =
    centre.y -
    height / 2;

  if (
    shape.type === "freehand"
  ) {
    const originalWidth =
      Math.max(
        original.width,
        1
      );

    const originalHeight =
      Math.max(
        original.height,
        1
      );

    shape.points =
      action
        .originalPoints
        .map(
          point => ({
            x:
              x +
              (
                (
                  point.x -
                  original.x
                ) /
                originalWidth
              ) *
              width,

            y:
              y +
              (
                (
                  point.y -
                  original.y
                ) /
                originalHeight
              ) *
              height
          })
        );
  }

  else {
    shape.x = x;
    shape.y = y;
    shape.width = width;
    shape.height = height;
  }
}


function performTransform(point) {
  if (!transformAction) {
    return;
  }

  const shape =
    shapes.find(
      item =>
        item.id ===
        transformAction.shapeId
    );

  if (!shape) {
    transformAction = null;
    return;
  }

  if (
    transformAction.type ===
    "move"
  ) {
    selectedItem = {
      kind: "shape",
      id: shape.id
    };

    moveSelectedItem(
      point.x -
      transformAction.lastPoint.x,

      point.y -
      transformAction.lastPoint.y
    );

    transformAction.lastPoint =
      point;

    renderAll();
  }

  else if (
    transformAction.type ===
    "rotate"
  ) {
    const centre =
      transformAction.centre;

    const current =
      Math.atan2(
        point.y - centre.y,
        point.x - centre.x
      ) *
      180 /
      Math.PI;

    shape.rotation =
      normaliseRotation(
        transformAction.startRotation +
        current -
        transformAction.startAngle
      );

    renderAll();
  }

  else {
    resizeSelectedShape(
      shape,
      point
    );

    renderAll();
  }
}


/* =========================================================
   POINTER INTERACTION
========================================================= */

canvas.addEventListener(
  "pointerdown",
  event => {
    event.preventDefault();

    if (
      appMode ===
      "teacher-review"
    ) {
      beginTeacherAnnotation(
        event
      );

      return;
    }

    if (
      !isStudentEditingAllowed()
    ) {
      return;
    }

    if (
      referenceHoldActive
    ) {
      return;
    }

    closeFlyouts();

    hideColourPanel();

    let point =
      getCanvasPoint(event);

    if (
      currentTool ===
      "transform"
    ) {
      const done =
        event.target.closest(
          ".done-shape-button"
        );

      if (done) {
        openObjectModal();
        return;
      }

      const rotate =
        event.target.closest(
          ".rotate-handle"
        );

      if (rotate) {
        beginRotation(
          point,
          event.pointerId
        );

        return;
      }

      const handle =
        event.target.closest(
          ".resize-handle"
        );

      if (handle) {
        beginResize(
          handle.dataset.handle,
          event.pointerId
        );

        return;
      }

      const shapeTarget =
        event.target.closest(
          ".map-shape"
        );

      if (shapeTarget) {
        const id =
          Number(
            shapeTarget.dataset.shapeId
          );

        const draft =
          getPendingDraft();

        if (
          draft &&
          id !== draft.id
        ) {
          selectedItem = {
            kind: "shape",
            id: draft.id
          };

          renderAll();

          return;
        }

        selectedItem = {
          kind: "shape",
          id
        };

        const shape =
          getSelectedShape();

        if (
          shape &&
          !shape.draft
        ) {
          interactionBeforeState =
            captureMapState();
        }

        transformAction = {
          type: "move",
          shapeId: id,
          lastPoint: point
        };

        canvas.setPointerCapture(
          event.pointerId
        );

        renderAll();

        return;
      }

      if (
        getPendingDraft()
      ) {
        selectedItem = {
          kind: "shape",
          id:
            getPendingDraft().id
        };

        renderAll();

        return;
      }

      selectedItem = null;

      renderAll();

      return;
    }

    if (
      currentTool ===
      "select"
    ) {
      const routeTarget =
        event.target.closest(
          "[data-route-id]"
        );

      const shapeTarget =
        event.target.closest(
          ".map-shape"
        );

      if (routeTarget) {
        selectedItem = {
          kind: "route",

          id:
            Number(
              routeTarget.dataset.routeId
            )
        };

        if (
          allowedTools.move
        ) {
          interactionBeforeState =
            captureMapState();

          pointerActive = true;

          lastMovePoint = point;

          canvas.setPointerCapture(
            event.pointerId
          );
        }

        renderAll();

        return;
      }

      if (shapeTarget) {
        selectedItem = {
          kind: "shape",

          id:
            Number(
              shapeTarget.dataset.shapeId
            )
        };

        if (
          allowedTools.move
        ) {
          interactionBeforeState =
            captureMapState();

          pointerActive = true;

          lastMovePoint = point;

          canvas.setPointerCapture(
            event.pointerId
          );
        }

        renderAll();

        return;
      }

      selectedItem = null;

      renderAll();

      return;
    }

    if (
      currentTool === "path" ||
      currentTool === "road"
    ) {
      interactionBeforeState =
        captureMapState();

      pointerActive = true;

      currentPoints = [
        point
      ];

      canvas.setPointerCapture(
        event.pointerId
      );

      return;
    }

    if (
      currentTool ===
      "freehand"
    ) {
      draftOriginState =
        captureMapState();

      pointerActive = true;

      currentPoints = [
        point
      ];

      canvas.setPointerCapture(
        event.pointerId
      );

      return;
    }

    if (
      FIXED_SHAPES.includes(
        currentTool
      )
    ) {
      draftOriginState =
        captureMapState();

      pointerActive = true;

      startPoint = point;

      canvas.setPointerCapture(
        event.pointerId
      );
    }
  }
);


canvas.addEventListener(
  "pointermove",
  event => {
    if (
      appMode ===
      "teacher-review"
    ) {
      moveTeacherAnnotation(
        event
      );

      return;
    }

    const point =
      getCanvasPoint(event);

    if (
      currentTool ===
      "transform" &&
      transformAction
    ) {
      performTransform(point);

      return;
    }

    if (!pointerActive) {
      return;
    }

    if (
      currentTool ===
      "select" &&
      selectedItem &&
      lastMovePoint &&
      allowedTools.move
    ) {
      moveSelectedItem(
        point.x -
        lastMovePoint.x,

        point.y -
        lastMovePoint.y
      );

      lastMovePoint = point;

      renderAll();

      return;
    }

    if (
      [
        "path",
        "road",
        "freehand"
      ].includes(
        currentTool
      )
    ) {
      const previous =
        currentPoints[
          currentPoints.length - 1
        ];

      if (
        previous &&
        distanceBetween(
          point,
          previous
        ) > 3
      ) {
        currentPoints.push(
          point
        );

        if (
          currentTool ===
          "freehand"
        ) {
          renderTemporaryFreehand();
        }

        else {
          renderTemporaryRoute(
            currentTool
          );
        }
      }

      return;
    }

    if (
      FIXED_SHAPES.includes(
        currentTool
      ) &&
      startPoint
    ) {
      renderTemporaryFixedShape(
        currentTool,

        getDragBounds(
          currentTool,
          startPoint,
          point
        )
      );
    }
  }
);


canvas.addEventListener(
  "pointerup",
  event => {
    if (
      appMode ===
      "teacher-review"
    ) {
      endTeacherAnnotation(
        event
      );

      return;
    }

    const point =
      getCanvasPoint(event);

    if (
      currentTool ===
      "transform" &&
      transformAction
    ) {
      const edited =
        shapes.find(
          shape =>
            shape.id ===
            transformAction.shapeId
        );

      transformAction = null;

      if (
        edited &&
        !edited.draft
      ) {
        commitHistory(
          interactionBeforeState
        );
      }

      interactionBeforeState = null;

      renderAll();

      return;
    }

    if (!pointerActive) {
      return;
    }

    if (
      currentTool ===
      "select"
    ) {
      commitHistory(
        interactionBeforeState
      );

      interactionBeforeState = null;

      pointerActive = false;

      lastMovePoint = null;

      renderAll();

      return;
    }

    if (
      currentTool === "path" ||
      currentTool === "road"
    ) {
      finishRoute(
        currentTool
      );

      return;
    }

    if (
      currentTool ===
      "freehand"
    ) {
      createFreehandDraft();

      pointerActive = false;

      temporaryLayer.innerHTML =
        "";

      return;
    }

    if (
      FIXED_SHAPES.includes(
        currentTool
      ) &&
      startPoint
    ) {
      const bounds =
        getDragBounds(
          currentTool,
          startPoint,
          point
        );

      temporaryLayer.innerHTML =
        "";

      pointerActive = false;

      startPoint = null;

      if (
        bounds.width < 20 ||
        bounds.height < 20
      ) {
        statusBar.textContent =
          "That shape is too small. Try again.";

        draftOriginState = null;

        return;
      }

      const shape = {
        id: nextShapeId++,
        type: currentTool,
        name: "",
        meaning: "",
        fill: DEFAULT_SHAPE_FILL,
        rotation: 0,
        draft: true,
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height
      };

      shapes.push(shape);

      pendingDraftId =
        shape.id;

      selectedItem = {
        kind: "shape",
        id: shape.id
      };

      setTool("transform");
    }
  }
);


canvas.addEventListener(
  "pointercancel",
  () =>
    resetInteractionState()
);


window.addEventListener(
  "blur",
  () => {
    hideReferenceOverlay();

    if (
      appMode !==
      "teacher-review"
    ) {
      resetInteractionState();
    }
  }
);


/* =========================================================
   LANDMARK NAMING
========================================================= */

function openObjectModal() {
  const draft =
    getPendingDraft();

  if (!draft) {
    return;
  }

  objectNameInput.value = "";

  objectCategorySelect.value =
    "Building";

  objectError.hidden = true;

  objectModal.hidden = false;

  document.body.classList.add(
    "modal-open"
  );

  setTimeout(
    () =>
      objectNameInput.focus(),
    20
  );
}


function closeObjectModal() {
  objectModal.hidden = true;

  document.body.classList.remove(
    "modal-open"
  );
}


saveObjectDetailsButton.addEventListener(
  "click",
  () => {
    const draft =
      getPendingDraft();

    const name =
      objectNameInput
        .value
        .trim();

    if (!draft) {
      closeObjectModal();
      return;
    }

    if (!name) {
      objectError.hidden = false;
      return;
    }

    draft.name = name;

    draft.meaning =
      objectCategorySelect.value;

    draft.draft = false;

    pendingDraftId = null;

    closeObjectModal();

    selectedItem = {
      kind: "shape",
      id: draft.id
    };

    commitHistory(
      draftOriginState
    );

    draftOriginState = null;

    setTool("select");

    statusBar.textContent =
      `${name} added to your map.`;
  }
);


discardObjectButton.addEventListener(
  "click",
  () => {
    const draft =
      getPendingDraft();

    if (draft) {
      shapes =
        shapes.filter(
          shape =>
            shape.id !==
            draft.id
        );
    }

    pendingDraftId = null;

    draftOriginState = null;

    selectedItem = null;

    closeObjectModal();

    setTool("select");

    renderAll();
  }
);


/* =========================================================
   PATH / ROAD NAMING
========================================================= */

function openRouteModal(route) {
  routeModalLabel.textContent =
    route.kind === "road"
      ? "ROAD READY"
      : "PATH READY";

  routeModalTitle.textContent =
    route.kind === "road"
      ? "Name this road"
      : "Name this path";

  routeNameInput.value = "";

  routeError.hidden = true;

  routeModal.hidden = false;

  document.body.classList.add(
    "modal-open"
  );

  setTimeout(
    () =>
      routeNameInput.focus(),
    20
  );
}


function closeRouteModal() {
  routeModal.hidden = true;

  document.body.classList.remove(
    "modal-open"
  );
}


saveRouteDetailsButton.addEventListener(
  "click",
  () => {
    const route =
      getPendingRoute();

    const name =
      routeNameInput
        .value
        .trim();

    if (!route) {
      closeRouteModal();
      return;
    }

    if (!name) {
      routeError.hidden = false;
      return;
    }

    route.name = name;

    route.draft = false;

    pendingRouteId = null;

    closeRouteModal();

    selectedItem = {
      kind: "route",
      id: route.id
    };

    commitHistory(
      interactionBeforeState
    );

    interactionBeforeState = null;

    setTool("select");

    statusBar.textContent =
      `${
        route.kind === "road"
          ? "Road"
          : "Path"
      } added and labelled.`;
  }
);


discardRouteButton.addEventListener(
  "click",
  () => {
    const route =
      getPendingRoute();

    if (route) {
      routes =
        routes.filter(
          item =>
            item.id !==
            route.id
        );
    }

    pendingRouteId = null;

    interactionBeforeState = null;

    selectedItem = null;

    closeRouteModal();

    setTool("select");

    renderAll();
  }
);


/* =========================================================
   COLOUR PANEL
========================================================= */

function showColourPanel() {
  const shape =
    getSelectedShape();

  if (
    !shape ||
    shape.draft
  ) {
    statusBar.textContent =
      "Select a completed landmark first.";

    return;
  }

  fillColour.value =
    shape.fill ||
    DEFAULT_SHAPE_FILL;

  colourBeforeState =
    captureMapState();

  closeFlyouts();

  colourPanel.hidden = false;
}


function hideColourPanel() {
  colourPanel.hidden = true;
}


colourMenuButton.addEventListener(
  "click",
  showColourPanel
);


closeColourPanel.addEventListener(
  "click",
  hideColourPanel
);


colourSwatches.addEventListener(
  "click",
  event => {
    const button =
      event.target.closest(
        "[data-colour]"
      );

    if (!button) {
      return;
    }

    const shape =
      getSelectedShape();

    if (!shape) {
      return;
    }

    shape.fill =
      button.dataset.colour;

    fillColour.value =
      shape.fill;

    renderAll();

    scheduleSave();
  }
);


fillColour.addEventListener(
  "input",
  () => {
    const shape =
      getSelectedShape();

    if (!shape) {
      return;
    }

    shape.fill =
      fillColour.value;

    renderAll();

    scheduleSave();
  }
);


fillColour.addEventListener(
  "change",
  () => {
    commitHistory(
      colourBeforeState
    );

    colourBeforeState =
      captureMapState();
  }
);


/* =========================================================
   EDIT / DUPLICATE / DELETE / LAYERS
========================================================= */

function openEditModal() {
  const shape =
    getSelectedShape();

  const route =
    getSelectedRoute();

  if (
    !shape &&
    !route
  ) {
    statusBar.textContent =
      "Select an item first.";

    return;
  }

  editNameInput.value =
    shape
      ? shape.name
      : route.name;

  editCategoryWrap.hidden =
    !shape;

  if (shape) {
    editCategorySelect.value =
      shape.meaning || "Other";
  }

  editError.hidden = true;

  editModal.hidden = false;

  document.body.classList.add(
    "modal-open"
  );
}


editSelectedButton.addEventListener(
  "click",
  () => {
    closeFlyouts();

    openEditModal();
  }
);


cancelEditButton.addEventListener(
  "click",
  () => {
    editModal.hidden = true;

    document.body.classList.remove(
      "modal-open"
    );
  }
);


saveEditButton.addEventListener(
  "click",
  () => {
    const name =
      editNameInput
        .value
        .trim();

    if (!name) {
      editError.hidden = false;
      return;
    }

    const before =
      captureMapState();

    const shape =
      getSelectedShape();

    const route =
      getSelectedRoute();

    if (shape) {
      shape.name = name;

      shape.meaning =
        editCategorySelect.value;
    }

    else if (route) {
      route.name = name;
    }

    editModal.hidden = true;

    document.body.classList.remove(
      "modal-open"
    );

    commitHistory(before);

    renderAll();
  }
);


function duplicateSelectedLandmark() {
  const original =
    getSelectedShape();

  if (
    !original ||
    original.draft
  ) {
    statusBar.textContent =
      "Select a completed landmark first.";

    return;
  }

  draftOriginState =
    captureMapState();

  const copy =
    deepClone(original);

  copy.id =
    nextShapeId++;

  copy.name = "";
  copy.meaning = "";
  copy.draft = true;

  if (
    copy.type === "freehand"
  ) {
    copy.points.forEach(
      point => {
        point.x += 35;
        point.y += 35;
      }
    );
  }

  else {
    copy.x += 35;
    copy.y += 35;
  }

  shapes.push(copy);

  pendingDraftId =
    copy.id;

  selectedItem = {
    kind: "shape",
    id: copy.id
  };

  closeFlyouts();

  setTool("transform");
}


duplicateButton.addEventListener(
  "click",
  duplicateSelectedLandmark
);


function moveShapeLayer(direction) {
  const shape =
    getSelectedShape();

  if (
    !shape ||
    shape.draft
  ) {
    return;
  }

  const index =
    shapes.findIndex(
      item =>
        item.id ===
        shape.id
    );

  const newIndex =
    direction === "forward"
      ? Math.min(
          shapes.length - 1,
          index + 1
        )
      : Math.max(
          0,
          index - 1
        );

  if (
    index === newIndex
  ) {
    return;
  }

  const before =
    captureMapState();

  const [item] =
    shapes.splice(
      index,
      1
    );

  shapes.splice(
    newIndex,
    0,
    item
  );

  commitHistory(before);

  renderAll();
}


bringForwardToolbarButton.addEventListener(
  "click",
  () =>
    moveShapeLayer(
      "forward"
    )
);


sendBackwardToolbarButton.addEventListener(
  "click",
  () =>
    moveShapeLayer(
      "backward"
    )
);


function deleteSelectedItem() {
  if (!selectedItem) {
    return;
  }

  const before =
    captureMapState();

  if (
    selectedItem.kind ===
    "shape"
  ) {
    shapes =
      shapes.filter(
        shape =>
          shape.id !==
          selectedItem.id
      );
  }

  else {
    routes =
      routes.filter(
        route =>
          route.id !==
          selectedItem.id
      );
  }

  selectedItem = null;

  pendingDraftId = null;
  pendingRouteId = null;

  commitHistory(before);

  setTool("select");
}


deleteButton.addEventListener(
  "click",
  deleteSelectedItem
);


clearButton.addEventListener(
  "click",
  () => {
    if (
      !confirm(
        "Clear the entire map?"
      )
    ) {
      return;
    }

    const before =
      captureMapState();

    shapes = [];
    routes = [];

    selectedItem = null;

    pendingDraftId = null;
    pendingRouteId = null;

    nextShapeId = 1;
    nextRouteId = 1;

    commitHistory(before);

    closeFlyouts();

    setTool("select");
  }
);


undoButton.addEventListener(
  "click",
  performUndo
);


redoButton.addEventListener(
  "click",
  performRedo
);


saveNowButton.addEventListener(
  "click",
  () => {
    closeFlyouts();

    saveStudentMap(true);
  }
);


submitButton.addEventListener(
  "click",
  () => {
    closeFlyouts();

    submitToTeacher();
  }
);


/* =========================================================
   NORTH ARROW
========================================================= */

function renderNorthArrow() {
  northArrowInner.style.transform =
    `rotate(${northAngle}deg)`;
}


northIndicator.addEventListener(
  "pointerdown",
  event => {
    if (
      appMode !==
      "student"
    ) {
      return;
    }

    event.preventDefault();

    const rectangle =
      northIndicator
        .getBoundingClientRect();

    const centreX =
      rectangle.left +
      rectangle.width / 2;

    const centreY =
      rectangle.top +
      rectangle.height / 2;

    northBeforeState =
      captureMapState();

    northDragging = true;

    northStartAngle =
      Math.atan2(
        event.clientY -
        centreY,

        event.clientX -
        centreX
      );

    northStartRotation =
      northAngle;

    northIndicator.setPointerCapture(
      event.pointerId
    );
  }
);


northIndicator.addEventListener(
  "pointermove",
  event => {
    if (!northDragging) {
      return;
    }

    const rectangle =
      northIndicator
        .getBoundingClientRect();

    const centreX =
      rectangle.left +
      rectangle.width / 2;

    const centreY =
      rectangle.top +
      rectangle.height / 2;

    const current =
      Math.atan2(
        event.clientY -
        centreY,

        event.clientX -
        centreX
      );

    northAngle =
      normaliseRotation(
        northStartRotation +
        (
          current -
          northStartAngle
        ) *
        180 /
        Math.PI
      );

    renderNorthArrow();
  }
);


northIndicator.addEventListener(
  "pointerup",
  () => {
    if (!northDragging) {
      return;
    }

    northDragging = false;

    commitHistory(
      northBeforeState
    );

    northBeforeState = null;

    renderAll();
  }
);


/* =========================================================
   RENDER SHAPES
========================================================= */

function renderShapes() {
  shapeLayer.innerHTML = "";

  shapes.forEach(
    shape => {
      let element;

      if (
        shape.type ===
        "freehand"
      ) {
        element =
          document.createElementNS(
            SVG_NS,
            "polygon"
          );

        element.setAttribute(
          "points",
          pointsToString(
            shape.points
          )
        );
      }

      else {
        element =
          createFixedShapeElement(
            shape.type,
            shape.x,
            shape.y,
            shape.width,
            shape.height
          );
      }

      if (!element) {
        return;
      }

      const centre =
        getShapeCentre(shape);

      element.setAttribute(
        "fill",
        shape.fill ||
        DEFAULT_SHAPE_FILL
      );

      element.setAttribute(
        "class",
        "map-shape"
      );

      element.dataset.shapeId =
        shape.id;

      if (shape.draft) {
        element.classList.add(
          "draft-shape"
        );
      }

      if (
        selectedItem?.kind ===
        "shape" &&
        selectedItem.id ===
        shape.id
      ) {
        element.classList.add(
          "selected"
        );
      }

      element.setAttribute(
        "transform",
        `rotate(
          ${shape.rotation || 0}
          ${centre.x}
          ${centre.y}
        )`
      );

      shapeLayer.appendChild(
        element
      );

      if (
        !shape.draft &&
        shape.name
      ) {
        renderWrappedLabel(shape);
      }
    }
  );
}


function calculateLabelFontSize(
  text,
  width,
  height
) {
  return Math.round(
    Math.max(
      9,

      Math.min(
        22,

        height * .32,

        width /
        Math.max(
          3,

          Math.sqrt(
            Math.max(
              text.length,
              1
            )
          ) *
          1.55
        )
      )
    )
  );
}


function renderWrappedLabel(shape) {
  const bounds =
    getShapeBounds(shape);

  const centre =
    getShapeCentre(shape);

  const rotation =
    Math.abs(
      (
        (
          shape.rotation || 0
        ) %
        180 +
        180
      ) %
      180
    );

  let width =
    bounds.width * .68;

  let height =
    bounds.height * .62;

  if (
    rotation > 50 &&
    rotation < 130
  ) {
    width =
      Math.max(
        bounds.width * .5,
        bounds.height * .9
      );

    height =
      Math.max(
        bounds.height * .18,
        bounds.width * .28
      );
  }

  if (
    shape.type ===
    "triangle" ||
    shape.type ===
    "diamond"
  ) {
    width *= .8;
  }

  if (
    shape.type ===
    "semicircle"
  ) {
    height *= .7;
  }

  width =
    Math.max(
      35,
      Math.min(
        width,
        480
      )
    );

  height =
    Math.max(
      24,
      Math.min(
        height,
        150
      )
    );

  const foreignObject =
    document.createElementNS(
      SVG_NS,
      "foreignObject"
    );

  foreignObject.setAttribute(
    "x",
    centre.x -
    width / 2
  );

  foreignObject.setAttribute(
    "y",
    centre.y -
    height / 2
  );

  foreignObject.setAttribute(
    "width",
    width
  );

  foreignObject.setAttribute(
    "height",
    height
  );

  foreignObject.setAttribute(
    "class",
    "shape-label-container"
  );

  const div =
    document.createElementNS(
      HTML_NS,
      "div"
    );

  div.setAttribute(
    "class",
    "shape-label-box"
  );

  div.style.fontSize =
    `${
      calculateLabelFontSize(
        shape.name,
        width,
        height
      )
    }px`;

  div.textContent =
    shape.name;

  foreignObject.appendChild(div);

  shapeLayer.appendChild(
    foreignObject
  );
}


/* =========================================================
   RENDER PATHS + ROADS
========================================================= */

function routePolyline(
  route,
  className
) {
  const line =
    document.createElementNS(
      SVG_NS,
      "polyline"
    );

  line.setAttribute(
    "points",
    pointsToString(
      route.points
    )
  );

  line.setAttribute(
    "fill",
    "none"
  );

  line.setAttribute(
    "class",
    className
  );

  line.dataset.routeId =
    route.id;

  return line;
}


function renderRoutes() {
  routeLayer.innerHTML = "";

  routes.forEach(
    route => {
      if (
        route.kind ===
        "boundary"
      ) {
        return;
      }

      const group =
        document.createElementNS(
          SVG_NS,
          "g"
        );

      const hit =
        routePolyline(
          route,
          "route-hit"
        );

      hit.setAttribute(
        "stroke-width",
        route.kind === "road"
          ? Math.max(
              28,
              route.width + 16
            )
          : Math.max(
              22,
              route.width + 14
            )
      );

      group.appendChild(hit);

      if (
        route.kind === "road"
      ) {
        const edge =
          routePolyline(
            route,
            "road-edge"
          );

        edge.removeAttribute(
          "data-route-id"
        );

        edge.setAttribute(
          "stroke-width",
          route.width + 7
        );

        group.appendChild(edge);

        const core =
          routePolyline(
            route,
            "road-core"
          );

        core.removeAttribute(
          "data-route-id"
        );

        core.setAttribute(
          "stroke",
          route.colour ||
          "#d8d3c6"
        );

        core.setAttribute(
          "stroke-width",
          route.width
        );

        group.appendChild(core);
      }

      else {
        const line =
          routePolyline(
            route,
            "path-line"
          );

        line.removeAttribute(
          "data-route-id"
        );

        line.setAttribute(
          "stroke",
          route.colour ||
          "#3f75a8"
        );

        line.setAttribute(
          "stroke-width",
          route.width || 5
        );

        group.appendChild(line);
      }

      if (
        !route.draft &&
        route.name
      ) {
        const middle =
          routeMidpoint(
            route.points
          );

        const text =
          document.createElementNS(
            SVG_NS,
            "text"
          );

        text.setAttribute(
          "x",
          middle.x
        );

        text.setAttribute(
          "y",
          middle.y
        );

        text.setAttribute(
          "font-size",
          route.kind === "road"
            ? 18
            : 17
        );

        text.setAttribute(
          "class",
          `route-label ${
            route.kind === "road"
              ? "road-label"
              : "path-label"
          }`
        );

        text.textContent =
          route.name;

        group.appendChild(text);
      }

      routeLayer.appendChild(group);
    }
  );
}


/* =========================================================
   TRANSFORM OVERLAY
========================================================= */

function renderSelectionOverlay() {
  selectionLayer.innerHTML = "";

  if (
    appMode !== "student" ||
    currentTool !== "transform"
  ) {
    return;
  }

  const shape =
    getSelectedShape() ||
    getPendingDraft();

  if (!shape) {
    return;
  }

  const bounds =
    getShapeBounds(shape);

  const centre =
    getShapeCentre(shape);

  const group =
    document.createElementNS(
      SVG_NS,
      "g"
    );

  group.setAttribute(
    "transform",
    `rotate(
      ${shape.rotation || 0}
      ${centre.x}
      ${centre.y}
    )`
  );

  const box =
    document.createElementNS(
      SVG_NS,
      "rect"
    );

  box.setAttribute(
    "x",
    bounds.x
  );

  box.setAttribute(
    "y",
    bounds.y
  );

  box.setAttribute(
    "width",
    bounds.width
  );

  box.setAttribute(
    "height",
    bounds.height
  );

  box.setAttribute(
    "class",
    "transform-box"
  );

  group.appendChild(box);

  const handles = [
    [
      "tl",
      bounds.x,
      bounds.y
    ],

    [
      "tr",
      bounds.x +
      bounds.width,
      bounds.y
    ],

    [
      "br",
      bounds.x +
      bounds.width,
      bounds.y +
      bounds.height
    ],

    [
      "bl",
      bounds.x,
      bounds.y +
      bounds.height
    ],

    [
      "left",
      bounds.x,
      bounds.y +
      bounds.height / 2
    ],

    [
      "right",
      bounds.x +
      bounds.width,
      bounds.y +
      bounds.height / 2
    ],

    [
      "top",
      bounds.x +
      bounds.width / 2,
      bounds.y
    ],

    [
      "bottom",
      bounds.x +
      bounds.width / 2,
      bounds.y +
      bounds.height
    ]
  ];

  handles.forEach(
    (
      [
        name,
        x,
        y
      ]
    ) => {
      const handle =
        document.createElementNS(
          SVG_NS,
          "circle"
        );

      handle.setAttribute(
        "cx",
        x
      );

      handle.setAttribute(
        "cy",
        y
      );

      handle.setAttribute(
        "r",
        11
      );

      handle.setAttribute(
        "class",
        `resize-handle handle-${name}`
      );

      handle.dataset.handle =
        name;

      group.appendChild(handle);
    }
  );

  const middleX =
    bounds.x +
    bounds.width / 2;

  const line =
    document.createElementNS(
      SVG_NS,
      "line"
    );

  line.setAttribute(
    "x1",
    middleX
  );

  line.setAttribute(
    "y1",
    bounds.y
  );

  line.setAttribute(
    "x2",
    middleX
  );

  line.setAttribute(
    "y2",
    bounds.y - 45
  );

  line.setAttribute(
    "class",
    "rotate-line"
  );

  group.appendChild(line);

  const rotate =
    document.createElementNS(
      SVG_NS,
      "circle"
    );

  rotate.setAttribute(
    "cx",
    middleX
  );

  rotate.setAttribute(
    "cy",
    bounds.y - 58
  );

  rotate.setAttribute(
    "r",
    13
  );

  rotate.setAttribute(
    "class",
    "rotate-handle"
  );

  group.appendChild(rotate);

  selectionLayer.appendChild(group);

  if (
    shape.id ===
    pendingDraftId
  ) {
    renderDoneButton(shape);
  }
}


function renderDoneButton(shape) {
  const bounds =
    getShapeBounds(shape);

  const centre =
    getShapeCentre(shape);

  const local =
    (
      bounds.y +
      bounds.height +
      75 <
      CANVAS_HEIGHT
    )
      ? {
          x:
            bounds.x +
            bounds.width / 2,

          y:
            bounds.y +
            bounds.height +
            52
        }
      : {
          x:
            bounds.x +
            bounds.width / 2,

          y:
            bounds.y - 52
        };

  let position =
    rotatePoint(
      local,
      centre,
      shape.rotation || 0
    );

  position.x =
    clamp(
      position.x,
      58,
      CANVAS_WIDTH - 58
    );

  position.y =
    clamp(
      position.y,
      28,
      CANVAS_HEIGHT - 28
    );

  const group =
    document.createElementNS(
      SVG_NS,
      "g"
    );

  group.setAttribute(
    "class",
    "done-shape-button"
  );

  group.setAttribute(
    "transform",
    `translate(
      ${position.x}
      ${position.y}
    )`
  );

  const rectangle =
    document.createElementNS(
      SVG_NS,
      "rect"
    );

  rectangle.setAttribute(
    "x",
    -52
  );

  rectangle.setAttribute(
    "y",
    -21
  );

  rectangle.setAttribute(
    "width",
    104
  );

  rectangle.setAttribute(
    "height",
    42
  );

  rectangle.setAttribute(
    "rx",
    20
  );

  rectangle.setAttribute(
    "class",
    "done-shape-rect"
  );

  const text =
    document.createElementNS(
      SVG_NS,
      "text"
    );

  text.setAttribute(
    "x",
    0
  );

  text.setAttribute(
    "y",
    1
  );

  text.setAttribute(
    "class",
    "done-shape-text"
  );

  text.textContent = "✓ Done";

  group.append(
    rectangle,
    text
  );

  selectionLayer.appendChild(group);
}


/* =========================================================
   LEGEND
========================================================= */

function createLegendShapePreview(shape) {
  const svg =
    document.createElementNS(
      SVG_NS,
      "svg"
    );

  svg.setAttribute(
    "viewBox",
    "0 0 31 24"
  );

  svg.setAttribute(
    "class",
    "legend-preview"
  );

  let element;

  if (
    shape.type ===
    "freehand"
  ) {
    element =
      document.createElementNS(
        SVG_NS,
        "polygon"
      );

    element.setAttribute(
      "points",
      "3,14 6,5 14,3 27,7 27,18 20,21 7,20"
    );
  }

  else {
    element =
      createFixedShapeElement(
        shape.type,
        3,
        3,
        25,
        18
      );
  }

  if (element) {
    element.setAttribute(
      "fill",
      shape.fill
    );

    element.setAttribute(
      "stroke",
      "#3b3d3a"
    );

    element.setAttribute(
      "stroke-width",
      2
    );

    svg.appendChild(element);
  }

  return svg;
}


function createLegendRoutePreview(route) {
  const svg =
    document.createElementNS(
      SVG_NS,
      "svg"
    );

  svg.setAttribute(
    "viewBox",
    "0 0 31 24"
  );

  svg.setAttribute(
    "class",
    "legend-preview"
  );

  if (
    route.kind === "road"
  ) {
    const edge =
      document.createElementNS(
        SVG_NS,
        "line"
      );

    edge.setAttribute("x1", 2);
    edge.setAttribute("y1", 12);
    edge.setAttribute("x2", 29);
    edge.setAttribute("y2", 12);
    edge.setAttribute("stroke", "#474943");
    edge.setAttribute("stroke-width", 8);
    edge.setAttribute("stroke-linecap", "round");

    svg.appendChild(edge);

    const core =
      document.createElementNS(
        SVG_NS,
        "line"
      );

    core.setAttribute("x1", 2);
    core.setAttribute("y1", 12);
    core.setAttribute("x2", 29);
    core.setAttribute("y2", 12);
    core.setAttribute("stroke", route.colour);
    core.setAttribute("stroke-width", 4);
    core.setAttribute("stroke-linecap", "round");

    svg.appendChild(core);
  }

  else {
    const line =
      document.createElementNS(
        SVG_NS,
        "line"
      );

    line.setAttribute("x1", 2);
    line.setAttribute("y1", 12);
    line.setAttribute("x2", 29);
    line.setAttribute("y2", 12);
    line.setAttribute("stroke", route.colour);
    line.setAttribute("stroke-width", 4);
    line.setAttribute("stroke-dasharray", "6 4");
    line.setAttribute("stroke-linecap", "round");

    svg.appendChild(line);
  }

  return svg;
}


function renderLegend() {
  legendList.innerHTML = "";

  const completedShapes =
    shapes.filter(
      shape =>
        !shape.draft
    );

  const completedRoutes =
    routes.filter(
      route =>
        !route.draft &&
        route.kind !==
        "boundary"
    );

  if (
    !completedShapes.length &&
    !completedRoutes.length
  ) {
    legendList.innerHTML =
      `
      <p class="empty-legend">
        Your map symbols will appear here automatically.
      </p>
      `;

    return;
  }

  const items = [
    ...completedShapes.map(
      shape => ({
        preview:
          createLegendShapePreview(
            shape
          ),

        name:
          shape.name,

        type:
          shape.meaning
      })
    ),

    ...completedRoutes.map(
      route => ({
        preview:
          createLegendRoutePreview(
            route
          ),

        name:
          route.name,

        type:
          route.kind ===
          "road"
            ? "Road"
            : "Path"
      })
    )
  ];

  items.forEach(
    item => {
      const row =
        document.createElement(
          "div"
        );

      row.className =
        "legend-item";

      const text =
        document.createElement(
          "div"
        );

      text.className =
        "legend-text";

      const name =
        document.createElement(
          "div"
        );

      name.className =
        "legend-object-name";

      name.textContent =
        item.name;

      const type =
        document.createElement(
          "div"
        );

      type.className =
        "legend-category";

      type.textContent =
        item.type;

      text.append(
        name,
        type
      );

      row.append(
        item.preview,
        text
      );

      legendList.appendChild(
        row
      );
    }
  );
}


/* =========================================================
   BUTTON STATE
========================================================= */

function updateLayerButtons() {
  const shape =
    getSelectedShape();

  const valid =
    Boolean(
      shape &&
      !shape.draft &&
      allowedTools.layers
    );

  if (!valid) {
    sendBackwardToolbarButton.disabled =
      true;

    bringForwardToolbarButton.disabled =
      true;

    return;
  }

  const index =
    shapes.findIndex(
      item =>
        item.id ===
        shape.id
    );

  sendBackwardToolbarButton.disabled =
    index <= 0;

  bringForwardToolbarButton.disabled =
    index >=
    shapes.length - 1;
}


function updateMoreButtons() {
  duplicateButton.disabled =
    !getSelectedShape();

  editSelectedButton.disabled =
    !getSelectedShape() &&
    !getSelectedRoute();

  submitButton.hidden =
    appMode !== "student";
}


function renderAll() {
  createGrid();

  renderShapes();

  renderRoutes();

  renderAnnotations();

  renderSelectionOverlay();

  renderLegend();

  renderNorthArrow();

  updateToolbarActiveState();

  updateHistoryButtons();

  updateLayerButtons();

  updateMoreButtons();

  applyToolPermissions();
}


/* =========================================================
   TEACHER RED-PEN ANNOTATIONS
========================================================= */

function renderAnnotations() {
  annotationLayer.innerHTML = "";

  annotations.forEach(
    stroke => {
      const polyline =
        document.createElementNS(
          SVG_NS,
          "polyline"
        );

      polyline.setAttribute(
        "points",
        pointsToString(
          stroke.points || []
        )
      );

      polyline.setAttribute(
        "class",
        "teacher-ink"
      );

      annotationLayer.appendChild(
        polyline
      );
    }
  );

  if (
    annotationDrawing &&
    currentAnnotationPoints.length >
    1
  ) {
    const polyline =
      document.createElementNS(
        SVG_NS,
        "polyline"
      );

    polyline.setAttribute(
      "points",
      pointsToString(
        currentAnnotationPoints
      )
    );

    polyline.setAttribute(
      "class",
      "teacher-ink"
    );

    annotationLayer.appendChild(
      polyline
    );
  }
}


function beginTeacherAnnotation(event) {
  if (
    !annotationPenButton
      .classList
      .contains("active")
  ) {
    return;
  }

  annotationDrawing = true;

  currentAnnotationPoints = [
    getCanvasPoint(event)
  ];

  canvas.setPointerCapture(
    event.pointerId
  );
}


function moveTeacherAnnotation(event) {
  if (!annotationDrawing) {
    return;
  }

  const point =
    getCanvasPoint(event);

  const previous =
    currentAnnotationPoints[
      currentAnnotationPoints.length - 1
    ];

  if (
    distanceBetween(
      point,
      previous
    ) > 3
  ) {
    currentAnnotationPoints.push(
      point
    );

    renderAnnotations();
  }
}


function endTeacherAnnotation() {
  if (!annotationDrawing) {
    return;
  }

  annotationDrawing = false;

  if (
    currentAnnotationPoints.length >
    1
  ) {
    annotations.push({
      points:
        currentAnnotationPoints.map(
          point => ({
            ...point
          })
        )
    });
  }

  currentAnnotationPoints = [];

  renderAnnotations();
}


annotationPenButton.addEventListener(
  "click",
  () =>
    annotationPenButton
      .classList
      .toggle("active")
);


clearAnnotationsButton.addEventListener(
  "click",
  () => {
    if (
      confirm(
        "Clear all teacher ink on this submission?"
      )
    ) {
      annotations = [];

      renderAnnotations();
    }
  }
);


/* =========================================================
   STUDENT ENTRY + PROFILE + GROUP PROJECTS
========================================================= */

async function ensureAnonymousStudentSession() {
  if (!BACKEND_READY) {
    return null;
  }

  const {
    data: {
      session
    }
  } =
    await sb
      .auth
      .getSession();

  if (
    session?.user?.is_anonymous
  ) {
    return session.user;
  }

  if (session) {
    await sb
      .auth
      .signOut();
  }

  const {
    data,
    error
  } =
    await sb
      .auth
      .signInAnonymously();

  if (error) {
    throw error;
  }

  return data.user;
}


async function prepareStudentLogin() {
  startupError.hidden = true;

  startupClassSelect.innerHTML =
    `<option value="">Loading classes…</option>`;

  startupStudentSelect.innerHTML =
    `<option value="">Select your class first</option>`;

  startupStudentSelect.disabled = true;

  if (!BACKEND_READY) {
    startupClassSelect.innerHTML =
      `<option value="">Backend not configured</option>`;

    studentLoginButton.disabled = true;

    startupError.textContent =
      "Student profiles need the connected class database.";

    startupError.hidden = false;

    return;
  }

  studentLoginButton.disabled = false;

  try {
    await ensureAnonymousStudentSession();

    const {
      data,
      error
    } =
      await sb.rpc(
        "student_list_classes"
      );

    if (error) {
      throw error;
    }

    const classes =
      Array.isArray(data)
        ? data
        : [];

    startupClassSelect.innerHTML =
      `<option value="">Select your class</option>`;

    classes.forEach(
      item => {
        const option =
          document.createElement(
            "option"
          );

        option.value =
          item.id;

        option.textContent =
          item.class_name;

        startupClassSelect.appendChild(
          option
        );
      }
    );

    if (!classes.length) {
      startupClassSelect.innerHTML =
        `<option value="">No classes available</option>`;

      studentLoginButton.disabled = true;
    }
  }

  catch (error) {
    console.error(error);

    startupError.textContent =
      error.message ||
      "Could not load classes.";

    startupError.hidden = false;

    startupClassSelect.innerHTML =
      `<option value="">Could not load classes</option>`;
  }
}


async function loadStudentRoster(
  classId
) {
  currentStudentRoster = [];

  startupStudentSelect.innerHTML =
    `<option value="">Loading names…</option>`;

  startupStudentSelect.disabled =
    true;

  if (!classId) {
    startupStudentSelect.innerHTML =
      `<option value="">Select your class first</option>`;

    return;
  }

  try {
    const {
      data,
      error
    } =
      await sb.rpc(
        "student_list_roster",
        {
          p_class_id:
            classId
        }
      );

    if (error) {
      throw error;
    }

    currentStudentRoster =
      Array.isArray(data)
        ? data
        : [];

    startupStudentSelect.innerHTML =
      `<option value="">Select your name</option>`;

    currentStudentRoster.forEach(
      student => {
        const option =
          document.createElement(
            "option"
          );

        option.value =
          student.id;

        option.textContent =
          student.student_name;

        startupStudentSelect.appendChild(
          option
        );
      }
    );

    startupStudentSelect.disabled =
      !currentStudentRoster.length;
  }

  catch (error) {
    console.error(error);

    startupStudentSelect.innerHTML =
      `<option value="">Could not load names</option>`;

    startupError.textContent =
      error.message ||
      "Could not load the class list.";

    startupError.hidden = false;
  }
}


startupClassSelect.addEventListener(
  "change",
  async () => {
    startupError.hidden = true;

    await loadStudentRoster(
      startupClassSelect.value
    );
  }
);


async function loginStudentProfile() {
  startupError.hidden = true;

  const classId =
    startupClassSelect.value;

  const studentId =
    startupStudentSelect.value;

  if (
    !classId ||
    !studentId
  ) {
    startupError.textContent =
      "Please select your class and your name.";

    startupError.hidden = false;

    return;
  }

  studentLoginButton.disabled = true;
  studentLoginButton.textContent =
    "Opening…";

  try {
    await ensureAnonymousStudentSession();

    const {
      data,
      error
    } =
      await sb.rpc(
        "student_select_profile",
        {
          p_student_id:
            studentId
        }
      );

    if (error) {
      throw error;
    }

    const profile =
      Array.isArray(data)
        ? data[0]
        : data;

    if (!profile) {
      throw new Error(
        "Student profile was not found."
      );
    }

    currentStudentProfile =
      profile;

    studentInfo = {
      name:
        profile.student_name,

      className:
        profile.class_name,

      group:
        ""
    };

    profileStudentName.textContent =
      profile.student_name;

    profileClassName.textContent =
      profile.class_name;

    studentBadge.textContent =
      `${profile.student_name} · ${profile.class_name}`;

    startupModal.hidden = true;

    studentWorkspace.hidden = true;

    teacherDashboard.hidden = true;

    studentProfilePage.hidden = false;

    document.body.classList.remove(
      "modal-open"
    );

    await loadStudentProjectHistory();

    studentTaskCode.value = "";

    studentTaskError.hidden = true;

    studentTaskCode.focus();
  }

  catch (error) {
    console.error(error);

    startupError.textContent =
      error.message ||
      "Could not open your profile.";

    startupError.hidden = false;
  }

  finally {
    studentLoginButton.disabled = false;
    studentLoginButton.textContent =
      "Continue";
  }
}


studentLoginButton.addEventListener(
  "click",
  loginStudentProfile
);


async function loadStudentProjectHistory() {
  if (!currentStudentProfile) {
    return;
  }

  studentProjectsList.innerHTML =
    `<p class="helper-text">Loading projects…</p>`;

  try {
    const {
      data,
      error
    } =
      await sb.rpc(
        "student_project_history",
        {
          p_student_id:
            currentStudentProfile.student_id
        }
      );

    if (error) {
      throw error;
    }

    currentStudentProjects =
      Array.isArray(data)
        ? data
        : [];

    renderStudentProjectHistory();
  }

  catch (error) {
    console.error(error);

    studentProjectsList.innerHTML =
      `
      <p class="helper-text">
        ${escapeHtml(
          error.message ||
          "Could not load projects."
        )}
      </p>
      `;
  }
}


function renderStudentProjectHistory() {
  studentProjectsList.innerHTML = "";

  if (!currentStudentProjects.length) {
    studentProjectsList.innerHTML =
      `
      <p class="helper-text">
        No projects yet. Enter a task code to start.
      </p>
      `;

    return;
  }

  currentStudentProjects.forEach(
    project => {
      const button =
        document.createElement(
          "button"
        );

      button.type = "button";

      button.className =
        "student-project-card";

      const members =
        Array.isArray(
          project.group_members
        )
          ? project.group_members
              .map(
                member =>
                  member.student_name
              )
              .filter(Boolean)
          : [];

      button.innerHTML =
        `
        <div class="student-project-card-head">
          <div>
            <strong>
              ${escapeHtml(
                project.task_title ||
                "Mapping Activity"
              )}
            </strong>

            <div class="student-project-meta">
              Last edited
              ${
                project.updated_at
                  ? new Date(
                      project.updated_at
                    ).toLocaleString()
                  : "—"
              }
            </div>
          </div>

          <span class="student-project-status ${
            project.status ===
            "submitted"
              ? "submitted"
              : ""
          }">
            ${escapeHtml(
              project.status ||
              "draft"
            )}
          </span>
        </div>

        <div class="student-project-members">
          ${
            members.length > 1
              ? `Group: ${
                  escapeHtml(
                    members.join(" · ")
                  )
                }`
              : "Individual project"
          }
        </div>
        `;

      button.addEventListener(
        "click",
        () =>
          loadStudentProject(
            project.submission_id
          )
      );

      studentProjectsList.appendChild(
        button
      );
    }
  );
}


refreshStudentProjectsButton.addEventListener(
  "click",
  loadStudentProjectHistory
);


async function openTaskFromCode() {
  if (!currentStudentProfile) {
    return;
  }

  const code =
    studentTaskCode
      .value
      .trim()
      .toUpperCase();

  studentTaskError.hidden = true;

  if (!code) {
    studentTaskError.textContent =
      "Enter the task code from your teacher.";

    studentTaskError.hidden = false;

    return;
  }

  openStudentTaskButton.disabled = true;
  openStudentTaskButton.textContent =
    "Checking…";

  try {
    const {
      data,
      error
    } =
      await sb.rpc(
        "student_get_task_by_code",
        {
          p_code:
            code,

          p_student_id:
            currentStudentProfile.student_id
        }
      );

    if (error) {
      throw error;
    }

    const task =
      Array.isArray(data)
        ? data[0]
        : data;

    if (!task) {
      throw new Error(
        "Task code not found for your class."
      );
    }

    if (
      task.existing_submission_id
    ) {
      await loadStudentProject(
        task.existing_submission_id
      );

      return;
    }

    pendingTaskLookup =
      task;

    await showGroupSelection();
  }

  catch (error) {
    console.error(error);

    studentTaskError.textContent =
      error.message ||
      "Could not open this task.";

    studentTaskError.hidden = false;
  }

  finally {
    openStudentTaskButton.disabled =
      false;

    openStudentTaskButton.textContent =
      "Continue";
  }
}


openStudentTaskButton.addEventListener(
  "click",
  openTaskFromCode
);


studentTaskCode.addEventListener(
  "keydown",
  event => {
    if (event.key === "Enter") {
      openTaskFromCode();
    }
  }
);


async function showGroupSelection() {
  if (
    !pendingTaskLookup ||
    !currentStudentProfile
  ) {
    return;
  }

  if (
    !currentStudentRoster.length
  ) {
    const {
      data,
      error
    } =
      await sb.rpc(
        "student_list_roster",
        {
          p_class_id:
            currentStudentProfile.class_id
        }
      );

    if (error) {
      throw error;
    }

    currentStudentRoster =
      data || [];
  }

  groupTaskTitle.textContent =
    pendingTaskLookup.title ||
    "Who are you working with?";

  groupMembersList.innerHTML = "";

  currentStudentRoster.forEach(
    student => {
      const isCurrent =
        student.id ===
        currentStudentProfile.student_id;

      const label =
        document.createElement(
          "label"
        );

      label.className =
        "group-member-option" +
        (
          isCurrent
            ? " current-student"
            : ""
        );

      label.innerHTML =
        `
        <input
          type="checkbox"
          value="${escapeHtml(
            student.id
          )}"
          ${
            isCurrent
              ? "checked disabled"
              : ""
          }
        >

        <span>
          ${escapeHtml(
            student.student_name
          )}
          ${
            isCurrent
              ? "<strong> · You</strong>"
              : ""
          }
        </span>
        `;

      groupMembersList.appendChild(
        label
      );
    }
  );

  groupError.hidden = true;

  groupModal.hidden = false;

  document.body.classList.add(
    "modal-open"
  );
}


cancelGroupButton.addEventListener(
  "click",
  () => {
    groupModal.hidden = true;

    pendingTaskLookup = null;

    document.body.classList.remove(
      "modal-open"
    );
  }
);


startGroupTaskButton.addEventListener(
  "click",
  async () => {
    if (
      !pendingTaskLookup ||
      !currentStudentProfile
    ) {
      return;
    }

    groupError.hidden = true;

    startGroupTaskButton.disabled =
      true;

    startGroupTaskButton.textContent =
      "Starting…";

    const selectedMembers =
      Array.from(
        groupMembersList
          .querySelectorAll(
            'input[type="checkbox"]:checked:not(:disabled)'
          )
      )
        .map(
          input =>
            input.value
        );

    try {
      const {
        data,
        error
      } =
        await sb.rpc(
          "student_start_group_project",
          {
            p_task_code:
              pendingTaskLookup.task_code,

            p_student_id:
              currentStudentProfile.student_id,

            p_member_ids:
              selectedMembers
          }
        );

      if (error) {
        throw error;
      }

      const submissionId =
        data;

      groupModal.hidden = true;

      document.body.classList.remove(
        "modal-open"
      );

      pendingTaskLookup = null;

      await loadStudentProject(
        submissionId
      );
    }

    catch (error) {
      console.error(error);

      groupError.textContent =
        error.message ||
        "Could not start the group project.";

      groupError.hidden = false;
    }

    finally {
      startGroupTaskButton.disabled =
        false;

      startGroupTaskButton.textContent =
        "Start Activity";
    }
  }
);


async function loadStudentProject(
  submissionId
) {
  if (
    !currentStudentProfile ||
    !submissionId
  ) {
    return;
  }

  try {
    const {
      data,
      error
    } =
      await sb.rpc(
        "student_load_project",
        {
          p_submission_id:
            submissionId,

          p_student_id:
            currentStudentProfile.student_id
        }
      );

    if (error) {
      throw error;
    }

    const project =
      Array.isArray(data)
        ? data[0]
        : data;

    if (!project) {
      throw new Error(
        "This project could not be opened."
      );
    }

    currentTask = {
      id:
        project.task_id,

      title:
        project.task_title,

      task_code:
        project.task_code,

      instructions:
        project.instructions,

      reference_path:
        project.reference_path,

      allowed_tools:
        project.allowed_tools
    };

    currentSubmission = {
      id:
        project.submission_id,

      status:
        project.status,

      updated_at:
        project.updated_at,

      submitted_at:
        project.submitted_at
    };

    allowedTools = {
      ...DEFAULT_ALLOWED_TOOLS,
      ...(
        project.allowed_tools ||
        {}
      )
    };

    const members =
      Array.isArray(
        project.group_members
      )
        ? project.group_members
        : [];

    studentInfo = {
      name:
        currentStudentProfile.student_name,

      className:
        currentStudentProfile.class_name,

      group:
        members
          .map(
            member =>
              member.student_name
          )
          .filter(Boolean)
          .join(", ")
    };

    loadMapData(
      project.map_data ||
      {}
    );

    taskTitle.textContent =
      currentTask.title ||
      "Abstract Mapping";

    taskInstructions.textContent =
      currentTask.instructions ||
      "";

    const memberNames =
      members
        .map(
          member =>
            member.student_name
        )
        .filter(Boolean);

    taskMembers.textContent =
      memberNames.length > 1
        ? `Group: ${memberNames.join(" · ")}`
        : "Individual project";

    taskIntro.hidden = false;

    studentProfilePage.hidden = true;

    teacherDashboard.hidden = true;

    studentWorkspace.hidden = false;

    floatingToolbar.hidden = false;

    teacherReviewToolbar.hidden = true;

    teacherFeedbackPanel.hidden = true;

    appMode = "student";

    setCloudStatus(
      "Saved project",
      "good"
    );

    await loadCurrentTaskReference();

    setTool("select");

    renderAll();

    statusBar.textContent =
      project.status ===
      "submitted"
        ? "This project has been submitted. You can continue editing and resubmit if needed."
        : "Project opened. Your work saves automatically.";
  }

  catch (error) {
    console.error(error);

    studentTaskError.textContent =
      error.message ||
      "Could not load the project.";

    studentTaskError.hidden = false;

    studentProfilePage.hidden = false;

    studentWorkspace.hidden = true;
  }
}


async function returnToStudentProfile() {
  if (!currentStudentProfile) {
    window.location.reload();
    return;
  }

  if (
    appMode ===
    "student"
  ) {
    await saveStudentMap(false);
  }

  closeFlyouts();

  hideColourPanel();

  studentWorkspace.hidden = true;

  teacherDashboard.hidden = true;

  studentProfilePage.hidden = false;

  taskIntro.hidden = true;

  currentTask = null;
  currentSubmission = null;
  currentReferenceUrl = "";

  referenceOverlay.hidden = true;

  await loadStudentProjectHistory();

  studentTaskCode.value = "";

  studentTaskError.hidden = true;
}


backToProfileButton.addEventListener(
  "click",
  returnToStudentProfile
);


switchStudentButton.addEventListener(
  "click",
  async () => {
    currentStudentProfile = null;
    currentStudentProjects = [];
    currentStudentRoster = [];

    studentProfilePage.hidden = true;
    studentWorkspace.hidden = true;
    teacherDashboard.hidden = true;

    startupModal.hidden = false;

    document.body.classList.add(
      "modal-open"
    );

    startupClassSelect.value = "";

    startupStudentSelect.innerHTML =
      `<option value="">Select your class first</option>`;

    startupStudentSelect.disabled =
      true;

    await prepareStudentLogin();
  }
);


/* =========================================================
   TEACHER LOGIN
========================================================= */

function openTeacherLogin() {
  if (!BACKEND_READY) {
    alert(
      "Teacher mode needs Supabase first."
    );

    return;
  }

  teacherLoginReturnView =
    !studentWorkspace.hidden
      ? "workspace"
      : !studentProfilePage.hidden
        ? "profile"
        : "startup";

  startupModal.hidden = true;

  teacherLoginError.hidden = true;

  teacherLoginModal.hidden = false;

  document.body.classList.add(
    "modal-open"
  );

  teacherEmail.focus();
}


teacherPortalButton.addEventListener(
  "click",
  openTeacherLogin
);


startupTeacherLink.addEventListener(
  "click",
  openTeacherLogin
);


cancelTeacherLogin.addEventListener(
  "click",
  () => {
    teacherLoginModal.hidden = true;

    if (
      teacherLoginReturnView ===
      "startup"
    ) {
      startupModal.hidden = false;
    }

    else {
      document.body.classList.remove(
        "modal-open"
      );
    }
  }
);


teacherLoginButton.addEventListener(
  "click",
  async () => {
    teacherLoginError.hidden = true;

    teacherLoginButton.disabled = true;

    try {
      await sb
        .auth
        .signOut();

      const {
        data,
        error
      } =
        await sb
          .auth
          .signInWithPassword({
            email:
              teacherEmail
                .value
                .trim(),

            password:
              teacherPassword.value
          });

      if (error) {
        throw error;
      }

      currentTeacherUser =
        data.user;

      const profile =
        await sb
          .from(
            "teacher_profiles"
          )
          .upsert(
            {
              id:
                data.user.id,

              display_name:
                data.user.email
            },
            {
              onConflict:
                "id"
            }
          )
          .select()
          .single();

      if (profile.error) {
        throw profile.error;
      }

      teacherLoginModal.hidden =
        true;

      document.body.classList.remove(
        "modal-open"
      );

      await openTeacherDashboard();
    }

    catch (error) {
      teacherLoginError.textContent =
        error.message ||
        "Could not sign in.";

      teacherLoginError.hidden =
        false;
    }

    finally {
      teacherLoginButton.disabled =
        false;
    }
  }
);


/* =========================================================
   TEACHER DASHBOARD
========================================================= */

function setTeacherSection(section) {
  const showTasks =
    section === "tasks";

  teacherTasksPanel.hidden =
    !showTasks;

  teacherClassesPanel.hidden =
    showTasks;

  teacherTasksTabButton.classList.toggle(
    "active",
    showTasks
  );

  teacherClassesTabButton.classList.toggle(
    "active",
    !showTasks
  );

  teacherTasksTabButton.setAttribute(
    "aria-selected",
    showTasks
      ? "true"
      : "false"
  );

  teacherClassesTabButton.setAttribute(
    "aria-selected",
    !showTasks
      ? "true"
      : "false"
  );
}


teacherTasksTabButton.addEventListener(
  "click",
  () =>
    setTeacherSection("tasks")
);


teacherClassesTabButton.addEventListener(
  "click",
  () =>
    setTeacherSection("classes")
);


async function openTeacherDashboard() {
  appMode =
    "teacher-dashboard";

  studentWorkspace.hidden = true;
  studentProfilePage.hidden = true;

  teacherDashboard.hidden = false;

  startupModal.hidden = true;

  teacherReviewToolbar.hidden = true;
  teacherFeedbackPanel.hidden = true;

  setTeacherSection("tasks");

  setCloudStatus(
    "Teacher mode",
    "good"
  );

  await loadTeacherClasses();
  await loadTeacherTasks();
}


teacherSignOutButton.addEventListener(
  "click",
  async () => {
    if (BACKEND_READY) {
      await sb
        .auth
        .signOut();
    }

    currentTeacherUser = null;

    window.location.reload();
  }
);


/* =========================================================
   TEACHER CLASSES
========================================================= */

async function loadTeacherClasses() {
  if (!currentTeacherUser) {
    return;
  }

  const {
    data,
    error
  } =
    await sb
      .from("classes")
      .select("*")
      .eq(
        "active",
        true
      )
      .order(
        "class_name",
        {
          ascending: true
        }
      );

  if (error) {
    alert(error.message);
    return;
  }

  teacherClasses =
    data || [];

  const classIds =
    teacherClasses.map(
      item =>
        item.id
    );

  const counts = {};

  if (classIds.length) {
    const studentsResult =
      await sb
        .from("students")
        .select(
          "id,class_id"
        )
        .in(
          "class_id",
          classIds
        )
        .eq(
          "active",
          true
        );

    if (studentsResult.error) {
      alert(
        studentsResult.error.message
      );
    }

    else {
      (
        studentsResult.data ||
        []
      ).forEach(
        student => {
          counts[
            student.class_id
          ] =
            (
              counts[
                student.class_id
              ] ||
              0
            ) +
            1;
        }
      );
    }
  }

  teacherClasses =
    teacherClasses.map(
      item => ({
        ...item,
        student_count:
          counts[item.id] ||
          0
      })
    );

  renderTeacherClassList();

  if (selectedTeacherTask) {
    await loadTaskClassAssignments(
      selectedTeacherTask.id
    );
  }

  if (selectedTeacherClass) {
    const refreshed =
      teacherClasses.find(
        item =>
          item.id ===
          selectedTeacherClass.id
      );

    if (refreshed) {
      await selectTeacherClass(
        refreshed
      );
    }

    else {
      selectedTeacherClass = null;
      noClassSelected.hidden = false;
      classEditor.hidden = true;
    }
  }
}


function renderTeacherClassList() {
  teacherClassesList.innerHTML = "";

  if (!teacherClasses.length) {
    teacherClassesList.innerHTML =
      `
      <p class="helper-text">
        No classes yet.
      </p>
      `;

    return;
  }

  teacherClasses.forEach(
    item => {
      const button =
        document.createElement(
          "button"
        );

      button.type = "button";

      button.className =
        "teacher-task-item" +
        (
          selectedTeacherClass?.id ===
          item.id
            ? " active"
            : ""
        );

      button.innerHTML =
        `
        <strong>
          ${escapeHtml(
            item.class_name
          )}
        </strong>

        <span>
          ${
            Number(
              item.student_count
            ) ||
            0
          }
          students
        </span>
        `;

      button.addEventListener(
        "click",
        () =>
          selectTeacherClass(
            item
          )
      );

      teacherClassesList.appendChild(
        button
      );
    }
  );
}


createClassButton.addEventListener(
  "click",
  async () => {
    const name =
      prompt(
        "Class name",
        ""
      )?.trim();

    if (!name) {
      return;
    }

    const {
      data,
      error
    } =
      await sb
        .from("classes")
        .insert({
          teacher_id:
            currentTeacherUser.id,

          class_name:
            name,

          active:
            true
        })
        .select()
        .single();

    if (error) {
      alert(
        error.code ===
        "23505"
          ? "A class with this name already exists."
          : error.message
      );

      return;
    }

    await loadTeacherClasses();

    const created =
      teacherClasses.find(
        item =>
          item.id ===
          data.id
      );

    if (created) {
      await selectTeacherClass(
        created
      );
    }
  }
);


async function selectTeacherClass(
  classItem
) {
  selectedTeacherClass =
    classItem;

  noClassSelected.hidden =
    true;

  classEditor.hidden =
    false;

  teacherClassHeading.textContent =
    classItem.class_name;

  teacherClassName.value =
    classItem.class_name;

  pendingClassImportNames = [];

  classListFile.value = "";

  classImportPreview.hidden =
    true;

  classImportPreview.innerHTML =
    "";

  importClassListButton.disabled =
    true;

  const {
    data,
    error
  } =
    await sb
      .from("students")
      .select("*")
      .eq(
        "class_id",
        classItem.id
      )
      .eq(
        "active",
        true
      )
      .order(
        "register_no",
        {
          ascending: true,
          nullsFirst: false
        }
      )
      .order(
        "student_name",
        {
          ascending: true
        }
      );

  if (error) {
    alert(error.message);
    return;
  }

  selectedClassRoster =
    data || [];

  teacherClassCount.textContent =
    `${selectedClassRoster.length} ${
      selectedClassRoster.length ===
      1
        ? "student"
        : "students"
    }`;

  renderTeacherClassList();
  renderClassRoster();
}


function renderClassRoster() {
  classRosterList.innerHTML = "";

  if (!selectedClassRoster.length) {
    classRosterList.innerHTML =
      `
      <p class="helper-text">
        No students yet. Upload a class list or add a student.
      </p>
      `;

    return;
  }

  selectedClassRoster.forEach(
    (
      student,
      index
    ) => {
      const row =
        document.createElement(
          "div"
        );

      row.className =
        "class-roster-row";

      row.innerHTML =
        `
        <span class="roster-number">
          ${
            student.register_no ??
            index + 1
          }
        </span>

        <span class="roster-name">
          ${escapeHtml(
            student.student_name
          )}
        </span>
        `;

      const remove =
        document.createElement(
          "button"
        );

      remove.type = "button";

      remove.className =
        "roster-remove";

      remove.textContent =
        "Remove";

      remove.addEventListener(
        "click",
        async () => {
          if (
            !confirm(
              `Remove ${student.student_name} from the active class list?`
            )
          ) {
            return;
          }

          const {
            error
          } =
            await sb
              .from("students")
              .update({
                active:
                  false
              })
              .eq(
                "id",
                student.id
              );

          if (error) {
            alert(error.message);
            return;
          }

          await loadTeacherClasses();
        }
      );

      row.appendChild(remove);

      classRosterList.appendChild(
        row
      );
    }
  );
}


saveClassNameButton.addEventListener(
  "click",
  async () => {
    if (!selectedTeacherClass) {
      return;
    }

    const name =
      teacherClassName
        .value
        .trim();

    if (!name) {
      alert(
        "Enter a class name."
      );
      return;
    }

    const {
      data,
      error
    } =
      await sb
        .from("classes")
        .update({
          class_name:
            name
        })
        .eq(
          "id",
          selectedTeacherClass.id
        )
        .select()
        .single();

    if (error) {
      alert(
        error.code ===
        "23505"
          ? "A class with this name already exists."
          : error.message
      );

      return;
    }

    selectedTeacherClass =
      data;

    await loadTeacherClasses();
  }
);


archiveClassButton.addEventListener(
  "click",
  async () => {
    if (!selectedTeacherClass) {
      return;
    }

    if (
      !confirm(
        `Archive ${selectedTeacherClass.class_name}? Students will no longer see it on the login screen.`
      )
    ) {
      return;
    }

    const {
      error
    } =
      await sb
        .from("classes")
        .update({
          active:
            false
        })
        .eq(
          "id",
          selectedTeacherClass.id
        );

    if (error) {
      alert(error.message);
      return;
    }

    selectedTeacherClass = null;

    noClassSelected.hidden = false;
    classEditor.hidden = true;

    await loadTeacherClasses();
  }
);


function cleanImportedNames(
  names
) {
  const seen =
    new Set();

  return names
    .map(
      name =>
        String(
          name ?? ""
        )
          .replace(
            /\s+/g,
            " "
          )
          .trim()
    )
    .filter(Boolean)
    .filter(
      name => {
        const key =
          name.toLocaleLowerCase();

        if (
          seen.has(key)
        ) {
          return false;
        }

        seen.add(key);

        return true;
      }
    );
}


async function parseClassListFile(
  file
) {
  if (
    !window.XLSX
  ) {
    throw new Error(
      "The spreadsheet reader did not load. Refresh the page and try again."
    );
  }

  const buffer =
    await file.arrayBuffer();

  const workbook =
    window.XLSX.read(
      buffer,
      {
        type:
          "array"
      }
    );

  const firstSheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const rows =
    window.XLSX.utils
      .sheet_to_json(
        firstSheet,
        {
          header:
            1,

          raw:
            false,

          defval:
            ""
        }
      );

  if (!rows.length) {
    return [];
  }

  const firstRow =
    rows[0].map(
      value =>
        String(value)
          .trim()
    );

  let nameColumn =
    firstRow.findIndex(
      value =>
        /^(student\s*)?(full\s*)?name$/i
          .test(value)
    );

  let startRow = 0;

  if (
    nameColumn >= 0
  ) {
    startRow = 1;
  }

  else {
    const widest =
      Math.max(
        ...rows.map(
          row =>
            row.length
        ),
        1
      );

    const counts =
      Array.from(
        {
          length:
            widest
        },
        () =>
          0
      );

    rows.forEach(
      row => {
        for (
          let index = 0;
          index < widest;
          index++
        ) {
          if (
            String(
              row[index] ?? ""
            ).trim()
          ) {
            counts[index] +=
              1;
          }
        }
      }
    );

    nameColumn =
      counts.indexOf(
        Math.max(
          ...counts
        )
      );
  }

  return cleanImportedNames(
    rows
      .slice(
        startRow
      )
      .map(
        row =>
          row[
            nameColumn
          ]
      )
  );
}


classListFile.addEventListener(
  "change",
  async () => {
    const file =
      classListFile
        .files?.[0];

    pendingClassImportNames = [];

    classImportPreview.hidden =
      true;

    importClassListButton.disabled =
      true;

    if (!file) {
      return;
    }

    try {
      pendingClassImportNames =
        await parseClassListFile(
          file
        );

      if (
        !pendingClassImportNames.length
      ) {
        throw new Error(
          "No student names were found in this file."
        );
      }

      classImportPreview.innerHTML =
        `
        <strong>
          ${pendingClassImportNames.length}
          names found
        </strong>

        ${pendingClassImportNames
          .map(
            (
              name,
              index
            ) =>
              `${
                index + 1
              }. ${
                escapeHtml(
                  name
                )
              }`
          )
          .join("<br>")}
        `;

      classImportPreview.hidden =
        false;

      importClassListButton.disabled =
        false;
    }

    catch (error) {
      console.error(error);

      alert(
        error.message ||
        "Could not read the class list."
      );

      classListFile.value = "";
    }
  }
);


importClassListButton.addEventListener(
  "click",
  async () => {
    if (
      !selectedTeacherClass ||
      !pendingClassImportNames.length
    ) {
      return;
    }

    importClassListButton.disabled =
      true;

    importClassListButton.textContent =
      "Importing…";

    try {
      const allExistingResult =
        await sb
          .from("students")
          .select(
            "id,student_name,register_no,active"
          )
          .eq(
            "class_id",
            selectedTeacherClass.id
          );

      if (
        allExistingResult.error
      ) {
        throw allExistingResult.error;
      }

      const allExisting =
        allExistingResult.data ||
        [];

      const byName =
        new Map(
          allExisting.map(
            student => [
              student.student_name
                .trim()
                .toLocaleLowerCase(),

              student
            ]
          )
        );

      let nextRegister =
        Math.max(
          0,
          ...allExisting.map(
            student =>
              Number(
                student.register_no
              ) ||
              0
          )
        ) +
        1;

      const toInsert = [];
      const toReactivate = [];

      pendingClassImportNames.forEach(
        name => {
          const key =
            name.toLocaleLowerCase();

          const existing =
            byName.get(key);

          if (existing) {
            if (!existing.active) {
              toReactivate.push(
                existing.id
              );
            }

            return;
          }

          toInsert.push({
            class_id:
              selectedTeacherClass.id,

            register_no:
              nextRegister++,

            student_name:
              name,

            active:
              true
          });
        }
      );

      if (toInsert.length) {
        const insertResult =
          await sb
            .from("students")
            .insert(
              toInsert
            );

        if (
          insertResult.error
        ) {
          throw insertResult.error;
        }
      }

      if (toReactivate.length) {
        const reactivateResult =
          await sb
            .from("students")
            .update({
              active:
                true
            })
            .in(
              "id",
              toReactivate
            );

        if (
          reactivateResult.error
        ) {
          throw reactivateResult.error;
        }
      }

      pendingClassImportNames = [];

      classListFile.value = "";

      classImportPreview.hidden =
        true;

      importClassListButton.textContent =
        "✓ Imported";

      await loadTeacherClasses();

      setTimeout(
        () => {
          importClassListButton.textContent =
            "Import Students";

          importClassListButton.disabled =
            true;
        },
        1200
      );
    }

    catch (error) {
      console.error(error);

      alert(
        error.message ||
        "Could not import the class list."
      );

      importClassListButton.textContent =
        "Import Students";

      importClassListButton.disabled =
        false;
    }
  }
);


addStudentButton.addEventListener(
  "click",
  async () => {
    if (!selectedTeacherClass) {
      return;
    }

    const name =
      newStudentName
        .value
        .replace(
          /\s+/g,
          " "
        )
        .trim();

    if (!name) {
      return;
    }

    const existingResult =
      await sb
        .from("students")
        .select("*")
        .eq(
          "class_id",
          selectedTeacherClass.id
        )
        .eq(
          "student_name",
          name
        )
        .maybeSingle();

    if (
      existingResult.error
    ) {
      alert(
        existingResult.error.message
      );

      return;
    }

    if (existingResult.data) {
      if (
        existingResult.data.active
      ) {
        alert(
          "That student is already in this class."
        );

        return;
      }

      const {
        error
      } =
        await sb
          .from("students")
          .update({
            active:
              true
          })
          .eq(
            "id",
            existingResult.data.id
          );

      if (error) {
        alert(error.message);
        return;
      }
    }

    else {
      const maxRegister =
        Math.max(
          0,
          ...selectedClassRoster.map(
            student =>
              Number(
                student.register_no
              ) ||
              0
          )
        );

      const {
        error
      } =
        await sb
          .from("students")
          .insert({
            class_id:
              selectedTeacherClass.id,

            register_no:
              maxRegister +
              1,

            student_name:
              name,

            active:
              true
          });

      if (error) {
        alert(error.message);
        return;
      }
    }

    newStudentName.value = "";

    await loadTeacherClasses();
  }
);


/* =========================================================
   TEACHER TASKS
========================================================= */

async function loadTeacherTasks() {
  const {
    data,
    error
  } =
    await sb
      .from("tasks")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if (error) {
    alert(error.message);
    return;
  }

  teacherTasks =
    data || [];

  renderTeacherTaskList();

  if (selectedTeacherTask) {
    const refreshed =
      teacherTasks.find(
        task =>
          task.id ===
          selectedTeacherTask.id
      );

    if (refreshed) {
      await selectTeacherTask(
        refreshed
      );
    }
  }
}


function renderTeacherTaskList() {
  teacherTasksList.innerHTML = "";

  if (!teacherTasks.length) {
    teacherTasksList.innerHTML =
      `
      <p class="helper-text">
        No tasks yet.
      </p>
      `;

    return;
  }

  teacherTasks.forEach(
    task => {
      const button =
        document.createElement(
          "button"
        );

      button.type = "button";

      button.className =
        "teacher-task-item" +
        (
          selectedTeacherTask?.id ===
          task.id
            ? " active"
            : ""
        );

      button.innerHTML =
        `
        <strong>
          ${escapeHtml(
            task.title ||
            "Untitled Task"
          )}
        </strong>

        <span>
          Code
          ${escapeHtml(
            task.task_code ||
            ""
          )}
        </span>
        `;

      button.addEventListener(
        "click",
        () =>
          selectTeacherTask(
            task
          )
      );

      teacherTasksList.appendChild(
        button
      );
    }
  );
}


function escapeHtml(string) {
  return String(
    string ?? ""
  )
    .replace(
      /[&<>'"]/g,
      character =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;"
        })[
          character
        ]
    );
}


createTaskButton.addEventListener(
  "click",
  async () => {
    let result = null;

    for (
      let i = 0;
      i < 4 &&
      !result;
      i++
    ) {
      const code =
        randomTaskCode();

      const attempt =
        await sb
          .from("tasks")
          .insert({
            teacher_id:
              currentTeacherUser.id,

            title:
              "New OE Mapping Task",

            task_code:
              code,

            instructions:
              "Create an abstract map using relative size and position.",

            allowed_tools: {
              ...DEFAULT_ALLOWED_TOOLS
            }
          })
          .select()
          .single();

      if (!attempt.error) {
        result =
          attempt.data;
      }

      else if (
        attempt.error.code !==
        "23505"
      ) {
        alert(
          attempt.error.message
        );

        return;
      }
    }

    if (!result) {
      alert(
        "Could not generate a unique task code. Try again."
      );

      return;
    }

    await loadTeacherTasks();

    await selectTeacherTask(
      result
    );
  }
);


async function loadTaskClassAssignments(
  taskId
) {
  if (
    !taskId
  ) {
    return;
  }

  const {
    data,
    error
  } =
    await sb
      .from("task_classes")
      .select(
        "class_id"
      )
      .eq(
        "task_id",
        taskId
      );

  if (error) {
    taskAssignedClasses.innerHTML =
      `
      <p class="helper-text">
        ${escapeHtml(
          error.message
        )}
      </p>
      `;

    return;
  }

  const assigned =
    new Set(
      (
        data ||
        []
      ).map(
        item =>
          item.class_id
      )
    );

  renderTaskClassAssignments(
    assigned
  );
}


function renderTaskClassAssignments(
  assigned =
    new Set()
) {
  taskAssignedClasses.innerHTML = "";

  if (!teacherClasses.length) {
    taskAssignedClasses.innerHTML =
      `
      <p class="helper-text">
        No active classes yet. Open the Classes tab to create one.
      </p>
      `;

    return;
  }

  teacherClasses.forEach(
    classItem => {
      const label =
        document.createElement(
          "label"
        );

      label.className =
        "class-checkbox-option";

      label.innerHTML =
        `
        <input
          type="checkbox"
          value="${escapeHtml(
            classItem.id
          )}"
          ${
            assigned.has(
              classItem.id
            )
              ? "checked"
              : ""
          }
        >

        <span>
          ${escapeHtml(
            classItem.class_name
          )}
        </span>
        `;

      taskAssignedClasses.appendChild(
        label
      );
    }
  );
}


async function selectTeacherTask(task) {
  selectedTeacherTask = task;

  noTaskSelected.hidden = true;

  taskEditor.hidden = false;

  teacherTaskHeading.textContent =
    task.title || "Task";

  teacherTaskCode.textContent =
    task.task_code || "------";

  teacherTaskTitle.value =
    task.title || "";

  teacherTaskInstructions.value =
    task.instructions || "";

  const tools = {
    ...DEFAULT_ALLOWED_TOOLS,
    ...(
      task.allowed_tools ||
      {}
    )
  };

  Object.entries(
    permissionInputs
  )
    .forEach(
      (
        [
          key,
          input
        ]
      ) => {
        input.checked =
          Boolean(
            tools[key]
          );
      }
    );

  await loadTaskClassAssignments(
    task.id
  );

  teacherReferencePreview.hidden =
    true;

  teacherReferencePreview.removeAttribute(
    "src"
  );

  if (
    task.reference_path
  ) {
    const url =
      await getSignedReferenceUrl(
        task.reference_path
      );

    if (url) {
      teacherReferencePreview.src =
        url;

      teacherReferencePreview.hidden =
        false;
    }
  }

  renderTeacherTaskList();

  await loadSubmissions();
}


saveTaskSettingsButton.addEventListener(
  "click",
  async () => {
    if (
      !selectedTeacherTask
    ) {
      return;
    }

    const originalButtonText =
      "Save Task Settings";

    saveTaskSettingsButton.disabled =
      true;

    saveTaskSettingsButton.textContent =
      "Saving…";

    setCloudStatus(
      "Saving task settings…",
      "busy"
    );

    const allowed = {};

    Object.entries(
      permissionInputs
    )
      .forEach(
        (
          [
            key,
            input
          ]
        ) => {
          allowed[key] =
            input.checked;
        }
      );

    const selectedClassIds =
      Array.from(
        taskAssignedClasses
          .querySelectorAll(
            'input[type="checkbox"]:checked'
          )
      )
        .map(
          input =>
            input.value
        );

    const payload = {
      title:
        teacherTaskTitle
          .value
          .trim() ||
        "Untitled Task",

      instructions:
        teacherTaskInstructions
          .value
          .trim(),

      allowed_tools:
        allowed
    };

    try {
      const {
        data,
        error
      } =
        await sb
          .from("tasks")
          .update(payload)
          .eq(
            "id",
            selectedTeacherTask.id
          )
          .select()
          .single();

      if (error) {
        throw error;
      }

      const deleteAssignments =
        await sb
          .from("task_classes")
          .delete()
          .eq(
            "task_id",
            selectedTeacherTask.id
          );

      if (
        deleteAssignments.error
      ) {
        throw deleteAssignments.error;
      }

      if (
        selectedClassIds.length
      ) {
        const assignmentRows =
          selectedClassIds.map(
            classId => ({
              task_id:
                selectedTeacherTask.id,

              class_id:
                classId
            })
          );

        const insertAssignments =
          await sb
            .from("task_classes")
            .insert(
              assignmentRows
            );

        if (
          insertAssignments.error
        ) {
          throw insertAssignments.error;
        }
      }

      selectedTeacherTask =
        data;

      teacherTaskHeading.textContent =
        data.title;

      await loadTeacherTasks();

      saveTaskSettingsButton.textContent =
        "✓ Saved";

      setCloudStatus(
        "Task settings saved",
        "good"
      );

      setTimeout(
        () => {
          saveTaskSettingsButton.textContent =
            originalButtonText;

          saveTaskSettingsButton.disabled =
            false;

          if (
            appMode ===
            "teacher-dashboard"
          ) {
            setCloudStatus(
              "Teacher mode",
              "good"
            );
          }
        },
        1400
      );
    }

    catch (error) {
      console.error(error);

      saveTaskSettingsButton.textContent =
        "Save failed";

      setCloudStatus(
        "Task settings save failed",
        "bad"
      );

      alert(
        error.message ||
        "Could not save task settings."
      );

      setTimeout(
        () => {
          saveTaskSettingsButton.textContent =
            originalButtonText;

          saveTaskSettingsButton.disabled =
            false;
        },
        1800
      );
    }
  }
);


/* =========================================================
   TEACHER REFERENCE MAP
========================================================= */

teacherReferenceFile.addEventListener(
  "change",
  async () => {
    const file =
      teacherReferenceFile
        .files?.[0];

    if (
      !file ||
      !selectedTeacherTask
    ) {
      return;
    }

    if (
      file.size >
      8 *
      1024 *
      1024
    ) {
      alert(
        "Keep the reference image under 8 MB."
      );

      return;
    }

    const path =
      `${
        currentTeacherUser.id
      }/${
        selectedTeacherTask.id
      }/${
        Date.now()
      }-${
        safeFileName(
          file.name
        )
      }`;

    const upload =
      await sb
        .storage
        .from(
          APP_CONFIG.referenceBucket
        )
        .upload(
          path,
          file,
          {
            upsert: false,
            contentType:
              file.type
          }
        );

    if (upload.error) {
      alert(
        upload.error.message
      );

      return;
    }

    const old =
      selectedTeacherTask
        .reference_path;

    const updated =
      await sb
        .from("tasks")
        .update({
          reference_path:
            path
        })
        .eq(
          "id",
          selectedTeacherTask.id
        )
        .select()
        .single();

    if (updated.error) {
      alert(
        updated.error.message
      );

      return;
    }

    selectedTeacherTask =
      updated.data;

    if (old) {
      await sb
        .storage
        .from(
          APP_CONFIG.referenceBucket
        )
        .remove([
          old
        ]);
    }

    await selectTeacherTask(
      selectedTeacherTask
    );

    teacherReferenceFile.value =
      "";
  }
);


removeReferenceButton.addEventListener(
  "click",
  async () => {
    if (
      !selectedTeacherTask
        ?.reference_path
    ) {
      return;
    }

    if (
      !confirm(
        "Remove this reference map from the task?"
      )
    ) {
      return;
    }

    const path =
      selectedTeacherTask
        .reference_path;

    const updated =
      await sb
        .from("tasks")
        .update({
          reference_path:
            null
        })
        .eq(
          "id",
          selectedTeacherTask.id
        )
        .select()
        .single();

    if (updated.error) {
      alert(
        updated.error.message
      );

      return;
    }

    await sb
      .storage
      .from(
        APP_CONFIG.referenceBucket
      )
      .remove([
        path
      ]);

    selectedTeacherTask =
      updated.data;

    await selectTeacherTask(
      selectedTeacherTask
    );
  }
);


/* =========================================================
   STUDENT SUBMISSION LIST
========================================================= */

async function loadSubmissions() {
  if (
    !selectedTeacherTask
  ) {
    return;
  }

  const {
    data,
    error
  } =
    await sb
      .from("submissions")
      .select(
        `
        id,
        student_name,
        class_name,
        group_name,
        status,
        updated_at,
        submitted_at
        `
      )
      .eq(
        "task_id",
        selectedTeacherTask.id
      )
      .order(
        "updated_at",
        {
          ascending: false
        }
      );

  if (error) {
    submissionList.innerHTML =
      `
      <p class="helper-text">
        ${escapeHtml(
          error.message
        )}
      </p>
      `;

    return;
  }

  renderSubmissionList(
    data || []
  );
}


function renderSubmissionList(items) {
  submissionList.innerHTML = "";

  if (!items.length) {
    submissionList.innerHTML =
      `
      <p class="helper-text">
        No student saves yet.
      </p>
      `;

    return;
  }

  items.forEach(
    submission => {
      const row =
        document.createElement(
          "div"
        );

      row.className =
        "submission-row";

      row.innerHTML =
        `
        <div class="submission-name">

          <strong>
            ${escapeHtml(
              submission.student_name
            )}
          </strong>

          <span>
            ${escapeHtml(
              submission.class_name
            )}

            ${
              submission.group_name
                ? ` · ${
                    escapeHtml(
                      submission.group_name
                    )
                  }`
                : ""
            }
          </span>

        </div>

        <div class="submission-meta">
          ${
            new Date(
              submission.updated_at
            )
              .toLocaleString()
          }
        </div>

        <div
          class="status-pill ${
            submission.status ===
            "submitted"
              ? "submitted"
              : ""
          }"
        >
          ${escapeHtml(
            submission.status ||
            "draft"
          )}
        </div>
        `;

      const button =
        document.createElement(
          "button"
        );

      button.className =
        "quiet-button";

      button.textContent =
        "Review";

      button.addEventListener(
        "click",
        () =>
          openSubmissionReview(
            submission.id
          )
      );

      row.appendChild(button);

      submissionList.appendChild(
        row
      );
    }
  );
}


refreshSubmissionsButton.addEventListener(
  "click",
  loadSubmissions
);


/* =========================================================
   TEACHER REVIEW
========================================================= */

async function openSubmissionReview(id) {
  const submissionResult =
    await sb
      .from("submissions")
      .select("*")
      .eq(
        "id",
        id
      )
      .single();

  if (submissionResult.error) {
    alert(
      submissionResult.error.message
    );

    return;
  }

  const data =
    submissionResult.data;

  reviewSubmission = data;

  currentTask =
    selectedTeacherTask;

  allowedTools = {
    ...DEFAULT_ALLOWED_TOOLS
  };

  loadMapData(
    data.map_data || {}
  );

  const reviewResult =
    await sb
      .from("submission_reviews")
      .select(
        `
        teacher_annotations,
        teacher_feedback
        `
      )
      .eq(
        "submission_id",
        id
      )
      .maybeSingle();

  if (reviewResult.error) {
    alert(
      reviewResult.error.message
    );

    return;
  }

  annotations =
    Array.isArray(
      reviewResult.data
        ?.teacher_annotations
    )
      ? deepClone(
          reviewResult.data
            .teacher_annotations
        )
      : [];

  teacherFeedbackText.value =
    reviewResult.data
      ?.teacher_feedback ||
    "";

  reviewStudentName.textContent =
    data.group_name
      ? `${data.class_name} · ${data.group_name}`
      : `${data.student_name} · ${data.class_name}`;

  appMode =
    "teacher-review";

  teacherDashboard.hidden = true;

  studentWorkspace.hidden = false;

  floatingToolbar.hidden = true;

  teacherReviewToolbar.hidden = false;

  teacherFeedbackPanel.hidden = false;

  taskIntro.hidden = false;

  taskTitle.textContent =
    currentTask.title ||
    "Student Map";

  taskInstructions.textContent =
    "Teacher review copy — red ink and comments are stored separately from the student's map.";

  taskMembers.textContent = "";

  studentBadge.textContent =
    "Teacher Review";

  await loadCurrentTaskReference();

  renderAll();
}


backToDashboardButton.addEventListener(
  "click",
  async () => {
    appMode =
      "teacher-dashboard";

    studentWorkspace.hidden = true;

    teacherDashboard.hidden = false;

    floatingToolbar.hidden = false;

    teacherReviewToolbar.hidden = true;

    teacherFeedbackPanel.hidden = true;

    annotations = [];

    reviewSubmission = null;

    await loadSubmissions();
  }
);


saveTeacherFeedbackButton.addEventListener(
  "click",
  async () => {
    if (
      !reviewSubmission ||
      !currentTeacherUser
    ) {
      return;
    }

    setCloudStatus(
      "Saving feedback…",
      "busy"
    );

    const { error } =
      await sb
        .from(
          "submission_reviews"
        )
        .upsert(
          {
            submission_id:
              reviewSubmission.id,

            teacher_id:
              currentTeacherUser.id,

            teacher_annotations:
              annotations,

            teacher_feedback:
              teacherFeedbackText.value,

            updated_at:
              new Date().toISOString()
          },
          {
            onConflict:
              "submission_id"
          }
        );

    if (error) {
      setCloudStatus(
        "Feedback save failed",
        "bad"
      );

      alert(error.message);

      return;
    }

    setCloudStatus(
      "Feedback saved",
      "good"
    );

    statusBar.textContent =
      "Teacher feedback and red ink saved.";
  }
);


/* =========================================================
   PNG EXPORT
========================================================= */

function buildExportSvg() {
  const clone =
    canvas.cloneNode(true);

  clone
    .querySelector(
      "#selectionLayer"
    )
    ?.remove();

  clone
    .querySelector(
      "#temporaryLayer"
    )
    ?.remove();

  if (
    appMode !==
    "teacher-review"
  ) {
    clone
      .querySelector(
        "#annotationLayer"
      )
      ?.remove();
  }

  clone.setAttribute(
    "xmlns",
    SVG_NS
  );

  clone.setAttribute(
    "width",
    CANVAS_WIDTH
  );

  clone.setAttribute(
    "height",
    CANVAS_HEIGHT
  );

  return new XMLSerializer()
    .serializeToString(clone);
}


async function downloadMapPNG() {
  const svgText =
    buildExportSvg();

  const blob =
    new Blob(
      [svgText],
      {
        type:
          "image/svg+xml;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const image =
    new Image();

  image.onload =
    () => {
      const exportCanvas =
        document.createElement(
          "canvas"
        );

      exportCanvas.width =
        CANVAS_WIDTH;

      exportCanvas.height =
        CANVAS_HEIGHT;

      const context =
        exportCanvas.getContext(
          "2d"
        );

      context.fillStyle =
        "#fff";

      context.fillRect(
        0,
        0,
        exportCanvas.width,
        exportCanvas.height
      );

      context.drawImage(
        image,
        0,
        0
      );

      URL.revokeObjectURL(url);

      exportCanvas.toBlob(
        png => {
          const anchor =
            document.createElement(
              "a"
            );

          anchor.href =
            URL.createObjectURL(
              png
            );

          anchor.download =
            `${
              safeFileName(
                studentInfo.name ||
                "OE-map"
              )
            }.png`;

          anchor.click();

          setTimeout(
            () =>
              URL.revokeObjectURL(
                anchor.href
              ),
            500
          );
        }
      );
    };

  image.src = url;
}


downloadButton.addEventListener(
  "click",
  () => {
    closeFlyouts();

    downloadMapPNG();
  }
);


/* =========================================================
   UI
========================================================= */

function updateStudentBadge() {
  studentBadge.textContent =
    studentInfo.name
      ? `${studentInfo.name} · ${studentInfo.className}${
          studentInfo.group
            ? ` · Group ${studentInfo.group}`
            : ""
        }`
      : "Student";
}


function hideColourAndFlyouts() {
  hideColourPanel();

  closeFlyouts();
}


document.addEventListener(
  "keydown",
  event => {
    if (
      event.key === "Escape"
    ) {
      hideColourAndFlyouts();
    }
  }
);


/* =========================================================
   STARTUP
========================================================= */

async function initialise() {
  createGrid();

  renderAll();

  updateStudentBadge();

  studentWorkspace.hidden = true;
  studentProfilePage.hidden = true;
  teacherDashboard.hidden = true;

  startupModal.hidden = false;

  document.body.classList.add(
    "modal-open"
  );

  if (!BACKEND_READY) {
    setCloudStatus(
      "Offline",
      "bad"
    );

    startupError.textContent =
      "The class database is not connected.";

    startupError.hidden = false;

    return;
  }

  setCloudStatus(
    "Ready",
    "good"
  );

  await prepareStudentLogin();
}


initialise();