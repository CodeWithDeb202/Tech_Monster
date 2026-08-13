import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import "./AccountForm.css";

import useAuth from "../../../../../hooks/useAuth";
import { tokenStorage } from "../../../../../services/auth/tokenStorage";

import {
  updateProfile,
  uploadProfileImage
} from "../../../../../services/api/profileService";

import {
  getInitialFormData
} from "../../../../../utils/initialFormData";

import {
  validateForm
} from "../../../../../utils/validation";

import useProfileImage from "./hooks/useProfileImage";
import usePincode from "./hooks/usePincode";
import useSkills from "./hooks/useSkills";

import {
  PersonalDetails,
  EducationDetails,
  AddressDetails,
} from "./components";


export default function AccountForm({
  initialEmail,
  editData,
  onSubmitForm
}) {

  const { updateUser } = useAuth();

  const loginUser = tokenStorage.getUser();

  const [formData, setFormData] = useState(() => {

    const initialData =
      getInitialFormData(
        loginUser?.email ||
        initialEmail ||
        ""
      );

    if (editData) {

      return {
        ...initialData,
        ...editData
      };

    }

    return initialData;

  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  // ==============================
  // PROFILE IMAGE
  // ==============================

  const {
    imageFile,
    preview,
    handleImageChange
  } = useProfileImage(
    editData?.avatar
  );


  // ==============================
  // PINCODE
  // ==============================

  const {
    handlePincode
  } = usePincode(setFormData);


  // ==============================
  // SKILLS
  // ==============================

  const {
    skillInput,
    setSkillInput,
    addSkill,
    removeSkill
  } = useSkills(
    formData,
    setFormData
  );


  // ==============================
  // INPUT CHANGE
  // ==============================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "pincode") {
      handlePincode(value);
    }
  };


  // ==============================
  // FORM SUBMIT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM DATA BEFORE SUBMIT:", formData);

    const {
      errors: validationErrors,
      isValid
    } = validateForm(formData);

    setErrors(validationErrors);
    if (!isValid) return;
    setLoading(true);

    try {
      let latestUser = null;

      // Upload profile image
      if (imageFile) {

        const form = new FormData();

        form.append(
          "avatar",
          imageFile
        );

        const response = await uploadProfileImage(form);

        latestUser = response.data.user;
      }

      // Update profile
      const response = await updateProfile(formData);

      latestUser = response.data.user;

      // Update auth context
      updateUser(latestUser);

      // Notify parent
      onSubmitForm(latestUser);

      toast.success(
        "Profile updated successfully!"
      );

    } catch (error) {

      console.error(
        "Profile Update Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Profile update failed"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <>

      {/* Username */}
      <div id="username-box">
        <h2>
          @{loginUser?.username}
        </h2>
      </div>

      {/* Account Form */}

      <motion.form
        id="account-form-container"

        initial={{
          opacity: 0,
          y: 20
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        transition={{
          duration: 0.5
        }}

        onSubmit={handleSubmit}
      >

        <PersonalDetails
          formData={formData}
          errors={errors}
          preview={preview}
          handleChange={handleChange}
          handleImageChange={handleImageChange}
        />

        <EducationDetails
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          addSkill={addSkill}
          removeSkill={removeSkill}
        />

        <AddressDetails
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />

        {/* Submit */}

        <button
          disabled={loading}
          type="submit"
          id="submit-btn"
        >
          {loading
            ? "Saving..."
            : "Save & profile view"
          }
        </button>
      </motion.form>
    </>
  );
}