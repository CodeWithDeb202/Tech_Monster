import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import DeleteModal from "../../../../../components/ui/DeleteModal";

import CourseCard from "../CourseCard";
import InternshipSkeleton from "../../../internships/components/InternshipSkeleton";

import api from "../../../../../services/api/axios";
import { API } from "../../../../../services/api/endpoints";

import "./AllCourses.css";


export default function AllCourses() {


    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);



    useEffect(() => {

        // eslint-disable-next-line react-hooks/immutability
        fetchCourses();

    }, []);



    const fetchCourses = async () => {

        try {

            const res = await api.get(
                API.COURSES.BASE
            );


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




    const handleDelete = async (id) => {


        try {


            await api.delete(
                API.COURSES.BY_ID(id)
            );



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
