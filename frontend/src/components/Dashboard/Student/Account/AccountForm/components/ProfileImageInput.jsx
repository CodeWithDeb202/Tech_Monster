import { motion } from "framer-motion";

import defaultProfileImg from '../../../../../../assets/profile/default-profile.svg';

function ProfileImageInput({
    preview = defaultProfileImg,
    onChange
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            id="form-group"
        >
            <label>
                Choose Profile Photo (Under 2MB) *
            </label>

            <input
                type="file"
                accept="image/*"
                required
                onChange={onChange}
            />

            {preview && (
                <img
                    src={preview}
                    alt="Profile Preview"
                    className="profile-preview"
                />
            )}
        </motion.div>
    );
}

export default ProfileImageInput;