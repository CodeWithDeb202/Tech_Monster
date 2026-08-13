import { useEffect, useState } from "react";

export default function useProfileImage(initialImage = "") {

    const [imageFile, setImageFile] =
        useState(null);

    const [preview, setPreview] =
        useState(initialImage || "");


    useEffect(() => {

        setPreview(initialImage || "");

    }, [initialImage]);


    const handleImageChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) return;


        setImageFile(file);

        setPreview(
            URL.createObjectURL(file)
        );
    };


    return {
        imageFile,
        preview,
        handleImageChange
    };
}