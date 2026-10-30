(() => {
    "use strict";

    const PREFIX = "oe-tutorial";
    const POLL_MS = 140;
    const STEP_ADVANCE_MS = 260;
    const SECTION_COMPLETE_MS = 950;
    const HOLD_MS = 550;
    const RESTART_KEY = "oeMapMakerTutorialRestartV4";

    const startupCard = startupModal?.querySelector(".student-login-modal") || null;
    const drawMenuButton = document.getElementById("oe-enhance-draw-menu");
    const drawFlyout = document.getElementById("oe-enhance-draw-flyout");
    const contextMoreButton = document.getElementById("oe-enhance-context-more");
    const contextFlyout = document.getElementById("oe-enhance-context-flyout");
    const copyButton = document.getElementById("oe-enhance-copy");
    const pasteButton = document.getElementById("oe-enhance-paste");
    const extendRouteButton = document.getElementById("oe-enhance-extend-route");
    const resizeRouteButton = document.getElementById("oe-enhance-resize-route");
    const resizeRouteFlyout = document.getElementById("oe-enhance-resize-flyout");

    if (!startupCard || !canvasWrap || !canvas || !floatingToolbar) {
        console.warn("OE Tutorial: required app elements were not found.");
        return;
    }

    /* =========================================================
       STYLES
    ========================================================= */

    const style = document.createElement("style");
    style.id = `${PREFIX}-styles`;

    style.textContent = `
        #${PREFIX}-entry {
            width:100%;
            margin:10px 0 2px;
        }

        .${PREFIX}-entry-note {
            margin:6px 0 0;
            color:var(--muted);
            font-size:11px;
            line-height:1.35;
            text-align:center;
        }

        body.${PREFIX}-active {
            overflow:auto;
        }

        .${PREFIX}-spotlight {
            position:fixed;
            z-index:5000;
            display:none;
            border:3px solid #e0a52d;
            border-radius:11px;
            box-shadow:
                0 0 0 9999px rgba(18,24,21,.16),
                0 0 0 5px rgba(224,165,45,.18);
            pointer-events:none;
        }

        .${PREFIX}-spotlight.active {
            display:block;
        }

        .${PREFIX}-panel {
            position:fixed;
            z-index:6000;
            right:10px;
            bottom:10px;
            width:min(340px,calc(100vw - 20px));
            max-height:min(480px,calc(100vh - 20px));
            overflow:auto;
            padding:12px;
            border:1px solid rgba(52,72,61,.28);
            border-radius:14px;
            background:#fffdf8;
            box-shadow:0 14px 42px rgba(0,0,0,.24);
        }

        .${PREFIX}-panel.left {
            right:auto;
            left:10px;
        }

        .${PREFIX}-panel.top {
            top:10px;
            bottom:auto;
        }

        .${PREFIX}-topline {
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:10px;
        }

        .${PREFIX}-section {
            color:var(--forest);
            font-size:9px;
            font-weight:900;
            letter-spacing:1.15px;
            text-transform:uppercase;
        }

        .${PREFIX}-count {
            color:var(--muted);
            font-size:9px;
            font-weight:800;
        }

        .${PREFIX}-panel h2 {
            margin:5px 0;
            font-size:18px;
            line-height:1.18;
        }

        .${PREFIX}-copy {
            margin:0;
            color:#59605c;
            font-size:12px;
            line-height:1.42;
        }

        .${PREFIX}-task {
            margin:9px 0 0 !important;
            padding:9px 10px;
            border:1px solid #d7d9d1;
            border-left:4px solid #e0a52d;
            border-radius:8px;
            background:#fbf7ec;
            color:#2e342f !important;
            font-size:12.5px !important;
            font-weight:800;
            line-height:1.42 !important;
        }

        .${PREFIX}-hint {
            margin:6px 0 0 !important;
            color:var(--muted) !important;
            font-size:10.5px !important;
            line-height:1.35 !important;
        }

        .${PREFIX}-progress {
            display:flex;
            gap:4px;
            margin-top:9px;
        }

        .${PREFIX}-progress span {
            height:4px;
            flex:1;
            border-radius:999px;
            background:#e3e1d9;
        }

        .${PREFIX}-progress span.done {
            background:var(--forest);
        }

        .${PREFIX}-progress span.current {
            background:#d7b35f;
        }

        .${PREFIX}-sections {
            display:flex;
            flex-wrap:wrap;
            gap:4px;
            margin-top:8px;
        }

        .${PREFIX}-sections span {
            display:inline-flex;
            align-items:center;
            min-height:22px;
            padding:3px 6px;
            border:1px solid #d7d5cc;
            border-radius:999px;
            background:#fff;
            color:#6a716d;
            font-size:8.5px;
            font-weight:800;
        }

        .${PREFIX}-sections span.current {
            border-color:var(--forest);
            background:#edf4ee;
            color:var(--forest-dark);
        }

        .${PREFIX}-sections span.done {
            border-color:#c9dfcf;
            background:#e8f3eb;
            color:#2e6745;
        }

        .${PREFIX}-actions {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:7px;
            margin-top:10px;
        }

        .${PREFIX}-actions button {
            min-height:35px;
            padding:6px 9px;
            border:1px solid #c8c7c0;
            border-radius:8px;
            background:#fffdf8;
            color:var(--ink);
            font:inherit;
            font-size:11px;
            font-weight:850;
            cursor:pointer;
        }

        .${PREFIX}-actions button:disabled {
            opacity:.35;
            cursor:not-allowed;
        }

        .${PREFIX}-skip {
            margin-left:auto;
            border-style:dashed !important;
            color:#59635d !important;
        }

        .${PREFIX}-finish {
            margin-left:auto;
            background:var(--forest) !important;
            border-color:var(--forest-dark) !important;
            color:#fff !important;
        }

        .${PREFIX}-footer {
            display:flex;
            justify-content:space-between;
            gap:10px;
            margin-top:9px;
            padding-top:8px;
            border-top:1px solid #e2dfd5;
        }

        .${PREFIX}-footer button {
            border:0;
            padding:2px 0;
            background:transparent;
            color:var(--muted);
            font-size:10px;
            font-weight:800;
            text-decoration:underline;
            cursor:pointer;
        }

        .${PREFIX}-toast {
            position:fixed;
            z-index:6500;
            left:50%;
            top:12px;
            transform:translateX(-50%);
            max-width:min(500px,calc(100vw - 24px));
            padding:8px 12px;
            border-radius:999px;
            background:#34483d;
            color:#fff;
            box-shadow:0 5px 18px rgba(0,0,0,.2);
            font-size:11px;
            font-weight:800;
            text-align:center;
            opacity:0;
            pointer-events:none;
        }

        .${PREFIX}-toast.show {
            opacity:1;
        }

        body.${PREFIX}-active #studentReviewPanel,
        body.${PREFIX}-active #teacherFeedbackPanel,
        body.${PREFIX}-active #editLockBanner,
        body.${PREFIX}-active #teacherReviewToolbar {
            display:none !important;
        }

        @media (max-width:700px) {
            .${PREFIX}-panel,
            .${PREFIX}-panel.left,
            .${PREFIX}-panel.top {
                left:6px;
                right:6px;
                top:auto;
                bottom:6px;
                width:auto;
                max-height:42vh;
                padding:10px;
            }

            .${PREFIX}-panel h2 {
                font-size:16px;
            }

            .${PREFIX}-copy {
                font-size:11px;
            }

            .${PREFIX}-task {
                font-size:11.5px !important;
            }
        }
    `;

    document.head.appendChild(style);

    /* =========================================================
       ENTRY BUTTON
    ========================================================= */

    const tutorialEntry =
        document.getElementById(`${PREFIX}-entry`) ||
        document.createElement("button");

    tutorialEntry.id = `${PREFIX}-entry`;
    tutorialEntry.type = "button";
    tutorialEntry.className = "quiet-button";
    tutorialEntry.textContent = "🧭 App Tutorial";

    tutorialEntry.setAttribute(
        "aria-label",
        "Open the step-by-step App Tutorial"
    );

    if (!tutorialEntry.parentNode) {
        const guestActions =
            startupCard.querySelector(
                ".guest-entry-actions"
            );

        const note =
            document.createElement("p");

        note.className =
            `${PREFIX}-entry-note`;

        note.textContent =
            "Practise every map tool. Nothing in the tutorial is saved.";

        if (guestActions) {
            startupCard.insertBefore(
                tutorialEntry,
                guestActions
            );

            startupCard.insertBefore(
                note,
                guestActions
            );
        }
        else {
            startupCard.append(
                tutorialEntry,
                note
            );
        }
    }

    /* =========================================================
       GUIDE UI
    ========================================================= */

    const spotlight =
        document.createElement("div");

    spotlight.className =
        `${PREFIX}-spotlight`;

    spotlight.setAttribute(
        "aria-hidden",
        "true"
    );

    const panel =
        document.createElement("aside");

    panel.className =
        `${PREFIX}-panel`;

    panel.hidden =
        true;

    panel.setAttribute(
        "aria-live",
        "polite"
    );

    panel.innerHTML = `
        <div class="${PREFIX}-topline">
            <div class="${PREFIX}-section"></div>
            <div class="${PREFIX}-count"></div>
        </div>

        <h2></h2>

        <p class="${PREFIX}-copy"></p>

        <p class="${PREFIX}-task"></p>

        <p class="${PREFIX}-hint"></p>

        <div class="${PREFIX}-progress"></div>

        <div class="${PREFIX}-sections"></div>

        <div class="${PREFIX}-actions">
            <button
                type="button"
                class="${PREFIX}-back"
            >
                ← Back
            </button>

            <button
                type="button"
                class="${PREFIX}-skip"
            >
                Skip section →
            </button>

            <button
                type="button"
                class="${PREFIX}-finish"
                hidden
            >
                Finish Tutorial
            </button>
        </div>

        <div class="${PREFIX}-footer">
            <button
                type="button"
                class="${PREFIX}-restart"
            >
                Restart
            </button>

            <button
                type="button"
                class="${PREFIX}-exit"
            >
                Exit tutorial
            </button>
        </div>
    `;

    const toast =
        document.createElement("div");

    toast.className =
        `${PREFIX}-toast`;

    document.body.append(
        spotlight,
        panel,
        toast
    );

    const sectionEl =
        panel.querySelector(
            `.${PREFIX}-section`
        );

    const countEl =
        panel.querySelector(
            `.${PREFIX}-count`
        );

    const titleEl =
        panel.querySelector("h2");

    const copyEl =
        panel.querySelector(
            `.${PREFIX}-copy`
        );

    const taskEl =
        panel.querySelector(
            `.${PREFIX}-task`
        );

    const hintEl =
        panel.querySelector(
            `.${PREFIX}-hint`
        );

    const progressEl =
        panel.querySelector(
            `.${PREFIX}-progress`
        );

    const sectionsEl =
        panel.querySelector(
            `.${PREFIX}-sections`
        );

    const backButton =
        panel.querySelector(
            `.${PREFIX}-back`
        );

    const skipButton =
        panel.querySelector(
            `.${PREFIX}-skip`
        );

    const finishButton =
        panel.querySelector(
            `.${PREFIX}-finish`
        );

    const restartButton =
        panel.querySelector(
            `.${PREFIX}-restart`
        );

    const exitButton =
        panel.querySelector(
            `.${PREFIX}-exit`
        );

    /* =========================================================
       STATE
    ========================================================= */

    let active = false;
    let stepIndex = 0;
    let runtime = {};
    let pollTimer = null;
    let transitionTimer = null;
    let toastTimer = null;
    let referenceHoldStarted = 0;
    let stepResolved = false;
    let showingSectionComplete = false;
    let showingTutorialComplete = false;

    let primaryShapeId = null;
    let secondShapeId = null;
    let freehandId = null;
    let pathId = null;
    let roadId = null;
    let hazardId = null;

    const completedSteps =
        new Set();

    const eventCounts =
        new Map();

    const bumpEvent =
        name =>
            eventCounts.set(
                name,
                (
                    eventCounts.get(name) ||
                    0
                ) + 1
            );

    const eventCount =
        name =>
            eventCounts.get(name) ||
            0;

    copyButton?.addEventListener(
        "click",
        () => {
            if (active) {
                bumpEvent("copy");
            }
        },
        true
    );

    /* =========================================================
       SAFE DUMMY ACTIONS
    ========================================================= */

    const originalScheduleSave =
        scheduleSave;

    const originalSaveLocalBackup =
        saveLocalBackup;

    const originalSaveStudentMap =
        saveStudentMap;

    const originalSubmitToTeacher =
        submitToTeacher;

    const originalDownloadMapPNG =
        downloadMapPNG;

    scheduleSave =
        (...args) =>
            active
                ? undefined
                : originalScheduleSave(
                    ...args
                );

    saveLocalBackup =
        (...args) =>
            active
                ? undefined
                : originalSaveLocalBackup(
                    ...args
                );

    saveStudentMap =
        async (...args) => {

            if (!active) {
                return originalSaveStudentMap(
                    ...args
                );
            }

            bumpEvent("save");

            showToast(
                "Tutorial only — nothing was saved."
            );
        };

    submitToTeacher =
        async (...args) => {

            if (!active) {
                return originalSubmitToTeacher(
                    ...args
                );
            }

            bumpEvent("submit");

            showToast(
                "Tutorial only — nothing was submitted."
            );
        };

    downloadMapPNG =
        async (...args) => {

            if (!active) {
                return originalDownloadMapPNG(
                    ...args
                );
            }

            bumpEvent("download");

            showToast(
                "Tutorial only — no file was downloaded."
            );
        };

    document.addEventListener(
        "click",
        event => {

            if (!active) {
                return;
            }

            const button =
                event.target.closest(
                    "button"
                );

            if (!button) {
                return;
            }

            const dummy = (
                name,
                message,
                status
            ) => {

                event.preventDefault();
                event.stopImmediatePropagation();

                bumpEvent(name);

                statusBar.textContent =
                    status;

                showToast(message);

                closeFlyouts();

                setTimeout(
                    checkStep,
                    10
                );
            };

            if (
                button ===
                saveNowButton
            ) {
                dummy(
                    "save",
                    "Save Now would save your latest work.",
                    "Tutorial only — nothing was saved."
                );
            }

            else if (
                button ===
                submitButton
            ) {
                dummy(
                    "submit",
                    "Submit would hand your map in to your teacher.",
                    "Tutorial only — nothing was submitted."
                );
            }

            else if (
                button ===
                downloadButton
            ) {
                dummy(
                    "download",
                    "Download PNG would make an image copy.",
                    "Tutorial only — no file was downloaded."
                );
            }

            else if (
                button ===
                backToProfileButton
            ) {
                dummy(
                    "myprojects",
                    "My Projects would return to your task folder.",
                    "Tutorial only — staying on the practice map."
                );
            }

            else if (
                button ===
                clearButton
            ) {
                dummy(
                    "clear",
                    "Clear Entire Map would remove everything after confirmation.",
                    "Tutorial only — your practice map was kept."
                );
            }
        },
        true
    );

    referenceButton.addEventListener(
        "pointerdown",
        () => {

            if (active) {
                referenceHoldStarted =
                    performance.now();
            }
        },
        true
    );

    referenceButton.addEventListener(
        "pointerup",
        () => {

            if (
                !active ||
                !referenceHoldStarted
            ) {
                return;
            }

            const held =
                performance.now() -
                referenceHoldStarted;

            referenceHoldStarted =
                0;

            if (
                held >=
                HOLD_MS
            ) {
                bumpEvent(
                    "reference"
                );

                showToast(
                    "Reference Map appears only while you hold it."
                );

                checkStep();
            }
        },
        true
    );

    referenceButton.addEventListener(
        "pointercancel",
        () => {
            referenceHoldStarted =
                0;
        },
        true
    );

    /* =========================================================
       HELPERS
    ========================================================= */

    function showToast(
        message
    ) {
        clearTimeout(
            toastTimer
        );

        toast.textContent =
            message;

        toast.classList.add(
            "show"
        );

        toastTimer =
            setTimeout(
                () =>
                    toast.classList.remove(
                        "show"
                    ),
                1800
            );
    }

    const finishedShapes =
        () =>
            shapes.filter(
                shape =>
                    !shape.draft
            );

    const finishedRoutes =
        () =>
            routes.filter(
                route =>
                    !route.draft &&
                    route.kind !==
                        "boundary"
            );

    const shapeById =
        id =>
            shapes.find(
                shape =>
                    shape.id ===
                    id
            ) ||
            null;

    const routeById =
        id =>
            routes.find(
                route =>
                    route.id ===
                    id
            ) ||
            null;

    const shapeElement =
        id =>
            document.querySelector(
                `.map-shape[data-shape-id="${id}"]`
            );

    const routeElement =
        id =>
            document.querySelector(
                `[data-route-id="${id}"]`
            );

    function routeBounds(
        route
    ) {

        return route?.points?.length

            ? getPointsBounds(
                route.points
            )

            : {
                x:0,
                y:0,
                width:0,
                height:0
            };
    }

    function enableTutorialActionButtons() {

        [
            saveNowButton,
            submitButton,
            downloadButton,
            backToProfileButton,
            clearButton
        ]
            .forEach(
                button => {

                    if (!button) {
                        return;
                    }

                    button.disabled =
                        false;

                    button.hidden =
                        false;
                }
            );
    }

    function closeTransientUi() {

        closeFlyouts();

        hideColourPanel();

        objectModal.hidden =
            true;

        routeModal.hidden =
            true;

        hazardModal.hidden =
            true;

        editModal.hidden =
            true;

        document.body.classList.remove(
            "modal-open"
        );
    }

    function cleanDrafts() {

        shapes =
            shapes.filter(
                shape =>
                    !shape.draft
            );

        routes =
            routes.filter(
                route =>
                    !route.draft
            );

        pendingDraftId =
            null;

        pendingRouteId =
            null;

        pendingHazard =
            null;

        draftOriginState =
            null;

        transformAction =
            null;

        pointerActive =
            false;

        startPoint =
            null;

        currentPoints =
            [];

        lastMovePoint =
            null;

        temporaryLayer.innerHTML =
            "";

        currentTool =
            "select";

        closeTransientUi();

        renderAll();
    }

    function ensurePrimaryShape() {

        let shape =
            shapeById(
                primaryShapeId
            ) ||
            finishedShapes()[0] ||
            null;

        if (!shape) {

            shape = {
                id:
                    nextShapeId++,

                type:
                    "rectangle",

                name:
                    "Hall",

                meaning:
                    "Building",

                fill:
                    "#c7d2df",

                rotation:
                    0,

                draft:
                    false,

                x:
                    470,

                y:
                    175,

                width:
                    270,

                height:
                    145
            };

            shapes.push(
                shape
            );
        }

        primaryShapeId =
            shape.id;

        renderAll();

        return shape;
    }

    function selectPrimaryShape() {

        const shape =
            ensurePrimaryShape();

        selectedItem = {
            kind:
                "shape",

            id:
                shape.id
        };

        currentTool =
            "select";

        renderAll();

        return shape;
    }

    function ensureSecondShape() {

        let shape =
            shapeById(
                secondShapeId
            );

        if (
            shape &&
            !shape.draft
        ) {
            return shape;
        }

        shape =
            finishedShapes().find(
                item =>
                    item.id !==
                    primaryShapeId
            ) ||
            null;

        if (!shape) {

            const first =
                ensurePrimaryShape();

            shape = {
                id:
                    nextShapeId++,

                type:
                    "circle",

                name:
                    "Shelter",

                meaning:
                    "Facility",

                fill:
                    "#d9c8a7",

                rotation:
                    0,

                draft:
                    false,

                x:
                    first.x +
                    40,

                y:
                    first.y +
                    35,

                width:
                    150,

                height:
                    150
            };

            shapes.push(
                shape
            );
        }

        secondShapeId =
            shape.id;

        renderAll();

        return shape;
    }

    function overlapSecondShape() {

        const first =
            ensurePrimaryShape();

        const second =
            ensureSecondShape();

        if (
            second.type !==
            "freehand"
        ) {
            second.x =
                first.x +
                35;

            second.y =
                first.y +
                30;
        }

        renderAll();

        return second;
    }

    function ensurePath() {

        let route =
            routeById(
                pathId
            ) ||
            finishedRoutes().find(
                item =>
                    item.kind ===
                    "path"
            ) ||
            null;

        if (!route) {

            route = {
                id:
                    nextRouteId++,

                kind:
                    "path",

                name:
                    "Walkway",

                draft:
                    false,

                colour:
                    "#3f75a8",

                width:
                    5,

                points: [
                    {
                        x:330,
                        y:420
                    },
                    {
                        x:560,
                        y:455
                    },
                    {
                        x:800,
                        y:410
                    }
                ]
            };

            routes.push(
                route
            );
        }

        pathId =
            route.id;

        renderAll();

        return route;
    }

    function selectPath() {

        const route =
            ensurePath();

        selectedItem = {
            kind:
                "route",

            id:
                route.id
        };

        currentTool =
            "select";

        renderAll();

        return route;
    }

    function ensureFinishExamples() {

        ensurePrimaryShape();

        ensurePath();

        if (!hazards.length) {

            const hazard = {
                id:
                    nextHazardId++,

                name:
                    "Wet Floor",

                note:
                    "Slippery after rain",

                x:
                    1030,

                y:
                    390
            };

            hazards.push(
                hazard
            );

            hazardId =
                hazard.id;
        }

        renderAll();
    }

    function tutorialReferenceDataUrl() {

        const svg = `
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1600 675"
            >
                <rect
                    width="1600"
                    height="675"
                    fill="#f7f5ef"
                />

                <rect
                    x="170"
                    y="120"
                    width="430"
                    height="190"
                    rx="18"
                    fill="#c9d8c9"
                    stroke="#536759"
                    stroke-width="8"
                />

                <rect
                    x="850"
                    y="105"
                    width="390"
                    height="160"
                    rx="18"
                    fill="#e2d3b7"
                    stroke="#76684f"
                    stroke-width="8"
                />

                <path
                    d="M180 470 C460 350 760 560 1190 420"
                    fill="none"
                    stroke="#6f8eaa"
                    stroke-width="34"
                    stroke-linecap="round"
                />

                <path
                    d="M180 470 C460 350 760 560 1190 420"
                    fill="none"
                    stroke="#f7f5ef"
                    stroke-width="15"
                    stroke-dasharray="25 18"
                    stroke-linecap="round"
                />

                <circle
                    cx="1320"
                    cy="455"
                    r="78"
                    fill="#bdd4b7"
                    stroke="#536759"
                    stroke-width="8"
                />

                <text
                    x="385"
                    y="225"
                    text-anchor="middle"
                    font-family="Arial"
                    font-size="44"
                    font-weight="700"
                    fill="#34483d"
                >
                    SAMPLE BLOCK
                </text>

                <text
                    x="1045"
                    y="205"
                    text-anchor="middle"
                    font-family="Arial"
                    font-size="42"
                    font-weight="700"
                    fill="#5a4d39"
                >
                    SAMPLE HALL
                </text>

                <text
                    x="800"
                    y="620"
                    text-anchor="middle"
                    font-family="Arial"
                    font-size="28"
                    font-weight="700"
                    fill="#6e746f"
                >
                    REFERENCE MAP — TUTORIAL ONLY
                </text>
            </svg>
        `;

        return (
            "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(
                svg
            )
        );
    }

    /* =========================================================
       GUIDE POSITIONING
    ========================================================= */

    function stepTarget(
        step =
            STEPS[
                stepIndex
            ]
    ) {

        if (
            typeof step?.target ===
            "function"
        ) {
            return step.target() ||
                null;
        }

        if (
            typeof step?.target ===
            "string"
        ) {
            return document.querySelector(
                step.target
            );
        }

        return null;
    }

    function visible(
        element
    ) {

        if (!element) {
            return false;
        }

        const computed =
            getComputedStyle(
                element
            );

        const rectangle =
            element.getBoundingClientRect();

        return (
            computed.display !==
                "none" &&
            computed.visibility !==
                "hidden" &&
            Number(
                computed.opacity
            ) !==
                0 &&
            rectangle.width >
                0 &&
            rectangle.height >
                0
        );
    }

    function positionGuide() {

        if (
            !active ||
            panel.hidden ||
            showingSectionComplete ||
            showingTutorialComplete
        ) {
            spotlight.classList.remove(
                "active"
            );

            return;
        }

        const target =
            stepTarget();

        if (
            !visible(
                target
            )
        ) {
            spotlight.classList.remove(
                "active"
            );

            return;
        }

        const rectangle =
            target.getBoundingClientRect();

        const padding =
            6;

        spotlight.style.left =
            `${
                Math.max(
                    3,
                    rectangle.left -
                    padding
                )
            }px`;

        spotlight.style.top =
            `${
                Math.max(
                    3,
                    rectangle.top -
                    padding
                )
            }px`;

        spotlight.style.width =
            `${
                Math.min(
                    window.innerWidth -
                    6,
                    rectangle.width +
                    padding *
                    2
                )
            }px`;

        spotlight.style.height =
            `${
                Math.min(
                    window.innerHeight -
                    6,
                    rectangle.height +
                    padding *
                    2
                )
            }px`;

        spotlight.classList.add(
            "active"
        );

        panel.classList.remove(
            "left",
            "top"
        );

        const isLargeTarget =
            rectangle.width >
            window.innerWidth *
            .55;

        if (
            !isLargeTarget &&
            rectangle.right >
            window.innerWidth -
            370
        ) {
            panel.classList.add(
                "left"
            );
        }

        if (
            rectangle.top >
                window.innerHeight *
                .62 &&
            window.innerWidth >
                700
        ) {
            panel.classList.add(
                "top"
            );
        }
    }

    function bringTargetIntoView() {

        const target =
            stepTarget();

        if (
            !visible(
                target
            )
        ) {
            return;
        }

        const rectangle =
            target.getBoundingClientRect();

        if (
            rectangle.top <
                8 ||
            rectangle.bottom >
                window.innerHeight -
                8
        ) {
            target.scrollIntoView({
                behavior:
                    "smooth",

                block:
                    "center",

                inline:
                    "nearest"
            });
        }
    }

    /* =========================================================
       SECTIONS
    ========================================================= */

    const SECTIONS = [
        {
            id:"landmarks",
            title:"1 · Landmarks",
            short:"Landmarks",
            done:"Landmarks complete — you can add, size and label map symbols."
        },
        {
            id:"adjust",
            title:"2 · Select & Adjust",
            short:"Adjust",
            done:"Select & Adjust complete — you can move, edit, resize, rotate, colour, copy and layer objects."
        },
        {
            id:"freehand",
            title:"3 · Freehand",
            short:"Freehand",
            done:"Freehand complete — you can draw irregular landmarks."
        },
        {
            id:"routes",
            title:"4 · Paths & Roads",
            short:"Routes",
            done:"Paths & Roads complete — you can draw, extend and resize routes."
        },
        {
            id:"hazards",
            title:"5 · Hazards",
            short:"Hazards",
            done:"Hazards complete — you can mark and explain safety risks."
        },
        {
            id:"finish",
            title:"6 · Finish & Navigate",
            short:"Finish",
            done:"Tutorial complete — you have practised the full student map-making flow."
        }
    ];

    const sectionForStep =
        index =>
            SECTIONS.find(
                section =>
                    section.id ===
                    STEPS[
                        index
                    ]?.section
            );

    const firstStepOfSection =
        sectionId =>
            STEPS.findIndex(
                step =>
                    step.section ===
                    sectionId
            );

    function lastStepOfSection(
        sectionId
    ) {

        let result =
            -1;

        STEPS.forEach(
            (
                step,
                index
            ) => {

                if (
                    step.section ===
                    sectionId
                ) {
                    result =
                        index;
                }
            }
        );

        return result;
    }

    const isFirstStepOfSection =
        index =>
            firstStepOfSection(
                STEPS[
                    index
                ].section
            ) ===
            index;

    const isLastStepOfSection =
        index =>
            lastStepOfSection(
                STEPS[
                    index
                ].section
            ) ===
            index;

    function completedSections() {

        return new Set(
            SECTIONS
                .filter(
                    section =>
                        completedSteps.has(
                            lastStepOfSection(
                                section.id
                            )
                        )
                )
                .map(
                    section =>
                        section.id
                )
        );
    }

    /* =========================================================
       PROGRESS / STEP FLOW
    ========================================================= */

    function renderProgress() {

        const currentSection =
            STEPS[
                stepIndex
            ]?.section ||
            "finish";

        const sectionSteps =
            STEPS
                .map(
                    (
                        step,
                        index
                    ) => ({
                        step,
                        index
                    })
                )
                .filter(
                    item =>
                        item.step.section ===
                        currentSection
                );

        progressEl.replaceChildren(
            ...sectionSteps.map(
                item => {

                    const bar =
                        document.createElement(
                            "span"
                        );

                    if (
                        completedSteps.has(
                            item.index
                        )
                    ) {
                        bar.classList.add(
                            "done"
                        );
                    }

                    else if (
                        item.index ===
                        stepIndex
                    ) {
                        bar.classList.add(
                            "current"
                        );
                    }

                    return bar;
                }
            )
        );

        const doneSections =
            completedSections();

        sectionsEl.replaceChildren(
            ...SECTIONS.map(
                section => {

                    const chip =
                        document.createElement(
                            "span"
                        );

                    chip.textContent =
                        section.short;

                    if (
                        section.id ===
                        currentSection
                    ) {
                        chip.classList.add(
                            "current"
                        );
                    }

                    if (
                        doneSections.has(
                            section.id
                        )
                    ) {
                        chip.classList.add(
                            "done"
                        );
                    }

                    return chip;
                }
            )
        );
    }

    function renderStep() {

        clearTimeout(
            transitionTimer
        );

        showingSectionComplete =
            false;

        showingTutorialComplete =
            false;

        stepResolved =
            false;

        runtime =
            {};

        finishButton.hidden =
            true;

        backButton.hidden =
            false;

        skipButton.hidden =
            false;

        taskEl.removeAttribute(
            "style"
        );

        const step =
            STEPS[
                stepIndex
            ];

        const section =
            sectionForStep(
                stepIndex
            );

        sectionEl.textContent =
            section.title;

        countEl.textContent =
            `${stepIndex + 1} / ${STEPS.length}`;

        titleEl.textContent =
            step.title;

        copyEl.textContent =
            step.copy ||
            "";

        taskEl.textContent =
            step.task;

        hintEl.textContent =
            step.hint ||
            "";

        hintEl.hidden =
            !step.hint;

        backButton.disabled =
            stepIndex ===
            0;

        if (
            section.id ===
            "finish"
        ) {
            skipButton.hidden =
                true;
        }

        renderProgress();

        step.prepare?.();

        requestAnimationFrame(
            () => {

                bringTargetIntoView();

                setTimeout(
                    positionGuide,
                    55
                );
            }
        );

        checkStep();
    }

    function goToStep(
        index
    ) {

        stepIndex =
            clamp(
                index,
                0,
                STEPS.length -
                1
            );

        renderStep();
    }

    function completeCurrentStep() {

        if (
            stepResolved ||
            showingSectionComplete ||
            showingTutorialComplete
        ) {
            return;
        }

        stepResolved =
            true;

        completedSteps.add(
            stepIndex
        );

        renderProgress();

        if (
            isLastStepOfSection(
                stepIndex
            )
        ) {
            showSectionComplete();
            return;
        }

        transitionTimer =
            setTimeout(
                () =>
                    goToStep(
                        stepIndex +
                        1
                    ),
                STEP_ADVANCE_MS
            );
    }

    function showSectionComplete() {

        showingSectionComplete =
            true;

        spotlight.classList.remove(
            "active"
        );

        const section =
            sectionForStep(
                stepIndex
            );

        sectionEl.textContent =
            section.title;

        countEl.textContent =
            "SECTION COMPLETE";

        titleEl.textContent =
            section.short ===
            "Finish"
                ? "Full tutorial complete"
                : `${section.short} complete`;

        copyEl.textContent =
            "";

        taskEl.textContent =
            section.done;

        taskEl.style.borderColor =
            "#c9dfcf";

        taskEl.style.borderLeftColor =
            "#2e6745";

        taskEl.style.background =
            "#e8f3eb";

        taskEl.style.color =
            "#2e6745";

        hintEl.hidden =
            true;

        backButton.hidden =
            true;

        skipButton.hidden =
            true;

        renderProgress();

        if (
            section.id ===
            "finish"
        ) {
            transitionTimer =
                setTimeout(
                    showTutorialComplete,
                    650
                );

            return;
        }

        transitionTimer =
            setTimeout(
                () =>
                    goToStep(
                        stepIndex +
                        1
                    ),
                SECTION_COMPLETE_MS
            );
    }

    function showTutorialComplete() {

        showingSectionComplete =
            false;

        showingTutorialComplete =
            true;

        spotlight.classList.remove(
            "active"
        );

        taskEl.removeAttribute(
            "style"
        );

        sectionEl.textContent =
            "APP TUTORIAL";

        countEl.textContent =
            "COMPLETE";

        titleEl.textContent =
            "Ready to map";

        copyEl.textContent =
            "You have practised the full student workflow. North stays fixed pointing up, and the legend updates automatically as you add map items.";

        taskEl.textContent =
            "Finish the tutorial to return to the normal login and task-code page.";

        hintEl.hidden =
            true;

        backButton.hidden =
            false;

        backButton.disabled =
            false;

        skipButton.hidden =
            true;

        finishButton.hidden =
            false;

        renderProgress();
    }

    function checkStep() {

        if (
            !active ||
            showingSectionComplete ||
            showingTutorialComplete ||
            stepResolved
        ) {
            positionGuide();
            return;
        }

        const step =
            STEPS[
                stepIndex
            ];

        if (
            step.check?.()
        ) {
            completeCurrentStep();
        }

        positionGuide();
    }

    function skipSection() {

        clearTimeout(
            transitionTimer
        );

        const currentSection =
            sectionForStep(
                stepIndex
            );

        const sectionIndex =
            SECTIONS.findIndex(
                section =>
                    section.id ===
                    currentSection.id
            );

        const nextSection =
            SECTIONS[
                sectionIndex +
                1
            ];

        if (!nextSection) {
            showTutorialComplete();
            return;
        }

        STEPS.forEach(
            (
                step,
                index
            ) => {

                if (
                    step.section ===
                    currentSection.id
                ) {
                    completedSteps.add(
                        index
                    );
                }
            }
        );

        cleanDrafts();

        goToStep(
            firstStepOfSection(
                nextSection.id
            )
        );
    }

    function goBack() {

        clearTimeout(
            transitionTimer
        );

        if (
            showingTutorialComplete
        ) {
            showingTutorialComplete =
                false;

            cleanDrafts();

            goToStep(
                firstStepOfSection(
                    "finish"
                )
            );

            return;
        }

        if (
            stepIndex ===
            0
        ) {
            return;
        }

        const currentSection =
            sectionForStep(
                stepIndex
            );

        let targetIndex =
            stepIndex -
            1;

        if (
            isFirstStepOfSection(
                stepIndex
            )
        ) {

            const sectionIndex =
                SECTIONS.findIndex(
                    section =>
                        section.id ===
                        currentSection.id
                );

            const previousSection =
                SECTIONS[
                    Math.max(
                        0,
                        sectionIndex -
                        1
                    )
                ];

            targetIndex =
                firstStepOfSection(
                    previousSection.id
                );
        }

        cleanDrafts();

        completedSteps.delete(
            targetIndex
        );

        goToStep(
            targetIndex
        );
    }

    /* =========================================================
       STEPS
    ========================================================= */

    const STEPS = [

        /* =====================================================
           LANDMARKS
        ===================================================== */

        {
            section:
                "landmarks",

            title:
                "Add a rectangle landmark",

            copy:
                "We start with a real object so every later tool has something to work on. This practice map is temporary and never saves.",

            task:
                "Press + Add, then choose Rectangle.",

            target:
                () =>
                    !shapeFlyout.hidden

                        ? document.querySelector(
                            '.shape-choice[data-shape-tool="rectangle"]'
                        )

                        : shapeMenuButton,

            prepare:
                () => {

                    selectedItem =
                        null;

                    currentTool =
                        "select";

                    closeFlyouts();

                    renderAll();
                },

            check:
                () =>
                    currentTool ===
                    "rectangle"
        },

        {
            section:
                "landmarks",

            title:
                "Draw the landmark",

            copy:
                "Its size and position should roughly match the real place.",

            task:
                "Drag on the map to draw a clear rectangle.",

            target:
                () =>
                    canvas,

            prepare:
                () => {

                    if (
                        currentTool !==
                        "rectangle"
                    ) {
                        setTool(
                            "rectangle"
                        );
                    }
                },

            check:
                () =>
                    Boolean(
                        getPendingDraft()
                    )
        },

        {
            section:
                "landmarks",

            title:
                "Finish and label it",

            copy:
                "A useful map symbol needs a name and category. The legend is created automatically from these details.",

            task:
                "Press ✓ Done. Then enter a name, choose the best category and press Add to Map.",

            hint:
                "Example: Canteen · Facility. Any sensible answer is fine.",

            target:
                () =>
                    !objectModal.hidden

                        ? objectNameInput

                        : document.querySelector(
                            ".done-shape-button"
                        ),

            prepare:
                () => {

                    runtime.before =
                        finishedShapes().length;
                },

            check:
                () => {

                    const list =
                        finishedShapes();

                    if (
                        list.length <=
                        runtime.before
                    ) {
                        return false;
                    }

                    primaryShapeId =
                        list[
                            list.length -
                            1
                        ].id;

                    return true;
                }
        },

        /* =====================================================
           SELECT & ADJUST
        ===================================================== */

        {
            section:
                "adjust",

            title:
                "Select the landmark",

            copy:
                "The finger tool is Select / Move. Use it whenever you want to work on something already on the map.",

            task:
                "Tap or click the landmark you just made.",

            target:
                () =>
                    shapeElement(
                        primaryShapeId
                    ),

            prepare:
                () => {

                    const shape =
                        ensurePrimaryShape();

                    primaryShapeId =
                        shape.id;

                    selectedItem =
                        null;

                    setTool(
                        "select"
                    );

                    renderAll();
                },

            check:
                () =>
                    selectedItem?.kind ===
                        "shape" &&
                    selectedItem.id ===
                        primaryShapeId
        },

        {
            section:
                "adjust",

            title:
                "Move it",

            copy:
                "Selected objects can be dragged to a better position.",

            task:
                "Drag the landmark to a noticeably different place.",

            target:
                () =>
                    shapeElement(
                        primaryShapeId
                    ),

            prepare:
                () => {

                    runtime.before =
                        getShapeCentre(
                            selectPrimaryShape()
                        );
                },

            check:
                () => {

                    const shape =
                        shapeById(
                            primaryShapeId
                        );

                    return Boolean(
                        shape &&
                        distanceBetween(
                            getShapeCentre(
                                shape
                            ),
                            runtime.before
                        ) >
                        25
                    );
                }
        },

        {
            section:
                "adjust",

            title:
                "Edit its label",

            copy:
                "Edit changes the name or category without redrawing the shape.",

            task:
                "Press Edit, change the name or category, then press Save.",

            target:
                () =>
                    !editModal.hidden

                        ? editNameInput

                        : editSelectedButton,

            prepare:
                () => {

                    const shape =
                        selectPrimaryShape();

                    runtime.name =
                        shape.name;

                    runtime.meaning =
                        shape.meaning;
                },

            check:
                () => {

                    const shape =
                        shapeById(
                            primaryShapeId
                        );

                    return Boolean(
                        shape &&
                        (
                            shape.name !==
                                runtime.name ||
                            shape.meaning !==
                                runtime.meaning
                        )
                    );
                }
        },

        {
            section:
                "adjust",

            title:
                "Resize it",

            copy:
                "Adjust opens resize and rotation handles. Corner handles change both width and height.",

            task:
                "Press Adjust, then drag any resize handle until the landmark clearly changes size.",

            target:
                () =>
                    currentTool ===
                    "transform"

                        ? document.querySelector(
                            ".resize-handle"
                        )

                        : transformTool,

            prepare:
                () => {

                    runtime.before =
                        getShapeBounds(
                            selectPrimaryShape()
                        );
                },

            check:
                () => {

                    const shape =
                        shapeById(
                            primaryShapeId
                        );

                    if (
                        !shape ||
                        !runtime.before
                    ) {
                        return false;
                    }

                    const after =
                        getShapeBounds(
                            shape
                        );

                    return (
                        Math.abs(
                            after.width -
                            runtime.before.width
                        ) >
                            20 ||
                        Math.abs(
                            after.height -
                            runtime.before.height
                        ) >
                            20
                    );
                }
        },

        {
            section:
                "adjust",

            title:
                "Rotate it",

            copy:
                "The round handle above the shape turns it to match the real direction of a place.",

            task:
                "Drag the round rotation handle until the landmark is visibly turned.",

            target:
                () =>
                    document.querySelector(
                        ".rotate-handle"
                    ),

            prepare:
                () => {

                    const shape =
                        shapeById(
                            primaryShapeId
                        ) ||
                        ensurePrimaryShape();

                    selectedItem = {
                        kind:
                            "shape",

                        id:
                            shape.id
                    };

                    setTool(
                        "transform"
                    );

                    runtime.before =
                        Number(
                            shape.rotation ||
                            0
                        );

                    renderAll();
                },

            check:
                () => {

                    const shape =
                        shapeById(
                            primaryShapeId
                        );

                    return Boolean(
                        shape &&
                        Math.abs(
                            Number(
                                shape.rotation ||
                                0
                            ) -
                            runtime.before
                        ) >
                        8
                    );
                }
        },

        {
            section:
                "adjust",

            title:
                "Change colour",

            copy:
                "Colour is inside the selected item's ••• menu.",

            task:
                "Open ••• → Change colour, then choose a different colour.",

            target:
                () => {

                    if (
                        !colourPanel.hidden
                    ) {
                        return colourSwatches;
                    }

                    if (
                        contextFlyout &&
                        !contextFlyout.hidden
                    ) {
                        return colourMenuButton;
                    }

                    return contextMoreButton;
                },

            prepare:
                () => {

                    runtime.before =
                        selectPrimaryShape().fill;
                },

            check:
                () =>
                    shapeById(
                        primaryShapeId
                    )?.fill !==
                    runtime.before
        },

        {
            section:
                "adjust",

            title:
                "Copy it",

            copy:
                "Copy stores the selected item. On a computer, Ctrl/Cmd+C does the same thing.",

            task:
                "Press Copy.",

            target:
                () =>
                    copyButton,

            prepare:
                () => {

                    selectPrimaryShape();

                    runtime.before =
                        eventCount(
                            "copy"
                        );
                },

            check:
                () =>
                    eventCount(
                        "copy"
                    ) >
                    runtime.before
        },

        {
            section:
                "adjust",

            title:
                "Paste the copy",

            copy:
                "Paste creates another copy slightly offset from the original. Ctrl/Cmd+V also works on a computer.",

            task:
                "Press Paste.",

            target:
                () =>
                    pasteButton,

            prepare:
                () => {

                    selectPrimaryShape();

                    runtime.before =
                        finishedShapes().length;
                },

            check:
                () => {

                    const list =
                        finishedShapes();

                    if (
                        list.length <=
                        runtime.before
                    ) {
                        return false;
                    }

                    secondShapeId =
                        getSelectedShape()?.id ||
                        list[
                            list.length -
                            1
                        ].id;

                    return true;
                }
        },

        {
            section:
                "adjust",

            title:
                "Send it behind",

            copy:
                "Layer controls matter when symbols overlap. The tutorial places your copy over the first landmark so the change is easy to see.",

            task:
                "Open ••• and press Send to Back.",

            target:
                () =>
                    contextFlyout &&
                    !contextFlyout.hidden

                        ? sendBackwardToolbarButton

                        : contextMoreButton,

            prepare:
                () => {

                    const second =
                        overlapSecondShape();

                    secondShapeId =
                        second.id;

                    selectedItem = {
                        kind:
                            "shape",

                        id:
                            second.id
                    };

                    setTool(
                        "select"
                    );

                    renderAll();
                },

            check:
                () =>
                    shapes.findIndex(
                        shape =>
                            shape.id ===
                            secondShapeId
                    ) ===
                    0
        },

        {
            section:
                "adjust",

            title:
                "Bring it to the front",

            copy:
                "Bring to Front does the opposite and draws the selected item above the others.",

            task:
                "Open ••• and press Bring to Front.",

            target:
                () =>
                    contextFlyout &&
                    !contextFlyout.hidden

                        ? bringForwardToolbarButton

                        : contextMoreButton,

            prepare:
                () => {

                    const second =
                        ensureSecondShape();

                    secondShapeId =
                        second.id;

                    selectedItem = {
                        kind:
                            "shape",

                        id:
                            second.id
                    };

                    setTool(
                        "select"
                    );

                    renderAll();
                },

            check:
                () =>
                    shapes.findIndex(
                        shape =>
                            shape.id ===
                            secondShapeId
                    ) ===
                    shapes.length -
                    1
        },

        {
            section:
                "adjust",

            title:
                "Delete the copy",

            copy:
                "Delete removes only the selected item.",

            task:
                "Open ••• and press Delete selected.",

            target:
                () =>
                    contextFlyout &&
                    !contextFlyout.hidden

                        ? deleteButton

                        : contextMoreButton,

            prepare:
                () => {

                    const second =
                        ensureSecondShape();

                    secondShapeId =
                        second.id;

                    selectedItem = {
                        kind:
                            "shape",

                        id:
                            second.id
                    };

                    setTool(
                        "select"
                    );

                    runtime.before =
                        finishedShapes().length;

                    renderAll();
                },

            check:
                () =>
                    finishedShapes().length <
                    runtime.before
        },

        {
            section:
                "adjust",

            title:
                "Undo",

            copy:
                "Undo reverses the last map change.",

            task:
                "Press Undo to bring the deleted copy back.",

            target:
                () =>
                    undoButton,

            prepare:
                () => {

                    runtime.before =
                        finishedShapes().length;
                },

            check:
                () =>
                    finishedShapes().length >
                    runtime.before
        },

        {
            section:
                "adjust",

            title:
                "Redo",

            copy:
                "Redo repeats the change you just undid.",

            task:
                "Press Redo to delete the copy again.",

            target:
                () =>
                    redoButton,

            prepare:
                () => {

                    runtime.before =
                        finishedShapes().length;
                },

            check:
                () =>
                    finishedShapes().length <
                    runtime.before
        },

        /* =====================================================
           FREEHAND
        ===================================================== */

        {
            section:
                "freehand",

            title:
                "Choose Freehand Landmark",

            copy:
                "Freehand is for an irregular place that does not fit a simple fixed shape.",

            task:
                "Open Draw, then choose Freehand Landmark.",

            target:
                () =>
                    drawFlyout &&
                    !drawFlyout.hidden

                        ? freehandTool

                        : drawMenuButton,

            prepare:
                cleanDrafts,

            check:
                () =>
                    currentTool ===
                    "freehand"
        },

        {
            section:
                "freehand",

            title:
                "Draw an irregular outline",

            copy:
                "Trace a clear shape around the area you want to represent.",

            task:
                "Drag on the map to draw a large freehand landmark.",

            target:
                () =>
                    canvas,

            prepare:
                () => {

                    if (
                        currentTool !==
                        "freehand"
                    ) {
                        setTool(
                            "freehand"
                        );
                    }
                },

            check:
                () =>
                    Boolean(
                        getPendingDraft()
                    )
        },

        {
            section:
                "freehand",

            title:
                "Finish and label it",

            copy:
                "Freehand landmarks use the same Select, Adjust, Colour, Copy and layer tools as fixed shapes.",

            task:
                "Press ✓ Done, name it, choose a category and press Add to Map.",

            target:
                () =>
                    !objectModal.hidden

                        ? objectNameInput

                        : document.querySelector(
                            ".done-shape-button"
                        ),

            prepare:
                () => {

                    runtime.before =
                        finishedShapes().length;
                },

            check:
                () => {

                    const list =
                        finishedShapes();

                    if (
                        list.length <=
                        runtime.before
                    ) {
                        return false;
                    }

                    freehandId =
                        list[
                            list.length -
                            1
                        ].id;

                    return true;
                }
        },

        /* =====================================================
           PATHS & ROADS
        ===================================================== */

        {
            section:
                "routes",

            title:
                "Open Path settings",

            copy:
                "Paths are dashed routes for walkways or trails.",

            task:
                "Open Draw, then choose Path.",

            target:
                () =>
                    drawFlyout &&
                    !drawFlyout.hidden

                        ? pathMenuButton

                        : drawMenuButton,

            prepare:
                cleanDrafts,

            check:
                () =>
                    !pathFlyout.hidden
        },

        {
            section:
                "routes",

            title:
                "Start the path",

            copy:
                "You can choose path colour and thickness before drawing.",

            task:
                "If needed, open Draw → Path again. Then choose any settings and press Start Drawing Path.",

            target:
                () => {

                    if (
                        !pathFlyout.hidden
                    ) {
                        return startPathButton;
                    }

                    if (
                        drawFlyout &&
                        !drawFlyout.hidden
                    ) {
                        return pathMenuButton;
                    }

                    return drawMenuButton;
                },

            check:
                () =>
                    currentTool ===
                    "path"
        },

        {
            section:
                "routes",

            title:
                "Draw and label the path",

            copy:
                "Draw the route someone would walk. A few bends make the path easier to practise with later.",

            task:
                "Drag a clear path. Then type its name and press Add to Map.",

            target:
                () =>
                    !routeModal.hidden

                        ? routeNameInput

                        : canvas,

            prepare:
                () => {

                    if (
                        currentTool !==
                        "path"
                    ) {
                        setTool(
                            "path"
                        );
                    }

                    runtime.before =
                        finishedRoutes()
                            .filter(
                                route =>
                                    route.kind ===
                                    "path"
                            )
                            .length;
                },

            check:
                () => {

                    const paths =
                        finishedRoutes()
                            .filter(
                                route =>
                                    route.kind ===
                                    "path"
                            );

                    if (
                        paths.length <=
                        runtime.before
                    ) {
                        return false;
                    }

                    pathId =
                        paths[
                            paths.length -
                            1
                        ].id;

                    return true;
                }
        },

        {
            section:
                "routes",

            title:
                "Select the path",

            copy:
                "Routes also use Select before you move, edit, copy, delete, extend or resize them.",

            task:
                "Tap or click the path you just made.",

            target:
                () =>
                    routeElement(
                        pathId
                    ),

            prepare:
                () => {

                    const route =
                        ensurePath();

                    pathId =
                        route.id;

                    selectedItem =
                        null;

                    setTool(
                        "select"
                    );

                    renderAll();
                },

            check:
                () =>
                    selectedItem?.kind ===
                        "route" &&
                    selectedItem.id ===
                        pathId
        },

        {
            section:
                "routes",

            title:
                "Extend the path",

            copy:
                "Extend adds more route onto either end without redrawing the whole path.",

            task:
                "Press Extend, then drag from one end of the path to make it longer.",

            hint:
                "Start your drag close to either endpoint.",

            target:
                () =>
                    currentTool ===
                    "extend-route"

                        ? canvas

                        : extendRouteButton,

            prepare:
                () => {

                    runtime.before =
                        selectPath()
                            .points
                            .length;
                },

            check:
                () =>
                    routeById(
                        pathId
                    )?.points.length >
                    runtime.before
        },

        {
            section:
                "routes",

            title:
                "Resize the whole path",

            copy:
                "Route Resize changes overall size without changing the route's basic shape.",

            task:
                "Press Resize, then press + beside Overall size.",

            target:
                () =>
                    resizeRouteFlyout &&
                    !resizeRouteFlyout.hidden

                        ? resizeRouteFlyout.querySelector(
                            '[data-route-scale="1.1"]'
                        )

                        : resizeRouteButton,

            prepare:
                () => {

                    runtime.before =
                        routeBounds(
                            selectPath()
                        );
                },

            check:
                () => {

                    const route =
                        routeById(
                            pathId
                        );

                    if (!route) {
                        return false;
                    }

                    const after =
                        routeBounds(
                            route
                        );

                    return (
                        Math.abs(
                            after.width -
                            runtime.before.width
                        ) >
                            8 ||
                        Math.abs(
                            after.height -
                            runtime.before.height
                        ) >
                            8
                    );
                }
        },

        {
            section:
                "routes",

            title:
                "Change path thickness",

            copy:
                "The same Resize panel can make a path or road line thicker or thinner.",

            task:
                "If Resize is closed, open it again. Then press + beside Thickness.",

            target:
                () =>
                    resizeRouteFlyout &&
                    !resizeRouteFlyout.hidden

                        ? resizeRouteFlyout.querySelector(
                            '[data-route-width="1"]'
                        )

                        : resizeRouteButton,

            prepare:
                () => {

                    runtime.before =
                        Number(
                            selectPath()
                                .width
                        );
                },

            check:
                () =>
                    Number(
                        routeById(
                            pathId
                        )?.width
                    ) !==
                    runtime.before
        },

        {
            section:
                "routes",

            title:
                "Open Road settings",

            copy:
                "Roads use a solid double-edged line instead of a dashed path.",

            task:
                "Open Draw, then choose Road.",

            target:
                () =>
                    drawFlyout &&
                    !drawFlyout.hidden

                        ? roadMenuButton

                        : drawMenuButton,

            prepare:
                () => {

                    currentTool =
                        "select";

                    closeFlyouts();

                    renderAll();
                },

            check:
                () =>
                    !roadFlyout.hidden
        },

        {
            section:
                "routes",

            title:
                "Start the road",

            copy:
                "Road colour and width can be chosen before drawing.",

            task:
                "If needed, open Draw → Road again. Then choose any settings and press Start Drawing Road.",

            target:
                () => {

                    if (
                        !roadFlyout.hidden
                    ) {
                        return startRoadButton;
                    }

                    if (
                        drawFlyout &&
                        !drawFlyout.hidden
                    ) {
                        return roadMenuButton;
                    }

                    return drawMenuButton;
                },

            check:
                () =>
                    currentTool ===
                    "road"
        },

        {
            section:
                "routes",

            title:
                "Draw and label the road",

            copy:
                "Roads can later be selected, moved, edited, copied, extended and resized just like the path you practised.",

            task:
                "Drag a road. Then type its name and press Add to Map.",

            target:
                () =>
                    !routeModal.hidden

                        ? routeNameInput

                        : canvas,

            prepare:
                () => {

                    if (
                        currentTool !==
                        "road"
                    ) {
                        setTool(
                            "road"
                        );
                    }

                    runtime.before =
                        finishedRoutes()
                            .filter(
                                route =>
                                    route.kind ===
                                    "road"
                            )
                            .length;
                },

            check:
                () => {

                    const roads =
                        finishedRoutes()
                            .filter(
                                route =>
                                    route.kind ===
                                    "road"
                            );

                    if (
                        roads.length <=
                        runtime.before
                    ) {
                        return false;
                    }

                    roadId =
                        roads[
                            roads.length -
                            1
                        ].id;

                    return true;
                }
        },

        /* =====================================================
           HAZARDS
        ===================================================== */

        {
            section:
                "hazards",

            title:
                "Choose Hazard",

            copy:
                "Hazards mark one exact place pupils should notice for safety.",

            task:
                "Open + Add, then choose Hazard.",

            target:
                () =>
                    !shapeFlyout.hidden

                        ? hazardTool

                        : shapeMenuButton,

            prepare:
                cleanDrafts,

            check:
                () =>
                    currentTool ===
                    "hazard"
        },

        {
            section:
                "hazards",

            title:
                "Place the hazard",

            copy:
                "Unlike a landmark, a hazard is one point on the map.",

            task:
                "Tap or click the map where the hazard should be.",

            target:
                () =>
                    canvas,

            prepare:
                () => {

                    if (
                        currentTool !==
                        "hazard"
                    ) {
                        setTool(
                            "hazard"
                        );
                    }
                },

            check:
                () =>
                    !hazardModal.hidden
        },

        {
            section:
                "hazards",

            title:
                "Explain the hazard",

            copy:
                "Give the hazard a short name. The optional note explains why it is dangerous. Hazards also appear in the legend.",

            task:
                "Enter a hazard name and optional reason, then press Add to Map.",

            hint:
                "Example: Wet Floor · Slippery after rain.",

            target:
                () =>
                    hazardNameInput,

            prepare:
                () => {

                    runtime.before =
                        hazards.length;
                },

            check:
                () => {

                    if (
                        hazards.length <=
                        runtime.before
                    ) {
                        return false;
                    }

                    hazardId =
                        hazards[
                            hazards.length -
                            1
                        ].id;

                    return true;
                }
        },

        /* =====================================================
           FINISH & NAVIGATE
        ===================================================== */

        {
            section:
                "finish",

            title:
                "Use the Reference Map",

            copy:
                "Hold Reference Map to compare with the real layout. It disappears when you release it. The red North arrow stays fixed pointing up.",

            task:
                "Press and hold Reference Map for about half a second, then release.",

            target:
                () =>
                    referenceButton,

            prepare:
                () => {

                    ensureFinishExamples();

                    referenceButton.hidden =
                        false;

                    runtime.before =
                        eventCount(
                            "reference"
                        );
                },

            check:
                () =>
                    eventCount(
                        "reference"
                    ) >
                    runtime.before
        },

        {
            section:
                "finish",

            title:
                "Save Now",

            copy:
                "Real projects save automatically. Save Now asks for an immediate save.",

            task:
                "Open ••• More and press Save now. It is a dummy in the tutorial.",

            target:
                () =>
                    moreFlyout.hidden

                        ? moreMenuButton

                        : saveNowButton,

            prepare:
                () => {

                    enableTutorialActionButtons();

                    runtime.before =
                        eventCount(
                            "save"
                        );
                },

            check:
                () =>
                    eventCount(
                        "save"
                    ) >
                    runtime.before
        },

        {
            section:
                "finish",

            title:
                "Submit to teacher",

            copy:
                "Submit is the final hand-in action for a real task.",

            task:
                "Open ••• More and press Submit to teacher. Nothing is actually submitted here.",

            target:
                () =>
                    moreFlyout.hidden

                        ? moreMenuButton

                        : submitButton,

            prepare:
                () => {

                    enableTutorialActionButtons();

                    runtime.before =
                        eventCount(
                            "submit"
                        );
                },

            check:
                () =>
                    eventCount(
                        "submit"
                    ) >
                    runtime.before
        },

        {
            section:
                "finish",

            title:
                "Download PNG",

            copy:
                "Download PNG makes an image copy of the map. It does not replace the project saved in the app.",

            task:
                "Open ••• More and press Download PNG. No file is created during the tutorial.",

            target:
                () =>
                    moreFlyout.hidden

                        ? moreMenuButton

                        : downloadButton,

            prepare:
                () => {

                    enableTutorialActionButtons();

                    runtime.before =
                        eventCount(
                            "download"
                        );
                },

            check:
                () =>
                    eventCount(
                        "download"
                    ) >
                    runtime.before
        },

        {
            section:
                "finish",

            title:
                "My Projects",

            copy:
                "My Projects returns a pupil to the current task folder so they can reopen their submission or correction work.",

            task:
                "Open ••• More and press ← My Projects. The tutorial will keep you here.",

            target:
                () =>
                    moreFlyout.hidden

                        ? moreMenuButton

                        : backToProfileButton,

            prepare:
                () => {

                    enableTutorialActionButtons();

                    runtime.before =
                        eventCount(
                            "myprojects"
                        );
                },

            check:
                () =>
                    eventCount(
                        "myprojects"
                    ) >
                    runtime.before
        },

        {
            section:
                "finish",

            title:
                "Clear Entire Map",

            copy:
                "Clear removes everything and normally asks for confirmation first.",

            task:
                "Open ••• More and press Clear Entire Map. Your tutorial work will stay on screen.",

            target:
                () =>
                    moreFlyout.hidden

                        ? moreMenuButton

                        : clearButton,

            prepare:
                () => {

                    enableTutorialActionButtons();

                    runtime.before =
                        eventCount(
                            "clear"
                        );
                },

            check:
                () =>
                    eventCount(
                        "clear"
                    ) >
                    runtime.before
        }
    ];

    /* =========================================================
       START / FINISH
    ========================================================= */

    function startTutorial() {

        if (active) {
            return;
        }

        active =
            true;

        completedSteps.clear();

        eventCounts.clear();

        primaryShapeId =
            null;

        secondShapeId =
            null;

        freehandId =
            null;

        pathId =
            null;

        roadId =
            null;

        hazardId =
            null;

        clearTimeout(
            saveTimer
        );

        appMode =
            "student";

        studentReadOnly =
            false;

        editLockOwned =
            true;

        projectHandedIn =
            false;

        currentTask = {
            id:
                "tutorial",

            title:
                "App Tutorial Practice Map",

            task_code:
                "TUTORIAL",

            instructions:
                "Practice every student map tool. Nothing here is saved.",

            reference_path:
                null,

            allowed_tools: {
                move:true,
                shapes:true,
                freehand:true,
                path:true,
                road:true,
                colour:true,
                transform:true,
                layers:true,
                hazard:true,
                reference:true,
                download:true
            }
        };

        currentSubmission =
            null;

        allowedTools = {
            ...currentTask.allowed_tools
        };

        studentInfo = {
            name:
                "Tutorial",

            className:
                "Practice",

            group:
                ""
        };

        shapes =
            [];

        routes =
            [];

        hazards =
            [];

        annotations =
            [];

        nextShapeId =
            1;

        nextRouteId =
            1;

        nextHazardId =
            1;

        selectedItem =
            null;

        pendingDraftId =
            null;

        pendingRouteId =
            null;

        pendingHazard =
            null;

        draftOriginState =
            null;

        undoStack =
            [];

        redoStack =
            [];

        currentTool =
            "select";

        currentReferenceUrl =
            tutorialReferenceDataUrl();

        referenceOverlay.src =
            currentReferenceUrl;

        referenceOverlay.hidden =
            true;

        startupModal.hidden =
            true;

        teacherLoginModal.hidden =
            true;

        guestModal.hidden =
            true;

        groupModal.hidden =
            true;

        studentProfilePage.hidden =
            true;

        teacherDashboard.hidden =
            true;

        teacherGallery.hidden =
            true;

        studentWorkspace.hidden =
            false;

        taskIntro.hidden =
            false;

        teacherReviewToolbar.hidden =
            true;

        teacherFeedbackPanel.hidden =
            true;

        studentReviewPanel.hidden =
            true;

        editLockBanner.hidden =
            true;

        floatingToolbar.hidden =
            false;

        taskTitle.textContent =
            "App Tutorial Practice Map";

        taskInstructions.textContent =
            "Follow the highlighted prompt. The tutorial moves on automatically when you do the correct action.";

        taskMembers.textContent =
            "Practice only · Nothing is saved or submitted";

        studentBadge.textContent =
            "Tutorial";

        document.body.classList.remove(
            "modal-open"
        );

        document.body.classList.add(
            `${PREFIX}-active`
        );

        setCloudStatus(
            "Tutorial",
            "good"
        );

        closeTransientUi();

        renderAll();

        applyToolPermissions();

        applyStudentEditLockUI();

        enableTutorialActionButtons();

        panel.hidden =
            false;

        stepIndex =
            0;

        pollTimer =
            setInterval(
                checkStep,
                POLL_MS
            );

        window.scrollTo({
            top:
                0,

            behavior:
                "smooth"
        });

        renderStep();
    }

    function finishTutorial() {

        clearInterval(
            pollTimer
        );

        pollTimer =
            null;

        clearTimeout(
            transitionTimer
        );

        transitionTimer =
            null;

        active =
            false;

        sessionStorage.removeItem(
            RESTART_KEY
        );

        window.location.reload();
    }

    function restartTutorial() {

        sessionStorage.setItem(
            RESTART_KEY,
            "1"
        );

        window.location.reload();
    }

    /* =========================================================
       EVENTS
    ========================================================= */

    tutorialEntry.addEventListener(
        "click",
        startTutorial
    );

    backButton.addEventListener(
        "click",
        goBack
    );

    skipButton.addEventListener(
        "click",
        skipSection
    );

    finishButton.addEventListener(
        "click",
        finishTutorial
    );

    restartButton.addEventListener(
        "click",
        () => {

            if (
                confirm(
                    "Restart the tutorial from the beginning?"
                )
            ) {
                restartTutorial();
            }
        }
    );

    exitButton.addEventListener(
        "click",
        () => {

            if (
                confirm(
                    "Exit the tutorial and return to login?"
                )
            ) {
                finishTutorial();
            }
        }
    );

    window.addEventListener(
        "resize",
        positionGuide
    );

    window.addEventListener(
        "scroll",
        positionGuide,
        {
            passive:true
        }
    );

    document.addEventListener(
        "click",
        () => {

            if (!active) {
                return;
            }

            setTimeout(
                checkStep,
                15
            );

            setTimeout(
                positionGuide,
                45
            );
        }
    );

    canvas.addEventListener(
        "pointerup",
        () => {

            if (active) {
                setTimeout(
                    checkStep,
                    25
                );
            }
        }
    );

    if (
        sessionStorage.getItem(
            RESTART_KEY
        ) ===
        "1"
    ) {
        sessionStorage.removeItem(
            RESTART_KEY
        );

        setTimeout(
            startTutorial,
            400
        );
    }
})();