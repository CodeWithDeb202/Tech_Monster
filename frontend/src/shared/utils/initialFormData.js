export const getInitialFormData = (email = "") => ({
    firstName: "",
    middleName: "",
    lastName: "",
    email,

    gender: "",
    phone: "",
    dateOfBirth: "",

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