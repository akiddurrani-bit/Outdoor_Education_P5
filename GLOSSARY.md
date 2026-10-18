# Outdoor Education Map Maker

A tool for Outdoor Education lessons in which students build abstract maps of a real site and teachers review them.

## Language

### Setting work

**Teacher**:
Anyone signed in to the teacher portal. Every Teacher can see and manage every Class, Task and Project.
_Avoid_: Admin, staff

**Task**:
An activity a teacher sets for one or more Classes, with instructions, the tools students may use, and optionally a Reference Map.
_Avoid_: Activity, assignment, lesson

**Task Code**:
The short code students enter to open a Task.
_Avoid_: Join code, PIN

**Class**:
A named group of students, such as TG1. Students identify themselves by choosing their Class and their name from its Roster, without a password.
_Avoid_: Form, section

**Roster**:
The list of student names belonging to a Class.
_Avoid_: Class list, register

**Reference Map**:
An image of the real site that students can see only while holding a button, for comparison with their own map.
_Avoid_: Base map, answer map

### Student work

**Project**:
The one map a student, or a Group of students, builds for one Task. It exists from the moment work starts, not only once it is handed in.
_Avoid_: Submission, map file, attempt

**Submitted**:
The state of a Project that has been handed to the teacher. Any one member of the Group can submit on behalf of all of them, and a Submitted Project can still be edited and handed in again.
_Avoid_: Final, completed

**Group**:
The set of students from one Class sharing one Project for one Task, chosen by whichever member opens the Task first. A student working alone is a Group of one; Groups do not carry over between Tasks.
_Avoid_: Team, pair

### Map features

**Landmark**:
A named area symbol on the map, drawn either as a fixed shape or freehand.
_Avoid_: Object, shape, building

**Route**:
A named line on the map; every Route is either a Path or a Road.
_Avoid_: Line, track

**Path**:
A Route drawn dashed, representing a walkway or trail.
_Avoid_: Walkway, trail

**Road**:
A Route drawn as a solid double-edged line, representing a road for vehicles.
_Avoid_: Street

**North Arrow**:
The arrow a student rotates to show which way is north on their map.
_Avoid_: Compass

**Legend**:
The key listing every Landmark and Route on the map, built automatically from them.
_Avoid_: Key

### Teacher feedback

**Review**:
A teacher's written feedback together with their free-form red-pen ink, laid over one Project without changing the student's map. A Project has at most one Review; the teacher saves it, and saving again updates it rather than adding another.
_Avoid_: Marking, comments, annotation, submitting (for teachers)

**Marked**:
The state of a Project once a teacher has saved a Review for it. There is no hidden draft Review.
_Avoid_: Graded, checked, returned

**Resubmitted**:
The state of a Marked Project that the student handed in again after its Review was last saved. It awaits a fresh Review; until then the student still sees the previous one.
_Avoid_: Re-marked, updated
