import { useState } from "react";

export default function useProfileImage() {
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    return {
        imageFile,
        preview,
        handleImageChange
    };
}