import { toast } from "react-toastify";

export default function usePincode(setFormData) {

    const handlePincode = async (value) => {

        if (value.length !== 6) {
            setFormData((prev) => ({
                ...prev,
                pincode: value,
                district: "",
                state: ""
            }));

            return;
        }

        if (!/^\d{6}$/.test(value)) {
            return;
        }

        try {
            const response = await fetch(
                `https://api.postalpincode.in/pincode/${value}`
            );

            const data = await response.json();

            if (
                data[0]?.Status === "Success" &&
                data[0]?.PostOffice?.length > 0
            ) {
                const postOffice = data[0].PostOffice[0];

                setFormData((prev) => ({
                    ...prev,
                    pincode: value,
                    district: postOffice.District || "",
                    state: postOffice.State || ""
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    pincode: value,
                    district: "",
                    state: ""
                }));

                toast.error("Invalid pincode");
            }

        } catch (error) {
            console.error("Pincode API Error:", error);
            
            toast.error("Failed to fetch pincode details", error);
            setFormData((prev) => ({
                ...prev,
                pincode: value,
                district: "",
                state: ""
            }));
        }
    };

    return { handlePincode };
}