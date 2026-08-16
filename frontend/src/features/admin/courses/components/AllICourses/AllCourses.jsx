import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import DeleteModal from "../../../../../components/ui/DeleteModal";

import CourseCard from "../CourseCard";
import InternshipSkeleton from "../../../internships/components/InternshipSkeleton";

import {
    getAllCourses,
    deleteCourse
} from "../../../../../services/api/course.service.js";

import "./AllCourses.css";


export default function AllCourses() {


    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const fetchCourses = async () => {

        try {
            const res = await getAllCourses();
            setCourses(res.data.courses);
        }
        catch {

            toast.error(
                "Failed to load courses"
            );

        }
        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        // eslint-disable-next-line react-hooks/immutability
        fetchCourses();

    }, []);




    const handleDelete = async (id) => {


        try {
            await deleteCourse(id);
            setCourses(
                prev => prev.filter(
                    item => item._id !== id
                )
            );
            toast.success(
                "Course deleted successfully"
            );
        }
        catch (error) {
            console.error("Delete failed:", error);

            toast.error(
                "Delete failed"
            );

        }


    };



    return (

        <div
            id="allCourses"
            className="fade-scroll"
        >


            <div id="allCoursesHeader">

                <h1>
                    All Courses
                </h1>


                <Link
                    to="/admin/course-form"
                    className="add-course-btn"
                >
                    + Add Course
                </Link>
            </div>



            <div id="allCoursesCards">


                {
                    loading ?

                        <InternshipSkeleton />


                        :

                        courses.length === 0 ?

                            <h3>
                                No courses Found
                            </h3>

                            :

                            <CourseCard
                                courses={courses}
                                onDelete={(id) => setDeleteId(id)}
                            />

                        }
                        <DeleteModal
        
        
                            open={deleteId !== null}
        
        
                            onCancel={() => setDeleteId(null)}
        
        
                            onConfirm={() => {
        
        
                                handleDelete(deleteId);
        
                                setDeleteId(null);
        
        
                            }}
        
        
                        />



            </div>


        </div>


    )

}
