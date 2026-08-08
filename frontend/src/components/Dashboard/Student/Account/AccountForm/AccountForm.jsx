import { useState } from 'react';
import { motion } from 'framer-motion';
import './AccountForm.css';

import useAuth from '../../../../../hooks/useAuth';

import { updateProfile } from '../../../../../services/api/profileService';
import { tokenStorage } from "../../../../../services/auth/tokenStorage";
import { uploadProfileImage } from '../../../../../services/api/profileService';
import Input from '../../../../Common/Form/Input';
import { toast } from 'react-toastify';


export default function AccountForm({ initialEmail, onSubmitForm }) {
  const { updateUser } = useAuth();

  const loginUser = tokenStorage.getUser();
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",

    email: loginUser?.email || "" || initialEmail,

    gender: "",
    phone: "",

    education: "",
    college: "",
    degree: "",
    branch: "",
    year: "",
    semester: "",

    github: "",
    linkedin: "",
    portfolio: "",

    bio: "",

    skills: [],

    currentAddress: "",
    localAddress: "",
    district: "",
    state: "",
    pincode: ""
  });

  const [imageFile, setImageFile] = useState(null);

  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const validateField = (name, value) => {
    let error = '';

    if (name === "firstName") {
      if (!value.trim()) {
        error = 'First name is required';
      } else if (value.trim().length < 3) {
        error = 'Name must be at least 3 character'
      }
    }

    if (name === 'lastName') {
      if (!value.trim()) {
        error = 'Lastname is required';
      } else if (value.trim().length < 2) {
        error = 'Lastname have must be 2 characters';
      }
    }

    if (name === 'phone') {
      if (!value.trim()) {
        error = 'mobile number is required';
      } else if (value.trim().length < 10) {
        error = 'Mobile number must be 10 digit';
      }
    }

    if (name === 'education') {
      if (!value.trim()) {
        error = 'Please enter your education';
      }
    }

    if (name === 'college') {
      if (!value.trim()) {
        error = 'College name is required';
      }
    }

    if (name === 'branch') {
      if (!value.trim()) {
        error = 'Branch name is required';
      }
    }

    if (name === 'year') {
      if (!value.trim()) {
        error = 'Year is required';
      }
    }

    if (name === 'semester') {
      if (!value.trim()) {
        error = 'Semester is required';
      }
    }

    if (name === 'currentAddress') {
      if (!value.trim()) {
        error = 'Current address is required';
      }
    }

    if (name === 'pincode') {
      if (!value.trim()) {
        error = 'Pincode is required';
      }
    }

    return error;
  }

  const validateForm = () => {
    const newErrors = {
      firstName: validateField("firstName", formData.firstName),
      lastName: validateField("lastName", formData.lastName),
      education: validateField("education", formData.education),
      college: validateField("college", formData.college),
      branch: validateField("branch", formData.branch),
      year: validateField("year", formData.year),
      semester: validateField("semester", formData.semester),
      currentAddress: validateField("currentAddress", formData.currentAddress),
      pincode: validateField("pincode", formData.pincode)
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  }

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Normal input update
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Only for pincode
    if (name === "pincode") {

      // User 6 digit complete na kariba parjyanta clear kara
      if (value.length !== 6) {

        setFormData((prev) => ({
          ...prev,
          pincode: value,
          district: "",
          state: ""
        }));

        return;
      }

      // Only numbers allow
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

          // Invalid pincode
          setFormData((prev) => ({
            ...prev,
            district: "",
            state: ""
          }));

        }

      } catch (error) {

        console.error(
          "Pincode API Error:",
          error
        );

        setFormData((prev) => ({
          ...prev,
          district: "",
          state: ""
        }));
      }
    }
  };

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);

    setPreview(URL.createObjectURL(file));

  }

  const addSkill = () => {
    if (skillInput && formData.skills.length < 7 && !formData.skills.includes(skillInput)) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput] });
      setSkillInput('');
    }
  };

  const removeSkill = (indexToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
        return;
    }

    setLoading(true);

    try {

        let latestUser = null;


        // =====================================
        // 1. UPLOAD PROFILE IMAGE
        // =====================================

        if (imageFile) {

            const form = new FormData();

            form.append("avatar", imageFile);

            const imageRes = await uploadProfileImage(form);

            latestUser = imageRes.data.user;

            console.log(
                "After image upload:",
                latestUser
            );
        }


        // =====================================
        // 2. UPDATE PROFILE INFORMATION
        // =====================================

        const res = await updateProfile(formData);

        latestUser = res.data.user;

        console.log(
            "After profile update:",
            latestUser
        );


        // =====================================
        // 3. UPDATE AUTH CONTEXT
        // =====================================

        updateUser(latestUser);


        // =====================================
        // 4. UPDATE PARENT
        // =====================================

        onSubmitForm(latestUser);


        toast.success(
            "Profile updated successfully!"
        );

    } catch (err) {

        console.error(
            "Profile Update Error:",
            err
        );

        toast.error(
            err.response?.data?.message ||
            "Profile update failed"
        );

    } finally {

        setLoading(false);
    }
};

  return (
    <>

      <div id="username-box">
        <h2>@{loginUser?.username}</h2>
      </div>

      <motion.form
        id="account-form-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
      >

        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} id="form-section-title">1. Personal Details</motion.h3>
        <div id="form-grid">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} id="form-group">
            <label>Choose Profile Photo (Under 2MB) *</label>
            <input type="file" accept="image/*" required onChange={handleImageChange} />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginTop: "15px",
                  border: "2px solid #ddd"
                }}
              />
            )}
          </motion.div>

          <Input
            label="First Name"
            type="text"
            placeholder="Enter First Name"
            name={'firstName'}
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />

          <Input
            label="Middle Name"
            type="text"
            name={'middleName'}
            value={formData.middleName}
            onChange={handleChange}
          />

          <Input
            label="Last Name"
            type="text"
            name={'lastName'}
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} id="form-group">
            <label>Email (Auto-filled) *</label>
            <input type="email" name="email" value={formData.email} readOnly />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} id="form-group">
            <label>Gender *</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </motion.div>


          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} id="form-group">
            <label>Phone Number *</label>
            <div id="whatsapp-row">
              <input type="tel" name="phone" required placeholder="10-digit number" value={formData.phone} onChange={handleChange} />
              <a href="https://wa.me/918984457601?text=Hello%20Tech%20Monster" target="_blank" rel="noreferrer" id="whatsapp-link">Join WhatsApp</a>
            </div>
          </motion.div>


          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} id="form-group">
            <label>Date of Birth</label>

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </motion.div>
        </div>

        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} id="form-section-title">2. Educational Information</motion.h3>
        <div id="form-grid">

          <Input
            label="What are you studying?"
            type="text"
            placeholder="e.g. B.Tech / BCA"
            name={'education'}
            value={formData.education}
            onChange={handleChange}
            error={errors.education}
            required
          />


          <Input
            label="College Name"
            type="text"
            name={'college'}
            value={formData.college}
            onChange={handleChange}
            error={errors.college}
            required
          />


          <Input
            label="Branch"
            type="text"
            name={'branch'}
            value={formData.branch}
            onChange={handleChange}
            error={errors.branch}
            required
          />


          <Input
            label="Year"
            type="text"
            placeholder="e.g. 3rd Year"
            name={'year'}
            value={formData.year}
            onChange={handleChange}
            error={errors.year}
            required
          />


          <Input
            label="Semester"
            type="text"
            placeholder="e.g. 5th Sem"
            name={'semester'}
            value={formData.semester}
            onChange={handleChange}
            error={errors.semester}
            required
          />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} id="form-group">
            <label>Add Skills (Maximum 7) *</label>
            <div id="skills-input-container">
              <input type="text" value={skillInput} placeholder="Add skill & click add" onChange={(e) => setSkillInput(e.target.value)} />
              <button type="button" id="add-skill-btn" onClick={addSkill}>Add</button>
            </div>
            <div id="skills-tags">
              {formData.skills.map((skill, idx) => (
                <span key={idx} id="skill-tag">
                  {skill} <span onClick={() => removeSkill(idx)}>×</span>
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }} id="form-group">
            <label>Github</label>

            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }} id="form-group">
            <label>LinkedIn</label>

            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
            />
          </motion.div>
        </div>

        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }} id="form-section-title">3. Address Details</motion.h3>
        <div id="form-grid">

          <Input
            label="Current Address"
            type="text"
            placeholder="e.g. 5th Sem"
            name={'currentAddress'}
            value={formData.currentAddress}
            onChange={handleChange}
            error={errors.currentAddress}
            required
          />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4 }} id="form-group">
            <label>Local Address *</label>
            <input type="text" name="localAddress" required value={formData.localAddress} onChange={handleChange} />
          </motion.div>

          <Input
            label="Pincode"
            type="text"
            placeholder="e.g. 5th Sem"
            name={'pincode'}
            value={formData.pincode}
            onChange={handleChange}
            error={errors.pincode}
            maxLength={6}
            required
          />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8 }} id="form-group">
            <label>District (Auto-filled) *</label>
            <input type="text" name="district" value={formData.district} readOnly />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3 }} id="form-group">
            <label>State (Auto-filled) *</label>
            <input type="text" name="state" value={formData.state} readOnly />
          </motion.div>

        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.2 }} id="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </motion.div>


        <button disabled={loading} type="submit" id="submit-btn">
          {loading ? "Saving..." : "Save & profile view"}
        </button>
      </motion.form>
    </>
  );
}