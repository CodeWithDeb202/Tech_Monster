import { useEffect, useState } from "react";

const useLessonPreferences = () => {

    const [search, setSearch] = useState(
        () =>
            localStorage.getItem(
                "lessonSearch"
            ) || ""
    );

    const [readingMode, setReadingMode] =
        useState(
            () =>
                localStorage.getItem(
                    "readingMode"
                ) === "true"
        );


    useEffect(() => {

        localStorage.setItem(
            "lessonSearch",
            search
        );

    }, [search]);


    useEffect(() => {

        localStorage.setItem(
            "readingMode",
            readingMode
        );

    }, [readingMode]);


    return {
        search,
        setSearch,
        readingMode,
        setReadingMode
    };
};

export default useLessonPreferences;