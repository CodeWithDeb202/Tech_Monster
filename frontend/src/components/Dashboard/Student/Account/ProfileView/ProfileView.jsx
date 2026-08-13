import { motion } from "framer-motion";

import "./ProfileView.css";

import useProfileEdit from "./hooks/useProfileEdit";

import {
  ProfileHeader,
  PersonalDetails,
  EducationDetails,
  SkillsSection,
  AddressDetails,
  BioSection,
  BadgesSection
} from "./components";


export default function ProfileView({
  userData,
  onUpdateData,
  onEdit
}) {

  const {
    data,

    editingField,
    tempValue,

    saving,
    imageLoading,

    setTempValue,

    handleEditClick,
    handleCancel,
    handleSave,
    handleImageUpdate

  } = useProfileEdit({
    userData,
    onUpdateData
  });


  return (

    <motion.div
      id="profile-view-container"

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
    >

      {/* ============================== */}
      {/* PROFILE VIEW HEADER */}
      {/* ============================== */}

      <div id="profile-view-header">

        <h2>
          My Profile
        </h2>

        <button
          type="button"
          id="edit-profile-btn"
          onClick={onEdit}
        >
          Edit Profile
        </button>

      </div>

      {/* ============================== */}
      {/* PROFILE HEADER */}
      {/* ============================== */}

      <ProfileHeader
        data={data}
        imageLoading={imageLoading}
        handleImageUpdate={
          handleImageUpdate
        }
      />


      {/* ============================== */}
      {/* PERSONAL DETAILS */}
      {/* ============================== */}

      <PersonalDetails
        data={data}

        editingField={editingField}
        tempValue={tempValue}
        setTempValue={setTempValue}

        handleEditClick={
          handleEditClick
        }

        handleCancel={
          handleCancel
        }

        handleSave={
          handleSave
        }

        saving={saving}
      />


      {/* ============================== */}
      {/* EDUCATION DETAILS */}
      {/* ============================== */}

      <EducationDetails
        data={data}

        editingField={editingField}
        tempValue={tempValue}
        setTempValue={setTempValue}

        handleEditClick={
          handleEditClick
        }

        handleCancel={
          handleCancel
        }

        handleSave={
          handleSave
        }

        saving={saving}
      />


      {/* ============================== */}
      {/* SKILLS */}
      {/* ============================== */}

      <SkillsSection
        skills={data?.skills}
      />


      {/* ============================== */}
      {/* ADDRESS DETAILS */}
      {/* ============================== */}

      <AddressDetails
        data={data}

        editingField={editingField}
        tempValue={tempValue}
        setTempValue={setTempValue}

        handleEditClick={
          handleEditClick
        }

        handleCancel={
          handleCancel
        }

        handleSave={
          handleSave
        }

        saving={saving}
      />


      {/* ============================== */}
      {/* BIO */}
      {/* ============================== */}

      <BioSection
        data={data}

        editingField={editingField}
        tempValue={tempValue}
        setTempValue={setTempValue}

        handleEditClick={
          handleEditClick
        }

        handleCancel={
          handleCancel
        }

        handleSave={
          handleSave
        }

        saving={saving}
      />


      {/* ============================== */}
      {/* BADGES */}
      {/* ============================== */}

      <BadgesSection />

    </motion.div>
  );
}