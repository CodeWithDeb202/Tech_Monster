import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import DeleteModal from "../../../../../components/ui/DeleteModal";

import InternshipCard from "../InternshipsCard";
import InternshipSkeleton from "../InternshipSkeleton";

import api from "../../../../../services/api/axios";
import { API } from "../../../../../services/api/endpoints";

import "./AllInternships.css";


export default function AllInternships() {


    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);



    useEffect(() => {

        fetchInternships();

    }, []);



    const fetchInternships = async () => {

        try {

            const res = await api.get(
                API.INTERNSHIPS.BASE
            );


            setInternships(res.data.internships);


        }
        catch (error) {

            toast.error(
                "Failed to load internships"
            );

        }
        finally {

            setLoading(false);

        }

    };




    const handleDelete = async (id) => {


        try {


            await api.delete(
                API.INTERNSHIPS.BY_ID(id)
            );



            setInternships(
                prev => prev.filter(
                    item => item._id !== id
                )
            );



            toast.success(
                "Internship deleted successfully"
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
            id="allInternships"
            className="fade-scroll"
        >


            <div id="allInternshipsHeader">

                <h1>
                    All Internships
                </h1>


                <Link
                    to="/admin/internships-form"
                    className="add-internship-btn"
                >
                    + Add Internship
                </Link>


            </div>



            <div id="allInternshipsCards">


                {
                    loading ?

                        <InternshipSkeleton />


                        :

                        internships.length === 0 ?

                            <h3>
                                No Internship Found
                            </h3>


                            :

                            <InternshipCard

                                internships={internships}

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