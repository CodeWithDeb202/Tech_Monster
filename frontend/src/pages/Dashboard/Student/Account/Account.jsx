import { useEffect, useState } from "react";

import AccountForm from "../../../../components/Dashboard/Student/Account/AccountForm";

import ProfileView from "../../../../components/Dashboard/Student/Account/ProfileView";

import { getProfile } from "../../../../services/api/profileService";

import "./Account.css";

export default function Account() {

  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {

    // eslint-disable-next-line react-hooks/immutability
    loadProfile();

  }, []);

  const loadProfile = async () => {

    try {

      const res = await getProfile();
      console.log("Account:Data=", res.data);
      
      setUserData(res.data.user);
      setIsSubmitted(res.data.user.profileCompleted);

    } catch (err) {

      console.log(err);

    }

    setLoading(false);

  }

  if (loading) return <h3>Loading...</h3>;

  return (

    <div className="account-page-wrapper">

      <h2 className="account-main-title">

        Account

      </h2>

      {

        isSubmitted ?

          <ProfileView

            userData={userData}

            onUpdateData={setUserData}

          />

          :

          <AccountForm

            onSubmitForm={(data) => {

              setUserData(data);

              setIsSubmitted(true);

            }}

          />

      }

    </div>

  );

}