(() => {

    "use strict";

    const PREFIX = "oe-corrections";

    /* =========================================================

       STYLES

    ========================================================= */

    const style = document.createElement("style");

    style.textContent = `

        .${PREFIX}-actions {

            display: flex;

            flex-wrap: wrap;

            gap: 10px;

            align-items: center;

            margin-top: 14px;

        }

        .${PREFIX}-actions[hidden],

        .${PREFIX}-ink-note[hidden],

        .${PREFIX}-correction-note[hidden],

        .${PREFIX}-folder-hint[hidden] {

            display: none !important;

        }

        .${PREFIX}-ink-note {

            margin: 10px 0 0;

            font-size: 0.9rem;

            line-height: 1.45;

            opacity: 0.82;

        }

        .${PREFIX}-correction-note {

            margin-top: 10px;

            padding: 10px 12px;

            border: 1px solid rgba(127, 127, 127, 0.28);

            border-radius: 12px;

            font-size: 0.9rem;

            line-height: 1.45;

        }

        .${PREFIX}-student-card-version {

            margin-top: 6px;

            font-size: 0.78rem;

            font-weight: 800;

            letter-spacing: 0.035em;

            text-transform: uppercase;

            opacity: 0.76;

        }

        .${PREFIX}-folder-hint {

            margin: 0 0 12px;

            padding: 10px 12px;

            border: 1px solid rgba(79, 103, 89, 0.22);

            border-radius: 10px;

            background: rgba(244, 248, 243, 0.8);

            color: #4a554e;

            font-size: 0.9rem;

            line-height: 1.45;

        }

        .${PREFIX}-switch-task {

            white-space: nowrap;

        }

        .${PREFIX}-my-projects {

            flex-shrink: 0;

            align-self: center;

            white-space: nowrap;

        }

        .${PREFIX}-my-projects:not([hidden]) {

            display: inline-flex !important;

            align-items: center;

            justify-content: center;

        }

    `;

    document.head.appendChild(style);

    /* =========================================================

       PROFILE / TASK FOLDER ELEMENTS

    ========================================================= */

    const profileStartCard =

        studentProfilePage?.querySelector(

            ".profile-start-card"

        ) ||

        null;

    const profileHistoryCard =

        studentProfilePage?.querySelector(

            ".profile-history-card"

        ) ||

        null;

    const profileHistoryHead =

        profileHistoryCard?.querySelector(

            ".profile-section-head"

        ) ||

        null;

    const profileHistoryMiniLabel =

        profileHistoryHead?.querySelector(

            ".mini-label"

        ) ||

        null;

    const profileHistoryHeading =

        profileHistoryHead?.querySelector(

            "h2"

        ) ||

        null;

    const originalHistoryMiniLabel =

        profileHistoryMiniLabel?.textContent ||

        "MY PROJECTS";

    const originalHistoryHeading =

        profileHistoryHeading?.textContent ||

        "Past & current work";

    const switchTaskButton =

        document.createElement(

            "button"

        );

    switchTaskButton.type =

        "button";

    switchTaskButton.className =

        `quiet-button ${PREFIX}-switch-task`;

    switchTaskButton.textContent =

        "Switch Task";

    switchTaskButton.hidden =

        true;

    if (

        profileHistoryHead

    ) {

        profileHistoryHead.appendChild(

            switchTaskButton

        );

    }

    const folderHint =

        document.createElement(

            "div"

        );

    folderHint.className =

        `${PREFIX}-folder-hint`;

    folderHint.hidden =

        true;

    folderHint.textContent =

        "Choose the submission you want to open. You can move between submissions for this task without entering the task code again.";

    if (

        studentProjectsNotice?.parentNode

    ) {

        studentProjectsNotice.parentNode.insertBefore(

            folderHint,

            studentProjectsNotice.nextSibling

        );

    }

    /* =========================================================

       STUDENT CORRECTIONS UI

    ========================================================= */

    const reviewTitle =

        studentReviewPanel?.querySelector("h2") ||

        null;

    const reviewCopy =

        studentReviewPanel?.querySelector(

            ".student-review-copy"

        ) ||

        null;

    const reviewActions =

        document.createElement(

            "div"

        );

    reviewActions.className =

        `${PREFIX}-actions`;

    reviewActions.hidden =

        true;

    const startCorrectionsButton =

        document.createElement(

            "button"

        );

    startCorrectionsButton.type =

        "button";

    startCorrectionsButton.className =

        "primary-button";

    startCorrectionsButton.textContent =

        "Start Corrections";

    const viewOriginalButton =

        document.createElement(

            "button"

        );

    viewOriginalButton.type =

        "button";

    viewOriginalButton.className =

        "quiet-button";

    viewOriginalButton.textContent =

        "View Marked Submission 1";

    viewOriginalButton.hidden =

        true;

    reviewActions.append(

        startCorrectionsButton,

        viewOriginalButton

    );

    studentReviewPanel?.appendChild(

        reviewActions

    );

    const inkNote =

        document.createElement(

            "p"

        );

    inkNote.className =

        `${PREFIX}-ink-note`;

    inkNote.hidden =

        true;

    reviewCopy?.appendChild(

        inkNote

    );

    const correctionNote =

        document.createElement(

            "div"

        );

    correctionNote.className =

        `${PREFIX}-correction-note`;

    correctionNote.hidden =

        true;

    reviewCopy?.appendChild(

        correctionNote

    );

    /* =========================================================

       STATE

    ========================================================= */

    const revisionCache =

        new Map();

    let currentRevisionInfo =

        null;

    let parentReviewForCorrections =

        null;

    let correctionUiRequest =

        0;

    /*

    activeTaskScope is the task folder currently unlocked by a

    valid task code.

    null = the pupil is at the task-code gate and cannot browse

    other projects.

    */

    let activeTaskScope =

        null;

    /* =========================================================

       HELPERS

    ========================================================= */

    const integerVersion =

        value => {

            const number =

                Number(

                    value

                );

            return (

                Number.isInteger(

                    number

                ) &&

                number >= 1

            )

                ? number

                : 1;

        };

    const isPointComment =

        annotation =>

            Boolean(

                annotation &&

                annotation.type ===

                    "comment" &&

                typeof annotation.text ===

                    "string"

            );

    const pointComments =

        review =>

            Array.isArray(

                review?.annotations

            )

                ? review.annotations.filter(

                    isPointComment

                )

                : [];

    const inkCount =

        review =>

            Array.isArray(

                review?.annotations

            )

                ? review.annotations.filter(

                    annotation =>

                        !isPointComment(

                            annotation

                        ) &&

                        Array.isArray(

                            annotation?.points

                        )

                ).length

                : 0;

    const projectVersion =

        () =>

            integerVersion(

                currentSubmission

                    ?.submission_number ??

                currentRevisionInfo

                    ?.submission_number

            );

    const isCorrectionProject =

        () =>

            projectVersion() >=

            2;

    function projectMatchesActiveTask(

        project

    ) {

        if (

            !activeTaskScope ||

            !project

        ) {

            return false;

        }

        if (

            activeTaskScope.id &&

            project.task_id ===

                activeTaskScope.id

        ) {

            return true;

        }

        return (

            String(

                project.task_code ||

                ""

            )

                .trim()

                .toUpperCase() ===

            String(

                activeTaskScope.task_code ||

                ""

            )

                .trim()

                .toUpperCase()

        );

    }

    function scopedProjects() {

        if (

            !activeTaskScope

        ) {

            return [];

        }

        return currentStudentProjects.filter(

            projectMatchesActiveTask

        );

    }

    function normaliseTaskScope(

        task

    ) {

        if (

            !task

        ) {

            return null;

        }

        return {

            id:

                task.id ||

                task.task_id ||

                null,

            title:

                task.title ||

                task.task_title ||

                "Mapping Activity",

            task_code:

                String(

                    task.task_code ||

                    ""

                )

                    .trim()

                    .toUpperCase()

        };

    }

    function syncProfileScopeUI() {

        const hasScope =

            Boolean(

                activeTaskScope

            );

        if (

            profileStartCard

        ) {

            profileStartCard.hidden =

                hasScope;

        }

        if (

            profileHistoryCard

        ) {

            profileHistoryCard.hidden =

                !hasScope;

        }

        switchTaskButton.hidden =

            !hasScope;

        folderHint.hidden =

            !hasScope;

        if (

            profileHistoryMiniLabel

        ) {

            profileHistoryMiniLabel.textContent =

                hasScope

                    ? "MY PROJECTS › CURRENT TASK"

                    : originalHistoryMiniLabel;

        }

        if (

            profileHistoryHeading

        ) {

            profileHistoryHeading.textContent =

                hasScope

                    ? activeTaskScope.title

                    : originalHistoryHeading;

        }

        if (

            !hasScope

        ) {

            studentProjectsList.innerHTML =

                `

<p class="helper-text">

Enter a task code above to open a task.

</p>

`;

        }

    }

    function unlockTaskFolder(

        task

    ) {

        activeTaskScope =

            normaliseTaskScope(

                task

            );

        syncProfileScopeUI();

    }

    function lockTaskFolders() {

        activeTaskScope =

            null;

        hideProjectsNotice();

        syncProfileScopeUI();

    }

    /* =========================================================

       REVISION INFO

    ========================================================= */

    async function fetchRevisionInfo(

        submissionId,

        {

            force = false

        } = {}

    ) {

        if (

            !submissionId ||

            !hasCurrentLearnerIdentity()

        ) {

            return null;

        }

        if (

            !force &&

            revisionCache.has(

                submissionId

            )

        ) {

            return revisionCache.get(

                submissionId

            );

        }

        let result;

        if (

            currentIdentityType ===

            "guest"

        ) {

            result =

                await sb.rpc(

                    "guest_get_revision_info",

                    {

                        p_submission_id:

                            submissionId

                    }

                );

        }

        else {

            result =

                await sb.rpc(

                    "student_get_revision_info",

                    {

                        p_submission_id:

                            submissionId,

                        p_student_id:

                            currentStudentProfile

                                .student_id

                    }

                );

        }

        if (

            result.error

        ) {

            throw result.error;

        }

        const row =

            Array.isArray(

                result.data

            )

                ? result.data[0]

                : result.data;

        const info =

            row

                ? {

                    submission_number:

                        integerVersion(

                            row

                                .submission_number

                        ),

                    parent_submission_id:

                        row

                            .parent_submission_id ||

                        null,

                    correction_submission_id:

                        row

                            .correction_submission_id ||

                        null

                }

                : null;

        revisionCache.set(

            submissionId,

            info

        );

        return info;

    }

    function setCurrentRevisionInfo(

        info

    ) {

        currentRevisionInfo =

            info;

        if (

            currentSubmission &&

            info

        ) {

            currentSubmission

                .submission_number =

                integerVersion(

                    info

                        .submission_number

                );

            currentSubmission

                .parent_submission_id =

                info

                    .parent_submission_id ||

                null;

            currentSubmission

                .correction_submission_id =

                info

                    .correction_submission_id ||

                null;

        }

    }

    /* =========================================================

       REVIEW PANEL MODES

    ========================================================= */

    function restoreSubmissionOneReviewUI() {

        parentReviewForCorrections =

            null;

        correctionNote.hidden =

            true;

        inkNote.hidden =

            true;

        viewOriginalButton.hidden =

            true;

        if (

            reviewTitle

        ) {

            reviewTitle.textContent =

                "Marked work";

        }

        if (

            toggleStudentMarkedWorkButton

        ) {

            toggleStudentMarkedWorkButton.hidden =

                !(

                    studentReviewData

                        ?.annotations

                        ?.length

                );

        }

    }

    function renderCorrectionReference(

        review

    ) {

        parentReviewForCorrections =

            review ||

            null;

        if (

            !review

        ) {

            studentReviewPanel.hidden =

                true;

            reviewActions.hidden =

                true;

            return;

        }

        applyStudentReviewSnapshot(

            review

        );

        annotations =

            [];

        studentReviewVisible =

            false;

        renderAnnotations();

        if (

            reviewTitle

        ) {

            reviewTitle.textContent =

                "Feedback for Submission 1";

        }

        studentReviewPanel.hidden =

            false;

        toggleStudentMarkedWorkButton.hidden =

            true;

        correctionNote.hidden =

            false;

        if (

            currentSubmission

                ?.status ===

            "submitted"

        ) {

            correctionNote.textContent =

                "Submission 2 — Corrected Work has been handed in. " +

                "The feedback below is from Submission 1 for reference while you wait for your teacher to mark the corrected work.";

        }

        else {

            correctionNote.textContent =

                "Use this feedback while editing Submission 2. " +

                "Teacher markings stay on Submission 1 and are not placed over your correction map.";

        }

        const strokes =

            inkCount(

                review

            );

        if (

            strokes > 0

        ) {

            inkNote.hidden =

                false;

            inkNote.textContent =

                `Your teacher also added ${strokes} red-pen marking${strokes === 1 ? "" : "s"}. ` +

                "Open the marked Submission 1 below to see exactly where they were drawn.";

        }

        else {

            inkNote.hidden =

                true;

        }

        const comments =

            pointComments(

                review

            );

        if (

            !comments.length &&

            !review.feedback?.trim()

        ) {

            studentTeacherFeedbackText

                .textContent =

                "Your teacher reviewed Submission 1. Use the marked original as your reference.";

        }

        reviewActions.hidden =

            false;

        startCorrectionsButton.hidden =

            true;

        viewOriginalButton.hidden =

            false;

        syncCorrectionLockBanner();

    }

    function renderMarkedCorrection(

        review

    ) {

        parentReviewForCorrections =

            null;

        if (

            !review

        ) {

            return;

        }

        applyStudentReviewSnapshot(

            review

        );

        studentReviewVisible =

            true;

        annotations =

            deepClone(

                review.annotations ||

                []

            );

        renderAnnotations();

        if (

            reviewTitle

        ) {

            reviewTitle.textContent =

                "Marked corrected work";

        }

        correctionNote.hidden =

            false;

        correctionNote.textContent =

            "This is your teacher's feedback on Submission 2 — Corrected Work.";

        inkNote.hidden =

            true;

        reviewActions.hidden =

            false;

        startCorrectionsButton.hidden =

            true;

        viewOriginalButton.hidden =

            !currentRevisionInfo

                ?.parent_submission_id;

        toggleStudentMarkedWorkButton.hidden =

            !(

                review.annotations &&

                review.annotations.length

            );

        syncCorrectionLockBanner();

    }

    /* =========================================================

       VERSION LABELS / BANNERS

    ========================================================= */

    function syncVersionLabels() {

        if (

            !currentSubmission ||

            appMode !== "student"

        ) {

            return;

        }

        const version =

            projectVersion();

        submitButton.textContent =

            version >= 2

                ? "Submit Corrected Work"

                : "Submit to teacher";

        if (

            taskMembers &&

            !taskMembers.dataset

                .correctionBaseText

        ) {

            taskMembers.dataset

                .correctionBaseText =

                taskMembers.textContent ||

                "";

        }

        if (

            taskMembers

        ) {

            const baseText =

                taskMembers.dataset

                    .correctionBaseText ||

                taskMembers.textContent ||

                "";

            taskMembers.textContent =

                version >= 2

                    ? `Submission ${version} · Corrections · ${baseText}`

                    : `Submission 1 · ${baseText}`;

        }

    }

    function syncCorrectionLockBanner() {

        if (

            appMode !== "student" ||

            !isCorrectionProject() ||

            !projectHandedIn ||

            !studentReadOnly

        ) {

            return;

        }

        if (

            parentReviewForCorrections

        ) {

            editLockLabel.textContent =

                "SUBMISSION 2";

            editLockTitle.textContent =

                "Corrected work handed in — waiting for your teacher.";

            editLockMessage.textContent =

                "Submission 2 is locked. Submission 1 feedback remains below for reference while you wait for your teacher to mark the corrected work.";

            return;

        }

        if (

            studentReviewData

        ) {

            editLockLabel.textContent =

                "MARKED";

            editLockTitle.textContent =

                "Your teacher has marked Submission 2.";

            editLockMessage.textContent =

                "Read the feedback below. You can also return to marked Submission 1 for comparison.";

        }

    }

    function syncSubmissionOneActions() {

        if (

            !currentSubmission ||

            appMode !== "student" ||

            isCorrectionProject() ||

            !studentReviewData

        ) {

            startCorrectionsButton.hidden =

                true;

            reviewActions.hidden =

                viewOriginalButton.hidden;

            return;

        }

        const correctionId =

            currentRevisionInfo

                ?.correction_submission_id ||

            null;

        startCorrectionsButton.hidden =

            false;

        startCorrectionsButton.textContent =

            correctionId

                ? "Open Corrections"

                : "Start Corrections";

        viewOriginalButton.hidden =

            true;

        reviewActions.hidden =

            false;

    }

    /* =========================================================

       REFRESH CURRENT CORRECTIONS STATE

    ========================================================= */

    async function refreshCurrentCorrectionsUI(

        {

            force = false

        } = {}

    ) {

        const requestId =

            ++correctionUiRequest;

        const submissionId =

            currentSubmission?.id;

        if (

            !submissionId ||

            appMode !== "student" ||

            !hasCurrentLearnerIdentity()

        ) {

            return;

        }

        let info =

            null;

        try {

            info =

                await fetchRevisionInfo(

                    submissionId,

                    {

                        force

                    }

                );

        }

        catch (

            error

        ) {

            console.warn(

                "Could not load submission revision information:",

                error

            );

            return;

        }

        if (

            requestId !==

                correctionUiRequest ||

            currentSubmission?.id !==

                submissionId

        ) {

            return;

        }

        setCurrentRevisionInfo(

            info

        );

        syncVersionLabels();

        if (

            integerVersion(

                info

                    ?.submission_number

            ) >= 2

        ) {

            const parentId =

                info

                    ?.parent_submission_id;

            if (

                !parentId

            ) {

                return;

            }

            let ownReview =

                null;

            try {

                ownReview =

                    await fetchStudentReview(

                        submissionId

                    );

            }

            catch (

                error

            ) {

                console.warn(

                    "Could not load Submission 2 teacher feedback:",

                    error

                );

            }

            if (

                requestId !==

                    correctionUiRequest ||

                currentSubmission?.id !==

                    submissionId

            ) {

                return;

            }

            if (

                ownReview

            ) {

                renderMarkedCorrection(

                    ownReview

                );

                return;

            }

            let parentReview =

                null;

            try {

                parentReview =

                    await fetchStudentReview(

                        parentId

                    );

            }

            catch (

                error

            ) {

                console.warn(

                    "Could not load Submission 1 feedback for corrections:",

                    error

                );

            }

            if (

                requestId !==

                    correctionUiRequest ||

                currentSubmission?.id !==

                    submissionId

            ) {

                return;

            }

            renderCorrectionReference(

                parentReview

            );

            return;

        }

        restoreSubmissionOneReviewUI();

        syncSubmissionOneActions();

    }

    /* =========================================================

       START / OPEN CORRECTIONS

    ========================================================= */

    async function startOrOpenCorrections() {

        if (

            !currentSubmission?.id ||

            !studentReviewData ||

            appMode !== "student"

        ) {

            return;

        }

        startCorrectionsButton.disabled =

            true;

        const previousText =

            startCorrectionsButton

                .textContent;

        startCorrectionsButton.textContent =

            "Opening…";

        try {

            const parentId =

                currentSubmission.id;

            let correctionId =

                currentRevisionInfo

                    ?.correction_submission_id ||

                null;

            if (

                !correctionId

            ) {

                let result;

                if (

                    currentIdentityType ===

                    "guest"

                ) {

                    result =

                        await sb.rpc(

                            "guest_start_corrections",

                            {

                                p_submission_id:

                                    parentId

                            }

                        );

                }

                else {

                    result =

                        await sb.rpc(

                            "student_start_corrections",

                            {

                                p_submission_id:

                                    parentId,

                                p_student_id:

                                    currentStudentProfile

                                        .student_id

                            }

                        );

                }

                if (

                    result.error

                ) {

                    throw result.error;

                }

                correctionId =

                    result.data;

            }

            if (

                !correctionId

            ) {

                throw new Error(

                    "The correction submission could not be created."

                );

            }

            revisionCache.delete(

                parentId

            );

            revisionCache.delete(

                correctionId

            );

            await loadStudentProject(

                correctionId

            );

        }

        catch (

            error

        ) {

            console.error(

                error

            );

            alert(

                error.message ||

                "Could not start corrections."

            );

        }

        finally {

            startCorrectionsButton.disabled =

                false;

            startCorrectionsButton.textContent =

                previousText;

        }

    }

    startCorrectionsButton.addEventListener(

        "click",

        startOrOpenCorrections

    );

    /* =========================================================

       VIEW ORIGINAL SUBMISSION

    ========================================================= */

    viewOriginalButton.addEventListener(

        "click",

        async () => {

            const parentId =

                currentRevisionInfo

                    ?.parent_submission_id;

            if (

                !parentId

            ) {

                return;

            }

            viewOriginalButton.disabled =

                true;

            const oldText =

                viewOriginalButton

                    .textContent;

            viewOriginalButton.textContent =

                "Opening…";

            try {

                if (

                    currentSubmission

                        ?.status !==

                        "submitted" &&

                    !studentReadOnly &&

                    editLockOwned

                ) {

                    await saveStudentMap(

                        false

                    );

                }

                await loadStudentProject(

                    parentId

                );

            }

            catch (

                error

            ) {

                console.error(

                    error

                );

                alert(

                    error.message ||

                    "Could not open Submission 1."

                );

            }

            finally {

                viewOriginalButton.disabled =

                    false;

                viewOriginalButton.textContent =

                    oldText;

            }

        }

    );

    /* =========================================================

       SUBMISSION 2 CONFIRMATION

    ========================================================= */

    submitButton.addEventListener(

        "click",

        event => {

            if (

                appMode !== "student" ||

                !isCorrectionProject()

            ) {

                return;

            }

            event.preventDefault();

            event.stopImmediatePropagation();

            closeFlyouts();

            if (

                !confirm(

                    "Submit your corrected work to your teacher?\n\n" +

                    "You won't be able to change Submission 2 afterwards."

                )

            ) {

                return;

            }

            submitToTeacher();

        },

        true

    );

    /* =========================================================

       PROJECT LOAD WRAPPER

    ========================================================= */

    const originalLoadStudentProject =

        loadStudentProject;

    loadStudentProject =

        async function (

            ...args

        ) {

            if (

                taskMembers

            ) {

                delete taskMembers

                    .dataset

                    .correctionBaseText;

            }

            currentRevisionInfo =

                null;

            parentReviewForCorrections =

                null;

            correctionUiRequest +=

                1;

            const result =

                await originalLoadStudentProject(

                    ...args

                );

            if (

                currentSubmission?.id &&

                appMode === "student"

            ) {

                await refreshCurrentCorrectionsUI();

            }

            return result;

        };

    /* =========================================================

       SUBMISSION 1 LIVE FEEDBACK

    ========================================================= */

    const previousApplyStudentReviewSnapshot =

        applyStudentReviewSnapshot;

    applyStudentReviewSnapshot =

        function (

            ...args

        ) {

            const result =

                previousApplyStudentReviewSnapshot(

                    ...args

                );

            if (

                appMode === "student" &&

                currentSubmission?.id &&

                currentRevisionInfo &&

                integerVersion(

                    currentRevisionInfo

                        .submission_number

                ) === 1

            ) {

                refreshCurrentCorrectionsUI({

                    force:

                        true

                });

            }

            return result;

        };

    /* =========================================================

       REVIEW RESET

    ========================================================= */

    const previousResetStudentReviewState =

        resetStudentReviewState;

    resetStudentReviewState =

        function (

            ...args

        ) {

            const result =

                previousResetStudentReviewState(

                    ...args

                );

            reviewActions.hidden =

                true;

            startCorrectionsButton.hidden =

                true;

            viewOriginalButton.hidden =

                true;

            correctionNote.hidden =

                true;

            inkNote.hidden =

                true;

            return result;

        };

    /* =========================================================

       MY PROJECTS — REVISION INFO

    ========================================================= */

    const originalFetchStudentProjects =

        fetchStudentProjects;

    fetchStudentProjects =

        async function (

            ...args

        ) {

            const projects =

                await originalFetchStudentProjects(

                    ...args

                );

            await Promise.all(

                projects.map(

                    async project => {

                        try {

                            project.revision_info =

                                await fetchRevisionInfo(

                                    project

                                        .submission_id

                                );

                        }

                        catch (

                            error

                        ) {

                            console.warn(

                                "Could not load project revision badge:",

                                error

                            );

                            project.revision_info =

                                null;

                        }

                    }

                )

            );

            return projects;

        };

    /* =========================================================

       MY PROJECTS — TASK FOLDER RENDERING

    ========================================================= */

    const originalRenderStudentProjectHistory =

        renderStudentProjectHistory;

    renderStudentProjectHistory =

        function (

            ...args

        ) {

            syncProfileScopeUI();

            if (

                !activeTaskScope

            ) {

                studentProjectsList.innerHTML =

                    `

<p class="helper-text">

Enter a task code above to open a task.

</p>

`;

                return;

            }

            const allProjects =

                currentStudentProjects;

            const taskProjects =

                allProjects

                    .filter(

                        projectMatchesActiveTask

                    )

                    .sort(

                        (a, b) => {

                            const av =

                                integerVersion(

                                    a

                                        .revision_info

                                        ?.submission_number

                                );

                            const bv =

                                integerVersion(

                                    b

                                        .revision_info

                                        ?.submission_number

                                );

                            return av - bv;

                        }

                    );

            currentStudentProjects =

                taskProjects;

            const result =

                originalRenderStudentProjectHistory(

                    ...args

                );

            currentStudentProjects =

                allProjects;

            const cards =

                Array.from(

                    studentProjectsList

                        .querySelectorAll(

                            ".student-project-card"

                        )

                );

            cards.forEach(

                (

                    card,

                    index

                ) => {

                    const project =

                        taskProjects[

                            index

                        ];

                    if (

                        !project

                    ) {

                        return;

                    }

                    const version =

                        integerVersion(

                            project

                                .revision_info

                                ?.submission_number

                        );

                    const title =

                        card.querySelector(

                            ".student-project-card-head > div:first-child strong"

                        );

                    if (

                        title

                    ) {

                        title.textContent =

                            version >= 2

                                ? "Correction"

                                : "First Submission";

                    }

                    card

                        .querySelector(

                            ".student-project-meta"

                        )

                        ?.remove();

                    card

                        .querySelector(

                            `.${PREFIX}-student-card-version`

                        )

                        ?.remove();

                    card

                        .querySelector(

                            ".student-project-members"

                        )

                        ?.remove();

                    card

                        .querySelector(

                            ".student-project-review-note"

                        )

                        ?.remove();

                    const badges =

                        card.querySelector(

                            ".student-project-badges"

                        );

                    if (

                        badges

                    ) {

                        const isMarked =

                            Boolean(

                                project

                                    .teacher_review_snapshot

                            );

                        badges.innerHTML =

                            isMarked

                                ? `
<span class="teacher-review-badge">
Marked
</span>
`

                                : `
<span class="student-project-status">
Not marked yet
</span>
`;

                    }

                }

            );

            return result;

        };

    /* =========================================================

       CORRECTION-SPECIFIC LOCK BANNER

    ========================================================= */

    const originalApplyStudentEditLockUI =

        applyStudentEditLockUI;

    applyStudentEditLockUI =

        function (

            ...args

        ) {

            const result =

                originalApplyStudentEditLockUI(

                    ...args

                );

            syncCorrectionLockBanner();

            return result;

        };

    /* =========================================================

       LIVE FEEDBACK DURING / AFTER CORRECTIONS

    ========================================================= */

    const originalShowUpdatedStudentReview =

        showUpdatedStudentReview;

    showUpdatedStudentReview =

        function (

            review

        ) {

            if (

                appMode === "student" &&

                isCorrectionProject()

            ) {

                if (

                    review

                ) {

                    renderMarkedCorrection(

                        review

                    );

                    statusBar.textContent =

                        "Your teacher has marked Submission 2 — Corrected Work.";

                    return;

                }

                refreshCurrentCorrectionsUI({

                    force:

                        true

                });

                return;

            }

            return originalShowUpdatedStudentReview(

                review

            );

        };

    /* =========================================================

       TASK-CODE GATE

       Replace the original input/button DOM nodes so all old

       app.js click / Enter listeners are physically removed from

       the controls the student is using.

    ========================================================= */

    const originalTaskCodeInput =

        studentTaskCode;

    const originalTaskCodeButton =

        openStudentTaskButton;

    const taskCodeInputUI =

        originalTaskCodeInput.cloneNode(

            true

        );

    const taskCodeButtonUI =

        originalTaskCodeButton.cloneNode(

            true

        );

    originalTaskCodeInput.replaceWith(

        taskCodeInputUI

    );

    originalTaskCodeButton.replaceWith(

        taskCodeButtonUI

    );

    taskCodeInputUI.value =

        "";

    taskCodeButtonUI.textContent =

        "Continue";

    async function lookupTaskForCode(

        code

    ) {

        let result;

        if (

            currentIdentityType ===

            "guest"

        ) {

            result =

                await sb.rpc(

                    "guest_get_task_by_code",

                    {

                        p_code:

                            code

                    }

                );

        }

        else {

            result =

                await sb.rpc(

                    "student_get_task_by_code",

                    {

                        p_code:

                            code,

                        p_student_id:

                            currentStudentProfile

                                .student_id

                    }

                );

        }

        if (

            result.error

        ) {

            throw result.error;

        }

        return Array.isArray(

            result.data

        )

            ? result.data[0]

            : result.data;

    }

    async function openUnlockedTaskFolder(

        task

    ) {

        unlockTaskFolder(

            task

        );

        await loadStudentProjectHistory();

        syncProfileScopeUI();

        profileHistoryCard

            ?.scrollIntoView({

                behavior:

                    "smooth",

                block:

                    "start"

            });

    }

    async function routeTaskCodeFromGate() {

        if (

            !hasCurrentLearnerIdentity()

        ) {

            return;

        }

        const code =

            taskCodeInputUI

                .value

                .trim()

                .toUpperCase();

        studentTaskError.hidden =

            true;

        if (

            !code

        ) {

            studentTaskError.textContent =

                "Enter the task code from your teacher.";

            studentTaskError.hidden =

                false;

            return;

        }

        taskCodeButtonUI.disabled =

            true;

        taskCodeInputUI.disabled =

            true;

        const oldText =

            taskCodeButtonUI

                .textContent;

        taskCodeButtonUI.textContent =

            "Checking…";

        try {

            const task =

                await lookupTaskForCode(

                    code

                );

            if (

                !task

            ) {

                throw new Error(

                    currentIdentityType ===

                        "guest"

                        ? "Task code not found, or this task does not allow guest students."

                        : "Task code not found for your class."

                );

            }

            /*

            Existing submission(s): task code opens the TASK FOLDER,

            never a map.

            */

            if (

                task.existing_submission_id

            ) {

                await openUnlockedTaskFolder(

                    task

                );

                return;

            }

            /*

            First ever attempt for this task:

            remember the task folder, then hand off to the existing

            app.js first-time flow. It will create/open Submission 1.

            */

            unlockTaskFolder(

                task

            );

            originalTaskCodeInput.value =

                code;

            await openTaskFromCode();

        }

        catch (

            error

        ) {

            console.error(

                "Could not open task code:",

                error

            );

            studentTaskError.textContent =

                error.message ||

                "Could not open this task.";

            studentTaskError.hidden =

                false;

        }

        finally {

            taskCodeButtonUI.disabled =

                false;

            taskCodeInputUI.disabled =

                false;

            taskCodeButtonUI.textContent =

                oldText ||

                "Continue";

        }

    }

    /*
     * Public bridge used by app.js after the startup sign-in flow.
     * Existing work must always follow:
     * Task code -> task folder -> pupil chooses a submission.
     */
    window.oeOpenTaskFolderFromCode =
        async function (
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

            taskCodeInputUI.value =
                normalizedCode;

            // Keep the detached original node in sync because the base
            // first-attempt flow still reads it when creating Submission 1.
            originalTaskCodeInput.value =
                normalizedCode;

            await routeTaskCodeFromGate();
        };

    taskCodeButtonUI.addEventListener(

        "click",

        () =>
            window.oeOpenTaskFolderFromCode(
                taskCodeInputUI.value
            )

    );

    taskCodeInputUI.addEventListener(

        "keydown",

        event => {

            if (

                event.key !==

                "Enter"

            ) {

                return;

            }

            event.preventDefault();

            window.oeOpenTaskFolderFromCode(
                taskCodeInputUI.value
            );

        }

    );

    /* =========================================================

       SWITCH TASK

       Closes the current task folder. No other project can be

       browsed until another valid task code is entered.

    ========================================================= */

    switchTaskButton.addEventListener(

        "click",

        () => {

            lockTaskFolders();

            taskCodeInputUI.value =

                "";

            studentTaskError.hidden =

                true;

            taskCodeInputUI.focus();

        }

    );

    /*

    If a brand-new registered task reaches group selection and

    the pupil cancels before creating Submission 1, return to the

    locked task-code gate.

    */

    cancelGroupButton.addEventListener(

        "click",

        () => {

            const hasProjectForScope =

                scopedProjects().length >

                0;

            if (

                !hasProjectForScope

            ) {

                lockTaskFolders();

                taskCodeInputUI.value =

                    "";

            }

        }

    );

    /* =========================================================

       ALWAYS-VISIBLE MY PROJECTS BUTTON

       This means "back to the currently unlocked task folder".

    ========================================================= */

    const quickMyProjectsButton =

        document.createElement(

            "button"

        );

    quickMyProjectsButton.type =

        "button";

    quickMyProjectsButton.className =

        `mode-button ${PREFIX}-my-projects`;

    quickMyProjectsButton.textContent =

        "← My Projects";

    quickMyProjectsButton.hidden =

        true;

    taskIntro.appendChild(

        quickMyProjectsButton

    );

    function showQuickMyProjectsButton() {

        quickMyProjectsButton.hidden =

            !(

                appMode ===

                    "student" &&

                currentSubmission?.id &&

                !studentWorkspace.hidden

            );

    }

    function hideQuickMyProjectsButton() {

        quickMyProjectsButton.hidden =

            true;

    }

    async function returnToUnlockedTaskFolder() {

        await returnToStudentProfile();

        syncProfileScopeUI();

        hideQuickMyProjectsButton();

    }

    quickMyProjectsButton.addEventListener(

        "click",

        async () => {

            quickMyProjectsButton.disabled =

                true;

            try {

                await returnToUnlockedTaskFolder();

            }

            catch (

                error

            ) {

                console.error(

                    "Could not return to My Projects:",

                    error

                );

            }

            finally {

                quickMyProjectsButton.disabled =

                    false;

            }

        }

    );

    /*

    The old More-menu My Projects button already calls the base

    returnToStudentProfile(). Because our history renderer is scoped,

    it also returns to the current task folder rather than exposing

    every task.

    */

    backToProfileButton.addEventListener(

        "click",

        () => {

            currentRevisionInfo =

                null;

            parentReviewForCorrections =

                null;

            reviewActions.hidden =

                true;

            correctionNote.hidden =

                true;

            inkNote.hidden =

                true;

            hideQuickMyProjectsButton();

        }

    );

    /*

    Wrap the CURRENT loadStudentProject function.

    */

    const previousLoadStudentProjectForQuickBack =

        loadStudentProject;

    loadStudentProject =

        async function (

            ...args

        ) {

            hideQuickMyProjectsButton();

            const result =

                await previousLoadStudentProjectForQuickBack(

                    ...args

                );

            showQuickMyProjectsButton();

            return result;

        };

    const previousOpenSubmissionReviewForQuickBack =

        openSubmissionReview;

    openSubmissionReview =

        async function (

            ...args

        ) {

            hideQuickMyProjectsButton();

            return previousOpenSubmissionReviewForQuickBack(

                ...args

            );

        };

    /* =========================================================

       PROFILE SAFETY

       Login starts at the task-code gate. Switching student also

       clears the unlocked task folder.

    ========================================================= */

    switchStudentButton.addEventListener(

        "click",

        () => {

            activeTaskScope =

                null;

            taskCodeInputUI.value =

                "";

            hideQuickMyProjectsButton();

        }

    );

    const profileVisibilityObserver =

        new MutationObserver(

            () => {

                if (

                    !studentProfilePage.hidden

                ) {

                    syncProfileScopeUI();

                }

            }

        );

    profileVisibilityObserver.observe(

        studentProfilePage,

        {

            attributes:

                true,

            attributeFilter: [

                "hidden"

            ]

        }

    );

    /*

    Initial state after a fresh page load:

    task-code gate visible; project history locked.

    */

    syncProfileScopeUI();

    showQuickMyProjectsButton();

})();