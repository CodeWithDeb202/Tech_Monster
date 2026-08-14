import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

import {
    getLearningData
} from "../services/learning.service.js";

import StudentInternship from "../models/StudentInternship.js";
import Course from "../models/Course.js";
import Internship from "../models/Internship.js";


export const getLearningContent = asyncHandler(
    async (req, res) => {

        const { type, slug } = req.params;

        // --------------------------------
        // Validate type
        // --------------------------------

        if (
            type !== "course" &&
            type !== "internship"
        ) {
            throw new AppError(
                "Invalid learning type",
                400
            );
        }


        // --------------------------------
        // Get MongoDB document
        // --------------------------------

        const Model =
            type === "course"
                ? Course
                : Internship;


        const learning = await Model.findOne({
            slug
        });


        if (!learning) {

            throw new AppError(
                `${type === "course" ? "Course" : "Internship"} not found`,
                404
            );

        }


        // --------------------------------
        // Check student enrollment
        // --------------------------------

        const enrollmentQuery = {

            student: req.user._id

        };


        if (type === "course") {

            enrollmentQuery.course =
                learning._id;

        } else {

            enrollmentQuery.internship =
                learning._id;

        }


        const enrollment =
            await StudentInternship.findOne(
                enrollmentQuery
            );


        if (!enrollment) {

            throw new AppError(
                `You are not enrolled in this ${type}`,
                403
            );

        }


        // --------------------------------
        // Read JSON learning data
        // --------------------------------

        const learningData =
            await getLearningData(
                type,
                slug
            );


        if (!learningData) {

            throw new AppError(
                `${type} learning data not found`,
                404
            );

        }


        // --------------------------------
        // Response
        // --------------------------------

        return res.status(200).json({

            success: true,

            type,

            learning: {

                _id: learning._id,

                title:
                    learningData.title ||
                    learning.title,

                slug:
                    learning.slug,

                category:
                    learningData.category ||
                    learning.category,

                description:
                    learningData.description ||
                    learning.description,

                thumbnail:
                    learning.thumbnail,

                level:
                    learning.level,

                duration:
                    learning.duration,

                totalTasks:
                    learning.totalTasks,

                totalNotes:
                    learning.totalNotes,

                progress:
                    enrollment.progress,

                status:
                    enrollment.status,

                completedTasks:
                    enrollment.completedTasks,

                completedNotes:
                    enrollment.completedNotes,

                completedLessons:
                    enrollment.completedLessons || [],

                modules:
                    learningData.modules || []

            }

        });

    }
);