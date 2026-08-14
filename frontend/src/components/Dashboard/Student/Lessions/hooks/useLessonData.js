import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../../../../../services/api/axios";
import { API } from "../../../../../services/api/endpoints";

import { normalizeLessonData } from "../utils/normalizeLessonData";

const getContentEndpoint = (
    type,
    slug
) => {

    if (type === "internship") {

        return API.INTERNSHIPS.BY_SLUG
            ? API.INTERNSHIPS.BY_SLUG(slug)
            : `/internships/slug/${slug}`;
    }

    return API.COURSES.BY_SLUG
        ? API.COURSES.BY_SLUG(slug)
        : `/courses/slug/${slug}`;
};

const useLessonData = (
    courseSlug,
    contentType
) => {

    const [lessonData, setLessonData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    useEffect(() => {

        if (!courseSlug) {
            setError("Learning content not found.");
            setLoading(false);
            return;
        }

        let mounted = true;

        const fetchLearningContent = async () => {

            try {

                setLoading(true);
                setError(null);

                const response = await api.get(
                    getContentEndpoint(
                        contentType,
                        courseSlug
                    )
                );

                if (!mounted) return;

                const data =
                    response?.data?.course ||
                    response?.data?.internship ||
                    response?.data?.data ||
                    response?.data ||
                    null;

                if (!data) {

                    throw new Error(
                        `${contentType} content could not be loaded.`
                    );
                }

                setLessonData(
                    normalizeLessonData(data)
                );

            } catch (err) {

                if (!mounted) return;

                console.error(
                    "Learning content error:",
                    err
                );

                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    `Unable to load ${contentType} content.`;

                setError(message);

                toast.error(message);

            } finally {

                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchLearningContent();

        return () => {
            mounted = false;
        };

    }, [courseSlug, contentType]);

    return {
        lessonData,
        setLessonData,
        loading,
        error
    };
};

export default useLessonData;