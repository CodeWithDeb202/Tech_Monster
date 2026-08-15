import { useEffect, useState } from "react";

import AccountForm from "../../../../components/Dashboard/Student/Account/AccountForm";
import ProfileView from "../../../../components/Dashboard/Student/Account/ProfileView";

import {
  getProfile
} from "../../../../services/api/profileService";

import "./Account.css";

import { toast } from "react-toastify";
import Spinner from "../../../../components/Dashboard/common/LoaderPage/Spinner/Spinner";


export default function Account() {

  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState(null);

  const [isSubmitted, setIsSubmitted] = useState(false);


  
  
  // ==============================
  // LOAD PROFILE
  // ==============================

  const loadProfile = async () => {

    try {

      const res = await getProfile();

      const user = res.data.user;
      console.log("Account Respinse data:=",res?.data);
      console.log("Account Respinse user:=",res?.data?.user);
      console.log("Account Respinse stats:=",res?.data?.stats);
      setUserData({
        ...user,
        profileStats: res.data.stats
      });

      setIsSubmitted(
        user.profileCompleted
      );

    } catch (err) {

      console.log(err);
      
      toast.error(
        err.response?.data?.message ||
        "Something went wrong"
      );
      
    } finally {
      
      setLoading(false);
      
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();

  }, []);


  // ==============================
  // LOADING
  // ==============================

  if (loading) {

    return (
      <Spinner
        message="Loading your profile..."
        size={60}
      />
    );

  }


  // ==============================
  // PAGE
  // ==============================

  return (

    <div id="account-page-wrapper">

      <h2 id="account-main-title">
        Account
      </h2>


      {isSubmitted ? (

        <ProfileView
          userData={userData}

          onUpdateData={setUserData}

          onEdit={() =>
            setIsSubmitted(false)
          }
        />

      ) : (

        <AccountForm
          editData={userData}

          initialEmail={
            userData?.email
          }

          onSubmitForm={(data) => {

            setUserData(data);

            setIsSubmitted(true);

          }}
        />

      )}

    </div>
  );
}