const SVG_NS = "http://www.w3.org/2000/svg";
const HTML_NS = "http://www.w3.org/1999/xhtml";

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 675;

const MIN_SHAPE_SIZE = 30;
const DEFAULT_SHAPE_FILL = "#c7d2df";

const LOCAL_SAVE_KEY = "oeMapMakerLocalV9";
const MAX_HISTORY = 60;

const LIVE_CHECK_INTERVAL_MS = 10000;

const EDITOR_TOKEN_STORAGE_KEY =
    "oeMapMakerEditorTokenV1";


function getOrCreateEditorToken() {

    let token =
        sessionStorage.getItem(
            EDITOR_TOKEN_STORAGE_KEY
        );

    if (!token) {

        token =
            crypto.randomUUID();

        sessionStorage.setItem(
            EDITOR_TOKEN_STORAGE_KEY,
            token
        );
    }

    return token;
}


const EDITOR_TOKEN =
    getOrCreateEditorToken();


const APP_CONFIG = {

    supabaseUrl:
        "https://rdchyopkpbphcefkcnqs.supabase.co",

    supabaseAnonKey:
        "sb_publishable_t5MAatZBfgjK0ldu-TTKzw_6Fexkgcf",

    referenceBucket:
        "reference-maps"
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

    // Off unless the Teacher switches it on, so existing Tasks are unchanged.
    hazard: false,

    reference: true,

    download: true
};


const $ =
    id =>
        document.getElementById(id);


/* =========================================================
DOM
========================================================= */

const studentWorkspace =
    $("studentWorkspace");

const teacherDashboard =
    $("teacherDashboard");

const taskIntro =
    $("taskIntro");

const taskTitle =
    $("taskTitle");

const taskInstructions =
    $("taskInstructions");

const taskMembers =
    $("taskMembers");


const editLockBanner =
    $("editLockBanner");

const editLockTitle =
    $("editLockTitle");

const editLockMessage =
    $("editLockMessage");

const retryEditLockButton =
    $("retryEditLockButton");


const askToDrawButton =
    $("askToDrawButton");


const cancelEditRequestButton =
    $("cancelEditRequestButton");


const editRequestPrompt =
    $("editRequestPrompt");


const editRequestPromptTitle =
    $("editRequestPromptTitle");


const editRequestPromptCountdown =
    $("editRequestPromptCountdown");


const handOverButton =
    $("handOverButton");


const notNowButton =
    $("notNowButton");

const studentProfilePage =
    $("studentProfilePage");

const profileStudentName =
    $("profileStudentName");

const profileClassName =
    $("profileClassName");

const switchStudentButton =
    $("switchStudentButton");

const studentTaskCode =
    $("studentTaskCode");

const openStudentTaskButton =
    $("openStudentTaskButton");

const studentTaskError =
    $("studentTaskError");

const refreshStudentProjectsButton =
    $("refreshStudentProjectsButton");

const studentProjectsList =
    $("studentProjectsList");

const studentProjectsNotice =
    $("studentProjectsNotice");


const cloudStatus =
    $("cloudStatus");

const studentBadge =
    $("studentBadge");

const teacherPortalButton =
    $("teacherPortalButton");


const studentModeButton =
    $("studentModeButton");


const roleIndicator =
    $("roleIndicator");


const roleIndicatorLabel =
    $("roleIndicatorLabel");


const roleIndicatorDetail =
    $("roleIndicatorDetail");


const canvas =
    $("drawingCanvas");

const canvasWrap =
    $("canvasWrap");

const gridLayer =
    $("gridLayer");

const shapeLayer =
    $("shapeLayer");

const routeLayer =
    $("routeLayer");

const hazardLayer =
    $("hazardLayer");

const annotationLayer =
    $("annotationLayer");

const selectionLayer =
    $("selectionLayer");

const temporaryLayer =
    $("temporaryLayer");

const referenceOverlay =
    $("referenceOverlay");

const statusBar =
    $("statusBar");


const northIndicator =
    $("northIndicator");

const northArrowInner =
    $("northArrowInner");

const northAngleLabel =
    $("northAngleLabel");


const floatingToolbar =
    $("floatingToolbar");

const selectTool =
    $("selectTool");

const shapeMenuButton =
    $("shapeMenuButton");

const freehandTool =
    $("freehandTool");

const pathMenuButton =
    $("pathMenuButton");

const roadMenuButton =
    $("roadMenuButton");

const hazardTool =
    $("hazardTool");

const transformTool =
    $("transformTool");

const colourMenuButton =
    $("colourMenuButton");

const sendBackwardToolbarButton =
    $("sendBackwardToolbarButton");

const bringForwardToolbarButton =
    $("bringForwardToolbarButton");

const undoButton =
    $("undoButton");

const redoButton =
    $("redoButton");

const deleteButton =
    $("deleteButton");

const moreMenuButton =
    $("moreMenuButton");


const shapeFlyout =
    $("shapeFlyout");

const pathFlyout =
    $("pathFlyout");

const roadFlyout =
    $("roadFlyout");

const moreFlyout =
    $("moreFlyout");


const flyouts = [
    shapeFlyout,
    pathFlyout,
    roadFlyout,
    moreFlyout
];


const shapeButtons =
    document.querySelectorAll(
        ".shape-choice"
    );


const pathColour =
    $("pathColour");

const pathWidth =
    $("pathWidth");

const startPathButton =
    $("startPathButton");


const roadColour =
    $("roadColour");

const roadWidth =
    $("roadWidth");

const startRoadButton =
    $("startRoadButton");


const editSelectedButton =
    $("editSelectedButton");

const duplicateButton =
    $("duplicateButton");

const saveNowButton =
    $("saveNowButton");

const submitButton =
    $("submitButton");

const downloadButton =
    $("downloadButton");

const backToProfileButton =
    $("backToProfileButton");

const clearButton =
    $("clearButton");

const referenceButton =
    $("referenceButton");

const legendList =
    $("legendList");


const colourPanel =
    $("colourPanel");

const colourSwatches =
    $("colourSwatches");

const fillColour =
    $("fillColour");

const closeColourPanel =
    $("closeColourPanel");


const startupModal =
    $("startupModal");

const startupDescription =
    $("startupDescription");

const startupTaskCode =
    $("startupTaskCode");

const startupNameStep =
    $("startupNameStep");

const startupChangeCodeButton =
    $("startupChangeCodeButton");

const startupStudentSelect =
    $("startupStudentSelect");

const startupError =
    $("startupError");

const studentLoginButton =
    $("studentLoginButton");

const startupTeacherLink =
    $("startupTeacherLink");


const openGuestButton =
    $("openGuestButton");

const resumeGuestButton =
    $("resumeGuestButton");

const guestModal =
    $("guestModal");

const guestNameInput =
    $("guestNameInput");

const guestError =
    $("guestError");

const cancelGuestButton =
    $("cancelGuestButton");

const createGuestButton =
    $("createGuestButton");


const groupModal =
    $("groupModal");

const groupTaskTitle =
    $("groupTaskTitle");

const groupMembersList =
    $("groupMembersList");

const groupError =
    $("groupError");

const cancelGroupButton =
    $("cancelGroupButton");

const startGroupTaskButton =
    $("startGroupTaskButton");


const teacherLoginModal =
    $("teacherLoginModal");

const teacherEmail =
    $("teacherEmail");

const teacherPassword =
    $("teacherPassword");

const teacherLoginError =
    $("teacherLoginError");

const teacherGoogleButton =
    $("teacherGoogleButton");


const teacherLoginButton =
    $("teacherLoginButton");

const cancelTeacherLogin =
    $("cancelTeacherLogin");


const teacherNameModal =
    $("teacherNameModal");

const teacherNameInput =
    $("teacherNameInput");

const teacherNameEmail =
    $("teacherNameEmail");

const teacherNameError =
    $("teacherNameError");

const cancelTeacherNameButton =
    $("cancelTeacherNameButton");

const saveTeacherNameButton =
    $("saveTeacherNameButton");

const editTeacherNameButton =
    $("editTeacherNameButton");


const appFeedbackButton =
    $("appFeedbackButton");

const appFeedbackModal =
    $("appFeedbackModal");

const appFeedbackForm =
    $("appFeedbackForm");

const appFeedbackMessage =
    $("appFeedbackMessage");

const appFeedbackCount =
    $("appFeedbackCount");

const appFeedbackFiles =
    $("appFeedbackFiles");

const appFeedbackPreviews =
    $("appFeedbackPreviews");

const appFeedbackAttached =
    $("appFeedbackAttached");

const appFeedbackError =
    $("appFeedbackError");

const cancelAppFeedbackButton =
    $("cancelAppFeedbackButton");

const sendAppFeedbackButton =
    $("sendAppFeedbackButton");

const appFeedbackSent =
    $("appFeedbackSent");

const closeAppFeedbackButton =
    $("closeAppFeedbackButton");


const objectModal =
    $("objectModal");

const objectNameInput =
    $("objectNameInput");

const objectCategorySelect =
    $("objectCategorySelect");

const objectError =
    $("objectError");

const saveObjectDetailsButton =
    $("saveObjectDetailsButton");

const discardObjectButton =
    $("discardObjectButton");


const routeModal =
    $("routeModal");

const routeModalLabel =
    $("routeModalLabel");

const routeModalTitle =
    $("routeModalTitle");

const routeNameInput =
    $("routeNameInput");

const routeError =
    $("routeError");

const saveRouteDetailsButton =
    $("saveRouteDetailsButton");

const discardRouteButton =
    $("discardRouteButton");


const hazardModal =
    $("hazardModal");

const hazardModalLabel =
    $("hazardModalLabel");

const hazardModalTitle =
    $("hazardModalTitle");

const hazardNameInput =
    $("hazardNameInput");

const hazardNoteInput =
    $("hazardNoteInput");

const hazardError =
    $("hazardError");

const saveHazardButton =
    $("saveHazardButton");

const discardHazardButton =
    $("discardHazardButton");

const editModal =
    $("editModal");

const editNameInput =
    $("editNameInput");

const editCategoryWrap =
    $("editCategoryWrap");

const editCategorySelect =
    $("editCategorySelect");

const editError =
    $("editError");

const saveEditButton =
    $("saveEditButton");

const cancelEditButton =
    $("cancelEditButton");


const createTaskButton =
    $("createTaskButton");

const teacherSignOutButton =
    $("teacherSignOutButton");

const teacherTasksList =
    $("teacherTasksList");

const noTaskSelected =
    $("noTaskSelected");

const taskEditor =
    $("taskEditor");


const teacherTasksTabButton =
    $("teacherTasksTabButton");

const teacherClassesTabButton =
    $("teacherClassesTabButton");

const teacherTasksPanel =
    $("teacherTasksPanel");

const teacherClassesPanel =
    $("teacherClassesPanel");


const taskAssignedClasses =
    $("taskAssignedClasses");

const allowGuests =
    $("allowGuests");


const createClassButton =
    $("createClassButton");

const teacherClassesList =
    $("teacherClassesList");

const noClassSelected =
    $("noClassSelected");

const classEditor =
    $("classEditor");

const teacherClassHeading =
    $("teacherClassHeading");

const teacherClassCount =
    $("teacherClassCount");

const teacherClassName =
    $("teacherClassName");

const saveClassNameButton =
    $("saveClassNameButton");

const archiveClassButton =
    $("archiveClassButton");

const deleteClassButton =
    $("deleteClassButton");

const classListFile =
    $("classListFile");

const classImportPreview =
    $("classImportPreview");

const importClassListButton =
    $("importClassListButton");

const newStudentName =
    $("newStudentName");

const addStudentButton =
    $("addStudentButton");

const classRosterList =
    $("classRosterList");


const teacherTaskHeading =
    $("teacherTaskHeading");

const teacherTaskCode =
    $("teacherTaskCode");

const teacherTaskTitle =
    $("teacherTaskTitle");

const teacherTaskInstructions =
    $("teacherTaskInstructions");

const saveTaskSettingsButton =
    $("saveTaskSettingsButton");

const deleteTaskButton =
    $("deleteTaskButton");


const teacherReferenceFile =
    $("teacherReferenceFile");

const removeReferenceButton =
    $("removeReferenceButton");

const teacherReferencePreview =
    $("teacherReferencePreview");

const refreshSubmissionsButton =
    $("refreshSubmissionsButton");

const submissionList =
    $("submissionList");


const permissionInputs = {

    move:
        $("allowMove"),

    shapes:
        $("allowShapes"),

    freehand:
        $("allowFreehand"),

    path:
        $("allowPath"),

    road:
        $("allowRoad"),

    colour:
        $("allowColour"),

    transform:
        $("allowTransform"),

    layers:
        $("allowLayers"),

    hazard:
        $("allowHazard"),

    reference:
        $("allowReference"),

    download:
        $("allowDownload")
};


const teacherReviewToolbar =
    $("teacherReviewToolbar");

const annotationPenButton =
    $("annotationPenButton");

const clearAnnotationsButton =
    $("clearAnnotationsButton");

const backToDashboardButton =
    $("backToDashboardButton");


const teacherGallery =
    $("teacherGallery");


const galleryHeading =
    $("galleryHeading");


const galleryContent =
    $("galleryContent");


const openGalleryButton =
    $("openGalleryButton");


const galleryBackButton =
    $("galleryBackButton");


const continueTeacherStep =
    $("continueTeacherStep");


const continueTeacherButton =
    $("continueTeacherButton");

const teacherFeedbackPanel =
    $("teacherFeedbackPanel");

const reviewStudentName =
    $("reviewStudentName");


const reviewStudentMeta =
    $("reviewStudentMeta");


const reviewDraftNotice =
    $("reviewDraftNotice");


const reviewHint =
    $("reviewHint");


const handInForThemButton =
    $("handInForThemButton");


const editLockLabel =
    $("editLockLabel");

const teacherFeedbackText =
    $("teacherFeedbackText");

const saveTeacherFeedbackButton =
    $("saveTeacherFeedbackButton");


const studentReviewPanel =
    $("studentReviewPanel");

const studentReviewDate =
    $("studentReviewDate");

const studentTeacherFeedbackText =
    $("studentTeacherFeedbackText");

const toggleStudentMarkedWorkButton =
    $("toggleStudentMarkedWorkButton");


/* =========================================================
STATE
========================================================= */

let appMode =
    "student";

let currentTool =
    "select";

let shapes = [];

let routes = [];

let annotations = [];

let hazards = [];

let nextShapeId = 1;

let nextRouteId = 1;

let nextHazardId = 1;

// The Hazard the Hazard dialog is for: { x, y } for a new one, or
// { id } for an existing one being edited. Null when it is closed.
let pendingHazard = null;

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

let northPointerStart = null;

let northPointerMoved = false;

let referenceHoldActive = false;

let colourBeforeState = null;

let saveTimer = null;


// Gallery: the Task it shows, or null when it is closed.
let galleryTaskId =
    null;


// True while the first Gallery load for galleryTaskId is in flight.
let galleryLoading =
    false;


// Counts Gallery loads, so an older load that finishes late is ignored.
let galleryLoadCount =
    0;


// True when the open Review screen was opened from a Gallery tile.
let reviewOpenedFromGallery =
    false;


// Project id → { submission, signature, mapUpdatedAt, tile, ... }
let galleryEntries =
    new Map();


// Class name → { section, grid }
let galleryClassSections =
    new Map();


let toolbarWakeTimer = null;

let annotationDrawing = false;

let currentAnnotationPoints = [];


let studentInfo = {

    name: "",

    className: "",

    group: ""
};


let currentIdentityType =
    null;

let currentStudentProfile =
    null;

let currentGuestProfile =
    null;

let currentStudentRoster = [];

let currentStudentProjects = [];

let pendingTaskLookup =
    null;

let currentTask =
    null;

let currentSubmission =
    null;

let currentReferenceUrl =
    "";


let allowedTools = {
    ...DEFAULT_ALLOWED_TOOLS
};


let currentTeacherUser =
    null;

// The signed-in Teacher's Teacher Name, or null until chosen.
let currentTeacherName =
    null;

let teacherTasks = [];

let selectedTeacherTask =
    null;

let reviewSubmission =
    null;

let studentReviewData =
    null;

let studentReviewVisible =
    true;

let teacherLoginReturnView =
    "startup";

let teacherClasses = [];

let selectedTeacherClass =
    null;

let selectedClassRoster = [];

let pendingClassImportNames = [];


let studentReadOnly =
    false;

let editLockOwned =
    false;

let editLockHolderName =
    "";

let editLockLeaseExpiresAt =
    null;


// Edit Requests (see EDIT REQUESTS).
let currentGroupSize =
    0;


let editRequestState =
    "";


let editRequestNotice =
    "";


let editRequestRequesterName =
    "";


let editRequestDeadline =
    0;


let editRequestCountdownTimer =
    null;


let editRequestSavedAtZero =
    false;


let viewOnlyChecks =
    0;


// Submitted or Marked: locked for students (see HANDED IN IS FINAL).
let projectHandedIn =
    false;

let editLockHeartbeatTimer =
    null;

let editLockHeartbeatFailures =
    0;

let reviewWatchSubmissionId =
    null;

let reviewWatchSignature =
    "";

let projectsNoticeTimer =
    null;

// Last-saved time of the Review the Teacher is marking, as this
// Teacher last saw it; null when it had no Review yet.
let reviewLastSeenSavedAt =
    null;


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


function clamp(
    value,
    minimum,
    maximum
) {

    return Math.max(
        minimum,
        Math.min(
            maximum,
            value
        )
    );
}


function distanceBetween(
    first,
    second
) {

    return Math.hypot(
        first.x - second.x,
        first.y - second.y
    );
}


function dot(
    first,
    second
) {

    return (
        first.x * second.x +
        first.y * second.y
    );
}


function add(
    first,
    second
) {

    return {

        x:
            first.x +
            second.x,

        y:
            first.y +
            second.y
    };
}


function sub(
    first,
    second
) {

    return {

        x:
            first.x -
            second.x,

        y:
            first.y -
            second.y
    };
}


function scale(
    vector,
    number
) {

    return {

        x:
            vector.x * number,

        y:
            vector.y * number
    };
}


function normaliseRotation(
    angle
) {

    while (angle > 180) {

        angle -= 360;
    }


    while (angle < -180) {

        angle += 360;
    }


    return Math.round(angle);
}


function rotatePoint(
    point,
    centre,
    degrees
) {

    const radians =
        degrees *
        Math.PI /
        180;


    const cosine =
        Math.cos(radians);


    const sine =
        Math.sin(radians);


    const differenceX =
        point.x -
        centre.x;


    const differenceY =
        point.y -
        centre.y;


    return {

        x:
            centre.x +
            differenceX *
            cosine -
            differenceY *
            sine,

        y:
            centre.y +
            differenceX *
            sine +
            differenceY *
            cosine
    };
}


function getBasis(
    rotation
) {

    const radians =
        rotation *
        Math.PI /
        180;


    return {

        u: {

            x:
                Math.cos(radians),

            y:
                Math.sin(radians)
        },

        v: {

            x:
                -Math.sin(radians),

            y:
                Math.cos(radians)
        }
    };
}


function pointsToString(
    points
) {

    return points

        .map(
            point =>
                `${point.x},${point.y}`
        )

        .join(" ");
}


function setCloudStatus(
    text,
    state = ""
) {

    cloudStatus.textContent =
        text;


    cloudStatus.className =
        `cloud-status ${state}`.trim();
}


function safeFileName(
    name
) {

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


function hasCurrentLearnerIdentity() {

    return Boolean(

        currentIdentityType === "registered"

            ? currentStudentProfile

            : currentIdentityType === "guest"

                ? currentGuestProfile

                : false
    );
}


function currentLearnerName() {

    if (
        currentIdentityType === "guest"
    ) {

        return (
            currentGuestProfile?.guest_name ||
            "Guest"
        );
    }


    return (
        currentStudentProfile?.student_name ||
        "Student"
    );
}


function currentLearnerClassLabel() {

    if (
        currentIdentityType === "guest"
    ) {

        return currentGuestProfile?.guest_code

            ? `Guest · G-${currentGuestProfile.guest_code}`

            : "Guest";
    }


    return (
        currentStudentProfile?.class_name ||
        "Class"
    );
}


function isStudentEditingAllowed() {

    return (

        appMode === "student" &&

        !studentReadOnly &&

        editLockOwned
    );
}


function getCanvasPoint(
    event
) {

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
GRID
========================================================= */

function createGrid() {

    gridLayer.innerHTML =
        "";


    const spacing =
        50;


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


        line.setAttribute(
            "x1",
            x
        );

        line.setAttribute(
            "y1",
            0
        );

        line.setAttribute(
            "x2",
            x
        );

        line.setAttribute(
            "y2",
            CANVAS_HEIGHT
        );

        line.setAttribute(
            "class",
            "grid-line"
        );


        gridLayer.appendChild(
            line
        );
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


        line.setAttribute(
            "x1",
            0
        );

        line.setAttribute(
            "y1",
            y
        );

        line.setAttribute(
            "x2",
            CANVAS_WIDTH
        );

        line.setAttribute(
            "y2",
            y
        );

        line.setAttribute(
            "class",
            "grid-line"
        );


        gridLayer.appendChild(
            line
        );
    }
}


/* =========================================================
HISTORY
========================================================= */

function captureMapState() {

    return deepClone({

        shapes,

        routes,

        hazards,

        nextShapeId,

        nextRouteId,

        nextHazardId,

        selectedItem,

        pendingDraftId,

        pendingRouteId,

        currentTool,

        northAngle
    });
}


function restoreMapState(
    state
) {

    if (!state) {
        return;
    }


    shapes =
        deepClone(
            state.shapes ||
            []
        );


    routes =
        deepClone(
            state.routes ||
            []
        );


    hazards =
        deepClone(
            state.hazards ||
            []
        );


    nextShapeId =
        state.nextShapeId ||
        1;


    nextRouteId =
        state.nextRouteId ||
        1;


    nextHazardId =
        state.nextHazardId ||
        1;


    selectedItem =
        state.selectedItem ||
        null;


    pendingDraftId =
        state.pendingDraftId ??
        null;


    pendingRouteId =
        state.pendingRouteId ??
        null;


    currentTool =
        state.currentTool ||
        "select";


    northAngle =
        state.northAngle ||
        0;


    draftOriginState =
        null;


    resetInteractionState();


    renderAll();


    scheduleSave();
}


function commitHistory(
    before
) {

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


    redoStack =
        [];


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


    redoStack.push(
        current
    );


    restoreMapState(
        previous
    );


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


    undoStack.push(
        current
    );


    restoreMapState(
        next
    );


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

        version:
            10,

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

        hazards:
            deepClone(
                hazards
            ),

        nextShapeId,

        nextRouteId,

        nextHazardId,

        northAngle
    };
}


function loadMapData(
    data
) {

    const stored =
        data ||
        {};


    shapes =
        Array.isArray(
            stored.shapes
        )

            ? deepClone(
                stored.shapes
            )

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


    // Maps saved before Hazards existed simply have none.
    hazards =
        Array.isArray(
            stored.hazards
        )

            ? deepClone(
                stored.hazards
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
                    Number(shape.id) ||
                    0
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
                    Number(route.id) ||
                    0
            )
        ) +

        1;


    nextHazardId =

        Number(
            stored.nextHazardId
        ) ||

        Math.max(
            0,

            ...hazards.map(
                hazard =>
                    Number(hazard.id) ||
                    0
            )
        ) +

        1;


    northAngle =

        Number(
            stored.northAngle
        ) ||

        0;


    selectedItem =
        null;

    pendingDraftId =
        null;

    pendingRouteId =
        null;

    undoStack =
        [];

    redoStack =
        [];


    resetInteractionState();


    renderAll();
}


function saveLocalBackup() {

    try {

        localStorage.setItem(

            LOCAL_SAVE_KEY,

            JSON.stringify({

                taskId:
                    currentTask?.id ||
                    null,

                studentInfo,

                mapData:
                    serialiseMap()
            })
        );
    }

    catch (error) {

        console.warn(
            error
        );
    }
}


function scheduleSave() {

    clearTimeout(
        saveTimer
    );


    if (
        studentReadOnly
    ) {

        return;
    }


    saveLocalBackup();


    if (

        appMode !== "student" ||

        !editLockOwned

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


    if (

        studentReadOnly ||

        !editLockOwned

    ) {

        if (showMessage) {

            statusBar.textContent =
                "Read-only: this project is being edited on another device, so changes from this device are not saved.";
        }

        return;
    }


    saveLocalBackup();


    if (

        !BACKEND_READY ||

        !currentSubmission ||

        !hasCurrentLearnerIdentity()

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


        let result;


        if (
            currentIdentityType === "guest"
        ) {

            result =
                await sb.rpc(

                    "guest_save_project_locked",

                    {

                        p_submission_id:
                            currentSubmission.id,

                        p_map_data:
                            serialiseMap(),

                        p_submit:
                            false,

                        p_editor_token:
                            EDITOR_TOKEN
                    }
                );
        }

        else {

            result =
                await sb.rpc(

                    "student_save_project_locked",

                    {

                        p_submission_id:
                            currentSubmission.id,

                        p_student_id:
                            currentStudentProfile.student_id,

                        p_map_data:
                            serialiseMap(),

                        p_submit:
                            false,

                        p_editor_token:
                            EDITOR_TOKEN
                    }
                );
        }


        if (
            result.error
        ) {

            throw result.error;
        }


        currentSubmission.status =

            result.data ||

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

        console.error(
            error
        );


        if (
            String(
                error.message ||
                ""
            ).includes(
                "PROJECT_HANDED_IN"
            )
        ) {

            await showHandedInProject();

            return;
        }


        if (
            String(
                error.message ||
                ""
            ).includes(
                "EDIT_LOCK_REQUIRED"
            )
        ) {

            handleLostEditLock(
                "Another device has taken over editing this project."
            );

            return;
        }


        setCloudStatus(
            "Save failed",
            "bad"
        );


        if (showMessage) {

            statusBar.textContent =
                "Save failed. Please check your connection and try again.";
        }
    }
}


async function submitToTeacher() {

    if (

        !currentSubmission ||

        !hasCurrentLearnerIdentity() ||

        !BACKEND_READY

    ) {

        statusBar.textContent =
            "This project is not connected yet.";

        return;
    }


    if (

        studentReadOnly ||

        !editLockOwned

    ) {

        statusBar.textContent =
            "Read-only: only the device currently holding the edit lock can submit this project.";

        return;
    }


    try {

        let result;


        if (
            currentIdentityType === "guest"
        ) {

            result =
                await sb.rpc(

                    "guest_save_project_locked",

                    {

                        p_submission_id:
                            currentSubmission.id,

                        p_map_data:
                            serialiseMap(),

                        p_submit:
                            true,

                        p_editor_token:
                            EDITOR_TOKEN
                    }
                );
        }

        else {

            result =
                await sb.rpc(

                    "student_save_project_locked",

                    {

                        p_submission_id:
                            currentSubmission.id,

                        p_student_id:
                            currentStudentProfile.student_id,

                        p_map_data:
                            serialiseMap(),

                        p_submit:
                            true,

                        p_editor_token:
                            EDITOR_TOKEN
                    }
                );
        }


        if (
            result.error
        ) {

            throw result.error;
        }


        currentSubmission.status =
            result.data ||
            "submitted";


        setCloudStatus(
            "Submitted",
            "good"
        );


        await loadStudentProject(
            currentSubmission.id
        );


        statusBar.textContent =
            "✓ Handed in. Your teacher can mark it now.";
    }

    catch (error) {

        console.error(
            error
        );


        if (
            String(
                error.message ||
                ""
            ).includes(
                "PROJECT_HANDED_IN"
            )
        ) {

            await showHandedInProject();

            return;
        }


        if (
            String(
                error.message ||
                ""
            ).includes(
                "EDIT_LOCK_REQUIRED"
            )
        ) {

            handleLostEditLock(
                "Another device has taken over editing this project."
            );

            return;
        }


        setCloudStatus(
            "Submit failed",
            "bad"
        );


        statusBar.textContent =
            "Could not submit the map. Please try again.";
    }
}


/* =========================================================
EDIT LOCK
========================================================= */

function stopEditLockHeartbeat() {

    clearInterval(
        editLockHeartbeatTimer
    );


    editLockHeartbeatTimer =
        null;


    editLockHeartbeatFailures =
        0;
}


function applyStudentEditLockUI() {

    const inStudentWorkspace =

        appMode === "student" &&

        !studentWorkspace.hidden;


    if (!inStudentWorkspace) {

        editLockBanner.hidden =
            true;

        return;
    }


    if (
        studentReadOnly
    ) {

        floatingToolbar.hidden =
            true;


        northIndicator.disabled =
            true;


        editLockBanner.hidden =
            false;


        if (
            projectHandedIn
        ) {

            const marked =
                Boolean(
                    studentReviewData
                );


            editLockLabel.textContent =
                marked
                    ? "MARKED"
                    : "HANDED IN";


            editLockTitle.textContent =
                marked
                    ? "Your teacher has marked this map."
                    : "Handed in — waiting for your teacher.";


            editLockMessage.textContent =
                marked
                    ? "Read the feedback below. The map can't be changed now."
                    : "Your map is with your teacher. You can look at it, but it can't be changed now.";


            retryEditLockButton.hidden =
                true;

            askToDrawButton.hidden =
                true;

            cancelEditRequestButton.hidden =
                true;


            return;
        }


        editLockLabel.textContent =
            "VIEW-ONLY";


        const canAsk =
            isGroupProject();


        const waiting =
            editRequestState === "waiting";


        editLockTitle.textContent =

            waiting

                ? `Waiting for ${editLockHolderName || "the Editor"} to answer…`

                : editLockHolderName
                    ? `${editLockHolderName} is drawing.`
                    : "Someone on another device is drawing.";


        editLockMessage.textContent =

            editRequestNotice ||

            (
                waiting

                    ? "If they don't answer in 30 seconds, it will be your turn. Keep this screen open."

                    : canAsk

                        ? "You can watch the map as they draw. Tap Ask to draw for a turn."

                        : "You can view the latest saved map and teacher feedback here, but drawing, saving and submitting are disabled on this device. When the other editor leaves or stops responding, the lock expires automatically within about 90 seconds."
            );


        retryEditLockButton.hidden =
            canAsk;


        askToDrawButton.hidden =
            !canAsk ||
            waiting;


        cancelEditRequestButton.hidden =
            !waiting;
    }

    else {

        floatingToolbar.hidden =
            false;


        northIndicator.disabled =
            false;


        editLockBanner.hidden =
            true;


        askToDrawButton.hidden =
            true;


        cancelEditRequestButton.hidden =
            true;
    }
}


function handleLostEditLock(
    message
) {

    editLockOwned =
        false;


    studentReadOnly =
        true;


    stopEditLockHeartbeat();

    hideEditRequestPrompt();

    resetInteractionState();


    setCloudStatus(
        "Read-only",
        "busy"
    );


    editLockHolderName =

        editLockHolderName ||

        "Another student";


    applyStudentEditLockUI();


    statusBar.textContent =

        message ||

        "Editing has moved to another device. This device is now read-only.";
}


async function claimCurrentEditLock() {

    if (

        !BACKEND_READY ||

        !currentSubmission?.id ||

        !hasCurrentLearnerIdentity()

    ) {

        editLockOwned =
            true;


        studentReadOnly =
            false;


        return true;
    }


    const {
        data,
        error
    } =
        await sb.rpc(

            "claim_submission_edit_lock",

            {

                p_submission_id:
                    currentSubmission.id,

                p_editor_token:
                    EDITOR_TOKEN
            }
        );


    if (error) {

        throw error;
    }


    const lock =

        Array.isArray(data)

            ? data[0]

            : data;


    editLockOwned =
        Boolean(
            lock?.acquired
        );


    studentReadOnly =
        !editLockOwned;


    editLockHolderName =
        lock?.holder_name ||
        "";


    editLockLeaseExpiresAt =
        lock?.lease_expires_at ||
        null;


    if (
        editLockOwned
    ) {

        startEditLockHeartbeat();
    }

    else {

        stopEditLockHeartbeat();
    }


    applyStudentEditLockUI();


    return editLockOwned;
}


function startEditLockHeartbeat() {

    stopEditLockHeartbeat();


    editLockHeartbeatTimer =
        setInterval(

            renewCurrentEditLock,

            25000
        );
}


async function renewCurrentEditLock() {

    if (

        !editLockOwned ||

        !currentSubmission?.id ||

        appMode !== "student"

    ) {

        return;
    }


    try {

        const {
            data,
            error
        } =
            await sb.rpc(

                "renew_submission_edit_lock",

                {

                    p_submission_id:
                        currentSubmission.id,

                    p_editor_token:
                        EDITOR_TOKEN
                }
            );


        if (error) {

            throw error;
        }


        if (!data) {

            handleLostEditLock(
                "The editing lock expired or was taken by another device. This copy is now read-only."
            );

            return;
        }


        editLockHeartbeatFailures =
            0;
    }

    catch (error) {

        console.warn(
            "Edit-lock heartbeat failed:",
            error
        );


        editLockHeartbeatFailures +=
            1;


        if (
            editLockHeartbeatFailures >=
            2
        ) {

            handleLostEditLock(
                "The app could not confirm that this device still owns the editing lock. To prevent conflicting saves, this copy is now read-only."
            );
        }
    }
}


async function releaseCurrentEditLock() {

    stopEditLockHeartbeat();


    if (

        !BACKEND_READY ||

        !editLockOwned ||

        !currentSubmission?.id

    ) {

        editLockOwned =
            false;


        studentReadOnly =
            false;


        return;
    }


    const submissionId =
        currentSubmission.id;


    editLockOwned =
        false;


    studentReadOnly =
        false;


    try {

        await sb.rpc(

            "release_submission_edit_lock",

            {

                p_submission_id:
                    submissionId,

                p_editor_token:
                    EDITOR_TOKEN
            }
        );
    }

    catch (error) {

        console.warn(

            "Could not release edit lock immediately. It will expire automatically.",

            error
        );
    }
}


retryEditLockButton.addEventListener(

    "click",

    async () => {

        if (
            !currentSubmission?.id
        ) {

            return;
        }


        retryEditLockButton.disabled =
            true;


        retryEditLockButton.textContent =
            "Checking…";


        const submissionId =
            currentSubmission.id;


        try {

            await loadStudentProject(
                submissionId
            );
        }

        finally {

            retryEditLockButton.disabled =
                false;


            retryEditLockButton.textContent =
                "Try Editing Again";
        }
    }
);


/* =========================================================
REFERENCE MAP
========================================================= */

async function getSignedReferenceUrl(
    path
) {

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

        console.error(
            error
        );

        return "";
    }


    return (
        data?.signedUrl ||
        ""
    );
}


async function loadCurrentTaskReference() {

    currentReferenceUrl =
        "";


    referenceOverlay.hidden =
        true;


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


    if (
        currentReferenceUrl
    ) {

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


    referenceHoldActive =
        true;


    referenceOverlay.hidden =
        false;


    referenceButton.classList.add(
        "holding"
    );


    statusBar.textContent =
        "Reference preview — release to return to your map.";
}


function hideReferenceOverlay() {

    referenceHoldActive =
        false;


    referenceOverlay.hidden =
        true;


    referenceButton.classList.remove(
        "holding"
    );
}


function endReferencePreview() {

    if (
        !referenceHoldActive
    ) {

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
TOOL PERMISSIONS
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


    hazardTool.hidden =
        !settings.hazard;


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
TOOLBAR
========================================================= */

function wakeToolbar() {

    floatingToolbar.classList.add(
        "recently-used"
    );


    clearTimeout(
        toolbarWakeTimer
    );


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
            flyout.hidden =
                true
    );


    floatingToolbar
        .classList
        .remove(
            "open"
        );
}


function toggleFlyout(
    target
) {

    const shouldOpen =
        target.hidden;


    closeFlyouts();


    if (shouldOpen) {

        target.hidden =
            false;


        floatingToolbar
            .classList
            .add(
                "open"
            );
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
                    .remove(
                        "active"
                    )
        );


    if (
        currentTool === "select"
    ) {

        selectTool
            .classList
            .add(
                "active"
            );
    }

    else if (
        FIXED_SHAPES.includes(
            currentTool
        )
    ) {

        shapeMenuButton
            .classList
            .add(
                "active"
            );
    }

    else if (
        currentTool === "freehand"
    ) {

        freehandTool
            .classList
            .add(
                "active"
            );
    }

    else if (
        currentTool === "path"
    ) {

        pathMenuButton
            .classList
            .add(
                "active"
            );
    }

    else if (
        currentTool === "road"
    ) {

        roadMenuButton
            .classList
            .add(
                "active"
            );
    }

    else if (
        currentTool === "hazard"
    ) {

        hazardTool
            .classList
            .add(
                "active"
            );
    }

    else if (
        currentTool === "transform"
    ) {

        transformTool
            .classList
            .add(
                "active"
            );
    }
}


function setTool(
    tool
) {

    hideColourPanel();


    currentTool =
        tool;


    if (
        tool !== "transform"
    ) {

        transformAction =
            null;
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
            "Draw your road. You will name it after drawing.",

        hazard:
            "Tap or click on an area of the map to mark a hazard ⚠"
    };


    statusBar.textContent =

        messages[tool] ||

        "Drag on the map to create your landmark.";


    canvas.style.cursor =

        [
            "freehand",
            "path",
            "road",
            "hazard",
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

            setTool(
                "freehand"
            );
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


hazardTool.addEventListener(

    "click",

    () => {

        if (
            !blockWhileDraftExists()
        ) {

            closeFlyouts();

            setTool(
                "hazard"
            );
        }
    }
);


transformTool.addEventListener(

    "click",

    () => {

        closeFlyouts();

        setTool(
            "transform"
        );
    }
);


selectTool.addEventListener(

    "click",

    () => {

        if (
            !blockWhileDraftExists()
        ) {

            closeFlyouts();

            setTool(
                "select"
            );
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

            setTool(
                "path"
            );
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

            setTool(
                "road"
            );
        }
    }
);


/* =========================================================
DRAFTS
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
            draft?.id ??
            null;
    }


    return (
        draft ||
        null
    );
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
            route?.id ??
            null;
    }


    return (
        route ||
        null
    );
}


function blockWhileDraftExists() {

    const draft =
        getPendingDraft();


    if (draft) {

        selectedItem = {

            kind:
                "shape",

            id:
                draft.id
        };


        currentTool =
            "transform";


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

    pointerActive =
        false;

    startPoint =
        null;

    currentPoints =
        [];

    lastMovePoint =
        null;

    transformAction =
        null;

    interactionBeforeState =
        null;

    temporaryLayer.innerHTML =
        "";
}


/* =========================================================
SHAPE CREATION
========================================================= */

function getDragBounds(
    type,
    start,
    end
) {

    let width =
        Math.abs(
            end.x -
            start.x
        );


    let height =
        Math.abs(
            end.y -
            start.y
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

                    : start.x -
                    size,

            y:
                end.y >= start.y

                    ? start.y

                    : start.y -
                    size,

            width:
                size,

            height:
                size
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


function pointArrayToString(
    points
) {

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


        element.setAttribute(
            "x",
            x
        );

        element.setAttribute(
            "y",
            y
        );

        element.setAttribute(
            "width",
            width
        );

        element.setAttribute(
            "height",
            height
        );
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


function getPointsBounds(
    points
) {

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
            point =>
                point.x
        );


    const ys =
        points.map(
            point =>
                point.y
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

        x:
            minimumX,

        y:
            minimumY,

        width:
            maximumX -
            minimumX,

        height:
            maximumY -
            minimumY
    };
}


function getShapeBounds(
    shape
) {

    return (
        shape.type === "freehand"
    )

        ? getPointsBounds(
            shape.points
        )

        : {

            x:
                shape.x,

            y:
                shape.y,

            width:
                shape.width,

            height:
                shape.height
        };
}


function getShapeCentre(
    shape
) {

    const bounds =
        getShapeBounds(
            shape
        );


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


function findHazard(
    id
) {

    return hazards.find(

        hazard =>
            hazard.id ===
            id

    ) || null;
}


function getSelectedHazard() {

    return (

        selectedItem?.kind === "hazard"

    )

        ? findHazard(
            selectedItem.id
        )

        : null;
}


function getVisualBounds(
    shape
) {

    const bounds =
        getShapeBounds(
            shape
        );


    const centre =
        getShapeCentre(
            shape
        );


    return getPointsBounds(

        [

            {
                x:
                    bounds.x,

                y:
                    bounds.y
            },

            {
                x:
                    bounds.x +
                    bounds.width,

                y:
                    bounds.y
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
                x:
                    bounds.x,

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

                        shape.rotation ||
                        0
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
        getVisualBounds(
            shape
        );


    let x =
        dx;


    let y =
        dy;


    if (
        bounds.width <=
        CANVAS_WIDTH
    ) {

        if (
            bounds.x +
            x <
            0
        ) {

            x =
                -bounds.x;
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
        bounds.height <=
        CANVAS_HEIGHT
    ) {

        if (
            bounds.y +
            y <
            0
        ) {

            y =
                -bounds.y;
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

        dx:
            x,

        dy:
            y
    };
}


function constrainPointMovement(
    points,
    dx,
    dy
) {

    const bounds =
        getPointsBounds(
            points
        );


    let x =
        dx;


    let y =
        dy;


    if (
        bounds.width <=
        CANVAS_WIDTH
    ) {

        if (
            bounds.x +
            x <
            0
        ) {

            x =
                -bounds.x;
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
        bounds.height <=
        CANVAS_HEIGHT
    ) {

        if (
            bounds.y +
            y <
            0
        ) {

            y =
                -bounds.y;
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

        dx:
            x,

        dy:
            y
    };
}


function moveSelectedItem(
    dx,
    dy
) {

    if (!selectedItem) {
        return;
    }


    if (
        selectedItem.kind === "hazard"
    ) {

        const hazard =
            getSelectedHazard();


        if (!hazard) {
            return;
        }


        hazard.x =
            clamp(
                hazard.x + dx,
                0,
                CANVAS_WIDTH
            );


        hazard.y =
            clamp(
                hazard.y + dy,
                0,
                CANVAS_HEIGHT
            );


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

                    point.x +=
                        movement.dx;

                    point.y +=
                        movement.dy;
                }
            );
        }

        else {

            shape.x +=
                movement.dx;

            shape.y +=
                movement.dy;
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

                point.x +=
                    movement.dx;

                point.y +=
                    movement.dy;
            }
        );
    }
}


function renderTemporaryFixedShape(
    type,
    bounds
) {

    temporaryLayer.innerHTML =
        "";


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

    temporaryLayer.innerHTML =
        "";


    if (
        currentPoints.length <
        2
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
        pointsToString(currentPoints)
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

        currentPoints.length <
        5 ||

        bounds.width <
        15 ||

        bounds.height <
        15

    ) {

        statusBar.textContent =
            "Draw a larger freehand outline.";


        currentPoints =
            [];


        draftOriginState =
            null;


        return;
    }


    const shape = {

        id:
            nextShapeId++,

        type:
            "freehand",

        name:
            "",

        meaning:
            "",

        fill:
            DEFAULT_SHAPE_FILL,

        rotation:
            0,

        draft:
            true,

        points:
            currentPoints.map(

                point => ({
                    ...point
                })
            )
    };


    shapes.push(
        shape
    );


    pendingDraftId =
        shape.id;


    selectedItem = {

        kind:
            "shape",

        id:
            shape.id
    };


    currentPoints =
        [];


    setTool(
        "transform"
    );
}


/* =========================================================
ROUTES
========================================================= */

function renderTemporaryRoute(
    kind
) {

    temporaryLayer.innerHTML =
        "";


    if (
        currentPoints.length <
        2
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
            pointsToString(currentPoints)
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
            pointsToString(currentPoints)
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


        temporaryLayer.appendChild(
            edge
        );


        const core =
            document.createElementNS(
                SVG_NS,
                "polyline"
            );


        core.setAttribute(
            "points",
            pointsToString(currentPoints)
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


        temporaryLayer.appendChild(
            core
        );
    }
}


function finishRoute(
    kind
) {

    if (
        currentPoints.length <
        2
    ) {

        currentPoints =
            [];


        interactionBeforeState =
            null;


        return;
    }


    const route = {

        id:
            nextRouteId++,

        kind,

        name:
            "",

        draft:
            true,

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


    routes.push(
        route
    );


    pendingRouteId =
        route.id;


    selectedItem = {

        kind:
            "route",

        id:
            route.id
    };


    currentPoints =
        [];


    pointerActive =
        false;


    temporaryLayer.innerHTML =
        "";


    openRouteModal(
        route
    );
}


function routeMidpoint(
    points
) {

    if (
        !points?.length
    ) {

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


    const segments =
        [];


    let total =
        0;


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


        segments.push(
            length
        );


        total +=
            length;
    }


    const target =
        total / 2;


    let accumulated =
        0;


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
                    length ||
                    1
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


        accumulated +=
            length;
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

function handleSigns(
    handle
) {

    const map = {

        tl:
            [-1, -1],

        tr:
            [1, -1],

        br:
            [1, 1],

        bl:
            [-1, 1],

        left:
            [-1, 0],

        right:
            [1, 0],

        top:
            [0, -1],

        bottom:
            [0, 1]
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


    if (
        !shape.draft
    ) {

        interactionBeforeState =
            captureMapState();
    }


    const centre =
        getShapeCentre(
            shape
        );


    transformAction = {

        type:
            "rotate",

        shapeId:
            shape.id,

        centre,

        startAngle:
            Math.atan2(

                point.y -
                centre.y,

                point.x -
                centre.x

            ) *

            180 /

            Math.PI,

        startRotation:
            shape.rotation ||
            0
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


    if (
        !shape.draft
    ) {

        interactionBeforeState =
            captureMapState();
    }


    const bounds =
        getShapeBounds(
            shape
        );


    const centre =
        getShapeCentre(
            shape
        );


    const basis =
        getBasis(
            shape.rotation ||
            0
        );


    const {
        hx,
        hy
    } =
        handleSigns(
            handle
        );


    const anchor =
        add(

            centre,

            add(

                scale(
                    basis.u,
                    -hx *
                    bounds.width /
                    2
                ),

                scale(
                    basis.v,
                    -hy *
                    bounds.height /
                    2
                )
            )
        );


    transformAction = {

        type:
            "resize",

        shapeId:
            shape.id,

        handle,

        hx,

        hy,

        anchor,

        u:
            basis.u,

        v:
            basis.v,

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


        width =
            size;


        height =
            size;
    }

    else if (

        !isCorner &&

        shape.type === "square"

    ) {

        shape.type =
            "rectangle";
    }

    else if (

        !isCorner &&

        shape.type === "circle"

    ) {

        shape.type =
            "oval";
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
                    width /
                    2
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
                    height /
                    2
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

        shape.x =
            x;

        shape.y =
            y;

        shape.width =
            width;

        shape.height =
            height;
    }
}


function performTransform(
    point
) {

    if (
        !transformAction
    ) {

        return;
    }


    const shape =
        shapes.find(

            item =>
                item.id ===
                transformAction.shapeId
        );


    if (!shape) {

        transformAction =
            null;

        return;
    }


    if (
        transformAction.type ===
        "move"
    ) {

        selectedItem = {

            kind:
                "shape",

            id:
                shape.id
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

                point.y -
                centre.y,

                point.x -
                centre.x

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
CANVAS INTERACTION
========================================================= */

canvas.addEventListener(

    "pointerdown",

    event => {

        event.preventDefault();


        if (
            appMode === "teacher-review"
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
            getCanvasPoint(
                event
            );


        if (
            currentTool === "transform"
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

                        kind:
                            "shape",

                        id:
                            draft.id
                    };


                    renderAll();


                    return;
                }


                selectedItem = {

                    kind:
                        "shape",

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

                    type:
                        "move",

                    shapeId:
                        id,

                    lastPoint:
                        point
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

                    kind:
                        "shape",

                    id:
                        getPendingDraft().id
                };


                renderAll();


                return;
            }


            selectedItem =
                null;


            renderAll();


            return;
        }


        if (
            currentTool === "hazard"
        ) {

            openHazardModal({

                x:
                    point.x,

                y:
                    point.y
            });


            return;
        }


        if (
            currentTool === "select"
        ) {

            const routeTarget =
                event.target.closest(
                    "[data-route-id]"
                );


            const shapeTarget =
                event.target.closest(
                    ".map-shape"
                );


            // Hazards are drawn on top, so they are picked first.
            const hazardTarget =
                event.target.closest(
                    "[data-hazard-id]"
                );


            if (hazardTarget) {

                selectedItem = {

                    kind:
                        "hazard",

                    id:
                        Number(
                            hazardTarget.dataset.hazardId
                        )
                };


                if (
                    allowedTools.move
                ) {

                    interactionBeforeState =
                        captureMapState();


                    pointerActive =
                        true;


                    lastMovePoint =
                        point;


                    canvas.setPointerCapture(
                        event.pointerId
                    );
                }


                renderAll();


                return;
            }


            if (routeTarget) {

                selectedItem = {

                    kind:
                        "route",

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


                    pointerActive =
                        true;


                    lastMovePoint =
                        point;


                    canvas.setPointerCapture(
                        event.pointerId
                    );
                }


                renderAll();


                return;
            }


            if (shapeTarget) {

                selectedItem = {

                    kind:
                        "shape",

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


                    pointerActive =
                        true;


                    lastMovePoint =
                        point;


                    canvas.setPointerCapture(
                        event.pointerId
                    );
                }


                renderAll();


                return;
            }


            selectedItem =
                null;


            renderAll();


            return;
        }


        if (

            currentTool === "path" ||

            currentTool === "road"

        ) {

            interactionBeforeState =
                captureMapState();


            pointerActive =
                true;


            currentPoints = [
                point
            ];


            canvas.setPointerCapture(
                event.pointerId
            );


            return;
        }


        if (
            currentTool === "freehand"
        ) {

            draftOriginState =
                captureMapState();


            pointerActive =
                true;


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


            pointerActive =
                true;


            startPoint =
                point;


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
            appMode === "teacher-review"
        ) {

            moveTeacherAnnotation(
                event
            );

            return;
        }


        const point =
            getCanvasPoint(
                event
            );


        if (

            currentTool === "transform" &&

            transformAction

        ) {

            performTransform(
                point
            );


            return;
        }


        if (
            !pointerActive
        ) {

            return;
        }


        if (

            currentTool === "select" &&

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


            lastMovePoint =
                point;


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
                    currentPoints.length -
                    1
                ];


            if (

                previous &&

                distanceBetween(
                    point,
                    previous
                ) >
                3

            ) {

                currentPoints.push(
                    point
                );


                if (
                    currentTool === "freehand"
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
            appMode === "teacher-review"
        ) {

            endTeacherAnnotation(
                event
            );

            return;
        }


        const point =
            getCanvasPoint(
                event
            );


        if (

            currentTool === "transform" &&

            transformAction

        ) {

            const edited =
                shapes.find(

                    shape =>
                        shape.id ===
                        transformAction.shapeId
                );


            transformAction =
                null;


            if (
                edited &&
                !edited.draft
            ) {

                commitHistory(
                    interactionBeforeState
                );
            }


            interactionBeforeState =
                null;


            renderAll();


            return;
        }


        if (
            !pointerActive
        ) {

            return;
        }


        if (
            currentTool === "select"
        ) {

            commitHistory(
                interactionBeforeState
            );


            interactionBeforeState =
                null;


            pointerActive =
                false;


            lastMovePoint =
                null;


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
            currentTool === "freehand"
        ) {

            createFreehandDraft();


            pointerActive =
                false;


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


            pointerActive =
                false;


            startPoint =
                null;


            if (

                bounds.width <
                20 ||

                bounds.height <
                20

            ) {

                statusBar.textContent =
                    "That shape is too small. Try again.";


                draftOriginState =
                    null;


                return;
            }


            const shape = {

                id:
                    nextShapeId++,

                type:
                    currentTool,

                name:
                    "",

                meaning:
                    "",

                fill:
                    DEFAULT_SHAPE_FILL,

                rotation:
                    0,

                draft:
                    true,

                x:
                    bounds.x,

                y:
                    bounds.y,

                width:
                    bounds.width,

                height:
                    bounds.height
            };


            shapes.push(
                shape
            );


            pendingDraftId =
                shape.id;


            selectedItem = {

                kind:
                    "shape",

                id:
                    shape.id
            };


            setTool(
                "transform"
            );
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
            appMode !== "teacher-review"
        ) {

            resetInteractionState();
        }
    }
);


/* =========================================================
OBJECT MODAL
========================================================= */

function openObjectModal() {

    const draft =
        getPendingDraft();


    if (!draft) {
        return;
    }


    objectNameInput.value =
        "";


    objectCategorySelect.value =
        "Building";


    objectError.hidden =
        true;


    objectModal.hidden =
        false;


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

    objectModal.hidden =
        true;


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

            objectError.hidden =
                false;

            return;
        }


        draft.name =
            name;


        draft.meaning =
            objectCategorySelect.value;


        draft.draft =
            false;


        pendingDraftId =
            null;


        closeObjectModal();


        selectedItem = {

            kind:
                "shape",

            id:
                draft.id
        };


        commitHistory(
            draftOriginState
        );


        draftOriginState =
            null;


        setTool(
            "select"
        );


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


        pendingDraftId =
            null;


        draftOriginState =
            null;


        selectedItem =
            null;


        closeObjectModal();


        setTool(
            "select"
        );


        renderAll();
    }
);


/* =========================================================
ROUTE MODAL
========================================================= */

function openRouteModal(
    route
) {

    routeModalLabel.textContent =

        route.kind === "road"

            ? "ROAD READY"

            : "PATH READY";


    routeModalTitle.textContent =

        route.kind === "road"

            ? "Name this road"

            : "Name this path";


    routeNameInput.value =
        "";


    routeError.hidden =
        true;


    routeModal.hidden =
        false;


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

    routeModal.hidden =
        true;


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

            routeError.hidden =
                false;

            return;
        }


        route.name =
            name;


        route.draft =
            false;


        pendingRouteId =
            null;


        closeRouteModal();


        selectedItem = {

            kind:
                "route",

            id:
                route.id
        };


        commitHistory(
            interactionBeforeState
        );


        interactionBeforeState =
            null;


        setTool(
            "select"
        );


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


        pendingRouteId =
            null;


        interactionBeforeState =
            null;


        selectedItem =
            null;


        closeRouteModal();


        setTool(
            "select"
        );


        renderAll();
    }
);


/* =========================================================
HAZARD MODAL
========================================================= */

/*
Open the Hazard dialog, either for a new Hazard at { x, y } or
for an existing Hazard ({ id }) whose name and note can be changed.
*/
function openHazardModal(
    target
) {

    const existing =

        target.id !== undefined

            ? findHazard(
                target.id
            )

            : null;


    pendingHazard = {

        ...target,

        before:
            captureMapState()
    };


    hazardModalLabel.textContent =

        existing

            ? "EDIT HAZARD"

            : "HAZARD";


    hazardModalTitle.textContent =

        existing

            ? "Edit this hazard"

            : "Name this hazard";


    saveHazardButton.textContent =

        existing

            ? "Save"

            : "Add to Map";


    discardHazardButton.textContent =

        existing

            ? "Cancel"

            : "Discard";


    hazardNameInput.value =
        existing?.name ||
        "";


    hazardNoteInput.value =
        existing?.note ||
        "";


    hazardError.hidden =
        true;


    hazardModal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(

        () =>
            hazardNameInput.focus(),

        20
    );
}


function closeHazardModal() {

    pendingHazard =
        null;


    hazardModal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );
}


saveHazardButton.addEventListener(

    "click",

    () => {

        if (!pendingHazard) {

            closeHazardModal();

            return;
        }


        const name =
            hazardNameInput
                .value
                .trim();


        if (!name) {

            hazardError.hidden =
                false;

            return;
        }


        const note =
            hazardNoteInput
                .value
                .trim();


        const {
            before
        } =
            pendingHazard;


        let hazard =

            pendingHazard.id !== undefined

                ? findHazard(
                    pendingHazard.id
                )

                : null;


        const isNew =
            !hazard;


        if (hazard) {

            hazard.name =
                name;

            hazard.note =
                note;
        }

        else {

            hazard = {

                id:
                    nextHazardId++,

                name,

                note,

                x:
                    pendingHazard.x,

                y:
                    pendingHazard.y
            };


            hazards.push(
                hazard
            );
        }


        closeHazardModal();


        selectedItem = {

            kind:
                "hazard",

            id:
                hazard.id
        };


        commitHistory(
            before
        );


        setTool(
            "select"
        );


        statusBar.textContent =

            isNew

                ? `Hazard "${name}" added to your map.`

                : `Hazard "${name}" updated.`;
    }
);


discardHazardButton.addEventListener(

    "click",

    () => {

        closeHazardModal();


        renderAll();
    }
);


/* =========================================================
COLOUR
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


    colourPanel.hidden =
        false;
}


function hideColourPanel() {

    colourPanel.hidden =
        true;
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

    const hazard =
        getSelectedHazard();


    if (hazard) {

        openHazardModal({
            id:
                hazard.id
        });


        return;
    }


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
            shape.meaning ||
            "Other";
    }


    editError.hidden =
        true;


    editModal.hidden =
        false;


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

        editModal.hidden =
            true;


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

            editError.hidden =
                false;

            return;
        }


        const before =
            captureMapState();


        const shape =
            getSelectedShape();


        const route =
            getSelectedRoute();


        if (shape) {

            shape.name =
                name;


            shape.meaning =
                editCategorySelect.value;
        }

        else if (route) {

            route.name =
                name;
        }


        editModal.hidden =
            true;


        document.body.classList.remove(
            "modal-open"
        );


        commitHistory(
            before
        );


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
        deepClone(
            original
        );


    copy.id =
        nextShapeId++;


    copy.name =
        "";


    copy.meaning =
        "";


    copy.draft =
        true;


    if (
        copy.type === "freehand"
    ) {

        copy.points.forEach(

            point => {

                point.x +=
                    35;

                point.y +=
                    35;
            }
        );
    }

    else {

        copy.x +=
            35;

        copy.y +=
            35;
    }


    shapes.push(
        copy
    );


    pendingDraftId =
        copy.id;


    selectedItem = {

        kind:
            "shape",

        id:
            copy.id
    };


    closeFlyouts();


    setTool(
        "transform"
    );
}


duplicateButton.addEventListener(
    "click",
    duplicateSelectedLandmark
);


function moveShapeLayer(
    direction
) {

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


    const index =
        shapes.findIndex(

            item =>
                item.id ===
                shape.id
        );


    if (
        index < 0
    ) {

        return;
    }


    const targetIndex =

        direction === "front"

            ? shapes.length - 1

            : 0;


    if (
        index === targetIndex
    ) {

        statusBar.textContent =

            direction === "front"

                ? "This landmark is already at the front."

                : "This landmark is already at the back.";


        return;
    }


    const before =
        captureMapState();


    const [item] =
        shapes.splice(
            index,
            1
        );


    if (
        direction === "front"
    ) {

        shapes.push(
            item
        );
    }

    else {

        shapes.unshift(
            item
        );
    }


    commitHistory(
        before
    );


    renderAll();


    statusBar.textContent =
        `"${shape.name || "Landmark"}" moved to the ${
            direction === "front"
                ? "front"
                : "back"
        }.`;
}


bringForwardToolbarButton.addEventListener(

    "click",

    () =>
        moveShapeLayer(
            "front"
        )
);


sendBackwardToolbarButton.addEventListener(

    "click",

    () =>
        moveShapeLayer(
            "back"
        )
);


function deleteSelectedItem() {

    if (!selectedItem) {
        return;
    }


    const before =
        captureMapState();


    if (
        selectedItem.kind === "shape"
    ) {

        shapes =
            shapes.filter(

                shape =>
                    shape.id !==
                    selectedItem.id
            );
    }

    else if (
        selectedItem.kind === "hazard"
    ) {

        hazards =
            hazards.filter(

                hazard =>
                    hazard.id !==
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


    selectedItem =
        null;


    pendingDraftId =
        null;


    pendingRouteId =
        null;


    commitHistory(
        before
    );


    setTool(
        "select"
    );
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


        shapes =
            [];


        routes =
            [];


        hazards =
            [];


        selectedItem =
            null;


        pendingDraftId =
            null;


        pendingRouteId =
            null;


        nextShapeId =
            1;


        nextRouteId =
            1;


        nextHazardId =
            1;


        commitHistory(
            before
        );


        closeFlyouts();


        setTool(
            "select"
        );
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

        saveStudentMap(
            true
        );
    }
);


submitButton.addEventListener(

    "click",

    () => {

        closeFlyouts();


        if (
            !confirm(
                "Hand in your map to your teacher?\n\nYou won't be able to change it afterwards."
            )
        ) {

            return;
        }


        submitToTeacher();
    }
);


/* =========================================================
NORTH
========================================================= */

function displayNorthAngle(
    angle
) {

    return (

        (
            Math.round(angle) %
            360
        ) +

        360

    ) %

    360;
}


function renderNorthArrow() {

    northArrowInner.style.transform =
        `rotate(${northAngle}deg)`;


    northAngleLabel.textContent =
        `${displayNorthAngle(northAngle)}°`;


    northIndicator.setAttribute(

        "aria-label",

        `North is set to ${displayNorthAngle(northAngle)} degrees. Drag to rotate or tap to turn 45 degrees.`
    );
}


function finishNorthAdjustment() {

    if (
        !northDragging
    ) {

        return;
    }


    northDragging =
        false;


    northIndicator.classList.remove(
        "setting-north"
    );


    if (
        !northPointerMoved
    ) {

        northAngle =
            normaliseRotation(
                northStartRotation +
                45
            );


        renderNorthArrow();
    }


    commitHistory(
        northBeforeState
    );


    northBeforeState =
        null;


    northPointerStart =
        null;


    northPointerMoved =
        false;


    renderAll();


    statusBar.textContent =
        `North set to ${displayNorthAngle(northAngle)}°.`;
}


northIndicator.addEventListener(

    "pointerdown",

    event => {

        if (
            !isStudentEditingAllowed()
        ) {

            return;
        }


        event.preventDefault();


        const rectangle =
            northIndicator
                .getBoundingClientRect();


        const centreX =
            rectangle.left +
            rectangle.width /
            2;


        const centreY =
            rectangle.top +
            rectangle.height /
            2;


        northBeforeState =
            captureMapState();


        northPointerStart = {

            x:
                event.clientX,

            y:
                event.clientY
        };


        northPointerMoved =
            false;


        northDragging =
            true;


        northStartAngle =
            Math.atan2(

                event.clientY -
                centreY,

                event.clientX -
                centreX
            );


        northStartRotation =
            northAngle;


        northIndicator.classList.add(
            "setting-north"
        );


        statusBar.textContent =
            "Set North: drag the arrow until it points towards North. Tap once to rotate 45°.";


        northIndicator.setPointerCapture(
            event.pointerId
        );
    }
);


northIndicator.addEventListener(

    "pointermove",

    event => {

        if (
            !northDragging
        ) {

            return;
        }


        if (

            northPointerStart &&

            Math.hypot(

                event.clientX -
                northPointerStart.x,

                event.clientY -
                northPointerStart.y
            ) >
            5

        ) {

            northPointerMoved =
                true;
        }


        if (
            !northPointerMoved
        ) {

            return;
        }


        const rectangle =
            northIndicator
                .getBoundingClientRect();


        const centreX =
            rectangle.left +
            rectangle.width /
            2;


        const centreY =
            rectangle.top +
            rectangle.height /
            2;


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
    finishNorthAdjustment
);


northIndicator.addEventListener(

    "pointercancel",

    () => {

        northDragging =
            false;


        northIndicator.classList.remove(
            "setting-north"
        );


        northBeforeState =
            null;


        northPointerStart =
            null;


        northPointerMoved =
            false;


        renderNorthArrow();
    }
);


northIndicator.addEventListener(

    "lostpointercapture",

    () => {

        if (
            northDragging
        ) {

            finishNorthAdjustment();
        }
    }
);


northIndicator.addEventListener(

    "click",

    event => {

        if (

            event.detail !== 0 ||

            !isStudentEditingAllowed()

        ) {

            return;
        }


        const before =
            captureMapState();


        northAngle =
            normaliseRotation(
                northAngle +
                45
            );


        commitHistory(
            before
        );


        renderAll();


        statusBar.textContent =
            `North set to ${displayNorthAngle(northAngle)}°.`;
    }
);


/* =========================================================
RENDER SHAPES
========================================================= */

function renderShapes() {

    drawShapes(

        shapeLayer,

        shapes,

        selectedItem?.kind === "shape"
            ? selectedItem.id
            : null
    );
}


/*
Draw Landmarks into any SVG layer. Shared by the editor and
by map previews, so both always draw Landmarks the same way.
*/
function drawShapes(
    layer,
    shapeList,
    selectedShapeId = null
) {

    layer.innerHTML =
        "";


    shapeList.forEach(

        shape => {

            let element;


            if (
                shape.type === "freehand"
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
                getShapeCentre(
                    shape
                );


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


            if (
                shape.draft
            ) {

                element.classList.add(
                    "draft-shape"
                );
            }


            if (
                selectedShapeId !== null &&
                selectedShapeId ===
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


            layer.appendChild(
                element
            );


            if (

                !shape.draft &&

                shape.name

            ) {

                renderWrappedLabel(
                    shape,
                    layer
                );
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


function renderWrappedLabel(
    shape,
    layer = shapeLayer
) {

    const bounds =
        getShapeBounds(
            shape
        );


    const centre =
        getShapeCentre(
            shape
        );


    const rotation =
        Math.abs(

            (
                (
                    shape.rotation ||
                    0
                ) %

                180 +

                180
            ) %

            180
        );


    let width =
        bounds.width *
        .68;


    let height =
        bounds.height *
        .62;


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

        shape.type === "triangle" ||

        shape.type === "diamond"

    ) {

        width *=
            .8;
    }


    if (
        shape.type === "semicircle"
    ) {

        height *=
            .7;
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


    foreignObject.appendChild(
        div
    );


    layer.appendChild(
        foreignObject
    );
}


/* =========================================================
RENDER ROUTES
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

    drawRoutes(
        routeLayer,
        routes
    );
}


/*
Draw Routes into any SVG layer. Shared by the editor and by
map previews, so both always draw Routes the same way.
*/
function drawRoutes(
    layer,
    routeList
) {

    layer.innerHTML =
        "";


    routeList.forEach(

        route => {

            if (
                route.kind === "boundary"
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


            group.appendChild(
                hit
            );


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


                group.appendChild(
                    edge
                );


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


                group.appendChild(
                    core
                );
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

                    route.width ||
                    5
                );


                group.appendChild(
                    line
                );
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


                group.appendChild(
                    text
                );
            }


            layer.appendChild(
                group
            );
        }
    );
}


/* =========================================================
RENDER HAZARDS
========================================================= */

const HAZARD_RED =
    "#d7191c";


function renderHazards() {

    drawHazards(

        hazardLayer,

        hazards,

        selectedItem?.kind === "hazard"
            ? selectedItem.id
            : null
    );
}


/*
Draw the red ⚠ Hazard triangle into an SVG group, centred on (x, y).
Colours are set inline so they survive the PNG download, which
does not carry the page's CSS.
*/
function appendHazardSymbol(
    group,
    x,
    y,
    size
) {

    const half =
        size / 2;


    const triangle =
        document.createElementNS(
            SVG_NS,
            "polygon"
        );


    triangle.setAttribute(

        "points",

        pointArrayToString([

            [
                x,
                y - half
            ],

            [
                x + half,
                y + half * .8
            ],

            [
                x - half,
                y + half * .8
            ]
        ])
    );


    triangle.setAttribute(
        "fill",
        HAZARD_RED
    );


    triangle.setAttribute(
        "stroke",
        "#ffffff"
    );


    triangle.setAttribute(
        "stroke-width",
        size / 14
    );


    triangle.setAttribute(
        "stroke-linejoin",
        "round"
    );


    triangle.setAttribute(
        "class",
        "hazard-symbol"
    );


    const mark =
        document.createElementNS(
            SVG_NS,
            "text"
        );


    mark.setAttribute(
        "x",
        x
    );


    mark.setAttribute(
        "y",
        y + half * .62
    );


    mark.setAttribute(
        "text-anchor",
        "middle"
    );


    mark.setAttribute(
        "font-size",
        size * .62
    );


    mark.setAttribute(
        "font-weight",
        "900"
    );


    mark.setAttribute(
        "font-family",
        "Arial, sans-serif"
    );


    mark.setAttribute(
        "fill",
        "#ffffff"
    );


    mark.textContent =
        "!";


    group.append(
        triangle,
        mark
    );
}


/*
Draw Hazards into any SVG layer. Shared by the editor and by map
previews, so both always draw Hazards the same way.
*/
function drawHazards(
    layer,
    hazardList,
    selectedHazardId = null
) {

    layer.innerHTML =
        "";


    hazardList.forEach(

        hazard => {

            const group =
                document.createElementNS(
                    SVG_NS,
                    "g"
                );


            group.setAttribute(
                "class",
                "map-hazard"
            );


            group.dataset.hazardId =
                hazard.id;


            const title =
                document.createElementNS(
                    SVG_NS,
                    "title"
                );


            title.textContent =

                hazard.note

                    ? `⚠ ${hazard.name}: ${hazard.note}`

                    : `⚠ ${hazard.name}`;


            group.appendChild(
                title
            );


            if (
                hazard.id ===
                selectedHazardId
            ) {

                const ring =
                    document.createElementNS(
                        SVG_NS,
                        "circle"
                    );


                ring.setAttribute(
                    "cx",
                    hazard.x
                );


                ring.setAttribute(
                    "cy",
                    hazard.y
                );


                ring.setAttribute(
                    "r",
                    34
                );


                ring.setAttribute(
                    "fill",
                    "none"
                );


                ring.setAttribute(
                    "class",
                    "hazard-selected"
                );


                group.appendChild(
                    ring
                );
            }


            appendHazardSymbol(
                group,
                hazard.x,
                hazard.y,
                44
            );


            const label =
                document.createElementNS(
                    SVG_NS,
                    "text"
                );


            label.setAttribute(
                "x",
                hazard.x
            );


            label.setAttribute(
                "y",
                hazard.y + 42
            );


            label.setAttribute(
                "text-anchor",
                "middle"
            );


            label.setAttribute(
                "font-size",
                16
            );


            label.setAttribute(
                "font-weight",
                "800"
            );


            label.setAttribute(
                "font-family",
                "Arial, sans-serif"
            );


            label.setAttribute(
                "fill",
                HAZARD_RED
            );


            label.setAttribute(
                "stroke",
                "#ffffff"
            );


            label.setAttribute(
                "stroke-width",
                4
            );


            label.setAttribute(
                "paint-order",
                "stroke"
            );


            label.setAttribute(
                "class",
                "hazard-label"
            );


            label.textContent =
                hazard.name;


            group.appendChild(
                label
            );


            layer.appendChild(
                group
            );
        }
    );
}


/* =========================================================
MAP PREVIEW
========================================================= */

function mapDataHasFeatures(
    mapData
) {

    const data =
        mapData ||
        {};


    return (

        (
            Array.isArray(
                data.shapes
            ) &&
            data.shapes.length > 0
        ) ||

        (
            Array.isArray(
                data.routes
            ) &&
            data.routes.some(
                route =>
                    route.kind !==
                    "boundary"
            )
        ) ||

        (
            Array.isArray(
                data.hazards
            ) &&
            data.hazards.length > 0
        )
    );
}


/*
Draw one Project's map, read-only, into a container: the whole
canvas scaled to fit, with its North Arrow. No Legend, Reference
Map, selection or Review ink. Never touches the editor's state.
*/
function renderMapPreview(
    container,
    mapData
) {

    const data =
        mapData ||
        {};


    const svg =
        document.createElementNS(
            SVG_NS,
            "svg"
        );


    svg.setAttribute(
        "viewBox",
        `0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`
    );


    svg.setAttribute(
        "preserveAspectRatio",
        "xMidYMid meet"
    );


    svg.setAttribute(
        "aria-hidden",
        "true"
    );


    const background =
        document.createElementNS(
            SVG_NS,
            "rect"
        );


    background.setAttribute(
        "width",
        CANVAS_WIDTH
    );


    background.setAttribute(
        "height",
        CANVAS_HEIGHT
    );


    background.setAttribute(
        "class",
        "canvas-background"
    );


    const previewShapeLayer =
        document.createElementNS(
            SVG_NS,
            "g"
        );


    const previewRouteLayer =
        document.createElementNS(
            SVG_NS,
            "g"
        );


    const previewHazardLayer =
        document.createElementNS(
            SVG_NS,
            "g"
        );


    svg.append(
        background,
        previewShapeLayer,
        previewRouteLayer,
        previewHazardLayer
    );


    drawShapes(

        previewShapeLayer,        Array.isArray(
            data.shapes
        )
            ? data.shapes
            : []
    );


    drawRoutes(

        previewRouteLayer,

        Array.isArray(
            data.routes
        )
            ? data.routes
            : []
    );


    drawHazards(

        previewHazardLayer,

        Array.isArray(
            data.hazards
        )
            ? data.hazards
            : []
    );


    const north =
        document.createElement(
            "div"
        );

    north.className =
        "map-preview-north";

    north.innerHTML =
        `<strong>N</strong><span>↑</span>`;

    north.style.transform =
        `rotate(${Number(data.northAngle) || 0}deg)`;


    container.classList.add(
        "map-preview"
    );

    container.replaceChildren(
        svg,
        north
    );
}


/* =========================================================
SELECTION OVERLAY
========================================================= */

function renderSelectionOverlay() {

    selectionLayer.innerHTML =
        "";


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
        getShapeBounds(
            shape
        );


    const centre =
        getShapeCentre(
            shape
        );


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


    group.appendChild(
        box
    );


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


            group.appendChild(
                handle
            );
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


    group.appendChild(
        line
    );


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


    group.appendChild(
        rotate
    );


    selectionLayer.appendChild(
        group
    );


    if (
        shape.id === pendingDraftId
    ) {

        renderDoneButton(
            shape
        );
    }
}


function renderDoneButton(
    shape
) {

    const bounds =
        getShapeBounds(
            shape
        );


    const centre =
        getShapeCentre(
            shape
        );


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
                    bounds.y -
                    52
            };


    let position =
        rotatePoint(
            local,
            centre,
            shape.rotation ||
            0
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


    text.textContent =
        "✓ Done";


    group.append(
        rectangle,
        text
    );


    selectionLayer.appendChild(
        group
    );
}


/* =========================================================
LEGEND
========================================================= */

function createLegendShapePreview(
    shape
) {

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
        shape.type === "freehand"
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


        svg.appendChild(
            element
        );
    }


    return svg;
}


function createLegendRoutePreview(
    route
) {

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


        edge.setAttribute(
            "x1",
            2
        );

        edge.setAttribute(
            "y1",
            12
        );

        edge.setAttribute(
            "x2",
            29
        );

        edge.setAttribute(
            "y2",
            12
        );

        edge.setAttribute(
            "stroke",
            "#474943"
        );

        edge.setAttribute(
            "stroke-width",
            8
        );

        edge.setAttribute(
            "stroke-linecap",
            "round"
        );


        svg.appendChild(
            edge
        );


        const core =
            document.createElementNS(
                SVG_NS,
                "line"
            );


        core.setAttribute(
            "x1",
            2
        );

        core.setAttribute(
            "y1",
            12
        );

        core.setAttribute(
            "x2",
            29
        );

        core.setAttribute(
            "y2",
            12
        );

        core.setAttribute(
            "stroke",
            route.colour
        );

        core.setAttribute(
            "stroke-width",
            4
        );

        core.setAttribute(
            "stroke-linecap",
            "round"
        );


        svg.appendChild(
            core
        );
    }

    else {

        const line =
            document.createElementNS(
                SVG_NS,
                "line"
            );


        line.setAttribute(
            "x1",
            2
        );

        line.setAttribute(
            "y1",
            12
        );

        line.setAttribute(
            "x2",
            29
        );

        line.setAttribute(
            "y2",
            12
        );

        line.setAttribute(
            "stroke",
            route.colour
        );

        line.setAttribute(
            "stroke-width",
            4
        );

        line.setAttribute(
            "stroke-dasharray",
            "6 4"
        );

        line.setAttribute(
            "stroke-linecap",
            "round"
        );


        svg.appendChild(
            line
        );
    }


    return svg;
}


function renderLegend() {

    legendList.innerHTML =
        "";


    const completedShapes =

        shapes.filter(
            shape =>
                !shape.draft
        );


    const completedRoutes =

        routes.filter(

            route =>
                !route.draft &&
                route.kind !== "boundary"
        );


    if (

        !completedShapes.length &&

        !completedRoutes.length &&

        !hazards.length

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

                    route.kind === "road"

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


    renderLegendHazards();
}


/*
Hazards get their own section at the end of the Legend, each with
its name and, when there is one, why it is dangerous.
*/
function renderLegendHazards() {

    if (
        !hazards.length
    ) {

        return;
    }


    const section =
        document.createElement(
            "div"
        );


    section.className =
        "legend-section legend-hazards";


    const title =
        document.createElement(
            "div"
        );


    title.className =
        "legend-section-title";


    title.textContent =
        "Hazards";


    section.appendChild(
        title
    );


    hazards.forEach(

        hazard => {

            const preview =
                document.createElementNS(
                    SVG_NS,
                    "svg"
                );


            preview.setAttribute(
                "viewBox",
                "0 0 31 24"
            );


            preview.setAttribute(
                "class",
                "legend-preview"
            );


            appendHazardSymbol(
                preview,
                15.5,
                12.5,
                22
            );


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
                hazard.name;


            const note =
                document.createElement(
                    "div"
                );


            note.className =
                "legend-category";


            note.textContent =
                hazard.note ||
                "Hazard";


            text.append(
                name,
                note
            );


            row.append(
                preview,
                text
            );


            section.appendChild(
                row
            );
        }
    );


    legendList.appendChild(
        section
    );
}


/* =========================================================
RENDER MASTER
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
        shapes.length -
        1;
}


function updateMoreButtons() {

    duplicateButton.disabled =
        !getSelectedShape();


    editSelectedButton.disabled =

        !getSelectedShape() &&

        !getSelectedRoute() &&

        !getSelectedHazard();


    submitButton.hidden =
        appMode !== "student";
}


function renderAll() {

    createGrid();

    renderShapes();

    renderRoutes();

    renderHazards();

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
ANNOTATIONS
========================================================= */

function renderAnnotations() {

    annotationLayer.innerHTML =
        "";


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
                    stroke.points ||
                    []
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


function beginTeacherAnnotation(
    event
) {

    if (
        annotationPenButton.disabled ||
        !annotationPenButton
            .classList
            .contains(
                "active"
            )
    ) {

        return;
    }


    annotationDrawing =
        true;


    currentAnnotationPoints = [
        getCanvasPoint(event)
    ];


    canvas.setPointerCapture(
        event.pointerId
    );
}


function moveTeacherAnnotation(
    event
) {

    if (
        !annotationDrawing
    ) {

        return;
    }


    const point =
        getCanvasPoint(
            event
        );


    const previous =
        currentAnnotationPoints[
            currentAnnotationPoints.length -
            1
        ];


    if (
        distanceBetween(
            point,
            previous
        ) >
        3
    ) {

        currentAnnotationPoints.push(
            point
        );


        renderAnnotations();
    }
}


function endTeacherAnnotation() {

    if (
        !annotationDrawing
    ) {

        return;
    }


    annotationDrawing =
        false;


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


    currentAnnotationPoints =
        [];


    renderAnnotations();
}


annotationPenButton.addEventListener(

    "click",

    () =>
        annotationPenButton
            .classList
            .toggle(
                "active"
            )
);


clearAnnotationsButton.addEventListener(

    "click",

    () => {

        if (
            confirm(
                "Clear all teacher ink on this submission?"
            )
        ) {

            annotations =
                [];


            renderAnnotations();
        }
    }
);


/* =========================================================
AUTH / STUDENT / GUEST
========================================================= */

async function ensureAnonymousStudentSession() {

    if (
        !BACKEND_READY
    ) {

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


    let userIsGone =
        false;


    if (
        session?.user?.is_anonymous
    ) {

        // The browser remembers this sign-in, but its user may have been
        // deleted in Supabase since; ask the server before reusing it.
        const {
            error: userError
        } =
            await sb
                .auth
                .getUser();


        userIsGone =
            userError?.status >= 400 &&
            userError.status < 500;


        if (
            !userIsGone
        ) {

            return session.user;
        }


        console.warn(
            "Remembered student sign-in no longer exists; starting a fresh one.",
            userError
        );
    }


    if (session) {

        // A deleted user's sign-in can only be forgotten on this device.
        await sb
            .auth
            .signOut(
                userIsGone
                    ? {
                        scope:
                            "local"
                    }
                    : undefined
            );
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


async function createFreshAnonymousSession() {

    if (
        !BACKEND_READY
    ) {

        return null;
    }


    const {
        error: signOutError
    } =
        await sb
            .auth
            .signOut();


    // The server may refuse (e.g. the user was deleted); forget it here anyway.
    if (
        signOutError
    ) {

        await sb
            .auth
            .signOut({
                scope:
                    "local"
            });
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


async function ensureRegisteredStudentSession() {

    const user =
        await ensureAnonymousStudentSession();


    if (!user) {

        return null;
    }


    const {
        data,
        error
    } =
        await sb.rpc(
            "guest_current_profile"
        );


    if (error) {

        throw error;
    }


    const existingGuest =

        Array.isArray(data)

            ? data[0]

            : data;


    if (
        existingGuest
    ) {

        return await createFreshAnonymousSession();
    }


    return user;
}


async function detectResumeGuestSession() {

    resumeGuestButton.hidden =
        true;


    try {

        const {
            data,
            error
        } =
            await sb.rpc(
                "guest_current_profile"
            );


        if (error) {

            throw error;
        }


        const profile =

            Array.isArray(data)

                ? data[0]

                : data;


        if (!profile) {

            return null;
        }


        resumeGuestButton.textContent =
            `Continue Guest: ${profile.guest_name} · G-${profile.guest_code}`;


        resumeGuestButton.hidden =
            false;


        return profile;
    }

    catch (error) {

        console.warn(
            "Could not check for an existing guest session:",
            error
        );


        return null;
    }
}


/* Students sign in Task Code first: the code decides which
   Classes' names are offered, so nobody browses every Class. */

let pendingSignInTaskCode =
    "";


function showStartupCodeStep() {

    pendingSignInTaskCode =
        "";

    startupNameStep.hidden =
        true;

    startupStudentSelect.innerHTML =
        `<option value="">Choose your name</option>`;

    startupTaskCode.disabled =
        false;

    startupDescription.textContent =
        "Type the task code from your teacher.";

    studentLoginButton.textContent =
        "Find my name";

    startupError.hidden =
        true;
}


/*
 * Route a task code through the live task-code gate.
 * corrections-improvements.js replaces the visible profile controls
 * after app.js loads so existing tasks open their task folder instead
 * of jumping straight into the latest submission.
 */
async function routeSignedInTaskCode(
    code
) {

    const normalizedCode =
        String(
            code ||
            ""
        )
            .trim()
            .toUpperCase();


    if (
        !normalizedCode
    ) {

        return;
    }


    const liveTaskCodeInput =
        document.getElementById(
            "studentTaskCode"
        );


    if (
        liveTaskCodeInput
    ) {

        liveTaskCodeInput.value =
            normalizedCode;
    }


    // The corrections layer owns task-folder navigation when present.
    if (
        typeof window.oeOpenTaskFolderFromCode ===
        "function"
    ) {

        await window.oeOpenTaskFolderFromCode(
            normalizedCode
        );

        return;
    }


    // Safe fallback if app.js is ever used without the corrections layer.
    studentTaskCode.value =
        normalizedCode;


    await openTaskFromCode();
}


async function prepareStudentLogin() {


    showStartupCodeStep();


    startupTaskCode.value =
        "";


    resumeGuestButton.hidden =
        true;


    continueTeacherStep.hidden =
        true;


    if (
        !BACKEND_READY
    ) {

        studentLoginButton.disabled =
            true;

        openGuestButton.disabled =
            true;

        startupError.textContent =
            "Student profiles need the connected class database.";

        startupError.hidden =
            false;

        return;
    }


    studentLoginButton.disabled =
        false;

    openGuestButton.disabled =
        false;


    try {


        // A signed-in Teacher keeps their session until a student
        // actually starts (Task Code or Guest), or they sign out.
        const teacherUser =
            await signedInTeacherUser();


        if (teacherUser) {


            continueTeacherButton.textContent =
                `Continue as ${await savedTeacherName(teacherUser).catch(() => null) || teacherUser.email || "Teacher"}`;


            continueTeacherStep.hidden =
                false;
        }


        else {


            await ensureAnonymousStudentSession();


            await detectResumeGuestSession();
        }
    }
    catch (error) {
        console.error(
            error
        );
        startupError.textContent =
            error.message ||
            "Could not start signing in.";

        startupError.hidden =
            false;
    }


    setTimeout(
        () =>
            startupTaskCode.focus(),
        20
    );
}


function openGuestAccountModal() {

    startupModal.hidden =
        true;


    guestModal.hidden =
        false;


    guestError.hidden =
        true;


    guestNameInput.value =
        "";


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(

        () =>
            guestNameInput.focus(),

        20
    );
}


async function openGuestProfile(
    profile
) {

    currentIdentityType =
        "guest";


    currentGuestProfile =
        profile;


    currentStudentProfile =
        null;


    currentStudentRoster =
        [];


    studentInfo = {

        name:
            profile.guest_name,

        className:
            `Guest · G-${profile.guest_code}`,

        group:
            ""
    };


    profileStudentName.textContent =
        profile.guest_name;


    profileClassName.textContent =
        `Guest · G-${profile.guest_code}`;


    studentBadge.textContent =
        `${profile.guest_name} · G-${profile.guest_code}`;


    startupModal.hidden =
        true;


    guestModal.hidden =
        true;


    studentWorkspace.hidden =
        true;


    teacherDashboard.hidden =
        true;


    studentProfilePage.hidden =
        false;


    document.body.classList.remove(
        "modal-open"
    );


    await loadStudentProjectHistory();


    // A code typed before choosing "Create Guest Account" opens straight away.
    const signInTaskCode =
        startupTaskCode
            .value
            .trim()
            .toUpperCase();


    showStartupCodeStep();


    startupTaskCode.value =
        "";


    studentTaskError.hidden =
        true;


    if (
        signInTaskCode
    ) {

        await routeSignedInTaskCode(
            signInTaskCode
        );

        return;
    }


    document
        .getElementById(
            "studentTaskCode"
        )
        ?.focus();
}


openGuestButton.addEventListener(
    "click",
    openGuestAccountModal
);


cancelGuestButton.addEventListener(

    "click",

    () => {

        guestModal.hidden =
            true;


        startupModal.hidden =
            false;


        guestError.hidden =
            true;
    }
);


createGuestButton.addEventListener(

    "click",

    async () => {

        const name =
            guestNameInput
                .value
                .replace(
                    /\s+/g,
                    " "
                )
                .trim();


        guestError.hidden =
            true;


        if (!name) {

            guestError.textContent =
                "Enter your name.";


            guestError.hidden =
                false;


            return;
        }


        createGuestButton.disabled =
            true;


        createGuestButton.textContent =
            "Creating…";


        try {

            await createFreshAnonymousSession();


            const {
                data,
                error
            } =
                await sb.rpc(

                    "guest_create_profile",

                    {
                        p_guest_name:
                            name
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
                    "Guest account could not be created."
                );
            }


            await openGuestProfile(
                profile
            );
        }

        catch (error) {

            console.error(
                error
            );


            guestError.textContent =

                error.message ||

                "Could not create the guest account.";


            guestError.hidden =
                false;
        }

        finally {

            createGuestButton.disabled =
                false;


            createGuestButton.textContent =
                "Create Guest Account";
        }
    }
);


resumeGuestButton.addEventListener(

    "click",

    async () => {

        resumeGuestButton.disabled =
            true;


        try {

            const {
                data,
                error
            } =
                await sb.rpc(
                    "guest_current_profile"
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
                    "This guest session is no longer available. Create a new guest account."
                );
            }


            await openGuestProfile(
                profile
            );
        }

        catch (error) {

            startupError.textContent =

                error.message ||

                "Could not resume the guest session.";


            startupError.hidden =
                false;
        }

        finally {

            resumeGuestButton.disabled =
                false;
        }
    }
);


/* =========================================================
REGISTERED STUDENT LOGIN
========================================================= */

function rosterDisplayName(
    student
) {

    return student.register_no
        ? `${student.register_no} · ${student.student_name}`
        : student.student_name;
}


function renderStartupNames(
    names
) {

    startupStudentSelect.innerHTML =
        `<option value="">Choose your name</option>`;

    const classNames =
        [
            ...new Set(
                names.map(
                    student =>
                        student.class_name
                )
            )
        ];

    // Group names under their Class when the Task is set for several.
    classNames.forEach(
        className => {

            let parent =
                startupStudentSelect;

            if (
                classNames.length > 1
            ) {

                parent =
                    document.createElement(
                        "optgroup"
                    );

                parent.label =
                    className;

                startupStudentSelect.appendChild(
                    parent
                );
            }

            names
                .filter(
                    student =>
                        student.class_name === className
                )
                .forEach(
                    student => {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            student.student_id;

                        option.textContent =
                            rosterDisplayName(
                                student
                            );

                        parent.appendChild(
                            option
                        );
                    }
                );
        }
    );
}


async function findStudentNamesForTaskCode() {

    const code =
        startupTaskCode
            .value
            .trim()
            .toUpperCase();

    startupError.hidden =
        true;


    if (!code) {

        startupError.textContent =
            "Type the task code from your teacher.";

        startupError.hidden =
            false;

        return;
    }


    studentLoginButton.disabled =
        true;

    studentLoginButton.textContent =
        "Checking…";


    try {

        await ensureAnonymousStudentSession();

        const {
            data,
            error
        } =
            await sb.rpc(
                "student_list_task_roster",
                {
                    p_code:
                        code
                }
            );

        if (error) {
            throw error;
        }

        const names =
            Array.isArray(data)
                ? data
                : [];

        if (
            !names.length
        ) {

            throw new Error(
                "No names found for this code. Check the code with your teacher — your class may not be open yet."
            );
        }

        renderStartupNames(
            names
        );

        pendingSignInTaskCode =
            code;

        startupTaskCode.disabled =
            true;

        startupNameStep.hidden =
            false;

        startupDescription.textContent =
            "Now choose your name.";

        startupStudentSelect.focus();
    }

    catch (error) {

        console.error(
            error
        );

        startupError.textContent =
            error.message ||
            "Could not check this task code.";

        startupError.hidden =
            false;
    }

    finally {

        studentLoginButton.disabled =
            false;

        studentLoginButton.textContent =
            pendingSignInTaskCode
                ? "Continue"
                : "Find my name";
    }
}


startupTaskCode.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {
            loginStudentProfile();
        }
    }
);


startupChangeCodeButton.addEventListener(
    "click",
    () => {

        showStartupCodeStep();

        startupTaskCode.focus();

        startupTaskCode.select();
    }
);


async function loginStudentProfile() {

    startupError.hidden =
        true;


    // Step 1: the Task Code decides which names are offered.
    if (
        !pendingSignInTaskCode
    ) {

        await findStudentNamesForTaskCode();

        return;
    }


    const studentId =
        startupStudentSelect.value;


    if (
        !studentId
    ) {

        startupError.textContent =
            "Choose your name from the list.";


        startupError.hidden =
            false;


        return;
    }


    studentLoginButton.disabled =
        true;


    studentLoginButton.textContent =
        "Opening…";


    try {

        await ensureRegisteredStudentSession();


        const selectProfile =
            () =>
                sb.rpc(

                    "student_select_profile",

                    {
                        p_student_id:
                            studentId
                    }
                );


        let {
            data,
            error
        } =
            await selectProfile();


        // 23503: this device's sign-in belongs to a user deleted in
        // Supabase. Start a fresh sign-in and try once more.
        if (
            error?.code === "23503"
        ) {

            console.warn(
                "Student sign-in pointed at a deleted user; starting a fresh one.",
                error
            );


            await createFreshAnonymousSession();


            ({
                data,
                error
            } =
                await selectProfile());
        }


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


        currentIdentityType =
            "registered";


        currentStudentProfile =
            profile;


        currentGuestProfile =
            null;


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


        sessionWatcher.start();


        startupModal.hidden =
            true;


        studentWorkspace.hidden =
            true;


        teacherDashboard.hidden =
            true;


        studentProfilePage.hidden =
            false;


        document.body.classList.remove(
            "modal-open"
        );


        await loadStudentProjectHistory();


        // Go straight into the Task the student signed in with.
        const signInTaskCode =
            pendingSignInTaskCode;


        showStartupCodeStep();


        startupTaskCode.value =
            "";


        studentTaskError.hidden =
            true;


        await routeSignedInTaskCode(
            signInTaskCode
        );
    }

    catch (error) {

        console.error(
            error
        );


        startupError.textContent =

            error.message ||

            "Could not open your profile.";


        startupError.hidden =
            false;
    }

    finally {

        studentLoginButton.disabled =
            false;


        studentLoginButton.textContent =
            pendingSignInTaskCode
                ? "Continue"
                : "Find my name";
    }
}


studentLoginButton.addEventListener(
    "click",
    loginStudentProfile
);


/* =========================================================
TEACHER REVIEW FOR STUDENTS
========================================================= */

function normaliseTeacherReviewSnapshot(
    value
) {

    if (

        !value ||

        typeof value !== "object" ||

        Array.isArray(value)

    ) {

        return null;
    }


    const feedback =
        String(

            value.feedback ||

            value.teacher_feedback ||

            ""
        );


    const reviewAnnotations =

        Array.isArray(
            value.annotations
        )

            ? value.annotations

            : Array.isArray(
                value.teacher_annotations
            )

                ? value.teacher_annotations

                : [];


    const marked =
        Boolean(

            value.marked ||

            feedback.trim() ||

            reviewAnnotations.length
        );


    if (!marked) {

        return null;
    }


    return {

        marked:
            true,

        feedback,

        annotations:
            deepClone(
                reviewAnnotations
            ),

        updatedAt:

            value.updatedAt ||

            value.updated_at ||

            null
    };
}


async function fetchStudentReview(
    submissionId
) {

    if (

        !BACKEND_READY ||

        !hasCurrentLearnerIdentity() ||

        !submissionId

    ) {

        return null;
    }


    let result;


    if (
        currentIdentityType === "guest"
    ) {

        result =
            await sb.rpc(

                "guest_get_review",

                {
                    p_submission_id:
                        submissionId
                }
            );
    }

    else {

        result =
            await sb.rpc(

                "student_get_review",

                {
                    p_submission_id:
                        submissionId,

                    p_student_id:
                        currentStudentProfile.student_id
                }
            );
    }


    if (
        result.error
    ) {

        throw result.error;
    }


    const reviewRow =

        Array.isArray(
            result.data
        )

            ? result.data[0]

            : result.data;


    if (!reviewRow) {

        return null;
    }


    return normaliseTeacherReviewSnapshot({

        marked:
            true,

        teacher_annotations:
            reviewRow.teacher_annotations,

        teacher_feedback:
            reviewRow.teacher_feedback,

        updated_at:
            reviewRow.reviewed_at
    });
}


function resetStudentReviewState() {

    studentReviewData =
        null;


    studentReviewVisible =
        true;


    annotations =
        [];


    studentReviewPanel.hidden =
        true;


    studentReviewDate.textContent =
        "";


    studentTeacherFeedbackText.textContent =
        "";


    toggleStudentMarkedWorkButton.hidden =
        false;


    toggleStudentMarkedWorkButton.textContent =
        "Hide teacher markings";
}


function applyStudentReviewSnapshot(
    value
) {

    const review =
        normaliseTeacherReviewSnapshot(
            value
        );


    if (!review) {

        resetStudentReviewState();

        return;
    }


    studentReviewData =
        review;


    studentReviewVisible =
        true;


    annotations =
        deepClone(
            review.annotations
        );


    studentTeacherFeedbackText.textContent =

        review.feedback.trim() ||

        (
            review.annotations.length

                ? "Your teacher has added markings to your map."

                : "Your teacher has reviewed this project."
        );


    studentReviewDate.textContent =

        review.updatedAt

            ? `Reviewed ${new Date(review.updatedAt).toLocaleString()}`

            : "Teacher review available";


    toggleStudentMarkedWorkButton.hidden =
        !review.annotations.length;


    toggleStudentMarkedWorkButton.textContent =
        "Hide teacher markings";


    studentReviewPanel.hidden =
        false;


    applyStudentEditLockUI();
}


toggleStudentMarkedWorkButton.addEventListener(

    "click",

    () => {

        if (
            !studentReviewData
        ) {

            return;
        }


        studentReviewVisible =
            !studentReviewVisible;


        annotations =

            studentReviewVisible

                ? deepClone(
                    studentReviewData.annotations
                )

                : [];


        toggleStudentMarkedWorkButton.textContent =

            studentReviewVisible

                ? "Hide teacher markings"

                : "Show teacher markings";


        renderAnnotations();
    }
);


async function getProjectReviewSnapshot(
    project
) {

    if (

        !hasCurrentLearnerIdentity() ||

        !project?.submission_id

    ) {

        return null;
    }


    try {

        return await fetchStudentReview(
            project.submission_id
        );
    }

    catch (error) {

        console.warn(

            "Could not check teacher feedback for project:",

            error
        );


        return null;
    }
}


/* =========================================================
LIVE CHECKS
Repeat a check every LIVE_CHECK_INTERVAL_MS (or the interval
given) while it is active and the page is visible. Checks
never overlap.
========================================================= */

const liveChecks = [];


function createLiveCheck(
    isActive,
    check,
    intervalMs = LIVE_CHECK_INTERVAL_MS
) {

    let timer =
        null;

    let inFlight =
        false;


    function stop() {

        clearInterval(
            timer
        );

        timer =
            null;
    }


    async function runNow() {

        if (
            !isActive()
        ) {

            stop();

            return;
        }

        if (
            document.hidden ||
            inFlight
        ) {
            return;
        }

        inFlight =
            true;

        try {

            await check();
        }

        catch (error) {

            console.warn(
                "Live check failed:",
                error
            );
        }

        finally {

            inFlight =
                false;
        }
    }


    function start() {

        stop();

        timer =
            setInterval(
                runNow,
                intervalMs
            );
    }


    const liveCheck = {
        start,
        stop,
        runNow,

        isRunning:
            () =>
                timer !== null
    };

    liveChecks.push(
        liveCheck
    );

    return liveCheck;
}


document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {
            return;
        }

        liveChecks.forEach(
            liveCheck => {

                if (
                    liveCheck.isRunning()
                ) {
                    liveCheck.runNow();
                }
            }
        );
    }
);


/* =========================================================
HANDED IN IS FINAL
Once a Project is Submitted (or Marked) nobody can draw on
it: every member's device shows it locked. A student is
signed in on one device at a time.
========================================================= */

function handedInStatusText() {

    return studentReviewData

        ? "Marked. Read your teacher's feedback below."

        : "Handed in. Waiting for your teacher to mark it.";
}


// Nobody draws on a handed-in map, so let the pen go.
async function closeHandedInProject() {

    if (
        editLockOwned
    ) {

        await releaseCurrentEditLock();
    }


    stopEditLockHeartbeat();


    editLockOwned =
        false;


    studentReadOnly =
        true;


    hideEditRequestPrompt();


    applyStudentEditLockUI();


    return false;
}


// Someone else handed it in (a groupmate or the Teacher).
async function showHandedInProject() {

    if (
        currentSubmission?.id
    ) {

        await loadStudentProject(
            currentSubmission.id
        );
    }


    statusBar.textContent =
        "This map has been handed in, so it can't be changed now.";
}


function isSignedInAsStudent() {

    return (

        BACKEND_READY &&

        currentIdentityType === "registered" &&

        Boolean(
            currentStudentProfile
        ) &&

        appMode !== "teacher-dashboard" &&

        appMode !== "teacher-review"
    );
}


const sessionWatcher =
    createLiveCheck(
        isSignedInAsStudent,
        checkStillSignedIn
    );


async function checkStillSignedIn() {

    const {
        data,
        error
    } =
        await sb.rpc(
            "student_current_profile"
        );


    if (error) {

        throw error;
    }


    const me =
        Array.isArray(data)
            ? data[0]
            : data;


    if (
        me?.student_id ===
        currentStudentProfile?.student_id
    ) {

        return;
    }


    await signedOutElsewhere();
}


async function signedOutElsewhere() {

    // The other device already freed the pen.
    editLockOwned =
        false;

    studentReadOnly =
        false;


    stopEditLockHeartbeat();

    hideEditRequestPrompt();

    stopReviewWatcher();

    projectsWatcher.stop();

    sessionWatcher.stop();

    hideProjectsNotice();

    resetStudentReviewState();


    currentIdentityType =
        null;

    currentStudentProfile =
        null;

    currentStudentProjects =
        [];

    currentStudentRoster =
        [];

    currentSubmission =
        null;

    projectHandedIn =
        false;


    studentProfilePage.hidden =
        true;

    studentWorkspace.hidden =
        true;

    teacherDashboard.hidden =
        true;

    startupModal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    await prepareStudentLogin();


    startupError.textContent =
        "You signed in on another device, so you've been signed out here.";

    startupError.hidden =
        false;
}


/* Teacher side: watch drafts, mark only handed-in work. */

function reviewIsHandedIn() {

    return (
        reviewSubmission?.status ===
        "submitted"
    );
}


function applyReviewMarkingState() {

    const handedIn =
        reviewIsHandedIn();


    annotationPenButton.disabled =
        !handedIn;

    annotationPenButton.classList.toggle(
        "active",
        handedIn
    );

    clearAnnotationsButton.disabled =
        !handedIn;

    saveTeacherFeedbackButton.disabled =
        !handedIn;

    teacherFeedbackText.disabled =
        !handedIn;

    reviewDraftNotice.hidden =
        handedIn;

    handInForThemButton.hidden =
        handedIn;

    reviewHint.hidden =
        !handedIn;
}


function isWatchingDraftForTeacher() {

    return (

        appMode === "teacher-review" &&

        Boolean(
            reviewSubmission
        ) &&

        !reviewIsHandedIn()
    );
}


const draftReviewWatcher =
    createLiveCheck(
        isWatchingDraftForTeacher,
        refreshDraftForTeacher
    );


async function refreshDraftForTeacher() {

    const submissionId =
        reviewSubmission.id;


    const {
        data,
        error
    } =
        await sb
            .from(
                "submissions"
            )
            .select(
                "id,status,submitted_at,updated_at,map_data"
            )
            .eq(
                "id",
                submissionId
            )
            .single();


    if (error) {

        throw error;
    }


    if (
        reviewSubmission?.id !==
        submissionId
    ) {

        return;
    }


    if (
        data.updated_at !==
        reviewSubmission.updated_at
    ) {

        loadMapData(
            data.map_data ||
            {}
        );
    }


    reviewSubmission = {
        ...reviewSubmission,
        ...data
    };


    applyReviewMarkingState();
}


handInForThemButton.addEventListener(

    "click",

    async () => {

        if (
            !reviewSubmission
        ) {

            return;
        }


        if (
            !confirm(
                `Hand in this map for ${reviewStudentName.textContent.trim()}?\n\nThey won't be able to change it afterwards.`
            )
        ) {

            return;
        }


        handInForThemButton.disabled =
            true;


        try {

            const {
                data,
                error
            } =
                await sb
                    .from(
                        "submissions"
                    )
                    .update({
                        status:
                            "submitted",
                        submitted_at:
                            new Date().toISOString()
                    })
                    .eq(
                        "id",
                        reviewSubmission.id
                    )
                    .select()
                    .single();


            if (error) {

                throw error;
            }


            reviewSubmission =
                data;


            loadMapData(
                data.map_data ||
                {}
            );


            applyReviewMarkingState();


            statusBar.textContent =
                "Handed in. You can mark it now.";
        }

        catch (error) {

            alert(
                error.message ||
                "Could not hand in this map."
            );
        }

        finally {

            handInForThemButton.disabled =
                false;
        }
    }
);


/* =========================================================
EDIT REQUESTS
A View-only Group member asks the Editor for a turn. The
database decides every rule (one request at a time, the
30-second countdown, whether the asker is still there); this
page asks about every 5 seconds and shows the answer.
View-only devices also follow the Editor's map.
========================================================= */

const EDIT_REQUEST_CHECK_MS =
    5000;


function isGroupProject() {

    return (

        currentIdentityType !== "guest" &&

        currentGroupSize >= 2
    );
}


function isWatchingTurns() {

    return (

        BACKEND_READY &&

        appMode === "student" &&

        !studentWorkspace.hidden &&

        Boolean(
            currentSubmission?.id
        ) &&

        hasCurrentLearnerIdentity() &&

        !projectHandedIn &&

        (
            isGroupProject() ||
            studentReadOnly
        )
    );
}


const turnWatcher =
    createLiveCheck(
        isWatchingTurns,
        checkTurns,
        EDIT_REQUEST_CHECK_MS
    );


function startTurnWatcher() {

    editRequestState =
        "";

    editRequestNotice =
        "";

    viewOnlyChecks =
        0;

    hideEditRequestPrompt();

    applyStudentEditLockUI();

    turnWatcher.start();
}


async function checkTurns() {

    if (
        projectHandedIn
    ) {

        return;
    }


    if (
        isGroupProject()
    ) {

        await checkEditRequest();
    }


    viewOnlyChecks +=
        1;


    // About every 10 seconds: follow the map, notice a hand-in.
    if (
        viewOnlyChecks % 2 === 0
    ) {

        await followEditorMap();
    }
}


async function checkEditRequest() {

    const submissionId =
        currentSubmission.id;


    const {
        data,
        error
    } =
        await sb.rpc(
            "student_check_edit_request",
            {
                p_submission_id:
                    submissionId,
                p_editor_token:
                    EDITOR_TOKEN
            }
        );


    if (error) {

        throw error;
    }


    if (
        currentSubmission?.id !==
        submissionId
    ) {

        return;
    }


    const turn =
        (
            Array.isArray(data)
                ? data[0]
                : data
        ) ||
        {};


    const previous =
        editRequestState;


    editRequestState =
        turn.state ||
        "";


    if (
        turn.state === "editing" ||
        turn.state === "incoming"
    ) {

        if (
            !editLockOwned
        ) {

            // Our turn: open the latest saved map before drawing.
            await loadStudentProject(
                submissionId
            );


            statusBar.textContent =
                "Your turn — you're drawing now. Your work saves automatically.";


            return;
        }


        if (
            turn.state === "incoming"
        ) {

            showEditRequestPrompt(
                turn.requester_name,
                turn.seconds_left
            );
        }

        else {

            hideEditRequestPrompt();
        }


        return;
    }


    hideEditRequestPrompt();


    if (
        turn.state === "viewing"
    ) {

        if (
            editLockOwned
        ) {

            // The pen passed on without an answer.
            passTurnTo(
                turn.editor_name
            );


            return;
        }


        editLockHolderName =
            turn.editor_name ||
            editLockHolderName;


        if (
            !turn.requester_name &&
            editRequestNotice.startsWith(
                "Someone already asked"
            )
        ) {

            editRequestNotice =
                "";
        }
    }

    else if (
        previous === "waiting" &&
        turn.state !== "waiting"
    ) {

        editRequestNotice =

            turn.state === "refused"

                ? `${turn.editor_name || "The Editor"} said not now. You can ask again later.`

                : turn.state === "ran_out"

                    ? "Your request ran out. Ask again."

                    : "";
    }


    applyStudentEditLockUI();
}


function passTurnTo(
    name
) {

    const message =
        `${name || "Someone else"} is drawing now. Ask to draw to get a turn back.`;


    hideEditRequestPrompt();


    editRequestState =
        "";


    editLockHolderName =
        name ||
        "";


    editRequestNotice =
        message;


    handleLostEditLock(
        message
    );
}


async function followEditorMap() {

    const submissionId =
        currentSubmission.id;


    const result =

        currentIdentityType === "guest"

            ? await sb.rpc(
                "guest_load_project",
                {
                    p_submission_id:
                        submissionId
                }
            )

            : await sb.rpc(
                "student_load_project",
                {
                    p_submission_id:
                        submissionId,
                    p_student_id:
                        currentStudentProfile.student_id
                }
            );


    if (
        result.error
    ) {

        throw result.error;
    }


    const project =
        Array.isArray(
            result.data
        )
            ? result.data[0]
            : result.data;


    if (
        !project ||
        currentSubmission?.id !==
        submissionId
    ) {

        return;
    }


    // Handed in by a groupmate or the Teacher: show it locked.
    if (
        project.status === "submitted"
    ) {

        await loadStudentProject(
            submissionId
        );


        return;
    }


    if (
        !studentReadOnly ||
        project.updated_at ===
        currentSubmission.updated_at
    ) {

        return;
    }


    currentSubmission.updated_at =
        project.updated_at;

    currentSubmission.status =
        project.status;

    currentSubmission.submitted_at =
        project.submitted_at;


    // Keeps this device's zoom and position.
    loadMapData(
        project.map_data ||
        {}
    );
}


function showEditRequestPrompt(
    name,
    secondsLeft
) {

    const deadline =
        Date.now() +
        Math.max(
            0,
            Number(secondsLeft) ||
            0
        ) *
        1000;


    if (
        editRequestPrompt.hidden
    ) {

        editRequestSavedAtZero =
            false;

        editRequestDeadline =
            deadline;

        handOverButton.disabled =
            false;

        notNowButton.disabled =
            false;
    }

    else if (
        Math.abs(
            deadline -
            editRequestDeadline
        ) > 1500
    ) {

        editRequestDeadline =
            deadline;
    }


    editRequestRequesterName =
        name ||
        "A group member";


    editRequestPromptTitle.textContent =
        `${editRequestRequesterName} wants to draw.`;


    editRequestPrompt.hidden =
        false;


    renderEditRequestCountdown();


    if (
        !editRequestCountdownTimer
    ) {

        editRequestCountdownTimer =
            setInterval(
                renderEditRequestCountdown,
                1000
            );
    }
}


function renderEditRequestCountdown() {

    const left =
        Math.max(
            0,
            Math.ceil(
                (
                    editRequestDeadline -
                    Date.now()
                ) /
                1000
            )
        );


    editRequestPromptCountdown.textContent =

        left > 0

            ? `Handing over in ${left} s`

            : "Handing over now…";


    // Save at 0 so the last strokes are kept when the pen moves on.
    if (
        left === 0 &&
        !editRequestSavedAtZero &&
        editLockOwned
    ) {

        editRequestSavedAtZero =
            true;

        clearTimeout(
            saveTimer
        );

        saveStudentMap(
            false
        );
    }
}


function hideEditRequestPrompt() {

    editRequestPrompt.hidden =
        true;


    clearInterval(
        editRequestCountdownTimer
    );


    editRequestCountdownTimer =
        null;
}


async function answerEditRequest(
    handOver
) {

    if (
        !currentSubmission?.id ||
        !editLockOwned
    ) {

        return;
    }


    const name =
        editRequestRequesterName;


    handOverButton.disabled =
        true;

    notNowButton.disabled =
        true;


    try {

        if (
            handOver
        ) {

            clearTimeout(
                saveTimer
            );

            await saveStudentMap(
                false
            );


            if (
                !editLockOwned
            ) {

                return;
            }
        }


        const {
            data,
            error
        } =
            await sb.rpc(
                "student_answer_edit_request",
                {
                    p_submission_id:
                        currentSubmission.id,
                    p_editor_token:
                        EDITOR_TOKEN,
                    p_hand_over:
                        handOver
                }
            );


        if (error) {

            throw error;
        }


        if (
            data === "granted"
        ) {

            passTurnTo(
                name
            );


            return;
        }


        hideEditRequestPrompt();


        statusBar.textContent =

            data === "refused"

                ? "You kept drawing."

                : `${name} is no longer there, so you are still drawing.`;
    }

    catch (error) {

        console.warn(
            "Could not answer the request to draw:",
            error
        );


        handOverButton.disabled =
            false;

        notNowButton.disabled =
            false;


        statusBar.textContent =
            "Could not answer. Please try again.";
    }
}


handOverButton.addEventListener(
    "click",
    () =>
        answerEditRequest(
            true
        )
);


notNowButton.addEventListener(
    "click",
    () =>
        answerEditRequest(
            false
        )
);


askToDrawButton.addEventListener(

    "click",

    async () => {

        if (
            !currentSubmission?.id
        ) {

            return;
        }


        const submissionId =
            currentSubmission.id;


        askToDrawButton.disabled =
            true;


        editRequestNotice =
            "";


        try {

            const {
                data,
                error
            } =
                await sb.rpc(
                    "student_ask_to_draw",
                    {
                        p_submission_id:
                            submissionId,
                        p_editor_token:
                            EDITOR_TOKEN
                    }
                );


            if (error) {

                throw error;
            }


            if (
                data === "free"
            ) {

                await loadStudentProject(
                    submissionId
                );


                return;
            }


            if (
                data === "waiting"
            ) {

                editRequestState =
                    "waiting";
            }

            else {

                editRequestNotice =
                    `Someone already asked. Wait for ${editLockHolderName || "the Editor"} to answer.`;
            }
        }

        catch (error) {

            console.warn(
                "Could not ask to draw:",
                error
            );


            editRequestNotice =
                "Could not send your request. Please try again.";
        }

        finally {

            askToDrawButton.disabled =
                false;


            applyStudentEditLockUI();
        }
    }
);


cancelEditRequestButton.addEventListener(

    "click",

    async () => {

        if (
            !currentSubmission?.id
        ) {

            return;
        }


        cancelEditRequestButton.disabled =
            true;


        try {

            const {
                error
            } =
                await sb.rpc(
                    "student_cancel_edit_request",
                    {
                        p_submission_id:
                            currentSubmission.id,
                        p_editor_token:
                            EDITOR_TOKEN
                    }
                );


            if (error) {

                throw error;
            }


            editRequestState =
                "";

            editRequestNotice =
                "";
        }

        catch (error) {

            console.warn(
                "Could not cancel the request:",
                error
            );
        }

        finally {

            cancelEditRequestButton.disabled =
                false;


            applyStudentEditLockUI();
        }
    }
);


/* =========================================================
LIVE TEACHER FEEDBACK
While a Project is open, show its Review as soon as a
Teacher saves or changes it.
========================================================= */

function reviewSignature(
    review
) {

    if (!review) {
        return "";
    }

    return stateString({
        updatedAt:
            review.updatedAt,

        feedback:
            review.feedback,

        annotations:
            review.annotations
    });
}


function isWatchingOpenProject() {

    return (
        Boolean(reviewWatchSubmissionId) &&

        appMode === "student" &&

        !studentWorkspace.hidden &&

        currentSubmission?.id ===
        reviewWatchSubmissionId
    );
}


const reviewWatcher =
    createLiveCheck(
        isWatchingOpenProject,
        checkForReviewUpdate
    );


function startReviewWatcher(
    submissionId
) {

    reviewWatchSubmissionId =
        submissionId;

    reviewWatchSignature =
        reviewSignature(
            studentReviewData
        );

    reviewWatcher.start();
}


function stopReviewWatcher() {

    reviewWatcher.stop();

    reviewWatchSubmissionId =
        null;

    reviewWatchSignature =
        "";
}


async function checkForReviewUpdate() {

    const submissionId =
        reviewWatchSubmissionId;

    const review =
        await fetchStudentReview(
            submissionId
        );

    // The student may have left this Project while we waited.
    if (
        !isWatchingOpenProject() ||
        reviewWatchSubmissionId !== submissionId
    ) {
        return;
    }

    const signature =
        reviewSignature(
            review
        );

    if (
        signature ===
        reviewWatchSignature
    ) {
        return;
    }

    reviewWatchSignature =
        signature;

    showUpdatedStudentReview(
        review
    );
}


function showUpdatedStudentReview(
    review
) {

    // Respect "Hide teacher markings" if the student chose it.
    const keepMarkingsHidden =
        Boolean(studentReviewData) &&
        !studentReviewVisible;

    applyStudentReviewSnapshot(
        review
    );

    if (
        keepMarkingsHidden &&
        studentReviewData
    ) {

        studentReviewVisible =
            false;

        annotations =
            [];

        toggleStudentMarkedWorkButton.textContent =
            "Show teacher markings";
    }

    renderAnnotations();

    statusBar.textContent =
        "Teacher feedback updated.";
}


/* =========================================================
LIVE MY PROJECTS
While a student is on their profile page, keep My Projects
up to date: new Projects, status changes and new Reviews.
========================================================= */

function isShowingStudentProfile() {

    return (
        hasCurrentLearnerIdentity() &&

        !studentProfilePage.hidden &&

        studentWorkspace.hidden
    );
}


function currentLearnerProfile() {

    return currentIdentityType === "guest"
        ? currentGuestProfile
        : currentStudentProfile;
}


function projectListSignature(
    projects
) {

    return stateString(
        projects.map(
            project => [
                project.submission_id,
                project.status,
                project.updated_at,
                project.submitted_at,
                reviewSignature(
                    project.teacher_review_snapshot
                )
            ]
        )
    );
}


const projectsWatcher =
    createLiveCheck(
        isShowingStudentProfile,
        checkForProjectUpdates
    );


async function checkForProjectUpdates() {

    const learner =
        currentLearnerProfile();

    const projects =
        await fetchStudentProjects();

    // The student may have opened a Project or switched while we waited.
    if (
        !isShowingStudentProfile() ||
        currentLearnerProfile() !== learner
    ) {
        return;
    }

    if (
        projectListSignature(projects) ===
        projectListSignature(currentStudentProjects)
    ) {
        return;
    }

    const previousReviews =
        new Map(
            currentStudentProjects.map(
                project => [
                    project.submission_id,
                    reviewSignature(
                        project.teacher_review_snapshot
                    )
                ]
            )
        );

    const newlyMarked =
        projects.filter(
            project =>
                project.teacher_review_snapshot &&

                reviewSignature(
                    project.teacher_review_snapshot
                ) !==
                previousReviews.get(
                    project.submission_id
                )
        );

    currentStudentProjects =
        projects;

    renderStudentProjectHistory(
        new Set(
            newlyMarked.map(
                project =>
                    project.submission_id
            )
        )
    );

    if (
        newlyMarked.length
    ) {

        showProjectsNotice(
            newlyMarked.length === 1
                ? `New feedback on ${newlyMarked[0].task_title || "a project"}.`
                : `New feedback on ${newlyMarked.length} projects.`
        );
    }
}


function showProjectsNotice(
    message
) {

    clearTimeout(
        projectsNoticeTimer
    );

    studentProjectsNotice.textContent =
        message;

    studentProjectsNotice.hidden =
        false;

    projectsNoticeTimer =
        setTimeout(
            hideProjectsNotice,
            12000
        );
}


function hideProjectsNotice() {

    clearTimeout(
        projectsNoticeTimer
    );

    studentProjectsNotice.hidden =
        true;

    studentProjectsNotice.textContent =
        "";
}


/* =========================================================
PROJECT HISTORY
========================================================= */

async function loadStudentProjectHistory() {

    if (
        !hasCurrentLearnerIdentity()
    ) {

        return;
    }


    hideProjectsNotice();


    studentProjectsList.innerHTML =
        `<p class="helper-text">Loading projects…</p>`;


    try {

        currentStudentProjects =
            await fetchStudentProjects();


        renderStudentProjectHistory();
    }

    catch (error) {

        console.error(
            error
        );


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


    projectsWatcher.start();
}


async function fetchStudentProjects() {

    let result;


    if (
        currentIdentityType === "guest"
    ) {

        result =
            await sb.rpc(
                "guest_project_history"
            );
    }

    else {

        result =
            await sb.rpc(

                "student_project_history",

                {
                    p_student_id:
                        currentStudentProfile.student_id
                }
            );
    }


    if (
        result.error
    ) {

        throw result.error;
    }


    const projects =

        Array.isArray(
            result.data
        )

            ? result.data

            : [];


    return Promise.all(

        projects.map(

            async project => ({

                ...project,

                teacher_review_snapshot:
                    await getProjectReviewSnapshot(
                        project
                    )
            })
        )
    );
}


function renderStudentProjectHistory(
    highlightedProjectIds = new Set()
) {

    studentProjectsList.innerHTML =
        "";


    if (
        !currentStudentProjects.length
    ) {

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


            button.type =
                "button";


            button.className =
                "student-project-card";


            if (
                highlightedProjectIds.has(
                    project.submission_id
                )
            ) {

                button.classList.add(
                    "student-project-card-updated"
                );
            }


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


            const hasReview =
                Boolean(
                    project.teacher_review_snapshot
                );


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
Last activity
${
                    project.updated_at

                        ? new Date(
                            project.updated_at
                        ).toLocaleString()

                        : "—"
                }
</div>

</div>

<div class="student-project-badges">

${
                    hasReview

                        ? `
<span class="teacher-review-badge">
Marked
</span>
`

                        : ""
                }

<span class="student-project-status ${
                    project.status === "submitted"
                        ? "submitted"
                        : ""
                }">
${escapeHtml(
                    project.status ||
                    "draft"
                )}
</span>

</div>
</div>

<div class="student-project-members">
${
                    members.length > 1

                        ? `Group: ${escapeHtml(
                            members.join(" · ")
                        )}`

                        : "Individual project"
                }
</div>

${
                    hasReview

                        ? `
<div class="student-project-review-note">
Teacher feedback available — open to view your marked work.
</div>
`

                        : ""
                }
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


/* =========================================================
TASK CODE
========================================================= */

async function openTaskFromCode() {

    if (
        !hasCurrentLearnerIdentity()
    ) {

        return;
    }


    const code =
        studentTaskCode
            .value
            .trim()
            .toUpperCase();


    studentTaskError.hidden =
        true;


    if (!code) {

        studentTaskError.textContent =
            "Enter the task code from your teacher.";


        studentTaskError.hidden =
            false;


        return;
    }


    openStudentTaskButton.disabled =
        true;


    openStudentTaskButton.textContent =
        "Checking…";


    try {

        if (
            currentIdentityType === "guest"
        ) {

            const taskResult =
                await sb.rpc(

                    "guest_get_task_by_code",

                    {
                        p_code:
                            code
                    }
                );


            if (
                taskResult.error
            ) {

                throw taskResult.error;
            }


            const task =

                Array.isArray(
                    taskResult.data
                )

                    ? taskResult.data[0]

                    : taskResult.data;


            if (!task) {

                throw new Error(
                    "Task code not found, or this task does not allow guest students."
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


            const startResult =
                await sb.rpc(

                    "guest_start_project",

                    {
                        p_task_code:
                            task.task_code
                    }
                );


            if (
                startResult.error
            ) {

                throw startResult.error;
            }


            await loadStudentProject(
                startResult.data
            );


            return;
        }


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

        console.error(
            error
        );


        studentTaskError.textContent =

            error.message ||

            "Could not open this task.";


        studentTaskError.hidden =
            false;
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

        if (
            event.key === "Enter"
        ) {

            openTaskFromCode();
        }
    }
);


/* =========================================================
GROUP SELECTION
========================================================= */

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
            data ||
            [];
    }


    groupTaskTitle.textContent =

        pendingTaskLookup.title ||

        "Who are you working with?";


    groupMembersList.innerHTML =
        "";


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
value="${escapeHtml(student.id)}"
${
                    isCurrent
                        ? "checked disabled"
                        : ""
                }
>

<span>
${escapeHtml(rosterDisplayName(student))}
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


    groupError.hidden =
        true;


    groupModal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );
}


cancelGroupButton.addEventListener(

    "click",

    () => {

        groupModal.hidden =
            true;


        pendingTaskLookup =
            null;


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


        groupError.hidden =
            true;


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


            groupModal.hidden =
                true;


            document.body.classList.remove(
                "modal-open"
            );


            pendingTaskLookup =
                null;


            await loadStudentProject(
                submissionId
            );
        }

        catch (error) {

            console.error(
                error
            );


            groupError.textContent =

                error.message ||

                "Could not start the group project.";


            groupError.hidden =
                false;
        }

        finally {

            startGroupTaskButton.disabled =
                false;


            startGroupTaskButton.textContent =
                "Start Activity";
        }
    }
);


/* =========================================================
LOAD PROJECT
========================================================= */

async function loadStudentProject(
    submissionId
) {

    if (

        !hasCurrentLearnerIdentity() ||

        !submissionId

    ) {

        return;
    }


    if (

        currentSubmission?.id &&

        currentSubmission.id !==
        submissionId

    ) {

        await releaseCurrentEditLock();
    }


    projectsWatcher.stop();

    hideProjectsNotice();


    try {

        let result;


        if (
            currentIdentityType === "guest"
        ) {

            result =
                await sb.rpc(

                    "guest_load_project",

                    {
                        p_submission_id:
                            submissionId
                    }
                );
        }

        else {

            result =
                await sb.rpc(

                    "student_load_project",

                    {
                        p_submission_id:
                            submissionId,

                        p_student_id:
                            currentStudentProfile.student_id
                    }
                );
        }


        if (
            result.error
        ) {

            throw result.error;
        }


        const project =

            Array.isArray(
                result.data
            )

                ? result.data[0]

                : result.data;


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
                currentLearnerName(),

            className:
                currentLearnerClassLabel(),

            group:
                members
                    .map(
                        member =>
                            member.student_name
                    )
                    .filter(Boolean)
                    .join(", ")
        };


        currentGroupSize =
            members.length;

        resetStudentReviewState();


        loadMapData(
            project.map_data ||
            {}
        );


        let latestStudentReview =
            null;


        try {

            latestStudentReview =
                await fetchStudentReview(
                    project.submission_id
                );
        }

        catch (
            reviewError
        ) {

            console.warn(

                "Could not load teacher feedback for this project:",

                reviewError
            );
        }


        applyStudentReviewSnapshot(
            latestStudentReview
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

            currentIdentityType === "guest"

                ? `Guest account: ${currentLearnerClassLabel()}`

                : memberNames.length > 1

                    ? `Group: ${memberNames.join(" · ")}`

                    : "Individual project";


        taskIntro.hidden =
            false;


        studentProfilePage.hidden =
            true;


        teacherDashboard.hidden =
            true;


        studentWorkspace.hidden =
            false;


        teacherReviewToolbar.hidden =
            true;


        backToDashboardButton.hidden =
            true;


        teacherFeedbackPanel.hidden =
            true;


        appMode =
            "student";


        setCloudStatus(
            "Checking editor…",
            "busy"
        );


        await loadCurrentTaskReference();


        projectHandedIn =
            project.status === "submitted" ||
            Boolean(
                latestStudentReview
            );


        const acquired =

            projectHandedIn

                ? await closeHandedInProject()

                : await claimCurrentEditLock();


        setTool(
            "select"
        );


        renderAll();


        applyStudentEditLockUI();


        if (acquired) {

            setCloudStatus(
                "Editing",
                "good"
            );


            statusBar.textContent =

                project.status === "submitted"

                    ? "You are drawing. This project has been handed in, but you can keep editing and hand it in again."

                    : "You are drawing. Your work saves automatically.";
        }

        else {

            setCloudStatus(
                "Read-only",
                "busy"
            );


            statusBar.textContent =

                editLockHolderName

                    ? `${editLockHolderName} is drawing. You can watch from this device.`

                    : "Someone on another device is drawing. You can watch from this device.";
        }


        if (
            projectHandedIn
        ) {

            statusBar.textContent =
                handedInStatusText();
        }


        startReviewWatcher(
            project.submission_id
        );


        startTurnWatcher();
    }

    catch (error) {

        console.error(
            error
        );


        studentTaskError.textContent =

            error.message ||

            "Could not load the project.";


        studentTaskError.hidden =
            false;


        studentProfilePage.hidden =
            false;


        studentWorkspace.hidden =
            true;


        projectsWatcher.start();
    }
}


/* =========================================================
RETURN / SWITCH
========================================================= */

async function returnToStudentProfile() {

    if (
        !hasCurrentLearnerIdentity()
    ) {

        window.location.reload();

        return;
    }


    if (

        appMode === "student" &&

        editLockOwned

    ) {

        await saveStudentMap(
            false
        );
    }


    await releaseCurrentEditLock();


    closeFlyouts();

    hideColourPanel();


    studentWorkspace.hidden =
        true;


    teacherDashboard.hidden =
        true;


    studentProfilePage.hidden =
        false;


    taskIntro.hidden =
        true;


    editLockBanner.hidden =
        true;


    currentTask =
        null;


    currentSubmission =
        null;


    currentReferenceUrl =
        "";


    referenceOverlay.hidden =
        true;


    stopReviewWatcher();

    resetStudentReviewState();


    await loadStudentProjectHistory();


    studentTaskCode.value =
        "";


    studentTaskError.hidden =
        true;
}


backToProfileButton.addEventListener(
    "click",
    returnToStudentProfile
);


switchStudentButton.addEventListener(

    "click",

    async () => {

        await releaseCurrentEditLock();


        currentIdentityType =
            null;


        currentStudentProfile =
            null;


        currentGuestProfile =
            null;


        currentStudentProjects =
            [];


        currentStudentRoster =
            [];


        stopReviewWatcher();

        projectsWatcher.stop();

        hideProjectsNotice();

        resetStudentReviewState();


        studentProfilePage.hidden =
            true;


        studentWorkspace.hidden =
            true;


        teacherDashboard.hidden =
            true;


        startupModal.hidden =
            false;


        document.body.classList.add(
            "modal-open"
        );


        await prepareStudentLogin();
    }
);


/* =========================================================
TEACHER LOGIN
========================================================= */

async function openTeacherLogin() {

    if (
        !BACKEND_READY
    ) {

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


    if (

        appMode === "student" &&

        currentSubmission

    ) {

        if (
            editLockOwned
        ) {

            await saveStudentMap(
                false
            );
        }


        await releaseCurrentEditLock();
    }


    startupModal.hidden =
        true;


    teacherLoginError.hidden =
        true;


    teacherLoginModal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    teacherEmail.focus();
}


teacherPortalButton.addEventListener(
    "click",
    openTeacherLogin
);


/* =========================================================
ROLE INDICATOR
Shows in the header whether the app is being used as a
Student or a Teacher, following whichever screen is open.
========================================================= */

function currentRole() {

    return (

        !teacherLoginModal.hidden ||

        appMode === "teacher-dashboard" ||

        appMode === "teacher-review" ||

        !teacherDashboard.hidden

    )
        ? "teacher"
        : "student";
}


function refreshRoleIndicator() {

    const role =
        currentRole();


    const detail =

        role === "teacher"

            ? (
                currentTeacherUser &&
                teacherLoginModal.hidden

                    ? currentTeacherName ||
                    currentTeacherUser.email ||
                    "Signed in"

                    : "Signing in"
            )

            : hasCurrentLearnerIdentity()

                ? studentBadge.textContent.trim()

                : "Signing in";


    document.body.classList.toggle(
        "role-teacher",
        role === "teacher"
    );


    roleIndicator.dataset.role =
        role;


    roleIndicatorLabel.textContent =
        role === "teacher"
            ? "Teacher"
            : "Student";


    roleIndicatorDetail.textContent =
        detail;


    // App Feedback is for signed-in Teachers only, on every Teacher screen.
    appFeedbackButton.hidden =
        !(
            role === "teacher" &&
            currentTeacherUser &&
            teacherLoginModal.hidden
        );


    roleIndicator.title =
        `Using the app as a ${role === "teacher" ? "Teacher" : "Student"}: ${detail}`;


    studentModeButton.classList.toggle(
        "active",
        role === "student"
    );

    studentModeButton.setAttribute(
        "aria-pressed",
        String(role === "student")
    );


    teacherPortalButton.classList.toggle(
        "active",
        role === "teacher"
    );

    teacherPortalButton.setAttribute(
        "aria-pressed",
        String(role === "teacher")
    );
}


const roleIndicatorObserver =
    new MutationObserver(
        refreshRoleIndicator
    );


[
    teacherLoginModal,
    teacherDashboard,
    studentWorkspace,
    studentProfilePage,
    startupModal
].forEach(
    element =>
        roleIndicatorObserver.observe(
            element,
            {
                attributes: true,
                attributeFilter: [
                    "hidden"
                ]
            }
        )
);


roleIndicatorObserver.observe(
    studentBadge,
    {
        childList: true,
        characterData: true,
        subtree: true
    }
);


refreshRoleIndicator();


startupTeacherLink.addEventListener(
    "click",
    openTeacherLogin
);


cancelTeacherLogin.addEventListener(

    "click",

    () => {

        teacherLoginModal.hidden =
            true;


        if (
            teacherLoginReturnView === "startup"
        ) {

            startupModal.hidden =
                false;
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

        teacherLoginError.hidden =
            true;


        teacherLoginButton.disabled =
            true;


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


            await finishTeacherSignIn(
                data.user
            );
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
TEACHER SIGN-IN WITH GOOGLE
Google sends the Teacher back to this page, which then
finishes signing in instead of starting a student session.
========================================================= */

const GOOGLE_SIGN_IN_KEY =
    "oeMapMakerGoogleSignInV1";


async function finishTeacherSignIn(
    user
) {

    currentTeacherUser =
        user;


    // Creates the profile if missing; never overwrites a saved name.
    const created =
        await sb
            .from(
                "teacher_profiles"
            )
            .upsert(
                {
                    id:
                        user.id
                },
                {
                    onConflict:
                        "id",
                    ignoreDuplicates:
                        true
                }
            );


    if (
        created.error
    ) {

        throw created.error;
    }


    currentTeacherName =
        await savedTeacherName(
            user
        );


    teacherLoginModal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        !currentTeacherName
    ) {

        await askTeacherName({
            canCancel:
                false
        });
    }


    refreshRoleIndicator();


    await openTeacherDashboard();
}


/* =========================================================
TEACHER NAME
Chosen by the Teacher at first sign-in, suggested from their
email, and shown only on their own screens.
========================================================= */

const TEACHER_NAME_MAX_LENGTH =
    40;


// A saved name that is still an email address does not count.
function isTeacherName(
    name
) {

    return (
        typeof name === "string" &&
        name.trim() !== "" &&
        !name.includes("@")
    );
}


// "tan_mei_ling@moe.edu.sg" → "Tan Mei Ling"
function suggestTeacherName(
    email
) {

    return (email || "")
        .split("@")[0]
        .split(/[._\s]+/)
        .filter(Boolean)
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
        )
        .join(" ")
        .slice(
            0,
            TEACHER_NAME_MAX_LENGTH
        )
        .trim();
}


// The Teacher's saved Teacher Name, or null if they have none yet.
async function savedTeacherName(
    user
) {

    const {
        data,
        error
    } =
        await sb
            .from(
                "teacher_profiles"
            )
            .select(
                "display_name"
            )
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


    if (error) {

        throw error;
    }


    return isTeacherName(
        data?.display_name
    )
        ? data.display_name.trim()
        : null;
}


let resolveTeacherNameModal =
    null;


// Opens the name box; resolves once a name is saved or the box is cancelled.
function askTeacherName({
    canCancel
}) {

    teacherNameInput.value =
        currentTeacherName ||
        suggestTeacherName(
            currentTeacherUser?.email
        );


    teacherNameEmail.textContent =
        currentTeacherUser?.email
            ? `Signed in as ${currentTeacherUser.email}`
            : "";


    teacherNameError.hidden =
        true;


    cancelTeacherNameButton.hidden =
        !canCancel;


    teacherNameModal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    teacherNameInput.focus();

    teacherNameInput.select();


    return new Promise(
        resolve => {

            resolveTeacherNameModal =
                resolve;
        }
    );
}


function closeTeacherNameModal() {

    teacherNameModal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    resolveTeacherNameModal?.();

    resolveTeacherNameModal =
        null;
}


async function saveTeacherName() {

    const name =
        teacherNameInput.value.trim();


    if (
        !name
    ) {

        teacherNameError.textContent =
            "Please type a name.";

        teacherNameError.hidden =
            false;

        return;
    }


    if (
        name.includes("@")
    ) {

        teacherNameError.textContent =
            "Please type a name, not an email address.";

        teacherNameError.hidden =
            false;

        return;
    }


    saveTeacherNameButton.disabled =
        true;


    try {

        const {
            error
        } =
            await sb
                .from(
                    "teacher_profiles"
                )
                .update({
                    display_name:
                        name
                })
                .eq(
                    "id",
                    currentTeacherUser.id
                );


        if (error) {

            throw error;
        }


        currentTeacherName =
            name;


        refreshRoleIndicator();


        closeTeacherNameModal();
    }

    catch (error) {

        console.error(
            error
        );


        teacherNameError.textContent =
            "Could not save your name. Please try again.";

        teacherNameError.hidden =
            false;
    }

    finally {

        saveTeacherNameButton.disabled =
            false;
    }
}


saveTeacherNameButton.addEventListener(
    "click",
    saveTeacherName
);


teacherNameInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            saveTeacherName();
        }
    }
);


cancelTeacherNameButton.addEventListener(
    "click",
    closeTeacherNameModal
);


editTeacherNameButton.addEventListener(
    "click",
    () =>
        askTeacherName({
            canCancel:
                true
        })
);


/* =========================================================
APP FEEDBACK
A Teacher's message to the people who build the app, with up
to three screenshots. Teachers can send it but never read it.
========================================================= */

const APP_FEEDBACK_MAX_LENGTH =
    2000;

const APP_FEEDBACK_MAX_SCREENSHOTS =
    3;

const APP_FEEDBACK_MAX_BYTES =
    5 * 1024 * 1024;

// Allowed screenshot types, and the file ending each is stored with.
const APP_FEEDBACK_IMAGE_TYPES = {
    "image/png":
        "png",
    "image/jpeg":
        "jpg"
};


// { file, url } for each screenshot waiting to be sent.
let appFeedbackScreenshots =
    [];


// Why this file cannot be added, or null if it can.
function appFeedbackScreenshotProblem(
    file,
    alreadyAdded
) {

    if (
        alreadyAdded >= APP_FEEDBACK_MAX_SCREENSHOTS
    ) {

        return `You can add up to ${APP_FEEDBACK_MAX_SCREENSHOTS} screenshots.`;
    }


    if (
        !APP_FEEDBACK_IMAGE_TYPES[file.type]
    ) {

        return `"${file.name}" is not a PNG or JPG image.`;
    }


    if (
        file.size > APP_FEEDBACK_MAX_BYTES
    ) {

        return `"${file.name}" is bigger than 5 MB.`;
    }


    return null;
}


// Where the Teacher is now, for the App Feedback record.
function currentAppFeedbackContext() {

    const screen =

        appMode === "teacher-review"

            ? "Review"

            : !teacherGallery.hidden

            ? "Gallery"

            : !teacherDashboard.hidden

            ? (
                teacherClassesPanel.hidden
                    ? "Dashboard: Tasks"
                    : "Dashboard: Classes"
            )

            : appMode;


    return {
        screen,
        taskId:
            selectedTeacherTask?.id ||
            null,
        taskTitle:
            selectedTeacherTask?.title ||
            null
    };
}


function showAppFeedbackError(
    text
) {

    appFeedbackError.textContent =
        text;

    appFeedbackError.hidden =
        !text;
}


function renderAppFeedbackScreenshots() {

    appFeedbackPreviews.replaceChildren(

        ...appFeedbackScreenshots.map(
            (shot, index) => {

                const preview =
                    document.createElement(
                        "div"
                    );

                preview.className =
                    "app-feedback-preview";


                const image =
                    document.createElement(
                        "img"
                    );

                image.src =
                    shot.url;

                image.alt =
                    `Screenshot ${index + 1}`;


                const remove =
                    document.createElement(
                        "button"
                    );

                remove.type =
                    "button";

                remove.textContent =
                    "✕";

                remove.setAttribute(
                    "aria-label",
                    `Remove screenshot ${index + 1}`
                );

                remove.addEventListener(
                    "click",
                    () => {

                        URL.revokeObjectURL(
                            shot.url
                        );

                        appFeedbackScreenshots.splice(
                            index,
                            1
                        );

                        showAppFeedbackError(
                            ""
                        );

                        renderAppFeedbackScreenshots();
                    }
                );


                preview.append(
                    image,
                    remove
                );

                return preview;
            }
        )
    );
}


function addAppFeedbackScreenshots(
    files
) {

    const problems =
        [];


    for (
        const file of files
    ) {

        const problem =
            appFeedbackScreenshotProblem(
                file,
                appFeedbackScreenshots.length
            );


        if (problem) {

            problems.push(
                problem
            );

            continue;
        }


        appFeedbackScreenshots.push({
            file,
            url:
                URL.createObjectURL(
                    file
                )
        });
    }


    renderAppFeedbackScreenshots();


    showAppFeedbackError(
        [...new Set(problems)].join(" ")
    );
}


function updateAppFeedbackCount() {

    appFeedbackCount.textContent =
        `${appFeedbackMessage.value.length} / ${APP_FEEDBACK_MAX_LENGTH}`;
}


function resetAppFeedbackForm() {

    appFeedbackMessage.value =
        "";

    appFeedbackScreenshots.forEach(
        shot =>
            URL.revokeObjectURL(
                shot.url
            )
    );

    appFeedbackScreenshots =
        [];

    renderAppFeedbackScreenshots();

    showAppFeedbackError(
        ""
    );

    updateAppFeedbackCount();
}


function openAppFeedback() {

    const context =
        currentAppFeedbackContext();


    const where =
        context.taskTitle
            ? `this screen (${context.screen}) and Task (${context.taskTitle})`
            : `this screen (${context.screen})`;


    appFeedbackAttached.textContent =
        `We'll also send: your email (${currentTeacherUser?.email || "unknown"}) and name, the time, ${where}, and your browser and device.`;


    appFeedbackForm.hidden =
        false;

    appFeedbackSent.hidden =
        true;

    appFeedbackModal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    updateAppFeedbackCount();

    appFeedbackMessage.focus();
}


function closeAppFeedback() {

    appFeedbackModal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );
}


async function sendAppFeedback() {

    const message =
        appFeedbackMessage.value.trim();


    if (
        !message
    ) {

        showAppFeedbackError(
            "Please type a message."
        );

        return;
    }


    if (
        message.length > APP_FEEDBACK_MAX_LENGTH
    ) {

        showAppFeedbackError(
            `Please keep your message under ${APP_FEEDBACK_MAX_LENGTH} characters.`
        );

        return;
    }


    showAppFeedbackError(
        ""
    );

    sendAppFeedbackButton.disabled =
        true;

    sendAppFeedbackButton.textContent =
        "Sending…";


    try {

        const feedbackId =
            crypto.randomUUID();


        const context =
            currentAppFeedbackContext();


        // Screenshots first: the message is only saved once all have arrived.
        const screenshotPaths =
            [];


        for (
            const [index, shot] of appFeedbackScreenshots.entries()
        ) {

            const path =
                `${currentTeacherUser.id}/${feedbackId}/${index + 1}.${APP_FEEDBACK_IMAGE_TYPES[shot.file.type]}`;


            const {
                error
            } =
                await sb
                    .storage
                    .from(
                        "app-feedback"
                    )
                    .upload(
                        path,
                        shot.file,
                        {
                            contentType:
                                shot.file.type
                        }
                    );


            if (error) {

                throw error;
            }


            screenshotPaths.push(
                path
            );
        }


        // No .select(): Teachers may add App Feedback but not read it back.
        const {
            error
        } =
            await sb
                .from(
                    "app_feedback"
                )
                .insert({
                    id:
                        feedbackId,
                    teacher_id:
                        currentTeacherUser.id,
                    teacher_email:
                        currentTeacherUser.email ||
                        null,
                    teacher_name:
                        currentTeacherName,
                    message,
                    screen:
                        context.screen,
                    task_id:
                        context.taskId,
                    task_title:
                        context.taskTitle,
                    // Without the query or #part, which can hold sign-in tokens.
                    page_url:
                        window.location.origin +
                        window.location.pathname,
                    user_agent:
                        navigator.userAgent,
                    screenshot_paths:
                        screenshotPaths
                });


        if (error) {

            throw error;
        }


        resetAppFeedbackForm();


        appFeedbackForm.hidden =
            true;

        appFeedbackSent.hidden =
            false;
    }

    catch (error) {

        console.error(
            error
        );


        showAppFeedbackError(
            "Could not send your App Feedback. Please check your connection and try again."
        );
    }

    finally {

        sendAppFeedbackButton.disabled =
            false;

        sendAppFeedbackButton.textContent =
            "Send";
    }
}


appFeedbackButton.addEventListener(
    "click",
    openAppFeedback
);


appFeedbackMessage.addEventListener(
    "input",
    updateAppFeedbackCount
);


appFeedbackFiles.addEventListener(
    "change",
    () => {

        addAppFeedbackScreenshots(
            [...appFeedbackFiles.files]
        );


        // Lets the same file be chosen again after removing it.
        appFeedbackFiles.value =
            "";
    }
);


// Paste a screenshot anywhere while the form is open.
appFeedbackModal.addEventListener(
    "paste",
    event => {

        const pasted =
            [...(event.clipboardData?.files || [])];


        if (
            pasted.length
        ) {

            event.preventDefault();

            addAppFeedbackScreenshots(
                pasted
            );
        }
    }
);


sendAppFeedbackButton.addEventListener(
    "click",
    sendAppFeedback
);


cancelAppFeedbackButton.addEventListener(
    "click",
    closeAppFeedback
);


closeAppFeedbackButton.addEventListener(
    "click",
    closeAppFeedback
);


teacherGoogleButton.addEventListener(

    "click",

    async () => {

        teacherLoginError.hidden =
            true;

        teacherGoogleButton.disabled =
            true;


        try {

            sessionStorage.setItem(
                GOOGLE_SIGN_IN_KEY,
                "1"
            );


            await sb
                .auth
                .signOut();


            const {
                error
            } =
                await sb
                    .auth
                    .signInWithOAuth({
                        provider:
                            "google",
                        options: {
                            redirectTo:
                                window.location.origin +
                                window.location.pathname,
                            queryParams: {
                                prompt:
                                    "select_account"
                            }
                        }
                    });


            if (error) {

                throw error;
            }

            // The browser now goes to Google.
        }

        catch (error) {

            sessionStorage.removeItem(
                GOOGLE_SIGN_IN_KEY
            );


            teacherLoginError.textContent =
                error.message ||
                "Could not start Google sign-in.";

            teacherLoginError.hidden =
                false;

            teacherGoogleButton.disabled =
                false;
        }
    }
);


// Returns true when this page load was the return from Google.
/* The Teacher signed in on this browser, or null. */
async function signedInTeacherUser() {


    const {
        data: {
            session
        }
    } =
        await sb
            .auth
            .getSession();


    return (
        session?.user &&
        !session.user.is_anonymous
    )
        ? session.user
        : null;
}


continueTeacherButton.addEventListener(
    "click",
    async () => {


        continueTeacherButton.disabled =
            true;


        startupError.hidden =
            true;


        try {


            const user =
                await signedInTeacherUser();


            // Signed out elsewhere since the page loaded.
            if (!user) {


                await prepareStudentLogin();


                return;
            }


            startupModal.hidden =
                true;


            await finishTeacherSignIn(
                user
            );
        }


        catch (error) {


            console.error(
                error
            );


            startupModal.hidden =
                false;


            startupError.textContent =
                error.message ||
                "Could not continue as Teacher.";


            startupError.hidden =
                false;
        }


        finally {


            continueTeacherButton.disabled =
                false;
        }
    }
);


const LAST_TEACHER_TASK_KEY =
    "oeMapMakerLastTeacherTaskV1";


function rememberTeacherTask(
    taskId
) {


    try {


        if (taskId) {


            sessionStorage.setItem(
                LAST_TEACHER_TASK_KEY,
                taskId
            );
        }


        else {


            sessionStorage.removeItem(
                LAST_TEACHER_TASK_KEY
            );
        }
    }


    catch (error) {


        // Storage can be blocked; the Task is simply not remembered.
    }
}


function rememberedTeacherTaskId() {


    try {


        return sessionStorage.getItem(
            LAST_TEACHER_TASK_KEY
        );
    }


    catch (error) {


        return null;
    }
}


async function resumeGoogleTeacherSignIn() {

    if (
        sessionStorage.getItem(
            GOOGLE_SIGN_IN_KEY
        ) !== "1"
    ) {

        return false;
    }


    sessionStorage.removeItem(
        GOOGLE_SIGN_IN_KEY
    );


    const returned =
        new URLSearchParams(
            window.location.search
        );


    const returnedHash =
        new URLSearchParams(
            window.location.hash.slice(1)
        );


    const googleError =
        returned.get("error_description") ||
        returnedHash.get("error_description") ||
        returned.get("error") ||
        returnedHash.get("error");


    // Lets the Supabase client read the sign-in from the address first.
    const {
        data: {
            session
        }
    } =
        await sb
            .auth
            .getSession();


    window.history.replaceState(
        window.history.state,
        "",
        window.location.origin +
        window.location.pathname
    );


    if (
        session?.user &&
        !session.user.is_anonymous
    ) {

        startupModal.hidden =
            true;


        try {

            await finishTeacherSignIn(
                session.user
            );


            return true;
        }

        catch (error) {

            console.error(
                error
            );
        }
    }


    // Cancelled or failed: back to the Teacher sign-in, with a reason.
    await prepareStudentLogin();

    await openTeacherLogin();


    teacherLoginError.textContent =

        // Supabase refused a new non-MOE Teacher; its message says why.
        googleError?.includes("@moe.edu.sg")

            ? "Only MOE school email accounts (@moe.edu.sg) can sign in as a Teacher."

            : googleError

            ? `Google sign-in did not finish: ${googleError}`

            : "Google sign-in did not finish. Please try again, or use your email and password.";


    teacherLoginError.hidden =
        false;


    return true;
}


/* =========================================================
TEACHER DASHBOARD
========================================================= */

function setTeacherSection(
    section
) {

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


    // Catch up on Student Maps that changed while on the Classes tab.
    if (
        showTasks
    ) {

        submissionsWatcher.start();

        submissionsWatcher.runNow();
    }
}


teacherTasksTabButton.addEventListener(

    "click",

    () =>
        setTeacherSection(
            "tasks"
        )
);


teacherClassesTabButton.addEventListener(

    "click",

    () =>
        setTeacherSection(
            "classes"
        )
);


async function openTeacherDashboard() {

    appMode =
        "teacher-dashboard";


    studentWorkspace.hidden =
        true;


    studentProfilePage.hidden =
        true;


    teacherDashboard.hidden =
        false;


    teacherGallery.hidden =
        true;


    galleryTaskId =
        null;


    startupModal.hidden =
        true;


    teacherReviewToolbar.hidden =
        true;


    backToDashboardButton.hidden =
        true;


    teacherFeedbackPanel.hidden =
        true;


    stopReviewWatcher();

    projectsWatcher.stop();

    hideProjectsNotice();

    resetStudentReviewState();


    setTeacherSection(
        "tasks"
    );


    setCloudStatus(
        "Teacher mode",
        "good"
    );


    await loadTeacherClasses();
    await loadTeacherTasks();


    // After a refresh, reopen the Task this tab last had selected.
    if (
        !selectedTeacherTask
    ) {


        const lastTask =
            teacherTasks.find(
                task =>
                    task.id ===
                    rememberedTeacherTaskId()
            );


        if (lastTask) {


            await selectTeacherTask(
                lastTask
            );
        }
    }
}


teacherSignOutButton.addEventListener(

    "click",

    async () => {

        if (
            BACKEND_READY
        ) {

            await sb
                .auth
                .signOut();
        }


        currentTeacherUser =
            null;

        currentTeacherName =
            null;


        // An unsent message must not be left for the next person.
        resetAppFeedbackForm();

        closeAppFeedback();


        rememberTeacherTask(
            null
        );


        window.location.reload();
    }
);


/* =========================================================
TEACHER CLASSES
========================================================= */

async function loadTeacherClasses() {

    if (
        !currentTeacherUser
    ) {

        return;
    }


    const {
        data,
        error
    } =
        await sb
            .from(
                "classes"
            )
            .select("*")
            .eq(
                "active",
                true
            )
            .order(

                "class_name",

                {
                    ascending:
                        true
                }
            );


    if (error) {

        alert(
            error.message
        );


        return;
    }


    teacherClasses =
        data ||
        [];


    const classIds =
        teacherClasses.map(
            item =>
                item.id
        );


    const counts =
        {};


    if (
        classIds.length
    ) {

        const studentsResult =
            await sb
                .from(
                    "students"
                )
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


        if (
            studentsResult.error
        ) {

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


    if (
        selectedTeacherTask
    ) {

        await loadTaskClassAssignments(
            selectedTeacherTask.id
        );
    }


    if (
        selectedTeacherClass
    ) {

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

            selectedTeacherClass =
                null;


            noClassSelected.hidden =
                false;


            classEditor.hidden =
                true;
        }
    }
}


function renderTeacherClassList() {

    teacherClassesList.innerHTML =
        "";


    if (
        !teacherClasses.length
    ) {

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


            button.type =
                "button";


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
${escapeHtml(item.class_name)}
</strong>

<span>
${Number(item.student_count) || 0}
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


async function restoreArchivedClass(
    name
) {

    const {
        data: archived
    } =
        await sb
            .from(
                "classes"
            )
            .select("*")
            .eq(
                "teacher_id",
                currentTeacherUser.id
            )
            .eq(
                "class_name",
                name
            )
            .eq(
                "active",
                false
            )
            .maybeSingle();


    if (!archived) {

        alert(
            "A class with this name already exists."
        );


        return;
    }


    if (
        !confirm(
            `${name} was archived earlier. Restore it with its students and projects?`
        )
    ) {

        return;
    }


    const {
        error
    } =
        await sb
            .from(
                "classes"
            )
            .update({
                active: true
            })
            .eq(
                "id",
                archived.id
            );


    if (error) {

        alert(
            error.message
        );


        return;
    }


    await loadTeacherClasses();


    const restored =
        teacherClasses.find(

            item =>
                item.id ===
                archived.id
        );


    if (restored) {

        await selectTeacherClass(
            restored
        );
    }
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
                .from(
                    "classes"
                )
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


        if (
            error &&
            error.code === "23505"
        ) {

            await restoreArchivedClass(
                name
            );


            return;
        }


        if (error) {

            alert(
                error.message
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


    pendingClassImportNames =
        [];


    classListFile.value =
        "";


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
            .from(
                "students"
            )
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
                    ascending:
                        true,

                    nullsFirst:
                        false
                }
            )
            .order(

                "student_name",

                {
                    ascending:
                        true
                }
            );


    if (error) {

        alert(
            error.message
        );


        return;
    }


    selectedClassRoster =
        data ||
        [];


    teacherClassCount.textContent =
        `${selectedClassRoster.length} ${
            selectedClassRoster.length === 1
                ? "student"
                : "students"
        }`;


    renderTeacherClassList();


    renderClassRoster();
}


function renderClassRoster() {

    classRosterList.innerHTML =
        "";


    if (
        !selectedClassRoster.length
    ) {

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
${escapeHtml(student.student_name)}
</span>
`;


            const remove =
                document.createElement(
                    "button"
                );


            remove.type =
                "button";


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
                            .from(
                                "students"
                            )
                            .update({
                                active: false
                            })
                            .eq(
                                "id",
                                student.id
                            );


                    if (error) {

                        alert(
                            error.message
                        );


                        return;
                    }


                    await loadTeacherClasses();
                }
            );


            row.appendChild(
                remove
            );


            classRosterList.appendChild(
                row
            );
        }
    );
}


saveClassNameButton.addEventListener(

    "click",

    async () => {

        if (
            !selectedTeacherClass
        ) {

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
                .from(
                    "classes"
                )
                .update({
                    class_name: name
                })
                .eq(
                    "id",
                    selectedTeacherClass.id
                )
                .select()
                .single();


        if (error) {

            alert(

                error.code === "23505"

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

        if (
            !selectedTeacherClass
        ) {

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
                .from(
                    "classes"
                )
                .update({
                    active: false
                })
                .eq(
                    "id",
                    selectedTeacherClass.id
                );


        if (error) {

            alert(
                error.message
            );


            return;
        }


        selectedTeacherClass =
            null;


        noClassSelected.hidden =
            false;


        classEditor.hidden =
            true;


        await loadTeacherClasses();
    }
);


/* =========================================================
DELETE CLASS
Deletes the Class, its Roster, and every Project its students
worked on (with Reviews). Tasks are kept: they may be set for
other Classes. Projects go first, while this Teacher can still
see them through the Class.
========================================================= */

async function findClassProjectIds(
    classId
) {

    const ids =
        new Set();


    const byClass =
        await sb
            .from(
                "submissions"
            )
            .select(
                "id"
            )
            .eq(
                "class_id",
                classId
            );

    if (
        byClass.error
    ) {
        throw byClass.error;
    }

    (byClass.data || []).forEach(
        row =>
            ids.add(
                row.id
            )
    );


    // Older Projects may not record their Class, so also go by membership.
    const roster =
        await sb
            .from(
                "students"
            )
            .select(
                "id"
            )
            .eq(
                "class_id",
                classId
            );

    if (
        roster.error
    ) {
        throw roster.error;
    }

    const studentIds =
        (roster.data || []).map(
            row =>
                row.id
        );

    if (
        studentIds.length
    ) {

        const memberships =
            await sb
                .from(
                    "submission_members"
                )
                .select(
                    "submission_id"
                )
                .in(
                    "student_id",
                    studentIds
                );

        if (
            memberships.error
        ) {
            throw memberships.error;
        }

        (memberships.data || []).forEach(
            row =>
                ids.add(
                    row.submission_id
                )
        );
    }


    return {
        projectIds:
            [...ids],

        studentCount:
            studentIds.length
    };
}


deleteClassButton.addEventListener(
    "click",

    async () => {

        if (
            !selectedTeacherClass
        ) {
            return;
        }


        const classItem =
            selectedTeacherClass;


        deleteClassButton.disabled =
            true;


        try {

            const {
                projectIds,
                studentCount
            } =
                await findClassProjectIds(
                    classItem.id
                );


            const typed =
                prompt(
                    `Delete ${classItem.class_name} permanently?\n\n` +
                    `This deletes ${studentCount} student${studentCount === 1 ? "" : "s"} and ` +
                    `${projectIds.length} project${projectIds.length === 1 ? "" : "s"}, including teacher feedback. ` +
                    "Tasks are kept. This cannot be undone.\n\n" +
                    "To keep the work, press Cancel and use Archive Class instead.\n\n" +
                    "Type the class name to confirm:"
                );


            if (
                typed === null
            ) {
                return;
            }


            if (
                typed.trim() !==
                classItem.class_name
            ) {

                alert(
                    "The name did not match, so nothing was deleted."
                );

                return;
            }


            deleteClassButton.textContent =
                "Deleting…";


            setCloudStatus(
                "Deleting class…",
                "busy"
            );


            // Reviews, group links and edit locks are removed with each Project.
            if (
                projectIds.length
            ) {

                const projectDelete =
                    await sb
                        .from(
                            "submissions"
                        )
                        .delete()
                        .in(
                            "id",
                            projectIds
                        );

                if (
                    projectDelete.error
                ) {
                    throw projectDelete.error;
                }
            }


            // The Roster and the Class's Task assignments go with the Class.
            const classDelete =
                await sb
                    .from(
                        "classes"
                    )
                    .delete()
                    .eq(
                        "id",
                        classItem.id
                    )
                    .select(
                        "id"
                    );

            if (
                classDelete.error
            ) {
                throw classDelete.error;
            }

            if (
                !classDelete.data?.length
            ) {

                throw new Error(
                    "This class could not be deleted. You may no longer have access to it."
                );
            }


            selectedTeacherClass =
                null;


            noClassSelected.hidden =
                false;


            classEditor.hidden =
                true;


            setCloudStatus(
                "Class deleted",
                "good"
            );


            await loadTeacherClasses();
        }

        catch (error) {

            console.error(
                error
            );


            setCloudStatus(
                "Class delete failed",
                "bad"
            );


            alert(
                error.message ||
                "Could not delete this class."
            );
        }

        finally {

            deleteClassButton.disabled =
                false;


            deleteClassButton.textContent =
                "Delete Class";
        }
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
                    name ??
                    ""
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


                seen.add(
                    key
                );


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
                    header: 1,

                    raw: false,

                    defval: ""
                }
            );


    if (
        !rows.length
    ) {

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


    let startRow =
        0;


    if (
        nameColumn >= 0
    ) {

        startRow =
            1;
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

                () => 0
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
                            row[index] ??
                            ""
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
                Math.max(...counts)
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


        pendingClassImportNames =
            [];


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

${
                    pendingClassImportNames
                        .map(

                            (
                                name,
                                index
                            ) =>
                                `${
                                    index + 1
                                }. ${
                                    escapeHtml(name)
                                }`
                        )
                        .join("<br>")
                }
`;


            classImportPreview.hidden =
                false;


            importClassListButton.disabled =
                false;
        }

        catch (error) {

            console.error(
                error
            );


            alert(

                error.message ||

                "Could not read the class list."
            );


            classListFile.value =
                "";
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


        // Nudge towards first names only; never block the import.
        const fullNameCount =
            pendingClassImportNames.filter(
                name =>
                    /\s/.test(
                        String(name).trim()
                    )
            ).length;


        if (

            fullNameCount >
            pendingClassImportNames.length / 2 &&

            !confirm(
                "Most of these names have two or more words, so they look like full names.\n\n" +
                "For children's privacy, use first names only — the register number tells children with the same name apart.\n\n" +
                "Import anyway?"
            )

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
                    .from(
                        "students"
                    )
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


            const toInsert =
                [];


            const toReactivate =
                [];


            pendingClassImportNames.forEach(

                name => {

                    const key =
                        name.toLocaleLowerCase();


                    const existing =
                        byName.get(
                            key
                        );


                    if (existing) {

                        if (
                            !existing.active
                        ) {

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


            if (
                toInsert.length
            ) {

                const insertResult =
                    await sb
                        .from(
                            "students"
                        )
                        .insert(
                            toInsert
                        );


                if (
                    insertResult.error
                ) {

                    throw insertResult.error;
                }
            }


            if (
                toReactivate.length
            ) {

                const reactivateResult =
                    await sb
                        .from(
                            "students"
                        )
                        .update({
                            active: true
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


            pendingClassImportNames =
                [];


            classListFile.value =
                "";


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

            console.error(
                error
            );


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

        if (
            !selectedTeacherClass
        ) {

            return;
        }


        const typedName =
            newStudentName
                .value
                .replace(
                    /\s+/g,
                    " "
                )
                .trim();


        // "26. Ahmad" or "26 Ahmad": 26 is the register number.
        const numbered =
            typedName.match(
                /^(\d{1,3})\s*[.):-]?\s+(\S.*)$/
            );


        const name =
            numbered
                ? numbered[2]
                : typedName;


        const requestedRegister =
            numbered
                ? Number(
                    numbered[1]
                )
                : null;


        if (!name) {
            return;
        }


        const existingResult =
            await sb
                .from(
                    "students"
                )
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


        if (
            existingResult.data
        ) {

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
                    .from(
                        "students"
                    )
                    .update({
                        active: true
                    })
                    .eq(
                        "id",
                        existingResult.data.id
                    );


            if (error) {

                alert(
                    error.message
                );


                return;
            }
        }

        else {

            // Removed students keep their numbers, so count everyone.
            const everyoneResult =
                await sb
                    .from(
                        "students"
                    )
                    .select(
                        "id,student_name,register_no,active"
                    )
                    .eq(
                        "class_id",
                        selectedTeacherClass.id
                    );


            if (
                everyoneResult.error
            ) {

                alert(
                    everyoneResult.error.message
                );

                return;
            }


            const everyone =
                everyoneResult.data ||
                [];


            const holder =
                requestedRegister &&
                everyone.find(
                    student =>
                        Number(
                            student.register_no
                        ) ===
                        requestedRegister
                );


            if (
                holder &&
                holder.active
            ) {

                alert(
                    `Register number ${requestedRegister} already belongs to ${holder.student_name}.`
                );

                return;
            }


            if (holder) {

                if (
                    !confirm(
                        `Register number ${requestedRegister} belonged to ${holder.student_name}, who was removed from this class. Give the number to ${name} instead?`
                    )
                ) {

                    return;
                }


                const released =
                    await sb
                        .from(
                            "students"
                        )
                        .update({
                            register_no:
                                null
                        })
                        .eq(
                            "id",
                            holder.id
                        );


                if (
                    released.error
                ) {

                    alert(
                        released.error.message
                    );


                    return;
                }
            }


            const maxRegister =
                Math.max(
                    0,
                    ...everyone.map(
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
                    .from(
                        "students"
                    )
                    .insert({

                        class_id:
                            selectedTeacherClass.id,

                        register_no:
                            requestedRegister ||
                            maxRegister +
                            1,

                        student_name:
                            name,

                        active:
                            true
                    });


            if (error) {

                alert(
                    error.message
                );


                return;
            }
        }


        newStudentName.value =
            "";


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
            .from(
                "tasks"
            )
            .select("*")
            .order(

                "created_at",

                {
                    ascending:
                        false
                }
            );


    if (error) {

        alert(
            error.message
        );


        return;
    }


    teacherTasks =
        data ||
        [];


    renderTeacherTaskList();


    if (
        selectedTeacherTask
    ) {

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

    teacherTasksList.innerHTML =
        "";


    if (
        !teacherTasks.length
    ) {

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


            button.type =
                "button";


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


function escapeHtml(
    string
) {

    return String(
        string ??
        ""
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

        let result =
            null;


        for (
            let i = 0;
            i < 4 && !result;
            i++
        ) {

            const code =
                randomTaskCode();


            const attempt =
                await sb
                    .from(
                        "tasks"
                    )
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
                        },

                        allow_guests:
                            true
                    })
                    .select()
                    .single();


            if (
                !attempt.error
            ) {

                result =
                    attempt.data;
            }

            else if (
                attempt.error.code !== "23505"
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

    if (!taskId) {

        return;
    }


    const {
        data,
        error
    } =
        await sb
            .from(
                "task_classes"
            )
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
${escapeHtml(error.message)}
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
    assigned = new Set()
) {

    taskAssignedClasses.innerHTML =
        "";


    if (
        !teacherClasses.length
    ) {

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
value="${escapeHtml(classItem.id)}"
${
                    assigned.has(
                        classItem.id
                    )
                        ? "checked"
                        : ""
                }
>

<span>
${escapeHtml(classItem.class_name)}
</span>
`;


            taskAssignedClasses.appendChild(
                label
            );
        }
    );
}


async function selectTeacherTask(
    task
) {


    selectedTeacherTask =
        task;


    rememberTeacherTask(
        task.id
    );


    noTaskSelected.hidden =
        true;


    taskEditor.hidden =
        false;


    teacherTaskHeading.textContent =
        task.title ||
        "Task";


    teacherTaskCode.textContent =
        task.task_code ||
        "------";


    teacherTaskTitle.value =
        task.title ||
        "";


    teacherTaskInstructions.value =
        task.instructions ||
        "";


    allowGuests.checked =
        task.allow_guests !== false;


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


        const allowed =
            {};


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
                allowed,

            allow_guests:
                allowGuests.checked
        };


        try {

            const {
                data,
                error
            } =
                await sb
                    .from(
                        "tasks"
                    )
                    .update(
                        payload
                    )
                    .eq(
                        "id",
                        selectedTeacherTask.id
                    )
                    .select()
                    .single();


            if (error) {

                throw error;
            }


            // Add newly ticked Classes first, then remove unticked ones.
            // A co-Teacher only sees this Task through its Classes, so the
            // Task must never be left with none of theirs in between.
            if (
                selectedClassIds.length
            ) {

                const addAssignments =
                    await sb
                        .from(
                            "task_classes"
                        )
                        .upsert(

                            selectedClassIds.map(
                                classId => ({
                                    task_id:
                                        selectedTeacherTask.id,

                                    class_id:
                                        classId
                                })
                            ),

                            {
                                onConflict:
                                    "task_id,class_id",

                                ignoreDuplicates:
                                    true
                            }
                        );


                if (
                    addAssignments.error
                ) {

                    throw addAssignments.error;
                }
            }


            let removeAssignments =
                sb
                    .from(
                        "task_classes"
                    )
                    .delete()
                    .eq(
                        "task_id",
                        selectedTeacherTask.id
                    );


            if (
                selectedClassIds.length
            ) {

                removeAssignments =
                    removeAssignments.not(
                        "class_id",
                        "in",
                        `(${selectedClassIds.join(",")})`
                    );
            }


            const removeResult =
                await removeAssignments;


            if (
                removeResult.error
            ) {

                throw removeResult.error;
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
                        appMode === "teacher-dashboard"
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

            console.error(
                error
            );


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
DELETE TASK
========================================================= */

deleteTaskButton.addEventListener(

    "click",

    async () => {

        if (

            appMode !== "teacher-dashboard" ||

            !currentTeacherUser ||

            !selectedTeacherTask

        ) {

            return;
        }


        const taskToDelete =
            selectedTeacherTask;


        const taskName =
            taskToDelete.title ||
            "Untitled Task";


        const firstConfirmation =
            confirm(

                `Delete "${taskName}"?\n\n` +

                "This will permanently delete this task for ALL teachers and students, " +

                "including student submissions, group links, teacher feedback and red-pen annotations.\n\n" +

                "This cannot be undone."
            );


        if (!firstConfirmation) {

            return;
        }


        const finalConfirmation =
            confirm(

                `Final confirmation:\n\nPermanently delete "${taskName}"?`
            );


        if (!finalConfirmation) {

            return;
        }


        deleteTaskButton.disabled =
            true;


        deleteTaskButton.textContent =
            "Deleting…";


        setCloudStatus(
            "Deleting task…",
            "busy"
        );


        try {

            const taskId =
                taskToDelete.id;


            const referencePath =
                taskToDelete.reference_path ||
                null;


            const submissionsLookup =
                await sb
                    .from(
                        "submissions"
                    )
                    .select(
                        "id"
                    )
                    .eq(
                        "task_id",
                        taskId
                    );


            if (
                submissionsLookup.error
            ) {

                throw submissionsLookup.error;
            }


            const submissionIds =
                (
                    submissionsLookup.data ||
                    []
                )
                    .map(
                        submission =>
                            submission.id
                    )
                    .filter(Boolean);


            if (
                submissionIds.length
            ) {

                const reviewDelete =
                    await sb
                        .from(
                            "submission_reviews"
                        )
                        .delete()
                        .in(
                            "submission_id",
                            submissionIds
                        );


                if (
                    reviewDelete.error
                ) {

                    throw reviewDelete.error;
                }
            }


            if (
                submissionIds.length
            ) {

                const memberDelete =
                    await sb
                        .from(
                            "submission_members"
                        )
                        .delete()
                        .in(
                            "submission_id",
                            submissionIds
                        );


                if (
                    memberDelete.error
                ) {

                    throw memberDelete.error;
                }
            }


            const submissionDelete =
                await sb
                    .from(
                        "submissions"
                    )
                    .delete()
                    .eq(
                        "task_id",
                        taskId
                    );


            if (
                submissionDelete.error
            ) {

                throw submissionDelete.error;
            }


            // Remove the Reference Map while this Teacher can still see the Task.
            if (
                referencePath
            ) {

                const referenceDelete =
                    await sb
                        .storage
                        .from(
                            APP_CONFIG.referenceBucket
                        )
                        .remove([
                            referencePath
                        ]);


                if (
                    referenceDelete.error
                ) {

                    console.warn(
                        "Could not remove the task's reference image:",
                        referenceDelete.error
                    );
                }
            }


            // Deleting the Task also removes which Classes it was set for.
            const taskDelete =
                await sb
                    .from(
                        "tasks"
                    )
                    .delete()
                    .eq(
                        "id",
                        taskId
                    )
                    .select(
                        "id"
                    );


            if (
                taskDelete.error
            ) {

                throw taskDelete.error;
            }


            if (
                !taskDelete.data?.length
            ) {

                throw new Error(
                    "This task could not be deleted. You may no longer have access to it."
                );
            }


            selectedTeacherTask =
                null;


            currentTask =
                null;


            currentReferenceUrl =
                "";


            teacherReferencePreview.hidden =
                true;


            teacherReferencePreview.removeAttribute(
                "src"
            );


            noTaskSelected.hidden =
                false;


            taskEditor.hidden =
                true;


            submissionList.innerHTML =
                "";


            setCloudStatus(
                "Task deleted",
                "good"
            );


            await loadTeacherTasks();
        }

        catch (error) {

            console.error(
                error
            );


            setCloudStatus(
                "Delete failed",
                "bad"
            );


            alert(

                error.message ||

                "Could not delete this task."
            );
        }

        finally {

            deleteTaskButton.disabled =
                false;


            deleteTaskButton.textContent =
                "Delete Task";
        }
    }
);


/* =========================================================
REFERENCE UPLOAD
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
            `${currentTeacherUser.id}/${selectedTeacherTask.id}/${Date.now()}-${safeFileName(file.name)}`;


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
                        upsert:
                            false,

                        contentType:
                            file.type
                    }
                );


        if (
            upload.error
        ) {

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
                .from(
                    "tasks"
                )
                .update({
                    reference_path: path
                })
                .eq(
                    "id",
                    selectedTeacherTask.id
                )
                .select()
                .single();


        if (
            updated.error
        ) {

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
            !selectedTeacherTask?.reference_path
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
                .from(
                    "tasks"
                )
                .update({
                    reference_path: null
                })
                .eq(
                    "id",
                    selectedTeacherTask.id
                )
                .select()
                .single();


        if (
            updated.error
        ) {

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
SUBMISSIONS
========================================================= */

/* Rows are kept per Project so live refreshes update them in
   place: buttons never move under the Teacher's cursor. */

let submissionRowEntries =
    new Map();

let submissionListSignature =
    "";

let renderedSubmissionsTaskId =
    null;


async function loadSubmissions() {

    if (
        !selectedTeacherTask
    ) {
        return;
    }


    const taskId =
        selectedTeacherTask.id;


    let items;


    try {

        items =
            await fetchTaskProjects(
                taskId
            );
    }

    catch (error) {

        submissionRowEntries =
            new Map();


        submissionListSignature =
            "";


        renderedSubmissionsTaskId =
            null;


        submissionList.innerHTML =
            `
<p class="helper-text">
${escapeHtml(error.message || "Could not load student maps.")}
</p>
`;


        submissionsWatcher.start();


        return;
    }


    // Another Task may have been selected while we waited.
    if (
        selectedTeacherTask?.id !==
        taskId
    ) {

        return;
    }


    submissionRowEntries =
        new Map();


    submissionList.innerHTML =
        "";


    renderSubmissionList(
        items,
        false
    );


    renderedSubmissionsTaskId =
        taskId;


    submissionsWatcher.start();
}


async function fetchTaskProjects(
    taskId
) {

    const {
        data,
        error
    } =
        await sb
            .from(
                "submissions"
            )
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
                taskId
            );


    if (error) {

        throw error;
    }


    const items =
        data ||
        [];


    const markedAt =
        new Map();


    if (
        items.length
    ) {

        const reviews =
            await sb
                .from(
                    "submission_reviews"
                )
                .select(
                    `
submission_id,
teacher_feedback,
teacher_annotations,
updated_at
`
                )
                .in(
                    "submission_id",
                    items.map(
                        item =>
                            item.id
                    )
                );


        if (
            reviews.error
        ) {

            throw reviews.error;
        }


        (
            reviews.data ||
            []
        ).forEach(

            review => {

                // An emptied Review does not count as Marked.
                const snapshot =
                    normaliseTeacherReviewSnapshot(
                        review
                    );


                if (snapshot) {

                    markedAt.set(
                        review.submission_id,
                        review.updated_at
                    );
                }
            }
        );
    }


    return items
        .map(

            item => ({

                ...item,

                reviewed_at:
                    markedAt.get(
                        item.id
                    ) ||
                    null
            })
        )
        .sort(
            compareSubmissionsForList
        );
}


function compareSubmissionsForList(
    first,
    second
) {

    const options = {

        numeric:
            true,

        sensitivity:
            "base"
    };


    return (

        String(
            first.class_name ||
            ""
        ).localeCompare(

            String(
                second.class_name ||
                ""
            ),

            undefined,

            options
        ) ||

        String(
            first.group_name ||
            first.student_name ||
            ""
        ).localeCompare(

            String(
                second.group_name ||
                second.student_name ||
                ""
            ),

            undefined,

            options
        ) ||

        String(
            first.id
        ).localeCompare(
            String(second.id)
        )
    );
}


function submissionRowSignature(
    submission
) {

    return stateString([

        submission.id,

        submission.student_name,

        submission.class_name,

        submission.group_name,

        submission.status,

        submission.updated_at,

        submission.submitted_at,

        submission.reviewed_at
    ]);
}


function formatShortDateTime(
    value
) {

    return new Date(
        value
    ).toLocaleString(

        undefined,

        {
            dateStyle:
                "short",

            timeStyle:
                "short"
        }
    );
}


function renderSubmissionList(
    items,
    highlightChanges = false
) {

    if (
        !items.length
    ) {

        submissionRowEntries =
            new Map();


        submissionListSignature =
            stateString([]);


        submissionList.innerHTML =
            `
<p class="helper-text">
No student saves yet.
</p>
`;


        return;
    }


    // Drop any message left from an empty or failed load.
    Array.from(
        submissionList.children
    ).forEach(

        child => {

            if (
                !child.classList.contains(
                    "submission-row"
                )
            ) {

                child.remove();
            }
        }
    );


    const nextEntries =
        new Map();


    let anchor =
        submissionList.firstElementChild;


    items.forEach(

        submission => {

            const signature =
                submissionRowSignature(
                    submission
                );


            let entry =
                submissionRowEntries.get(
                    submission.id
                );


            if (!entry) {

                entry =
                    createSubmissionRow(
                        submission
                    );


                if (
                    highlightChanges
                ) {

                    flashSubmissionRow(
                        entry.row
                    );
                }
            }

            else if (
                entry.signature !==
                signature
            ) {

                const becameSubmitted =
                    entry.submission.status !== "submitted" &&
                    submission.status === "submitted";


                entry.submission =
                    submission;


                fillSubmissionRow(
                    entry
                );


                if (
                    highlightChanges &&
                    becameSubmitted
                ) {

                    flashSubmissionRow(
                        entry.row
                    );
                }
            }


            entry.submission =
                submission;


            entry.signature =
                signature;


            nextEntries.set(
                submission.id,
                entry
            );


            if (
                entry.row === anchor
            ) {

                anchor =
                    anchor.nextElementSibling;
            }

            else {

                submissionList.insertBefore(
                    entry.row,
                    anchor
                );
            }
        }
    );


    submissionRowEntries.forEach(

        (
            entry,
            id
        ) => {

            if (
                !nextEntries.has(id)
            ) {

                entry.row.remove();
            }
        }
    );


    submissionRowEntries =
        nextEntries;


    submissionListSignature =
        stateString(

            items.map(
                submissionRowSignature
            )
        );
}


function createSubmissionRow(
    submission
) {

    const entry = {

        submission,

        signature:
            "",

        row:
            document.createElement(
                "div"
            ),

        actions:
            document.createElement(
                "div"
            )
    };


    entry.row.className =
        "submission-row";


    entry.actions.className =
        "submission-actions";


    const reviewButton =
        document.createElement(
            "button"
        );


    reviewButton.type =
        "button";


    reviewButton.className =
        "quiet-button";


    reviewButton.textContent =
        "Review";


    reviewButton.addEventListener(

        "click",

        () =>
            openSubmissionReview(
                entry.submission.id
            )
    );


    const deleteProgressButton =
        document.createElement(
            "button"
        );


    deleteProgressButton.type =
        "button";


    deleteProgressButton.className =
        "danger-outline-button";


    deleteProgressButton.textContent =
        "Delete";


    deleteProgressButton.addEventListener(

        "click",

        () =>
            deleteStudentSubmissionProgress(
                entry.submission,
                deleteProgressButton
            )
    );


    entry.actions.append(
        reviewButton,
        deleteProgressButton
    );


    entry.row.appendChild(
        entry.actions
    );


    fillSubmissionRow(
        entry
    );


    return entry;
}


function fillSubmissionRow(
    entry
) {

    const submission =
        entry.submission;


    Array.from(
        entry.row.children
    ).forEach(

        child => {

            if (
                child !== entry.actions
            ) {

                child.remove();
            }
        }
    );


    entry.row.insertAdjacentHTML(

        "afterbegin",

        `
<div class="submission-name">
<strong>
${escapeHtml(submission.student_name)}
</strong>
<span>
${escapeHtml(submission.class_name)}
${
            submission.group_name
                ? ` · ${escapeHtml(submission.group_name)}`
                : ""
        }
</span>
${
            submission.reviewed_at
                ? `<span class="submission-marked">Marked · ${escapeHtml(formatShortDateTime(submission.reviewed_at))}</span>`
                : ""
        }
</div>
<div class="submission-meta">
${new Date(submission.updated_at).toLocaleString()}
</div>
<div class="status-pill ${
            submission.status === "submitted"
                ? "submitted"
                : ""
        }">
${escapeHtml(
            submission.status ||
            "draft"
        )}
</div>
`
    );
}


function flashSubmissionRow(
    row
) {

    row.classList.remove(
        "submission-row-updated"
    );


    // Force a reflow so the highlight can replay.
    void row.offsetWidth;


    row.classList.add(
        "submission-row-updated"
    );
}


function isShowingTaskSubmissions() {

    return (

        appMode === "teacher-dashboard" &&

        !teacherDashboard.hidden &&

        !teacherTasksPanel.hidden &&

        Boolean(
            selectedTeacherTask
        )
    );
}


const submissionsWatcher =
    createLiveCheck(
        isShowingTaskSubmissions,
        checkForSubmissionUpdates
    );


async function checkForSubmissionUpdates() {

    const taskId =
        selectedTeacherTask.id;


    // Let loadSubmissions finish the first draw for a new Task.
    if (
        renderedSubmissionsTaskId !==
        taskId
    ) {

        return;
    }


    const items =
        await fetchTaskProjects(
            taskId
        );


    if (

        !isShowingTaskSubmissions() ||

        selectedTeacherTask.id !==
        taskId ||

        renderedSubmissionsTaskId !==
        taskId

    ) {

        return;
    }


    if (
        stateString(

            items.map(
                submissionRowSignature
            )
        ) ===
        submissionListSignature
    ) {

        return;
    }


    renderSubmissionList(
        items,
        true
    );
}


refreshSubmissionsButton.addEventListener(
    "click",
    loadSubmissions
);


/* =========================================================
GALLERY
Every Project for the selected Task, side by side as small
maps, for Teachers only. It has no actions of its own.
========================================================= */


function galleryStatus(
    submission
) {

    if (
        submission.reviewed_at
    ) {

        return {

            label:
                "Marked",

            className:
                "marked"
        };
    }


    if (
        submission.status === "submitted"
    ) {

        return {

            label:
                "Submitted",

            className:
                "submitted"
        };
    }


    return {

        label:
            "Drawing",

        className:
            ""
    };
}


function formatTimeAgo(
    value
) {

    const minutes =
        Math.floor(

            (
                Date.now() -
                new Date(value).getTime()
            ) /

            60000
        );


    if (
        minutes < 1
    ) {

        return "just now";
    }


    if (
        minutes < 60
    ) {

        return `${minutes} min ago`;
    }


    if (
        minutes < 24 * 60
    ) {

        return `${Math.floor(minutes / 60)} h ago`;
    }


    return formatShortDateTime(
        value
    );
}


/*
Gallery shows only the latest Project for each student / group.

Submission 1 stays available in the normal Teacher submission
list and for marking/history, but once Submission 2 exists the
Gallery displays Submission 2 instead.

Using submission_members prevents pupils with the same first
name from accidentally being treated as the same student.
*/
async function latestProjectsForGallery(
    projects
) {

    if (
        !projects.length
    ) {

        return [];
    }


    const submissionIds =
        projects.map(
            project =>
                project.id
        );


    const memberResult =
        await sb
            .from(
                "submission_members"
            )
            .select(
                `
submission_id,
student_id
`
            )
            .in(
                "submission_id",
                submissionIds
            );


    if (
        memberResult.error
    ) {

        throw memberResult.error;
    }


    const membersBySubmission =
        new Map();


    (
        memberResult.data ||
        []
    )
        .forEach(
            row => {

                if (
                    !membersBySubmission.has(
                        row.submission_id
                    )
                ) {

                    membersBySubmission.set(
                        row.submission_id,
                        []
                    );
                }


                membersBySubmission
                    .get(
                        row.submission_id
                    )
                    .push(
                        String(
                            row.student_id
                        )
                    );
            }
        );


    const latestByOwner =
        new Map();


    projects.forEach(
        project => {

            const memberIds =
                (
                    membersBySubmission.get(
                        project.id
                    ) ||
                    []
                )
                    .sort();


            /*
            Registered individual/group projects use their real
            member IDs as the identity.

            Older/guest Projects may not have submission_members,
            so fall back to the visible class + group/student name.
            */
            const ownerKey =
                memberIds.length

                    ? `members:${memberIds.join(",")}`

                    : [
                        "fallback",
                        String(
                            project.class_name ||
                            ""
                        )
                            .trim()
                            .toLowerCase(),

                        String(
                            project.group_name ||
                            project.student_name ||
                            ""
                        )
                            .trim()
                            .toLowerCase()
                    ]
                        .join(
                            ":"
                        );


            const existing =
                latestByOwner.get(
                    ownerKey
                );


            if (
                !existing
            ) {

                latestByOwner.set(
                    ownerKey,
                    project
                );

                return;
            }


            const projectTime =
                new Date(
                    project.updated_at ||
                    project.submitted_at ||
                    0
                )
                    .getTime();


            const existingTime =
                new Date(
                    existing.updated_at ||
                    existing.submitted_at ||
                    0
                )
                    .getTime();


            if (
                projectTime >
                existingTime
            ) {

                latestByOwner.set(
                    ownerKey,
                    project
                );

                return;
            }


            /*
            Extremely unlikely tie:
            use the ID as a stable final tiebreaker.
            */
            if (
                projectTime ===
                    existingTime &&
                String(
                    project.id
                )
                    .localeCompare(
                        String(
                            existing.id
                        )
                    ) >
                    0
            ) {

                latestByOwner.set(
                    ownerKey,
                    project
                );
            }
        }
    );


    return [
        ...latestByOwner.values()
    ]
        .sort(
            compareSubmissionsForList
        );
}


/*
The Gallery's latest Projects in list order, each with its
map data.

Map data is downloaded only for Projects in
needMapIds(items).
*/
async function fetchGalleryProjects(
    taskId,
    needMapIds = items =>
        items.map(
            item =>
                item.id
        )
) {

    const allItems =
        await fetchTaskProjects(
            taskId
        );


    const items =
        await latestProjectsForGallery(
            allItems
        );


    const ids =
        needMapIds(
            items
        );


    const maps =
        new Map();


    if (
        ids.length
    ) {

        const {
            data,
            error
        } =
            await sb
                .from(
                    "submissions"
                )
                .select(
                    "id,updated_at,map_data"
                )
                .in(
                    "id",
                    ids
                );


        if (
            error
        ) {

            throw error;
        }


        (
            data ||
            []
        )
            .forEach(
                row =>
                    maps.set(
                        row.id,
                        row
                    )
            );
    }


    return {
        items,
        maps
    };
}


function createGalleryTile(
    submission
) {

    const entry = {

        submission,

        signature:
            "",

        mapUpdatedAt:
            null,

        tile:
            document.createElement(
                "button"
            ),

        map:
            document.createElement(
                "div"
            ),

        empty:
            document.createElement(
                "div"
            ),

        name:
            document.createElement(
                "strong"
            ),

        status:
            document.createElement(
                "div"
            ),

        meta:
            document.createElement(
                "span"
            )
    };


    entry.tile.type =
        "button";


    entry.tile.className =
        "gallery-tile";


    entry.tile.addEventListener(

        "click",

        () =>
            openSubmissionReview(

                entry.submission.id,

                {
                    fromGallery:
                        true
                }
            )
    );


    entry.map.className =
        "gallery-tile-map";


    entry.empty.className =
        "gallery-tile-empty";


    entry.empty.textContent =
        "Nothing drawn yet";


    const info =
        document.createElement(
            "div"
        );


    info.className =
        "gallery-tile-info";


    info.append(
        entry.name,
        entry.status,
        entry.meta
    );


    entry.tile.append(
        entry.map,
        info
    );


    fillGalleryTileLabels(
        entry
    );


    return entry;
}


function fillGalleryTileLabels(
    entry
) {

    const submission =
        entry.submission;


    const status =
        galleryStatus(
            submission
        );


    const name =
        submission.group_name ||
        submission.student_name ||
        "";


    entry.name.textContent =
        name;


    entry.tile.title =
        `Open ${name}'s map`;


    entry.status.className =
        `status-pill ${status.className}`;


    entry.status.textContent =
        status.label;


    updateGalleryTileTime(
        entry
    );
}


function updateGalleryTileTime(
    entry
) {

    const submission =
        entry.submission;


    const text =
        [

            submission.class_name,

            formatTimeAgo(
                submission.updated_at
            )
        ]
            .filter(Boolean)
            .join(" · ");


    // Leave the text alone when unchanged, so nothing flickers.
    if (
        entry.meta.textContent !==
        text
    ) {

        entry.meta.textContent =
            text;
    }
}


function drawGalleryTileMap(
    entry,
    mapRow
) {

    const mapData =
        mapRow.map_data ||
        {};


    renderMapPreview(
        entry.map,
        mapData
    );


    if (
        !mapDataHasFeatures(
            mapData
        )
    ) {

        entry.map.appendChild(
            entry.empty
        );
    }


    entry.mapUpdatedAt =
        mapRow.updated_at;
}


function getOrCreateGalleryClassSection(
    className
) {

    let classSection =
        galleryClassSections.get(
            className
        );


    if (!classSection) {

        const section =
            document.createElement(
                "section"
            );


        section.className =
            "gallery-class";


        const heading =
            document.createElement(
                "h2"
            );


        heading.textContent =
            className ||
            "No Class";


        const grid =
            document.createElement(
                "div"
            );


        grid.className =
            "gallery-grid";


        section.append(
            heading,
            grid
        );


        classSection = {

            section,

            grid
        };
    }


    return classSection;
}


/* Clear every tile and show a message in their place. */
function resetGallery(
    html
) {


    galleryEntries =
        new Map();


    galleryClassSections =
        new Map();


    galleryContent.innerHTML =
        html;
}


/*
Bring the tiles in line with items (already in list order).
Untouched tiles keep their elements; new tiles are put in place.
*/
function renderGallery(
    items,
    maps,
    highlightChanges = false
) {

    if (
        !items.length
    ) {

        // Already showing the message: leave it, so nothing flickers.
        if (
            galleryContent.querySelector(
                ".gallery-empty-message"
            )
        ) {

            return;
        }


        resetGallery(
            `
<p class="helper-text gallery-empty-message">
No student saves yet.
</p>
`
        );


        return;
    }


    // Drop any message left from an empty or failed load.
    Array.from(
        galleryContent.children
    ).forEach(

        child => {

            if (
                !child.classList.contains(
                    "gallery-class"
                )
            ) {

                child.remove();
            }
        }
    );


    const nextEntries =
        new Map();


    const nextSections =
        new Map();


    let sectionAnchor =
        galleryContent.firstElementChild;


    let tileAnchor =
        null;


    let currentClass =
        null;


    items.forEach(

        submission => {

            const className =
                submission.class_name ||
                "";


            if (
                !nextSections.has(
                    className
                )
            ) {

                const classSection =
                    getOrCreateGalleryClassSection(
                        className
                    );


                nextSections.set(
                    className,
                    classSection
                );


                if (
                    classSection.section ===
                    sectionAnchor
                ) {

                    sectionAnchor =
                        sectionAnchor.nextElementSibling;
                }

                else {

                    galleryContent.insertBefore(
                        classSection.section,
                        sectionAnchor
                    );
                }


                currentClass =
                    classSection;


                tileAnchor =
                    classSection.grid.firstElementChild;
            }


            const signature =
                submissionRowSignature(
                    submission
                );


            let entry =
                galleryEntries.get(
                    submission.id
                );


            if (!entry) {

                entry =
                    createGalleryTile(
                        submission
                    );


                if (
                    highlightChanges
                ) {

                    flashSubmissionRow(
                        entry.tile
                    );
                }
            }

            else if (
                entry.signature !==
                signature
            ) {

                const becameSubmitted =
                    entry.submission.status !== "submitted" &&
                    submission.status === "submitted";


                entry.submission =
                    submission;


                fillGalleryTileLabels(
                    entry
                );


                if (
                    highlightChanges &&
                    becameSubmitted
                ) {

                    flashSubmissionRow(
                        entry.tile
                    );
                }
            }

            else {


                entry.submission =
                    submission;


                updateGalleryTileTime(
                    entry
                );
            }


            entry.signature =
                signature;


            const mapRow =
                maps.get(
                    submission.id
                );


            if (mapRow) {

                drawGalleryTileMap(
                    entry,
                    mapRow
                );
            }


            nextEntries.set(
                submission.id,
                entry
            );


            if (
                entry.tile === tileAnchor
            ) {

                tileAnchor =
                    tileAnchor.nextElementSibling;
            }

            else {

                currentClass.grid.insertBefore(
                    entry.tile,
                    tileAnchor
                );
            }
        }
    );


    galleryEntries.forEach(

        (
            entry,
            id
        ) => {

            if (
                !nextEntries.has(id)
            ) {

                entry.tile.remove();
            }
        }
    );


    galleryClassSections.forEach(

        (
            classSection,
            className
        ) => {

            if (
                !nextSections.has(
                    className
                )
            ) {

                classSection.section.remove();
            }
        }
    );


    galleryEntries =
        nextEntries;


    galleryClassSections =
        nextSections;
}


async function loadGallery() {

    const taskId =
        galleryTaskId;


    const loadId =
        ++galleryLoadCount;


    let result;


    galleryLoading =
        true;


    try {


        result =
            await fetchGalleryProjects(
                taskId
            );
    }


    catch (error) {


        // A newer load (the Gallery was reopened) owns the page now.
        if (
            loadId !==
            galleryLoadCount
        ) {


            return;
        }


        resetGallery(
            `
<p class="helper-text">
${escapeHtml(error.message || "Could not load student maps.")}
</p>
`
        );


        return;
    }


    finally {


        if (
            loadId ===
            galleryLoadCount
        ) {


            galleryLoading =
                false;


            // Keep checking even after a failed load, so it can recover.
            if (
                isShowingGallery()
            ) {


                galleryWatcher.start();
            }
        }
    }


    // The Teacher may have left or reopened the Gallery while we waited.
    if (

        loadId !==
        galleryLoadCount ||

        galleryTaskId !==
        taskId

    ) {


        return;
    }


    renderGallery(
        result.items,
        result.maps
    );
}


function isShowingGallery() {

    return (

        appMode === "teacher-dashboard" &&

        !teacherGallery.hidden &&

        galleryTaskId !== null &&

        selectedTeacherTask?.id ===
        galleryTaskId
    );
}


const galleryWatcher =
    createLiveCheck(
        isShowingGallery,
        checkForGalleryUpdates
    );


/*
Download map data only for Projects that are new or whose
last-changed time moved since their tile was drawn.
*/
async function checkForGalleryUpdates() {

    const taskId =
        galleryTaskId;


    // Let loadGallery finish the first draw.
    if (
        galleryLoading
    ) {


        return;
    }


    // Move the "last changed" times on, even if this check then fails.
    galleryEntries.forEach(
        updateGalleryTileTime
    );


    const {
        items,
        maps
    } =
        await fetchGalleryProjects(

            taskId,

            projects =>
                projects
                    .filter(

                        item =>
                            galleryEntries.get(
                                item.id
                            )?.mapUpdatedAt !==
                            item.updated_at
                    )
                    .map(
                        item =>
                            item.id
                    )
        );


    if (

        !isShowingGallery() ||

        galleryTaskId !== taskId ||

        galleryLoading

    ) {

        return;
    }


    // After a failed first load, draw quietly rather than flash every tile.
    const galleryWasDrawn =
        Boolean(
            galleryContent.querySelector(
                ".gallery-class, .gallery-empty-message"
            )
        );


    renderGallery(
        items,
        maps,
        galleryWasDrawn
    );
}


async function openGallery() {

    if (
        !selectedTeacherTask
    ) {

        return;
    }


    galleryTaskId =
        selectedTeacherTask.id;


    galleryHeading.textContent =
        selectedTeacherTask.title ||
        "Gallery";


    resetGallery(
        `
<p class="helper-text">
Loading student maps…
</p>
`
    );


    submissionsWatcher.stop();


    teacherDashboard.hidden =
        true;


    teacherGallery.hidden =
        false;


    window.scrollTo(
        0,
        0
    );


    await loadGallery();
}


function closeGallery() {

    galleryWatcher.stop();


    galleryTaskId =
        null;


    teacherGallery.hidden =
        true;


    teacherDashboard.hidden =
        false;


    // Catch up on Student Maps that changed while in the Gallery.
    submissionsWatcher.start();


    submissionsWatcher.runNow();
}


openGalleryButton.addEventListener(
    "click",
    openGallery
);


galleryBackButton.addEventListener(
    "click",
    closeGallery
);


/* =========================================================
TEACHER REVIEW
========================================================= */

async function openSubmissionReview(
    id,
    {
        fromGallery = false
    } = {}
) {

    const submissionResult =
        await sb
            .from(
                "submissions"
            )
            .select("*")
            .eq(
                "id",
                id
            )
            .single();


    if (
        submissionResult.error
    ) {

        alert(
            submissionResult.error.message
        );


        return;
    }


    const data =
        submissionResult.data;


    reviewSubmission =
        data;


    currentTask =
        selectedTeacherTask;


    allowedTools = {
        ...DEFAULT_ALLOWED_TOOLS
    };


    loadMapData(
        data.map_data ||
        {}
    );


    const reviewResult =
        await sb
            .from(
                "submission_reviews"
            )
            .select(
                `
teacher_annotations,
teacher_feedback,
updated_at
`
            )
            .eq(
                "submission_id",
                id
            )
            .maybeSingle();


    if (
        reviewResult.error
    ) {

        alert(
            reviewResult.error.message
        );


        return;
    }


    reviewLastSeenSavedAt =
        reviewResult.data?.updated_at ??
        null;


    annotations =

        Array.isArray(
            reviewResult.data?.teacher_annotations
        )

            ? deepClone(
                reviewResult.data.teacher_annotations
            )

            : [];


    teacherFeedbackText.value =
        reviewResult.data?.teacher_feedback ??
        "";


    reviewStudentName.textContent =
        data.group_name ||
        data.student_name;


    reviewStudentMeta.textContent =

        data.group_name

            ? `${data.class_name} · Group of ${data.group_name.split(",").length}`

            : data.class_name;


    applyReviewMarkingState();


    draftReviewWatcher.start();


    appMode =
        "teacher-review";


    reviewOpenedFromGallery =
        fromGallery;


    galleryWatcher.stop();


    teacherDashboard.hidden =
        true;


    teacherGallery.hidden =
        true;


    studentWorkspace.hidden =
        false;


    floatingToolbar.hidden =
        true;


    teacherReviewToolbar.hidden =
        false;


    backToDashboardButton.hidden =
        false;


    teacherFeedbackPanel.hidden =
        false;


    studentReviewPanel.hidden =
        true;


    editLockBanner.hidden =
        true;


    studentReviewData =
        null;


    studentReviewVisible =
        true;


    taskIntro.hidden =
        false;


    taskTitle.textContent =
        currentTask.title ||
        "Student Map";


    taskInstructions.textContent =
        "";


    taskMembers.textContent =
        "";


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


        studentWorkspace.hidden =
            true;


        teacherDashboard.hidden =
            false;


        floatingToolbar.hidden =
            false;


        teacherReviewToolbar.hidden =
            true;


        backToDashboardButton.hidden =
            true;


        teacherFeedbackPanel.hidden =
            true;


        studentReviewPanel.hidden =
            true;


        studentReviewData =
            null;


        studentReviewVisible =
            true;


        annotations =
            [];


        reviewSubmission =
            null;


        if (
            reviewOpenedFromGallery &&
            galleryTaskId !== null
        ) {


            reviewOpenedFromGallery =
                false;


            teacherDashboard.hidden =
                true;


            teacherGallery.hidden =
                false;


            // Catch up on what changed while the Teacher was reviewing.
            galleryWatcher.start();


            galleryWatcher.runNow();


            return;
        }


        await loadSubmissions();
    }
);


/* Before saving, make sure no other Teacher saved this Review
   since this Teacher opened (or last saved) it. */

async function confirmNoNewerReview(
    submissionId
) {

    const latest =
        await sb
            .from(
                "submission_reviews"
            )
            .select(
                "updated_at"
            )
            .eq(
                "submission_id",
                submissionId
            )
            .maybeSingle();


    if (
        latest.error
    ) {

        console.warn(
            "Could not check for other Teachers' changes:",
            latest.error
        );


        return confirm(
            "Could not check whether another Teacher changed this Review. Save anyway?"
        );
    }


    const latestSavedAt =
        latest.data?.updated_at ??
        null;


    if (
        latestSavedAt ===
        reviewLastSeenSavedAt
    ) {

        return true;
    }


    if (
        !latestSavedAt
    ) {

        return confirm(
            "This Review was removed after you opened it. Save your version anyway?"
        );
    }


    return confirm(

        `Another Teacher saved this Review at ${formatShortDateTime(latestSavedAt)}, after you opened it.\n\n` +

        "Saving will replace their ink and feedback. Save anyway?"
    );
}


saveTeacherFeedbackButton.addEventListener(

    "click",

    async () => {

        if (

            !reviewSubmission ||

            !currentTeacherUser

        ) {

            return;
        }


        saveTeacherFeedbackButton.disabled =
            true;


        saveTeacherFeedbackButton.textContent =
            "Saving…";


        setCloudStatus(
            "Saving feedback…",
            "busy"
        );


        const saveConfirmed =
            await confirmNoNewerReview(
                reviewSubmission.id
            );


        if (
            !saveConfirmed
        ) {

            setCloudStatus(
                "Feedback not saved",
                "busy"
            );


            statusBar.textContent =
                "Not saved. Your ink and feedback are still on screen.";


            saveTeacherFeedbackButton.disabled =
                false;


            saveTeacherFeedbackButton.textContent =
                "Save feedback + ink";


            return;
        }


        const savedAt =
            new Date().toISOString();


        try {

            const reviewSave =
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
                                savedAt
                        },

                        {
                            onConflict:
                                "submission_id"
                        }
                    )
                    .select(
                        "updated_at"
                    )
                    .single();


            if (
                reviewSave.error
            ) {

                throw reviewSave.error;
            }


            // The database sets its own time on update, so remember what it stored.
            reviewLastSeenSavedAt =
                reviewSave.data?.updated_at ??
                savedAt;


            setCloudStatus(
                "Feedback saved",
                "good"
            );


            statusBar.textContent =
                "Teacher feedback and red ink saved. Students will see the latest review from My Projects.";


            saveTeacherFeedbackButton.textContent =
                "✓ Saved";


            setTimeout(

                () => {

                    saveTeacherFeedbackButton.disabled =
                        false;


                    saveTeacherFeedbackButton.textContent =
                        "Save feedback + ink";
                },

                1200
            );
        }

        catch (error) {

            console.error(
                error
            );


            setCloudStatus(
                "Feedback save failed",
                "bad"
            );


            alert(

                error.message ||

                "Could not save teacher feedback."
            );


            saveTeacherFeedbackButton.disabled =
                false;


            saveTeacherFeedbackButton.textContent =
                "Save feedback + ink";
        }
    }
);


/* =========================================================
EXPORT
========================================================= */

function buildExportSvg() {

    const clone =
        canvas.cloneNode(
            true
        );


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


    // A selected Hazard's ring is drawn with it, not in selectionLayer.
    clone
        .querySelectorAll(
            ".hazard-selected"
        )
        .forEach(
            ring =>
                ring.remove()
        );


    if (
        appMode !== "teacher-review"
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
        .serializeToString(
            clone
        );
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
        URL.createObjectURL(
            blob
        );


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


            URL.revokeObjectURL(
                url
            );


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


    image.src =
        url;
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

    if (

        currentIdentityType === "guest" &&

        currentGuestProfile

    ) {

        studentBadge.textContent =
            `${currentGuestProfile.guest_name} · G-${currentGuestProfile.guest_code}`;


        return;
    }


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


window.addEventListener(

    "pagehide",

    () => {

        if (
            editLockOwned
        ) {

            releaseCurrentEditLock();
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


    studentWorkspace.hidden =
        true;


    studentProfilePage.hidden =
        true;


    teacherDashboard.hidden =
        true;


    startupModal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    if (
        !BACKEND_READY
    ) {

        setCloudStatus(
            "Offline",
            "bad"
        );


        startupError.textContent =
            "The class database is not connected.";


        startupError.hidden =
            false;


        return;
    }


    setCloudStatus(
        "Ready",
        "good"
    );


    if (
        await resumeGoogleTeacherSignIn()
    ) {

        return;
    }


    await prepareStudentLogin();
}


initialise();


/* =========================================================
DELETE SUBMISSION / PROGRESS
========================================================= */

async function deleteStudentSubmissionProgress(
    submission,
    button
) {

    if (

        appMode !== "teacher-dashboard" ||

        !currentTeacherUser ||

        !selectedTeacherTask ||

        !submission ||

        !submission.id

    ) {

        return;
    }


    const isGroup =
        Boolean(
            submission.group_name
        );


    const displayName =

        isGroup

            ? `${submission.class_name} · ${submission.group_name}`

            : (
                submission.student_name ||
                "this student"
            );


    const warning =

        isGroup

            ? (
                `Delete submission/progress for ${displayName}?\n\n` +

                "This is a shared group project. " +

                "The saved map will be deleted for every student in this group.\n\n" +

                "Teacher feedback and red-pen annotations attached to this submission will also be deleted.\n\n" +

                "The students can enter the task code again and start a new project.\n\n" +

                "This cannot be undone."
            )

            : (
                `Delete submission/progress for ${displayName}?\n\n` +

                "The student's saved map will be permanently deleted.\n\n" +

                "Teacher feedback and red-pen annotations attached to this submission will also be deleted.\n\n" +

                "The student can enter the task code again and start a new project.\n\n" +

                "This cannot be undone."
            );


    const confirmed =
        confirm(
            warning
        );


    if (!confirmed) {

        return;
    }


    button.disabled =
        true;


    button.textContent =
        "Deleting…";


    try {

        const reviewDelete =
            await sb
                .from(
                    "submission_reviews"
                )
                .delete()
                .eq(
                    "submission_id",
                    submission.id
                );


        if (
            reviewDelete.error
        ) {

            throw reviewDelete.error;
        }


        const memberDelete =
            await sb
                .from(
                    "submission_members"
                )
                .delete()
                .eq(
                    "submission_id",
                    submission.id
                );


        if (
            memberDelete.error
        ) {

            throw memberDelete.error;
        }


        const submissionDelete =
            await sb
                .from(
                    "submissions"
                )
                .delete()
                .eq(
                    "id",
                    submission.id
                );


        if (
            submissionDelete.error
        ) {

            throw submissionDelete.error;
        }


        await loadSubmissions();
    }

    catch (error) {

        console.error(
            error
        );


        alert(

            error.message ||

            "Could not delete this submission/progress."
        );


        button.disabled =
            false;


        button.textContent =
            "Delete";
    }
}