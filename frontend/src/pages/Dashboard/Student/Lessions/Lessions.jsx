import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import "./Lessions.css";

import { toast } from "react-toastify";
import api from "../../../../services/api/axios";
import { API } from "../../../../services/api/endpoints";

// Components
import LessonSidebar from "../../../../components/Dashboard/Student/Lessions/LessonSidebar";
import LessonContent from "../../../../components/Dashboard/Student/Lessions/LessonContent";
import Pagination from "../../../../components/Dashboard/Student/Lessions/Pagination";

const normalizeCourseData = (courseData) => {
    if (!courseData?.modules) {
        return {
            title: courseData?.title || "Course",
            category: courseData?.category || "",
            modules: [],
            lessons: []
        };
    }

    const modules = courseData.modules.map((module, moduleIndex) => {
        const sections = (module.lessons || []).map((lesson, lessonIndex) => {
            const notes = lesson.notes || {};
            return {
                id: lesson.lessonId || `${moduleIndex + 1}-${lessonIndex + 1}`,
                title: lesson.lessonTitle || `Lesson ${lessonIndex + 1}`,
                heading: notes.heading || lesson.lessonTitle || `Lesson ${lessonIndex + 1}`,
                paragraph: notes.overview || notes.paragraph || "",
                completed: false,
                locked: false,
                bookmarked: false,
                lesson,
                moduleTitle: module.moduleTitle || `Module ${moduleIndex + 1}`
            };
        });

        return {
            id: module.moduleId || `module-${moduleIndex + 1}`,
            title: module.moduleTitle || `Module ${moduleIndex + 1}`,
            length: sections.length,
            sections
        };
    });

    return {
        ...courseData,
        title: courseData.title || "Course",
        category: courseData.category || "",
        modules,
        lessons: modules.flatMap((module) => module.sections)
    };
};

// Apply module-approval-aware + intra-module sequential locking.
//
// Rules:
//  - Module 1 (index 0) is always accessible (subject to intra-module locking).
//  - Module N+1 (index > 0) can ONLY start once Module N's task has been
//    APPROVED by the admin (`approvedModuleIds.has(prevModule.id)`). Until then
//    EVERY lesson in Module N+1 stays locked.
//  - Once a module can start, its lessons follow strict sequential unlocking:
//    lesson N+1 inside the module is locked until lesson N is completed.
const applyModuleLocking = (data, approvedModuleIds) => {
    if (!data?.modules) return data;

    const modules = data.modules.map((module, moduleIndex) => {
        // A module can start if it is the first module OR the previous
        // module's task submission has been approved by an admin.
        const canStart =
            moduleIndex === 0 ||
            approvedModuleIds.has(data.modules[moduleIndex - 1].id);

        const sections = (module.sections || []).map((section, sectionIndex) => {
            let locked = false;

            if (!canStart) {
                // Module N+1 is fully locked until Module N's task is approved.
                locked = true;
            } else if (sectionIndex > 0) {
                // Intra-module sequential unlock.
                locked = !module.sections[sectionIndex - 1].completed;
            }

            return { ...section, locked };
        });

        return { ...module, sections, canStart };
    });

    return {
        ...data,
        modules,
        lessons: modules.flatMap((module) => module.sections)
    };
};

// Normalize a slug so both "frontend_dev" and "frontend-dev" resolve to the
// dash-based slug used by the backend/JSON files.
const normalizeSlug = (slug) =>
    String(slug || "")
        .trim()
        .toLowerCase()
        .replace(/_/g, "-");

export default function Lessions() {
    const { slug, courseSlug: routeCourseSlug } = useParams();
    const [courseSlug, setCourseSlug] = useState(
        normalizeSlug(routeCourseSlug || slug || "")
    );

    const [activeLesson, setActiveLesson] = useState(0);
    const [lessonDataState, setLessonDataState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [readPercent, setReadPercent] = useState(0);
    const [contentType, setContentType] = useState("course");

    // Completed lesson IDs for the current course. This is the single source
    // of truth for completion. Persisted to localStorage (fast cache) and
    // synced to the backend (durable).
    const [completedLessonIds, setCompletedLessonIds] = useState(() => {
        try {
            const raw = localStorage.getItem(`completedLessons_${courseSlug}`);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    // Module IDs whose task submission has been APPROVED by an admin.
    // Module N+1 lessons stay locked until Module N's task is approved.
    const [approvedModuleIds, setApprovedModuleIds] = useState(() => {
        try {
            const raw = localStorage.getItem(`approvedModules_${courseSlug}`);
            return raw ? new Set(JSON.parse(raw)) : new Set();
        } catch {
            return new Set();
        }
    });

    // Ref to the scrollable reading container (forwarded to LessonContent).
    const contentContainerRef = useRef(null);


    // Reset the reading container's scroll position to the top INSTANTLY
    // (no smooth scrolling) whenever the selected lesson changes.
    // useLayoutEffect runs synchronously before the browser paints, so the
    // new lesson's heading appears immediately at the top edge.
    // Note: depend on `activeLesson` (declared at the top of the component)
    // rather than `currentLesson` to avoid a Temporal Dead Zone access.
    useLayoutEffect(() => {
        const el = contentContainerRef.current;
        if (!el) return;

        // Force an instant jump (override any CSS `scroll-behavior: smooth`).
        el.style.scrollBehavior = 'auto';
        el.scrollTop = 0;
    }, [activeLesson]);

    useEffect(() => {
        localStorage.setItem("activeLesson", activeLesson);
    }, [activeLesson]);

    const [search, setSearch] = useState(() => localStorage.getItem("lessonSearch") || "");

    useEffect(() => {
        localStorage.setItem("lessonSearch", search);
    }, [search]);

    const [readingMode, setReadingMode] = useState(() => localStorage.getItem("readingMode") === "true");

    useEffect(() => {
        localStorage.setItem("readingMode", readingMode);
    }, [readingMode]);

    const getContentEndpoint = (targetSlug) =>
        API.COURSES?.BY_SLUG
            ? API.COURSES.BY_SLUG(targetSlug)
            : `/courses/slug/${targetSlug}`;

    const getCompleteLessonEndpoint = (targetSlug) =>
        contentType === "course" && API.COURSES?.COMPLETE_LESSON
            ? API.COURSES.COMPLETE_LESSON(targetSlug)
            : API.INTERNSHIPS.COMPLETE_LESSON(targetSlug);

    // Resolve a course slug when the URL does not provide one.
    // Priority: (1) enrolled course/internship, (2) first available course.
    const resolveCourseSlug = async () => {
        try {
            const myCourseRes = await api.get("/courses/student/my");
            const myCourses = myCourseRes?.data?.courses || [];
            const enrolledCourseSlug =
                myCourses.find((item) => item.slug)?.slug ||
                myCourses[0]?.course?.slug ||
                myCourses[0]?.slug;

            if (enrolledCourseSlug) {
                return normalizeSlug(enrolledCourseSlug);
            }
        } catch {
            // Fall through to internships for backwards compatibility.
        }

        // 1) Try the logged-in student's enrolled internships first.
        try {
            const myRes = await api.get("/internships/student/my");
            const myList = myRes?.data?.internships || [];
            const enrolledSlug =
                myList.find((item) => item.slug)?.slug ||
                myList[0]?.internship?.slug ||
                myList[0]?.slug;

            if (enrolledSlug) {
                return normalizeSlug(enrolledSlug);
            }
        } catch {
            // Fall through to the public list if the auth call fails.
        }

        // 2) Fall back to the first available published course.
        try {
            const allCourseRes = await api.get("/courses");
            const allCourses = allCourseRes?.data?.courses || [];
            const firstCourseSlug =
                allCourses.find((item) => item.slug)?.slug || allCourses[0]?.slug || null;
            if (firstCourseSlug) {
                return normalizeSlug(firstCourseSlug);
            }
        } catch {
            // Fall through to internships for backwards compatibility.
        }

        // 3) Fall back to the first available published internship.
        try {
            const allRes = await api.get("/internships");
            const allList = allRes?.data?.internships || [];
            const firstSlug =
                allList.find((item) => item.slug)?.slug || allList[0]?.slug || null;
            return firstSlug ? normalizeSlug(firstSlug) : null;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        let mounted = true;

        const fetchCourse = async () => {
            try {
                setLoading(true);
                setError(null);

                let targetSlug = courseSlug;

                // No slug in the URL -> resolve a default course.
                if (!targetSlug) {
                    targetSlug = await resolveCourseSlug();
                    if (mounted && targetSlug) {
                        setCourseSlug(targetSlug);
                    }
                }

                if (!targetSlug) {
                    if (mounted) {
                        setError("No internship found. Please enroll in a course first.");
                        setLoading(false);
                    }
                    return;
                }

                let response = null;
                let sourceType = "course";

                try {
                    response = await api.get(getContentEndpoint(targetSlug));
                } catch {
                    response = await api.get(`/internships/slug/${targetSlug}`);
                    sourceType = "internship";
                }

                const courseData =
                    response?.data?.course ||
                    response?.data?.internship ||
                    response?.data ||
                    null;

                if (!mounted) return;

                if (courseData) {
                    setContentType(sourceType);
                    setLessonDataState(normalizeCourseData(courseData));
                    setActiveLesson(0);
                } else {
                    setError("Course content could not be loaded.");
                    toast.error("Course content could not be loaded.");
                }
            } catch {
                if (!mounted) return;
                setError("Unable to load lesson data right now.");
                toast.error("Unable to load lesson data right now.");
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchCourse();

        return () => {
            mounted = false;
        };
    }, [courseSlug]);

    // ============================================================
    // Rehydrate completed lessons on mount / course change.
    // 1) Instant fast path: read from localStorage cache.
    // 2) Authoritative source: fetch from the backend and merge.
    // ============================================================
    useEffect(() => {
        if (!courseSlug) return;

        let active = true;

        // Authoritative backend sync.
        const fetchCompleted = async () => {
            // Fast client-side fallback/cache first (covers slugs that were
            // resolved after initial mount).
            try {
                const raw = localStorage.getItem(`completedLessons_${courseSlug}`);
                if (raw) {
                    const cached = JSON.parse(raw);
                    if (Array.isArray(cached)) {
                        setCompletedLessonIds(cached);
                    }
                }
            } catch (err) {
                const msg = err?.response?.data?.message || err?.message;
                toast.error(msg);
                // ignore malformed cache
            }

            try {
                const completedEndpoint =
                    contentType === "course" && API.COURSES?.COMPLETED_LESSONS
                        ? API.COURSES.COMPLETED_LESSONS(courseSlug)
                        : API.INTERNSHIPS.COMPLETED_LESSONS(courseSlug);

                const res = await api.get(completedEndpoint);
                const list = res?.data?.completedLessons;
                if (active && Array.isArray(list)) {
                    // setCompletedLessonIds(list);
                    localStorage.setItem(
                        `completedLessons_${courseSlug}`,
                        JSON.stringify(list)
                    );
                }
            } catch (err) {
                const msg = err?.response?.data?.message || err?.message;
                toast.error(msg);
                // Keep the local cache on network/backend errors.
            }
        };

        fetchCompleted();

        return () => {
            active = false;
        };
    }, [courseSlug, contentType]);

    // Persist completed lesson IDs to localStorage whenever they change.
    useEffect(() => {
        if (!courseSlug) return;
        try {
            localStorage.setItem(
                `completedLessons_${courseSlug}`,
                JSON.stringify(completedLessonIds)
            );
        } catch {
            // ignore write errors
        }
    }, [completedLessonIds, courseSlug]);

    // ============================================================
    // 🛑 TEMPORARY TESTING CODE: Clear completed lessons on refresh
    // TODO: Remove this entire useEffect before deployment
    // ============================================================
    useEffect(() => {
        if (!courseSlug) return;

        const handleRefresh = () => {
            // Removes only the specific completed lessons key for this course
            localStorage.removeItem(`completedLessons_${courseSlug}`);
        };

        // 'beforeunload' triggers right before the user refreshes or closes the tab
        window.addEventListener("beforeunload", handleRefresh);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener("beforeunload", handleRefresh);
        };
    }, [courseSlug]);
    // ============================================================

    // ============================================================
    // Fetch approved module task submissions from the backend.
    // A module unlocks Module N+1 only when its task submission has
    // been APPROVED by an admin.
    // ============================================================
    useEffect(() => {
        if (!courseSlug) return;

        let active = true;

        const fetchApprovedModules = async () => {
            // Fast client-side cache fallback.
            try {
                const raw = localStorage.getItem(`approvedModules_${courseSlug}`);
                if (raw) {
                    const cached = JSON.parse(raw);
                    if (Array.isArray(cached)) {
                        setApprovedModuleIds(new Set(cached));
                    }
                }
            } catch {
                // ignore malformed cache
            }

            try {
                const res = await api.get(API.SUBMISSIONS.COURSE(courseSlug));
                const subs = res?.data?.submissions || [];
                const approved = new Set(
                    subs
                        .filter((s) => s.status === "approved")
                        .map((s) => s.moduleId)
                        .filter(Boolean)
                );

                if (active) {
                    setApprovedModuleIds(approved);
                    localStorage.setItem(
                        `approvedModules_${courseSlug}`,
                        JSON.stringify([...approved])
                    );
                }
            } catch {
                // Keep local cache on network/backend errors.
            }
        };

        fetchApprovedModules();

        return () => {
            active = false;
        };
    }, [courseSlug]);

    // Derive the lesson list with `completed` flags sourced from the persisted
    // `completedLessonIds`, then apply module-approval-aware locking.
    const lessonData = useMemo(() => {
        if (!lessonDataState?.modules) return lessonDataState;

        const completedSet = new Set(completedLessonIds);

        const modules = lessonDataState.modules.map((module) => ({
            ...module,
            sections: (module.sections || []).map((section) => ({
                ...section,
                completed: completedSet.has(section.id)
            }))
        }));

        return applyModuleLocking(
            {
                ...lessonDataState,
                modules,
                lessons: modules.flatMap((module) => module.sections)
            },
            approvedModuleIds
        );
    }, [lessonDataState, completedLessonIds, approvedModuleIds]);

    const lessons = useMemo(() => lessonData?.lessons || [], [lessonData]);
    const currentLesson = lessons[activeLesson] || null;

    const filteredLessons = useMemo(() => {
        if (!lessonData?.modules) return [];

        const query = search.toLowerCase();
        return lessonData.modules.filter((module) => {
            const matchesModule = module.title.toLowerCase().includes(query);
            const matchesLesson = module.sections.some((section) =>
                section.heading.toLowerCase().includes(query)
            );
            return matchesModule || matchesLesson;
        });
    }, [lessonData, search]);

    if (loading) {
        return (
            <motion.div className="lesson-layout" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div id="lesson-right" style={{ width: "100%" }}>
                    <div className="lesson-page--loading">Loading lesson content...</div>
                </div>
            </motion.div>
        );
    }

    if (error || !lessonData || !lessons.length) {
        return (
            <motion.div className="lesson-layout" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div id="lesson-right" style={{ width: "100%" }}>
                    <div className="lesson-page--error">{error || "No lesson content found for this course."}</div>
                </div>
            </motion.div>
        );
    }

    const handleNext = () => {
        if (activeLesson < lessons.length - 1) {
            setActiveLesson((prev) => prev + 1);

            // Instant jump (no smooth scroll) when switching lessons.
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "auto"
            });
        }
    };

    const handlePrevious = () => {
        if (activeLesson > 0) {
            setActiveLesson((prev) => prev - 1);

            // Instant jump (no smooth scroll) when switching lessons.
            document.querySelector(".lesson-right")?.scrollTo({
                top: 0,
                left: 0,
                behavior: "auto"
            });
        }
    };

    const handleComplete = () => {
        if (!currentLesson) return;

        // If already completed, do nothing (avoid re-triggering).
        if (currentLesson.completed) {
            return;
        }

        const lessonId = currentLesson.id;

        // Update the single source of truth (completed lesson IDs). This
        // immediately refreshes the progress bar, checkmarks and lock icons
        // via the derived `lessonData` memo.
        setCompletedLessonIds((prev) => {
            if (prev.includes(lessonId)) return prev;
            const updated = [...prev, lessonId];

            // Write the fast client-side cache.
            try {
                localStorage.setItem(
                    `completedLessons_${courseSlug}`,
                    JSON.stringify(updated)
                );
            } catch {
                // ignore write errors
            }

            // Fire-and-forget persistence to the database.
            if (courseSlug) {
                api.post(
                    getCompleteLessonEndpoint(courseSlug),
                    { lessonId }
                ).catch(() => {
                    // Backend sync is best-effort; local cache keeps progress.
                });
            }

            return updated;
        });

        setReadPercent(100);

        toast.success("Lesson Completed 🎉");
    };

    const toggleBookmark = () => {
        if (!currentLesson) return;

        const isBookmarked = currentLesson.bookmarked;

        const updatedModules = lessonDataState.modules.map((module) => ({
            ...module,
            sections: module.sections.map((lesson) =>
                lesson.id === currentLesson.id ? { ...lesson, bookmarked: !lesson.bookmarked } : lesson
            )
        }));

        setLessonDataState({
            ...lessonDataState,
            modules: updatedModules,
            lessons: updatedModules.flatMap((module) => module.sections)
        });

        if (isBookmarked) {
            toast.info("Bookmark removed");
        } else {
            toast.success("Lesson bookmarked ⭐");
        }
    };

    const completedLessons = lessons.filter((lesson) => lesson.completed).length;
    const progress = lessons.length ? Math.round((completedLessons / lessons.length) * 100) : 0;

    return (
        <motion.div
            className={`lesson-layout ${readingMode ? "reading" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div id="lession-left">
                {!readingMode && (
                    <LessonSidebar
                        lessonData={lessonData}
                        filteredLessons={filteredLessons}
                        search={search}
                        setSearch={setSearch}
                        lessons={lessons}
                        activeLesson={currentLesson.id}
                        progress={progress}
                        completedLessons={completedLessons}
                        courseSlug={courseSlug}
                        approvedModuleIds={approvedModuleIds}
                        setActiveLesson={(lessonId) => {
                            const index = lessons.findIndex((lesson) => lesson.id === lessonId);
                            if (index !== -1) {
                                setActiveLesson(index);
                                // Reset reading progress when switching to a different lesson.
                                // The completed flag will surface 100% in LessonContent.
                                setReadPercent(0);
                            }
                        }}
                    />
                )}
            </div>

            <div id="lesson-right">
                <LessonContent
                    lesson={currentLesson}
                    lessonData={lessonData}
                    activeLesson={activeLesson}
                    handleComplete={handleComplete}
                    toggleBookmark={toggleBookmark}
                    readingMode={readingMode}
                    setReadingMode={setReadingMode}
                    readPercent={readPercent}
                    completed={currentLesson?.completed || false}
                    onScrollProgress={setReadPercent}
                    contentRef={contentContainerRef}
                />

                <Pagination
                    current={activeLesson}
                    total={lessons.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                />
            </div>
        </motion.div>
    );
}
