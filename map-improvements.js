(() => {
    /*
     * OE Map Maker — focused UX + review enhancements
     * Loaded AFTER app.js.
     *
     * Adds:
     * 1) concise Select / Add / Draw / Undo / Redo / More toolbar
     * 2) context-sensitive edit actions
     * 3) extend + resize for paths and roads
     * 4) internal map copy/paste + Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+D
     * 5) teacher reference preview for Phone / iPad / Computer
     * 6) point-specific teacher comments stored in teacher_annotations
     *
     * No Supabase schema migration is required.
     */

    const ENHANCE_PREFIX = "oe-enhance";

    const makeButton = (
        id,
        className,
        html,
        ariaLabel = ""
    ) => {
        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.id =
            id;

        button.className =
            className;

        button.innerHTML =
            html;

        if (ariaLabel) {
            button.setAttribute(
                "aria-label",
                ariaLabel
            );
        }

        return button;
    };


    const makeCloseButton = () => {
        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.className =
            "flyout-close";

        button.textContent =
            "×";

        button.setAttribute(
            "data-close-flyouts",
            ""
        );

        return button;
    };


    const setButtonContent = (
        button,
        icon,
        label
    ) => {
        button.innerHTML =
            `<span class="toolbar-icon">${icon}</span>` +
            `<span class="toolbar-tooltip">${label}</span>`;
    };


    const isTypingTarget = (
        target
    ) => {
        return Boolean(
            target instanceof
                HTMLInputElement ||
            target instanceof
                HTMLTextAreaElement ||
            target instanceof
                HTMLSelectElement ||
            target?.isContentEditable
        );
    };


    const selectedShape = () =>
        getSelectedShape();


    const selectedRoute = () =>
        getSelectedRoute();


    const selectedHazard = () =>
        getSelectedHazard();


    const routeToolAllowed = (
        route
    ) => {
        if (!route) {
            return false;
        }

        return route.kind === "road"
            ? Boolean(
                allowedTools.road
            )
            : Boolean(
                allowedTools.path
            );
    };


    /* =====================================================
       STYLES
    ===================================================== */

    const style =
        document.createElement(
            "style"
        );

    style.id =
        `${ENHANCE_PREFIX}-styles`;

    style.textContent = `
        /* Concise permanent toolbar */
        #floatingToolbar {
            top:12px;
            bottom:auto;
            width:54px;
            height:auto;
            justify-content:flex-start;
            padding:6px;
            opacity:.55;
        }

        #floatingToolbar .toolbar-button {
            flex:0 0 40px;
            width:40px;
            min-height:40px;
            max-height:40px;
        }

        #floatingToolbar .toolbar-divider {
            width:28px;
            margin:2px 0;
        }

        /* Add / Draw flyout buttons */
        .${ENHANCE_PREFIX}-flyout-button {
            width:100%;
            min-height:40px;
            display:flex;
            align-items:center;
            gap:9px;
            margin-top:7px;
            padding:8px 10px;
            border:1px solid #c8c7c0;
            border-radius:8px;
            background:#fffdf8;
            color:var(--ink);
            font:inherit;
            font-size:13px;
            font-weight:750;
            text-align:left;
            cursor:pointer;
        }

        .${ENHANCE_PREFIX}-flyout-button:hover {
            border-color:#89958d;
            background:#f5f7f3;
        }

        .${ENHANCE_PREFIX}-flyout-button:disabled {
            opacity:.42;
            cursor:not-allowed;
        }

        /* Selected-item contextual bar */
        .${ENHANCE_PREFIX}-context-toolbar {
            position:absolute;
            z-index:34;
            left:78px;
            bottom:12px;
            max-width:calc(100% - 170px);
            display:flex;
            align-items:center;
            gap:5px;
            padding:6px;
            border:1px solid rgba(0,0,0,.16);
            border-radius:11px;
            background:rgba(255,253,248,.96);
            box-shadow:0 5px 18px rgba(0,0,0,.14);
            backdrop-filter:blur(6px);
        }

        .${ENHANCE_PREFIX}-context-toolbar[hidden] {
            display:none !important;
        }

        .${ENHANCE_PREFIX}-context-action {
            min-height:34px;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            gap:5px;
            padding:6px 9px;
            border:1px solid #c8c7c0;
            border-radius:7px;
            background:#fffdf8;
            color:var(--ink);
            font:inherit;
            font-size:12px;
            font-weight:800;
            white-space:nowrap;
            cursor:pointer;
        }

        .${ENHANCE_PREFIX}-context-action:hover {
            border-color:#89958d;
            background:#f2f5f1;
        }

        .${ENHANCE_PREFIX}-context-action.active {
            border-color:var(--forest);
            background:#edf4ee;
            color:var(--forest-dark);
        }

        .${ENHANCE_PREFIX}-context-action:disabled {
            opacity:.42;
            cursor:not-allowed;
        }

        .${ENHANCE_PREFIX}-icon-only {
            min-width:36px;
            padding-left:8px;
            padding-right:8px;
        }

        .${ENHANCE_PREFIX}-context-flyout {
            left:78px;
            top:auto;
            bottom:58px;
            transform:none;
            width:270px;
        }

        .${ENHANCE_PREFIX}-context-flyout .toolbar-button {
            position:static;
            width:100%;
            min-height:38px;
            max-height:none;
            display:flex;
            align-items:center;
            justify-content:flex-start;
            gap:8px;
            margin-top:7px;
            padding:8px 10px;
            border:1px solid #c8c7c0;
            border-radius:8px;
            background:#fffdf8;
            color:var(--ink);
            font:inherit;
            font-size:13px;
            font-weight:750;
        }

        .${ENHANCE_PREFIX}-context-flyout .toolbar-button:hover {
            background:#f5f7f3;
        }

        .${ENHANCE_PREFIX}-context-flyout .toolbar-tooltip {
            position:static;
            transform:none;
            display:block;
            padding:0;
            background:none;
            color:inherit;
            font-size:13px;
        }

        .${ENHANCE_PREFIX}-context-flyout #deleteButton {
            border-color:#d7aaa3;
            color:#8c3d34;
        }

        /* Route resize */
        .${ENHANCE_PREFIX}-resize-flyout {
            left:78px;
            top:auto;
            bottom:58px;
            transform:none;
            width:270px;
        }

        .${ENHANCE_PREFIX}-route-control {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:14px;
            padding:9px 0;
            border-top:1px solid var(--line);
        }

        .${ENHANCE_PREFIX}-route-control:first-of-type {
            margin-top:9px;
        }

        .${ENHANCE_PREFIX}-route-control > span {
            font-size:12px;
            font-weight:800;
        }

        .${ENHANCE_PREFIX}-route-buttons {
            display:flex;
            gap:5px;
        }

        .${ENHANCE_PREFIX}-route-buttons button {
            width:38px;
            height:34px;
            border:1px solid #bfc4bf;
            border-radius:7px;
            background:#fff;
            color:var(--ink);
            font-size:19px;
            font-weight:800;
            cursor:pointer;
        }

        .${ENHANCE_PREFIX}-route-buttons button:hover {
            border-color:var(--forest);
            background:#f2f6f2;
        }

        /* Teacher point comments */
        .${ENHANCE_PREFIX}-comment-pin {
            cursor:pointer;
            pointer-events:all;
        }

        .${ENHANCE_PREFIX}-comment-pin circle {
            fill:#b95a4c;
            stroke:#fff;
            stroke-width:4;
            filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));
        }

        .${ENHANCE_PREFIX}-comment-pin text {
            fill:#fff;
            font-size:17px;
            font-weight:900;
            text-anchor:middle;
            dominant-baseline:middle;
            pointer-events:none;
            user-select:none;
        }

        .${ENHANCE_PREFIX}-comment-editor {
            position:absolute;
            z-index:45;
            width:min(300px,calc(100% - 24px));
            padding:10px;
            border:1px solid rgba(0,0,0,.2);
            border-radius:10px;
            background:#fffdf8;
            box-shadow:0 9px 28px rgba(0,0,0,.22);
        }

        .${ENHANCE_PREFIX}-comment-head {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:10px;
            margin-bottom:7px;
        }

        .${ENHANCE_PREFIX}-comment-head strong {
            font-size:13px;
        }

        .${ENHANCE_PREFIX}-comment-head button {
            width:28px;
            height:28px;
            border:0;
            border-radius:6px;
            background:#eeeae1;
            font-size:20px;
            cursor:pointer;
        }

        .${ENHANCE_PREFIX}-comment-editor textarea {
            width:100%;
            min-height:90px;
            padding:8px 9px;
            border:1px solid #bbbdb7;
            border-radius:7px;
            background:#fff;
            font:inherit;
            font-size:13px;
            line-height:1.4;
            resize:vertical;
        }

        .${ENHANCE_PREFIX}-comment-actions {
            display:flex;
            justify-content:flex-end;
            gap:7px;
            margin-top:8px;
        }

        .${ENHANCE_PREFIX}-comment-actions button {
            min-height:34px;
            padding:6px 10px;
            border-radius:7px;
            font:inherit;
            font-size:12px;
            font-weight:800;
            cursor:pointer;
        }

        .${ENHANCE_PREFIX}-comment-delete {
            margin-right:auto;
            border:1px solid #d7aaa3;
            background:#fff;
            color:#8c3d34;
        }

        .${ENHANCE_PREFIX}-comment-save {
            border:1px solid var(--forest-dark);
            background:var(--forest);
            color:#fff;
        }

        /* Teacher reference device preview */
        .${ENHANCE_PREFIX}-reference-panel {
            position:absolute;
            z-index:44;
            right:12px;
            bottom:58px;
            width:min(760px,calc(100% - 24px));
            max-height:calc(100% - 78px);
            overflow:auto;
            padding:12px;
            border:1px solid rgba(0,0,0,.18);
            border-radius:12px;
            background:rgba(255,253,248,.98);
            box-shadow:0 10px 30px rgba(0,0,0,.22);
            backdrop-filter:blur(7px);
        }

        .${ENHANCE_PREFIX}-reference-head {
            display:flex;
            align-items:flex-start;
            justify-content:space-between;
            gap:12px;
            margin-bottom:9px;
        }

        .${ENHANCE_PREFIX}-reference-head strong {
            display:block;
            font-size:14px;
        }

        .${ENHANCE_PREFIX}-reference-head span {
            display:block;
            margin-top:2px;
            color:var(--muted);
            font-size:11px;
        }

        .${ENHANCE_PREFIX}-reference-close {
            width:30px;
            height:30px;
            border:0;
            border-radius:7px;
            background:#eeeae1;
            font-size:20px;
            cursor:pointer;
        }

        .${ENHANCE_PREFIX}-device-tabs {
            display:flex;
            gap:6px;
            margin-bottom:10px;
        }

        .${ENHANCE_PREFIX}-device-tabs button {
            min-height:34px;
            padding:6px 10px;
            border:1px solid #c8c7c0;
            border-radius:7px;
            background:#fff;
            font:inherit;
            font-size:12px;
            font-weight:800;
            cursor:pointer;
        }

        .${ENHANCE_PREFIX}-device-tabs button.active {
            border-color:var(--forest);
            background:#edf4ee;
            color:var(--forest-dark);
        }

        .${ENHANCE_PREFIX}-device-note {
            margin:0 0 7px;
            color:var(--muted);
            font-size:11px;
            font-weight:750;
        }

        .${ENHANCE_PREFIX}-device-frame {
            margin:0 auto;
            overflow:hidden;
            border:4px solid #343936;
            border-radius:12px;
            background:#fff;
            transition:max-width .18s ease,aspect-ratio .18s ease;
        }

        .${ENHANCE_PREFIX}-device-frame[data-device="phone"] {
            max-width:390px;
            aspect-ratio:390 / 520;
        }

        .${ENHANCE_PREFIX}-device-frame[data-device="tablet"] {
            max-width:820px;
            aspect-ratio:820 / 520;
        }

        .${ENHANCE_PREFIX}-device-frame[data-device="desktop"] {
            max-width:100%;
            aspect-ratio:1600 / 675;
        }

        .${ENHANCE_PREFIX}-device-frame img {
            display:block;
            width:100%;
            height:100%;
            object-fit:fill;
        }

        /* Student point-comment list */
        .${ENHANCE_PREFIX}-student-comments {
            margin-top:10px;
            padding-top:10px;
            border-top:1px solid #ccd9cf;
        }

        .${ENHANCE_PREFIX}-student-comments > strong {
            display:block;
            margin-bottom:6px;
            font-size:12px;
        }

        .${ENHANCE_PREFIX}-student-comments ol {
            margin:0;
            padding-left:22px;
        }

        .${ENHANCE_PREFIX}-student-comments li {
            margin:4px 0;
            color:var(--ink);
            font-size:12px;
            line-height:1.45;
        }

        /* Teacher marking toolbar stays compact */
        #teacherReviewToolbar {
            flex-wrap:wrap;
            justify-content:flex-end;
            max-width:calc(100% - 24px);
        }

        #teacherReviewToolbar .review-tool {
            min-height:34px;
            padding:6px 9px;
            white-space:nowrap;
        }

        @media (max-width:700px) {
            #floatingToolbar {
                top:6px;
                bottom:auto;
                width:49px;
            }

            #floatingToolbar .toolbar-button {
                width:37px;
                min-height:37px;
                max-height:37px;
                flex-basis:37px;
            }

            .${ENHANCE_PREFIX}-context-toolbar {
                left:61px;
                right:6px;
                bottom:6px;
                max-width:none;
                overflow-x:auto;
                justify-content:flex-start;
            }

            .${ENHANCE_PREFIX}-context-action span {
                display:none;
            }

            .${ENHANCE_PREFIX}-context-action {
                min-width:36px;
                padding-left:8px;
                padding-right:8px;
            }

            .${ENHANCE_PREFIX}-context-flyout,
            .${ENHANCE_PREFIX}-resize-flyout {
                left:61px;
                bottom:52px;
                width:min(270px,calc(100% - 68px));
            }

            .${ENHANCE_PREFIX}-reference-panel {
                left:7px;
                right:7px;
                bottom:56px;
                width:auto;
                max-height:calc(100% - 68px);
            }

            #teacherReviewToolbar {
                left:7px;
                right:7px;
                bottom:7px;
                overflow-x:auto;
                flex-wrap:nowrap;
                justify-content:flex-start;
            }
        }
    `;

    document.head.appendChild(
        style
    );


    /* =====================================================
       CONCISE STUDENT TOOLBAR
    ===================================================== */

    setButtonContent(
        shapeMenuButton,
        "＋",
        "Add"
    );

    shapeMenuButton.setAttribute(
        "aria-label",
        "Add landmark or hazard"
    );


    const shapeFlyoutHeading =
        shapeFlyout.querySelector(
            ".flyout-heading > div"
        );

    if (shapeFlyoutHeading) {
        shapeFlyoutHeading.innerHTML =
            "<strong>Add to Map</strong>" +
            "<span>Landmark symbols and hazards</span>";
    }


    const shapeGrid =
        shapeFlyout.querySelector(
            ".shape-grid"
        );


    hazardTool.className =
        `${ENHANCE_PREFIX}-flyout-button`;

    hazardTool.innerHTML =
        "<span>⚠</span><span>Hazard</span>";

    shapeFlyout.appendChild(
        hazardTool
    );


    const drawMenuButton =
        makeButton(
            `${ENHANCE_PREFIX}-draw-menu`,
            "toolbar-button",
            '<span class="toolbar-icon">✎</span>' +
            '<span class="toolbar-tooltip">Draw</span>',
            "Draw freehand landmark, path or road"
        );


    const drawFlyout =
        document.createElement(
            "aside"
        );

    drawFlyout.id =
        `${ENHANCE_PREFIX}-draw-flyout`;

    drawFlyout.className =
        "tool-flyout compact-flyout";

    drawFlyout.hidden =
        true;

    drawFlyout.innerHTML =
        '<div class="flyout-heading">' +
            "<div>" +
                "<strong>Draw</strong>" +
                "<span>Freehand landmarks, paths and roads</span>" +
            "</div>" +
        "</div>";


    drawFlyout
        .querySelector(
            ".flyout-heading"
        )
        .appendChild(
            makeCloseButton()
        );


    [
        [
            freehandTool,
            "✎",
            "Freehand Landmark"
        ],
        [
            pathMenuButton,
            "┄",
            "Path"
        ],
        [
            roadMenuButton,
            "═",
            "Road"
        ]
    ]
        .forEach(
            (
                [
                    button,
                    icon,
                    label
                ]
            ) => {
                button.className =
                    `${ENHANCE_PREFIX}-flyout-button`;

                button.innerHTML =
                    `<span>${icon}</span>` +
                    `<span>${label}</span>`;

                drawFlyout.appendChild(
                    button
                );
            }
        );


    canvasWrap.appendChild(
        drawFlyout
    );


    flyouts.push(
        drawFlyout
    );


    drawMenuButton.addEventListener(
        "click",
        () => {
            if (
                !blockWhileDraftExists()
            ) {
                toggleFlyout(
                    drawFlyout
                );
            }
        }
    );


    /* =====================================================
       CONTEXTUAL ITEM ACTIONS
    ===================================================== */

    const contextToolbar =
        document.createElement(
            "nav"
        );

    contextToolbar.id =
        `${ENHANCE_PREFIX}-context-toolbar`;

    contextToolbar.className =
        `${ENHANCE_PREFIX}-context-toolbar`;

    contextToolbar.setAttribute(
        "aria-label",
        "Selected item actions"
    );

    contextToolbar.hidden =
        true;


    editSelectedButton.className =
        `${ENHANCE_PREFIX}-context-action`;

    editSelectedButton.innerHTML =
        "✎ <span>Edit</span>";

    editSelectedButton.title =
        "Edit name or details";


    const copyButton =
        makeButton(
            `${ENHANCE_PREFIX}-copy`,
            `${ENHANCE_PREFIX}-context-action`,
            "⧉ <span>Copy</span>",
            "Copy selected item"
        );

    copyButton.title =
        "Copy selected item (Ctrl/Cmd+C)";


    const pasteButton =
        makeButton(
            `${ENHANCE_PREFIX}-paste`,
            `${ENHANCE_PREFIX}-context-action`,
            "▣ <span>Paste</span>",
            "Paste copied item"
        );

    pasteButton.title =
        "Paste copied item (Ctrl/Cmd+V)";


    transformTool.className =
        `${ENHANCE_PREFIX}-context-action`;

    transformTool.innerHTML =
        "⤢ <span>Adjust</span>";

    transformTool.title =
        "Resize or rotate landmark";


    const extendRouteButton =
        makeButton(
            `${ENHANCE_PREFIX}-extend-route`,
            `${ENHANCE_PREFIX}-context-action`,
            "↗ <span>Extend</span>",
            "Extend selected path or road"
        );


    const resizeRouteButton =
        makeButton(
            `${ENHANCE_PREFIX}-resize-route`,
            `${ENHANCE_PREFIX}-context-action`,
            "↔ <span>Resize</span>",
            "Resize selected path or road"
        );


    const contextMoreButton =
        makeButton(
            `${ENHANCE_PREFIX}-context-more`,
            `${ENHANCE_PREFIX}-context-action ${ENHANCE_PREFIX}-icon-only`,
            "•••",
            "More selected item actions"
        );


    contextToolbar.append(
        editSelectedButton,
        copyButton,
        pasteButton,
        transformTool,
        extendRouteButton,
        resizeRouteButton,
        contextMoreButton
    );


    canvasWrap.appendChild(
        contextToolbar
    );


    const contextFlyout =
        document.createElement(
            "aside"
        );

    contextFlyout.id =
        `${ENHANCE_PREFIX}-context-flyout`;

    contextFlyout.className =
        `tool-flyout ${ENHANCE_PREFIX}-context-flyout`;

    contextFlyout.hidden =
        true;

    contextFlyout.innerHTML =
        '<div class="flyout-heading">' +
            "<div>" +
                "<strong>Selected item</strong>" +
                "<span>Less-used actions</span>" +
            "</div>" +
        "</div>";


    contextFlyout
        .querySelector(
            ".flyout-heading"
        )
        .appendChild(
            makeCloseButton()
        );


    colourMenuButton.innerHTML =
        '<span class="toolbar-icon">🎨</span>' +
        '<span class="toolbar-tooltip">Change colour</span>';

    sendBackwardToolbarButton.innerHTML =
        '<span class="toolbar-icon">⇩</span>' +
        '<span class="toolbar-tooltip">Send to Back</span>';

    bringForwardToolbarButton.innerHTML =
        '<span class="toolbar-icon">⇧</span>' +
        '<span class="toolbar-tooltip">Bring to Front</span>';

    deleteButton.innerHTML =
        '<span class="toolbar-icon">⌫</span>' +
        '<span class="toolbar-tooltip">Delete selected</span>';


    contextFlyout.append(
        colourMenuButton,
        sendBackwardToolbarButton,
        bringForwardToolbarButton,
        deleteButton
    );


    canvasWrap.appendChild(
        contextFlyout
    );

    flyouts.push(
        contextFlyout
    );


    contextMoreButton.addEventListener(
        "click",
        () => {
            toggleFlyout(
                contextFlyout
            );
        }
    );


    duplicateButton.hidden =
        true;


    const toolbarDivider =
        document.createElement(
            "div"
        );

    toolbarDivider.className =
        "toolbar-divider";


    floatingToolbar.replaceChildren(
        selectTool,
        shapeMenuButton,
        drawMenuButton,
        toolbarDivider,
        undoButton,
        redoButton,
        moreMenuButton
    );


    /* =====================================================
       ROUTE RESIZE UI
    ===================================================== */

    const resizeFlyout =
        document.createElement(
            "aside"
        );

    resizeFlyout.id =
        `${ENHANCE_PREFIX}-resize-flyout`;

    resizeFlyout.className =
        `tool-flyout ${ENHANCE_PREFIX}-resize-flyout`;

    resizeFlyout.hidden =
        true;

    resizeFlyout.innerHTML = `
        <div class="flyout-heading">
            <div>
                <strong>Resize route</strong>
                <span>Overall size or line thickness</span>
            </div>
        </div>

        <div class="${ENHANCE_PREFIX}-route-control">
            <span>Overall size</span>
            <div class="${ENHANCE_PREFIX}-route-buttons">
                <button type="button" data-route-scale="0.9" aria-label="Make route smaller">−</button>
                <button type="button" data-route-scale="1.1" aria-label="Make route larger">＋</button>
            </div>
        </div>

        <div class="${ENHANCE_PREFIX}-route-control">
            <span>Thickness</span>
            <div class="${ENHANCE_PREFIX}-route-buttons">
                <button type="button" data-route-width="-1" aria-label="Make route thinner">−</button>
                <button type="button" data-route-width="1" aria-label="Make route thicker">＋</button>
            </div>
        </div>
    `;


    resizeFlyout
        .querySelector(
            ".flyout-heading"
        )
        .appendChild(
            makeCloseButton()
        );


    canvasWrap.appendChild(
        resizeFlyout
    );

    flyouts.push(
        resizeFlyout
    );


    resizeRouteButton.addEventListener(
        "click",
        () => {
            toggleFlyout(
                resizeFlyout
            );
        }
    );


    /* =====================================================
       MAP CLIPBOARD
    ===================================================== */

    let clipboardItem =
        null;

    let clipboardPasteCount =
        0;


    const getSelectedClipboardItem = () => {
        const shape =
            selectedShape();

        if (
            shape &&
            !shape.draft
        ) {
            return {
                kind:
                    "shape",
                data:
                    shape
            };
        }


        const route =
            selectedRoute();

        if (
            route &&
            !route.draft
        ) {
            return {
                kind:
                    "route",
                data:
                    route
            };
        }


        const hazard =
            selectedHazard();

        if (hazard) {
            return {
                kind:
                    "hazard",
                data:
                    hazard
            };
        }


        return null;
    };


    const copySelectedItem = () => {
        const item =
            getSelectedClipboardItem();


        if (!item) {
            statusBar.textContent =
                "Select an item to copy.";

            return false;
        }


        clipboardItem = {
            kind:
                item.kind,
            data:
                deepClone(
                    item.data
                )
        };


        clipboardPasteCount =
            0;


        statusBar.textContent =
            "Copied. Use Paste or Ctrl/Cmd+V.";


        updateContextToolbar();

        return true;
    };


    const canPaste = () => {
        if (
            !clipboardItem ||
            appMode !== "student" ||
            !isStudentEditingAllowed()
        ) {
            return false;
        }


        if (
            clipboardItem.kind ===
            "hazard"
        ) {
            return Boolean(
                allowedTools.hazard
            );
        }


        if (
            clipboardItem.kind ===
            "route"
        ) {
            return clipboardItem
                .data
                .kind === "road"
                    ? Boolean(
                        allowedTools.road
                    )
                    : Boolean(
                        allowedTools.path
                    );
        }


        if (
            clipboardItem.kind ===
            "shape"
        ) {
            return clipboardItem
                .data
                .type === "freehand"
                    ? Boolean(
                        allowedTools.freehand
                    )
                    : Boolean(
                        allowedTools.shapes
                    );
        }


        return false;
    };


    const pasteCopiedItem = () => {
        if (!canPaste()) {
            statusBar.textContent =
                "Nothing available to paste here.";

            return false;
        }


        const before =
            captureMapState();

        const copy =
            deepClone(
                clipboardItem.data
            );


        clipboardPasteCount +=
            1;


        const offset =
            Math.min(
                35 *
                clipboardPasteCount,
                175
            );


        if (
            clipboardItem.kind ===
            "shape"
        ) {
            copy.id =
                nextShapeId++;

            copy.draft =
                false;


            if (
                copy.type ===
                "freehand"
            ) {
                const movement =
                    constrainPointMovement(
                        copy.points,
                        offset,
                        offset
                    );


                copy.points.forEach(
                    point => {
                        point.x +=
                            movement.dx;

                        point.y +=
                            movement.dy;
                    }
                );
            }

            else {
                const movement =
                    constrainShapeMovement(
                        copy,
                        offset,
                        offset
                    );


                copy.x +=
                    movement.dx;

                copy.y +=
                    movement.dy;
            }


            shapes.push(
                copy
            );


            selectedItem = {
                kind:
                    "shape",
                id:
                    copy.id
            };
        }

        else if (
            clipboardItem.kind ===
            "route"
        ) {
            copy.id =
                nextRouteId++;

            copy.draft =
                false;


            const movement =
                constrainPointMovement(
                    copy.points,
                    offset,
                    offset
                );


            copy.points.forEach(
                point => {
                    point.x +=
                        movement.dx;

                    point.y +=
                        movement.dy;
                }
            );


            routes.push(
                copy
            );


            selectedItem = {
                kind:
                    "route",
                id:
                    copy.id
            };
        }

        else {
            copy.id =
                nextHazardId++;

            copy.x =
                clamp(
                    copy.x + offset,
                    0,
                    CANVAS_WIDTH
                );

            copy.y =
                clamp(
                    copy.y + offset,
                    0,
                    CANVAS_HEIGHT
                );


            hazards.push(
                copy
            );


            selectedItem = {
                kind:
                    "hazard",
                id:
                    copy.id
            };
        }


        currentTool =
            "select";


        commitHistory(
            before
        );

        closeFlyouts();

        renderAll();


        statusBar.textContent =
            "Pasted a copy of the selected item.";

        return true;
    };


    copyButton.addEventListener(
        "click",
        copySelectedItem
    );


    pasteButton.addEventListener(
        "click",
        pasteCopiedItem
    );


    /* =====================================================
       ROUTE RESIZE
    ===================================================== */

    const scaleSelectedRoute = (
        factor
    ) => {
        const route =
            selectedRoute();


        if (
            !route ||
            route.draft ||
            !isStudentEditingAllowed() ||
            !routeToolAllowed(
                route
            )
        ) {
            return;
        }


        const before =
            captureMapState();

        const bounds =
            getPointsBounds(
                route.points
            );

        const centre = {
            x:
                bounds.x +
                bounds.width / 2,

            y:
                bounds.y +
                bounds.height / 2
        };


        const scaled =
            route.points.map(
                point => ({
                    x:
                        centre.x +
                        (
                            point.x -
                            centre.x
                        ) *
                        factor,

                    y:
                        centre.y +
                        (
                            point.y -
                            centre.y
                        ) *
                        factor
                })
            );


        const scaledBounds =
            getPointsBounds(
                scaled
            );


        if (
            scaledBounds.width >
                CANVAS_WIDTH ||
            scaledBounds.height >
                CANVAS_HEIGHT
        ) {
            statusBar.textContent =
                "That route cannot be made larger without leaving the map.";

            return;
        }


        let dx =
            0;

        let dy =
            0;


        if (
            scaledBounds.x <
            0
        ) {
            dx =
                -scaledBounds.x;
        }

        else if (
            scaledBounds.x +
                scaledBounds.width >
            CANVAS_WIDTH
        ) {
            dx =
                CANVAS_WIDTH -
                (
                    scaledBounds.x +
                    scaledBounds.width
                );
        }


        if (
            scaledBounds.y <
            0
        ) {
            dy =
                -scaledBounds.y;
        }

        else if (
            scaledBounds.y +
                scaledBounds.height >
            CANVAS_HEIGHT
        ) {
            dy =
                CANVAS_HEIGHT -
                (
                    scaledBounds.y +
                    scaledBounds.height
                );
        }


        route.points =
            scaled.map(
                point => ({
                    x:
                        point.x + dx,

                    y:
                        point.y + dy
                })
            );


        commitHistory(
            before
        );

        renderAll();


        statusBar.textContent =
            factor > 1
                ? "Route made larger."
                : "Route made smaller.";
    };


    const adjustSelectedRouteWidth = (
        direction
    ) => {
        const route =
            selectedRoute();


        if (
            !route ||
            route.draft ||
            !isStudentEditingAllowed() ||
            !routeToolAllowed(
                route
            )
        ) {
            return;
        }


        const before =
            captureMapState();


        const step =
            route.kind === "road"
                ? 2
                : 1;

        const minimum =
            route.kind === "road"
                ? 6
                : 2;

        const maximum =
            route.kind === "road"
                ? 36
                : 12;


        route.width =
            clamp(
                Number(
                    route.width
                ) +
                direction *
                step,
                minimum,
                maximum
            );


        commitHistory(
            before
        );

        renderAll();


        statusBar.textContent =
            direction > 0
                ? "Route made thicker."
                : "Route made thinner.";
    };


    resizeFlyout
        .querySelectorAll(
            "[data-route-scale]"
        )
        .forEach(
            button =>
                button.addEventListener(
                    "click",
                    () =>
                        scaleSelectedRoute(
                            Number(
                                button.dataset
                                    .routeScale
                            )
                        )
                )
        );


    resizeFlyout
        .querySelectorAll(
            "[data-route-width]"
        )
        .forEach(
            button =>
                button.addEventListener(
                    "click",
                    () =>
                        adjustSelectedRouteWidth(
                            Number(
                                button.dataset
                                    .routeWidth
                            )
                        )
                )
        );


    /* =====================================================
       ROUTE EXTENSION
    ===================================================== */

    let extendingRouteId =
        null;

    let extendingFromStart =
        false;

    let extensionActive =
        false;

    let extensionPoints =
        [];

    let extensionBeforeState =
        null;


    const drawExtensionPreview = (
        route
    ) => {
        temporaryLayer.innerHTML =
            "";


        if (
            !route ||
            extensionPoints.length <
                2
        ) {
            return;
        }


        const makePolyline = (
            stroke,
            width,
            dash = ""
        ) => {
            const line =
                document.createElementNS(
                    SVG_NS,
                    "polyline"
                );

            line.setAttribute(
                "points",
                pointsToString(
                    extensionPoints
                )
            );

            line.setAttribute(
                "fill",
                "none"
            );

            line.setAttribute(
                "stroke",
                stroke
            );

            line.setAttribute(
                "stroke-width",
                width
            );

            line.setAttribute(
                "stroke-linecap",
                "round"
            );

            line.setAttribute(
                "stroke-linejoin",
                "round"
            );

            if (dash) {
                line.setAttribute(
                    "stroke-dasharray",
                    dash
                );
            }

            temporaryLayer.appendChild(
                line
            );
        };


        if (
            route.kind === "road"
        ) {
            makePolyline(
                "#474943",
                Number(
                    route.width
                ) + 7
            );

            makePolyline(
                route.colour ||
                    "#d8d3c6",
                Number(
                    route.width
                )
            );
        }

        else {
            makePolyline(
                route.colour ||
                    "#3f75a8",
                Number(
                    route.width
                ) ||
                    5,
                "16 10"
            );
        }
    };


    const cancelRouteExtension = (
        message = ""
    ) => {
        extendingRouteId =
            null;

        extendingFromStart =
            false;

        extensionActive =
            false;

        extensionPoints =
            [];

        extensionBeforeState =
            null;

        temporaryLayer.innerHTML =
            "";


        if (
            currentTool ===
            "extend-route"
        ) {
            currentTool =
                "select";

            canvas.style.cursor =
                "default";

            renderAll();
        }


        if (message) {
            statusBar.textContent =
                message;
        }
    };


    const enterRouteExtension = () => {
        const route =
            selectedRoute();


        if (
            !route ||
            route.draft ||
            !isStudentEditingAllowed() ||
            !routeToolAllowed(
                route
            )
        ) {
            return;
        }


        closeFlyouts();


        extendingRouteId =
            route.id;

        currentTool =
            "extend-route";

        canvas.style.cursor =
            "crosshair";


        updateToolbarActiveState();

        updateContextToolbar();


        statusBar.textContent =
            "Drag from either end of the selected route to extend it.";
    };


    extendRouteButton.addEventListener(
        "click",
        enterRouteExtension
    );


    canvas.addEventListener(
        "pointerdown",
        event => {
            if (
                currentTool !==
                    "extend-route" ||
                appMode !==
                    "student" ||
                !isStudentEditingAllowed() ||
                referenceHoldActive
            ) {
                return;
            }


            const route =
                routes.find(
                    item =>
                        item.id ===
                        extendingRouteId
                );


            if (
                !route ||
                route.points.length <
                    2
            ) {
                cancelRouteExtension(
                    "Select a path or road first."
                );

                return;
            }


            const point =
                getCanvasPoint(
                    event
                );

            const first =
                route.points[0];

            const last =
                route.points[
                    route.points.length -
                    1
                ];

            const firstDistance =
                distanceBetween(
                    point,
                    first
                );

            const lastDistance =
                distanceBetween(
                    point,
                    last
                );


            if (
                Math.min(
                    firstDistance,
                    lastDistance
                ) >
                150
            ) {
                statusBar.textContent =
                    "Start your drag near either end of the selected route.";

                return;
            }


            extendingFromStart =
                firstDistance <=
                lastDistance;


            const endpoint =
                extendingFromStart
                    ? first
                    : last;


            extensionPoints = [
                {
                    ...endpoint
                }
            ];


            extensionBeforeState =
                captureMapState();

            extensionBeforeState
                .currentTool =
                "select";


            extensionActive =
                true;


            canvas.setPointerCapture(
                event.pointerId
            );


            event.preventDefault();
        }
    );


    canvas.addEventListener(
        "pointermove",
        event => {
            if (
                !extensionActive ||
                currentTool !==
                    "extend-route"
            ) {
                return;
            }


            const route =
                routes.find(
                    item =>
                        item.id ===
                        extendingRouteId
                );


            if (!route) {
                cancelRouteExtension();

                return;
            }


            const point =
                getCanvasPoint(
                    event
                );

            const previous =
                extensionPoints[
                    extensionPoints.length -
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
                extensionPoints.push(
                    point
                );

                drawExtensionPreview(
                    route
                );
            }
        }
    );


    canvas.addEventListener(
        "pointerup",
        () => {
            if (
                !extensionActive ||
                currentTool !==
                    "extend-route"
            ) {
                return;
            }


            const route =
                routes.find(
                    item =>
                        item.id ===
                        extendingRouteId
                );


            extensionActive =
                false;


            if (
                route &&
                extensionPoints.length >
                    1
            ) {
                const extension =
                    extensionPoints.map(
                        point => ({
                            ...point
                        })
                    );


                route.points =
                    extendingFromStart

                        ? [
                            ...extension
                                .reverse(),

                            ...route.points
                                .slice(
                                    1
                                )
                        ]

                        : [
                            ...route.points
                                .slice(
                                    0,
                                    -1
                                ),

                            ...extension
                        ];


                selectedItem = {
                    kind:
                        "route",
                    id:
                        route.id
                };


                currentTool =
                    "select";

                canvas.style.cursor =
                    "default";

                temporaryLayer.innerHTML =
                    "";

                extensionPoints =
                    [];

                extendingRouteId =
                    null;

                extendingFromStart =
                    false;


                commitHistory(
                    extensionBeforeState
                );


                extensionBeforeState =
                    null;


                renderAll();


                statusBar.textContent =
                    `${
                        route.kind === "road"
                            ? "Road"
                            : "Path"
                    } extended.`;

                return;
            }


            cancelRouteExtension(
                "Route extension cancelled."
            );
        }
    );


    canvas.addEventListener(
        "pointercancel",
        () => {
            if (
                extensionActive
            ) {
                cancelRouteExtension(
                    "Route extension cancelled."
                );
            }
        }
    );


    /* =====================================================
       TOOLBAR / PERMISSION SYNCHRONISATION
    ===================================================== */

    const updateContextToolbar = () => {
        const shape =
            selectedShape();

        const route =
            selectedRoute();

        const hazard =
            selectedHazard();


        const completedShape =
            Boolean(
                shape &&
                !shape.draft
            );

        const completedRoute =
            Boolean(
                route &&
                !route.draft
            );

        const hasSelection =
            Boolean(
                completedShape ||
                completedRoute ||
                hazard
            );


        const editable =
            appMode === "student" &&
            isStudentEditingAllowed();


        contextToolbar.hidden =
            !editable ||
            (
                !hasSelection &&
                !clipboardItem
            );


        editSelectedButton.hidden =
            !hasSelection;

        copyButton.hidden =
            !hasSelection;

        pasteButton.hidden =
            !clipboardItem;

        pasteButton.disabled =
            !canPaste();


        transformTool.hidden =
            !(
                completedShape &&
                allowedTools.transform
            );


        const routeEditable =
            completedRoute &&
            routeToolAllowed(
                route
            );


        extendRouteButton.hidden =
            !routeEditable;

        resizeRouteButton.hidden =
            !(
                routeEditable &&
                allowedTools.transform
            );


        contextMoreButton.hidden =
            !hasSelection;


        colourMenuButton.hidden =
            !(
                completedShape &&
                allowedTools.colour
            );


        sendBackwardToolbarButton.hidden =
            !(
                completedShape &&
                allowedTools.layers
            );


        bringForwardToolbarButton.hidden =
            !(
                completedShape &&
                allowedTools.layers
            );


        deleteButton.hidden =
            !hasSelection;


        if (
            !completedRoute
        ) {
            resizeFlyout.hidden =
                true;
        }


        if (
            !hasSelection
        ) {
            contextFlyout.hidden =
                true;
        }
    };


    const syncCondensedPermissions =
        () => {
            const settings =
                allowedTools ||
                DEFAULT_ALLOWED_TOOLS;


            shapeMenuButton.hidden =
                !(
                    settings.shapes ||
                    settings.hazard
                );


            drawMenuButton.hidden =
                !(
                    settings.freehand ||
                    settings.path ||
                    settings.road
                );


            if (shapeGrid) {
                shapeGrid.hidden =
                    !settings.shapes;
            }


            updateContextToolbar();
        };


    const originalApplyToolPermissions =
        applyToolPermissions;

    applyToolPermissions =
        function (...args) {
            const result =
                originalApplyToolPermissions(
                    ...args
                );

            syncCondensedPermissions();

            return result;
        };


    const originalUpdateToolbarActiveState =
        updateToolbarActiveState;

    updateToolbarActiveState =
        function (...args) {
            const result =
                originalUpdateToolbarActiveState(
                    ...args
                );


            drawMenuButton.classList.toggle(
                "active",
                [
                    "freehand",
                    "path",
                    "road"
                ].includes(
                    currentTool
                )
            );


            shapeMenuButton.classList.toggle(
                "active",
                FIXED_SHAPES.includes(
                    currentTool
                ) ||
                currentTool ===
                    "hazard"
            );


            transformTool.classList.toggle(
                "active",
                currentTool ===
                    "transform"
            );


            return result;
        };


    const originalRenderAll =
        renderAll;

    renderAll =
        function (...args) {
            const result =
                originalRenderAll(
                    ...args
                );

            updateContextToolbar();

            syncCondensedPermissions();

            return result;
        };


    /* =====================================================
       KEYBOARD COPY / PASTE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {
            if (
                event.key ===
                "Escape"
            ) {
                if (
                    currentTool ===
                    "extend-route"
                ) {
                    cancelRouteExtension(
                        "Route extension cancelled."
                    );
                }

                closePointCommentEditor();

                referencePanel.hidden =
                    true;

                return;
            }


            if (
                isTypingTarget(
                    event.target
                ) ||
                appMode !==
                    "student" ||
                !isStudentEditingAllowed()
            ) {
                return;
            }


            const modified =
                event.ctrlKey ||
                event.metaKey;


            if (!modified) {
                return;
            }


            const key =
                event.key.toLowerCase();


            if (
                key === "c"
            ) {
                event.preventDefault();

                copySelectedItem();

                return;
            }


            if (
                key === "v"
            ) {
                event.preventDefault();

                pasteCopiedItem();

                return;
            }


            if (
                key === "d"
            ) {
                const selected =
                    getSelectedClipboardItem();


                if (!selected) {
                    return;
                }


                event.preventDefault();


                if (
                    copySelectedItem()
                ) {
                    pasteCopiedItem();
                }
            }
        }
    );


    /* =====================================================
       TEACHER POINT COMMENTS
    ===================================================== */

    const isPointComment = (
        annotation
    ) => {
        return Boolean(
            annotation &&
            annotation.type ===
                "comment" &&
            Number.isFinite(
                Number(
                    annotation.x
                )
            ) &&
            Number.isFinite(
                Number(
                    annotation.y
                )
            )
        );
    };


    const pointCommentsFrom = (
        source
    ) => {
        return (
            Array.isArray(
                source
            )
                ? source
                : []
        )
            .filter(
                isPointComment
            );
    };


    const newPointCommentId =
        () => {
            if (
                globalThis.crypto
                    ?.randomUUID
            ) {
                return globalThis
                    .crypto
                    .randomUUID();
            }


            return (
                `comment-${Date.now()}-` +
                Math.random()
                    .toString(16)
                    .slice(2)
            );
        };


    const commentButton =
        makeButton(
            `${ENHANCE_PREFIX}-comment-tool`,
            "review-tool",
            "📍 Comment",
            "Place a point-specific comment"
        );


    const referenceButtonReview =
        makeButton(
            `${ENHANCE_PREFIX}-reference-tool`,
            "review-tool",
            "🖥 Reference",
            "Preview the reference map on common devices"
        );


    const clearInkButton =
        makeButton(
            `${ENHANCE_PREFIX}-clear-ink`,
            "review-tool",
            "Clear Ink",
            "Clear red ink but keep point comments"
        );


    teacherReviewToolbar.replaceChildren(
        annotationPenButton,
        commentButton,
        referenceButtonReview,
        clearInkButton
    );


    annotationPenButton.textContent =
        "✍ Pen";


    let reviewToolMode =
        "pen";

    let pendingPointComment =
        null;


    const commentEditor =
        document.createElement(
            "div"
        );

    commentEditor.id =
        `${ENHANCE_PREFIX}-comment-editor`;

    commentEditor.className =
        `${ENHANCE_PREFIX}-comment-editor`;

    commentEditor.hidden =
        true;

    commentEditor.innerHTML = `
        <div class="${ENHANCE_PREFIX}-comment-head">
            <strong>Point comment</strong>
            <button type="button" data-comment-close aria-label="Close">×</button>
        </div>

        <textarea
            rows="4"
            maxlength="500"
            placeholder="Write a comment about this exact point..."
        ></textarea>

        <div class="${ENHANCE_PREFIX}-comment-actions">
            <button
                type="button"
                class="${ENHANCE_PREFIX}-comment-delete"
                data-comment-delete
                hidden
            >
                Delete
            </button>

            <button
                type="button"
                class="${ENHANCE_PREFIX}-comment-save"
                data-comment-save
            >
                Save comment
            </button>
        </div>
    `;


    canvasWrap.appendChild(
        commentEditor
    );


    const commentEditorTitle =
        commentEditor.querySelector(
            "strong"
        );

    const commentTextarea =
        commentEditor.querySelector(
            "textarea"
        );

    const commentDeleteButton =
        commentEditor.querySelector(
            "[data-comment-delete]"
        );

    const commentSaveButton =
        commentEditor.querySelector(
            "[data-comment-save]"
        );

    const commentCloseButton =
        commentEditor.querySelector(
            "[data-comment-close]"
        );


    const closePointCommentEditor =
        () => {
            commentEditor.hidden =
                true;

            pendingPointComment =
                null;

            commentTextarea.value =
                "";
        };


    const positionPointCommentEditor =
        point => {
            const canvasRect =
                canvas
                    .getBoundingClientRect();

            const wrapRect =
                canvasWrap
                    .getBoundingClientRect();


            const rawLeft =
                (
                    point.x /
                    CANVAS_WIDTH
                ) *
                canvasRect.width +
                canvasRect.left -
                wrapRect.left +
                18;


            const rawTop =
                (
                    point.y /
                    CANVAS_HEIGHT
                ) *
                canvasRect.height +
                canvasRect.top -
                wrapRect.top +
                18;


            commentEditor.style.left =
                `${
                    clamp(
                        rawLeft,
                        12,
                        Math.max(
                            12,
                            canvasWrap
                                .clientWidth -
                            312
                        )
                    )
                }px`;


            commentEditor.style.top =
                `${
                    clamp(
                        rawTop,
                        12,
                        Math.max(
                            12,
                            canvasWrap
                                .clientHeight -
                            210
                        )
                    )
                }px`;
        };


    const openPointCommentEditor =
        (
            point,
            id = null
        ) => {
            const existing =
                id
                    ? annotations.find(
                        item =>
                            isPointComment(
                                item
                            ) &&
                            item.id ===
                                id
                    )
                    : null;


            pendingPointComment =
                existing
                    ? {
                        id:
                            existing.id,

                        x:
                            Number(
                                existing.x
                            ),

                        y:
                            Number(
                                existing.y
                            )
                    }
                    : {
                        id:
                            null,

                        x:
                            point.x,

                        y:
                            point.y
                    };


            commentEditorTitle
                .textContent =
                existing
                    ? "Edit point comment"
                    : "Point comment";


            commentTextarea.value =
                existing?.text ||
                "";


            commentDeleteButton.hidden =
                !existing;


            commentEditor.hidden =
                false;


            positionPointCommentEditor(
                pendingPointComment
            );


            setTimeout(
                () =>
                    commentTextarea
                        .focus(),
                20
            );
        };


    const syncReviewToolButtons =
        () => {
            annotationPenButton
                .classList
                .toggle(
                    "active",
                    reviewToolMode ===
                        "pen"
                );


            commentButton
                .classList
                .toggle(
                    "active",
                    reviewToolMode ===
                        "comment"
                );
        };


    annotationPenButton.addEventListener(
        "click",
        () => {
            if (
                annotationPenButton
                    .disabled
            ) {
                return;
            }

            reviewToolMode =
                "pen";

            closePointCommentEditor();

            syncReviewToolButtons();
        }
    );


    commentButton.addEventListener(
        "click",
        () => {
            if (
                commentButton.disabled
            ) {
                return;
            }

            reviewToolMode =
                "comment";

            closePointCommentEditor();

            syncReviewToolButtons();


            statusBar.textContent =
                "Click the exact point on the student's map where you want to comment.";
        }
    );


    commentSaveButton.addEventListener(
        "click",
        () => {
            if (
                !pendingPointComment
            ) {
                return;
            }


            const text =
                commentTextarea
                    .value
                    .trim();


            if (!text) {
                commentTextarea.focus();

                return;
            }


            if (
                pendingPointComment.id
            ) {
                const existing =
                    annotations.find(
                        item =>
                            isPointComment(
                                item
                            ) &&
                            item.id ===
                                pendingPointComment.id
                    );


                if (existing) {
                    existing.text =
                        text;
                }
            }

            else {
                annotations.push({
                    type:
                        "comment",

                    id:
                        newPointCommentId(),

                    x:
                        pendingPointComment.x,

                    y:
                        pendingPointComment.y,

                    text
                });
            }


            closePointCommentEditor();

            renderAnnotations();


            statusBar.textContent =
                "Point comment added. Save the review when you are done.";
        }
    );


    commentDeleteButton.addEventListener(
        "click",
        () => {
            if (
                !pendingPointComment
                    ?.id
            ) {
                return;
            }


            annotations =
                annotations.filter(
                    item =>
                        !(
                            isPointComment(
                                item
                            ) &&
                            item.id ===
                                pendingPointComment
                                    .id
                        )
                );


            closePointCommentEditor();

            renderAnnotations();


            statusBar.textContent =
                "Point comment removed. Save the review to keep this change.";
        }
    );


    commentCloseButton.addEventListener(
        "click",
        closePointCommentEditor
    );


    clearInkButton.addEventListener(
        "click",
        () => {
            if (
                clearInkButton.disabled
            ) {
                return;
            }


            if (
                !confirm(
                    "Clear all red ink on this submission? Point comments will stay."
                )
            ) {
                return;
            }


            annotations =
                annotations.filter(
                    isPointComment
                );


            renderAnnotations();


            statusBar.textContent =
                "Red ink cleared. Point comments were kept.";
        }
    );


    renderAnnotations =
        function () {
            annotationLayer.innerHTML =
                "";


            let commentNumber =
                0;


            annotations.forEach(
                annotation => {
                    if (
                        isPointComment(
                            annotation
                        )
                    ) {
                        commentNumber +=
                            1;


                        const group =
                            document.createElementNS(
                                SVG_NS,
                                "g"
                            );

                        group.setAttribute(
                            "class",
                            `${ENHANCE_PREFIX}-comment-pin`
                        );

                        group.dataset
                            .reviewCommentId =
                            annotation.id;


                        const circle =
                            document.createElementNS(
                                SVG_NS,
                                "circle"
                            );

                        circle.setAttribute(
                            "cx",
                            annotation.x
                        );

                        circle.setAttribute(
                            "cy",
                            annotation.y
                        );

                        circle.setAttribute(
                            "r",
                            19
                        );


                        const label =
                            document.createElementNS(
                                SVG_NS,
                                "text"
                            );

                        label.setAttribute(
                            "x",
                            annotation.x
                        );

                        label.setAttribute(
                            "y",
                            annotation.y + 1
                        );

                        label.textContent =
                            commentNumber;


                        const title =
                            document.createElementNS(
                                SVG_NS,
                                "title"
                            );

                        title.textContent =
                            annotation.text ||
                            "Teacher comment";


                        group.append(
                            circle,
                            label,
                            title
                        );


                        annotationLayer.appendChild(
                            group
                        );

                        return;
                    }


                    if (
                        !Array.isArray(
                            annotation?.points
                        )
                    ) {
                        return;
                    }


                    const polyline =
                        document.createElementNS(
                            SVG_NS,
                            "polyline"
                        );

                    polyline.setAttribute(
                        "points",
                        pointsToString(
                            annotation.points
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
                currentAnnotationPoints
                    .length >
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
        };


    beginTeacherAnnotation =
        function (
            event
        ) {
            const marker =
                event.target.closest(
                    "[data-review-comment-id]"
                );


            if (marker) {
                const comment =
                    annotations.find(
                        item =>
                            isPointComment(
                                item
                            ) &&
                            item.id ===
                                marker.dataset
                                    .reviewCommentId
                    );


                if (comment) {
                    openPointCommentEditor(
                        comment,
                        comment.id
                    );
                }

                return;
            }


            if (
                reviewToolMode ===
                "comment"
            ) {
                if (
                    commentButton.disabled
                ) {
                    return;
                }


                openPointCommentEditor(
                    getCanvasPoint(
                        event
                    )
                );

                return;
            }


            if (
                annotationPenButton
                    .disabled
            ) {
                return;
            }


            annotationDrawing =
                true;

            currentAnnotationPoints = [
                getCanvasPoint(
                    event
                )
            ];


            canvas.setPointerCapture(
                event.pointerId
            );
        };


    moveTeacherAnnotation =
        function (
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
                    currentAnnotationPoints
                        .length -
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
                currentAnnotationPoints.push(
                    point
                );

                renderAnnotations();
            }
        };


    endTeacherAnnotation =
        function () {
            if (
                !annotationDrawing
            ) {
                return;
            }


            annotationDrawing =
                false;


            if (
                currentAnnotationPoints
                    .length >
                    1
            ) {
                annotations.push({
                    type:
                        "ink",

                    points:
                        currentAnnotationPoints
                            .map(
                                point => ({
                                    ...point
                                })
                            )
                });
            }


            currentAnnotationPoints =
                [];


            renderAnnotations();
        };


    /* =====================================================
       STUDENT POINT-COMMENT LIST
    ===================================================== */

    const studentCommentWrap =
        document.createElement(
            "div"
        );

    studentCommentWrap.id =
        `${ENHANCE_PREFIX}-student-comments`;

    studentCommentWrap.className =
        `${ENHANCE_PREFIX}-student-comments`;

    studentCommentWrap.hidden =
        true;

    studentCommentWrap.innerHTML =
        "<strong>Point comments</strong>" +
        "<ol></ol>";


    const studentReviewCopy =
        studentReviewPanel
            .querySelector(
                ".student-review-copy"
            );


    studentReviewCopy?.appendChild(
        studentCommentWrap
    );


    const renderStudentPointComments =
        () => {
            const list =
                studentCommentWrap
                    .querySelector(
                        "ol"
                    );


            list.replaceChildren();


            const comments =
                pointCommentsFrom(
                    studentReviewData
                        ?.annotations
                );


            comments.forEach(
                comment => {
                    const item =
                        document.createElement(
                            "li"
                        );

                    item.textContent =
                        comment.text;

                    list.appendChild(
                        item
                    );
                }
            );


            studentCommentWrap.hidden =
                !comments.length;
        };


    const originalApplyStudentReviewSnapshot =
        applyStudentReviewSnapshot;

    applyStudentReviewSnapshot =
        function (...args) {
            const result =
                originalApplyStudentReviewSnapshot(
                    ...args
                );

            renderStudentPointComments();

            return result;
        };


    const originalResetStudentReviewState =
        resetStudentReviewState;

    resetStudentReviewState =
        function (...args) {
            const result =
                originalResetStudentReviewState(
                    ...args
                );

            studentCommentWrap.hidden =
                true;

            studentCommentWrap
                .querySelector(
                    "ol"
                )
                .replaceChildren();

            return result;
        };


    const syncMarkedWorkToggleText =
        () => {
            if (
                toggleStudentMarkedWorkButton
                    .textContent ===
                "Hide teacher markings"
            ) {
                toggleStudentMarkedWorkButton
                    .textContent =
                    "Hide map markings";
            }

            else if (
                toggleStudentMarkedWorkButton
                    .textContent ===
                "Show teacher markings"
            ) {
                toggleStudentMarkedWorkButton
                    .textContent =
                    "Show map markings";
            }
        };


    new MutationObserver(
        syncMarkedWorkToggleText
    )
        .observe(
            toggleStudentMarkedWorkButton,
            {
                childList:
                    true,
                characterData:
                    true,
                subtree:
                    true
            }
        );


    syncMarkedWorkToggleText();


    /* =====================================================
       TEACHER REFERENCE DEVICE PREVIEW
    ===================================================== */

    const referencePanel =
        document.createElement(
            "aside"
        );

    referencePanel.id =
        `${ENHANCE_PREFIX}-reference-panel`;

    referencePanel.className =
        `${ENHANCE_PREFIX}-reference-panel`;

    referencePanel.hidden =
        true;

    referencePanel.innerHTML = `
        <div class="${ENHANCE_PREFIX}-reference-head">
            <div>
                <strong>Reference preview</strong>
                <span>Simulates how the reference fills the student map area.</span>
            </div>

            <button
                type="button"
                class="${ENHANCE_PREFIX}-reference-close"
                aria-label="Close reference preview"
            >
                ×
            </button>
        </div>

        <div class="${ENHANCE_PREFIX}-device-tabs" role="group" aria-label="Preview device">
            <button type="button" data-device="phone">Phone</button>
            <button type="button" data-device="tablet">iPad</button>
            <button type="button" data-device="desktop" class="active">Computer</button>
        </div>

        <p class="${ENHANCE_PREFIX}-device-note">
            Computer mirrors the landscape canvas. Phone and iPad mirror the current responsive map height.
        </p>

        <div class="${ENHANCE_PREFIX}-device-frame" data-device="desktop">
            <img alt="Reference map device preview">
        </div>
    `;


    canvasWrap.appendChild(
        referencePanel
    );


    const referenceFrame =
        referencePanel.querySelector(
            `.${ENHANCE_PREFIX}-device-frame`
        );

    const referenceImage =
        referencePanel.querySelector(
            "img"
        );

    const referenceCloseButton =
        referencePanel.querySelector(
            `.${ENHANCE_PREFIX}-reference-close`
        );

    const deviceButtons =
        referencePanel.querySelectorAll(
            `.${ENHANCE_PREFIX}-device-tabs button[data-device]`
        );


    const setReferenceDevice =
        device => {
            referenceFrame.dataset
                .device =
                device;


            deviceButtons.forEach(
                button =>
                    button.classList
                        .toggle(
                            "active",
                            button.dataset
                                .device ===
                                device
                        )
            );
        };


    deviceButtons.forEach(
        button =>
            button.addEventListener(
                "click",
                () =>
                    setReferenceDevice(
                        button.dataset
                            .device
                    )
            )
    );


    referenceCloseButton.addEventListener(
        "click",
        () => {
            referencePanel.hidden =
                true;
        }
    );


    backToDashboardButton.addEventListener(
        "click",
        () => {
            referencePanel.hidden =
                true;

            closePointCommentEditor();

            reviewToolMode =
                "pen";

            syncReviewToolButtons();
        }
    );


    const syncReferenceReviewUI =
        () => {
            const available =
                Boolean(
                    currentReferenceUrl
                );


            referenceButtonReview
                .disabled =
                !available;


            if (!available) {
                referencePanel.hidden =
                    true;

                referenceImage
                    .removeAttribute(
                        "src"
                    );

                return;
            }


            referenceImage.src =
                currentReferenceUrl;
        };


    referenceButtonReview.addEventListener(
        "click",
        () => {
            syncReferenceReviewUI();


            if (
                !currentReferenceUrl
            ) {
                statusBar.textContent =
                    "This task does not have a reference map.";

                return;
            }


            referencePanel.hidden =
                !referencePanel.hidden;


            if (
                !referencePanel.hidden
            ) {
                setReferenceDevice(
                    referenceFrame.dataset
                        .device ||
                        "desktop"
                );
            }
        }
    );


    const originalLoadCurrentTaskReference =
        loadCurrentTaskReference;

    loadCurrentTaskReference =
        async function (...args) {
            const result =
                await originalLoadCurrentTaskReference(
                    ...args
                );

            syncReferenceReviewUI();

            return result;
        };


    /* =====================================================
       REVIEW ENABLE / DISABLE STATE
    ===================================================== */

    const originalApplyReviewMarkingState =
        applyReviewMarkingState;

    applyReviewMarkingState =
        function (...args) {
            const result =
                originalApplyReviewMarkingState(
                    ...args
                );


            const handedIn =
                reviewIsHandedIn();


            commentButton.disabled =
                !handedIn;

            clearInkButton.disabled =
                !handedIn;


            closePointCommentEditor();

            reviewToolMode =
                "pen";


            syncReviewToolButtons();

            syncReferenceReviewUI();


            return result;
        };


    const feedbackLabel =
        teacherFeedbackText
            .closest(
                ".review-field"
            )
            ?.querySelector(
                "label"
            );

    if (feedbackLabel) {
        feedbackLabel.textContent =
            "Overall feedback";
    }


    const normalizeReviewSaveButton =
        () => {
            const text =
                saveTeacherFeedbackButton
                    .textContent
                    .trim();


            if (
                text ===
                "Save feedback + ink"
            ) {
                saveTeacherFeedbackButton
                    .textContent =
                    "Save review";

                return;
            }


            if (
                text ===
                "✓ Saved"
            ) {
                statusBar.textContent =
                    "Teacher review saved: red ink, point comments and overall feedback are up to date.";
            }
        };


    new MutationObserver(
        normalizeReviewSaveButton
    )
        .observe(
            saveTeacherFeedbackButton,
            {
                childList:
                    true,
                characterData:
                    true,
                subtree:
                    true
            }
        );


    normalizeReviewSaveButton();


    /* =====================================================
       FINAL SYNCHRONISATION
    ===================================================== */

    document
        .querySelectorAll(
            `#${drawFlyout.id} [data-close-flyouts], ` +
            `#${contextFlyout.id} [data-close-flyouts], ` +
            `#${resizeFlyout.id} [data-close-flyouts]`
        )
        .forEach(
            button =>
                button.addEventListener(
                    "click",
                    closeFlyouts
                )
        );


    syncCondensedPermissions();

    updateToolbarActiveState();

    updateContextToolbar();

    syncReviewToolButtons();

    syncReferenceReviewUI();

    renderAnnotations();
})();