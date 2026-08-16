import { useEffect, useState } from "react";

import api from "../../../../services/api/axios";
import { API } from "../../../../services/api/endpoints";

const useApprovedModules = (courseSlug) => {

    const [approvedModuleIds, setApprovedModuleIds] =
        useState(new Set());

    useEffect(() => {

        if (!courseSlug) return;

        let active = true;

        const fetchApprovedModules = async () => {

            // Local cache
            try {

                const raw = localStorage.getItem(
                    `approvedModules_${courseSlug}`
                );

                if (raw) {

                    const cached =
                        JSON.parse(raw);

                    if (Array.isArray(cached)) {

                        setApprovedModuleIds(
                            new Set(cached)
                        );
                    }
                }

            } catch {
                // Ignore cache errors
            }


            // Backend
            try {

                const response =
                    await api.get(
                        API.SUBMISSIONS.COURSE(
                            courseSlug
                        )
                    );

                const submissions =
                    response?.data?.submissions || [];

                const approved =
                    new Set(
                        submissions
                            .filter(
                                item =>
                                    item.status ===
                                    "approved"
                            )
                            .map(
                                item =>
                                    item.moduleId
                            )
                            .filter(Boolean)
                    );

                if (active) {

                    setApprovedModuleIds(
                        approved
                    );

                    localStorage.setItem(
                        `approvedModules_${courseSlug}`,
                        JSON.stringify(
                            [...approved]
                        )
                    );
                }

            } catch {
                // Keep local cache
            }
        };

        fetchApprovedModules();

        return () => {
            active = false;
        };

    }, [courseSlug]);

    return approvedModuleIds;
};

export default useApprovedModules;