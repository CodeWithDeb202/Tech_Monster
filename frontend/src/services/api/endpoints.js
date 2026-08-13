export const API = {
  
  PUBLIC: {
    HERO_STATS: "/public/hero-stats"
  },

  
  AUTH: {

    LOGIN: "/auth/login",

    SIGNUP: "/auth/signup",

    LOGOUT: "/auth/logout",

    FORGOT_PASSWORD: "/auth/forgot-password",

    RESET_PASSWORD: "/auth/reset-password",

    VERIFY_OTP: "/auth/verify-otp",

    RESEND_OTP: "/auth/resend-otp",

    COMPLETE_PROFILE: "/auth/profile",

    ADMIN_LOGIN: "/auth/admin/login",

  },


  STUDENT: {

    PROFILE: "/student/profile",

    TASKS: "/student/tasks",

    ATTENDANCE: "/student/attendance",

  },

  ADMIN: {

    USERS: "/admin/users",

    INTERNSHIPS: "/admin/internships",

    TASKS: {

      PENDING: "/admin/tasks/pending",

      APPROVED: "/admin/tasks/approved",

      DETAILS: (id) => `/admin/tasks/${id}`,

      APPROVE: (id) => `/admin/tasks/${id}/approve`,

      REJECT: (id) => `/admin/tasks/${id}/reject`

    },

    SUBMISSIONS: {

      BASE: "/admin/submissions",

      DETAILS: (id) => `/admin/submissions/${id}`,

      APPROVE: (id) => `/admin/submissions/${id}/approve`,

      REJECT: (id) => `/admin/submissions/${id}/reject`,

      EXTEND: (id) => `/admin/submissions/${id}/extend`

    }

  },

  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
    IMAGE: "/profile/profile-image"
  },
  DASHBOARD: {
    STUDENT: "/dashboard/student",
    ADMIN: "/dashboard/admin"
  },

  SERVER: {

    STATUS: "/server/status"

  },

  INTERNSHIPS: {
    BASE: "/internships",
    BY_ID: (id) => `/internships/${id}`,
    JOIN: (id) => `/internships/${id}/join`,
    PROGRESS: (id) => `/internships/${id}/progress`,
    COMPLETE: (id) => `/internships/${id}/complete`,
    COMPLETE_LESSON: (slug) => `/internships/slug/${slug}/complete-lesson`,
    COMPLETED_LESSONS: (slug) => `/internships/slug/${slug}/completed-lessons`,
  },

  COURSES: {
    BASE: "/courses",
    BY_ID: (id) => `/courses/${id}`,
    BY_SLUG: (slug) => `/courses/slug/${slug}`,
    JOIN: (id) => `/courses/${id}/join`,
    PROGRESS: (id) => `/courses/${id}/progress`,
    COMPLETE: (id) => `/courses/${id}/complete`,
    COMPLETE_LESSON: (slug) => `/courses/slug/${slug}/complete-lesson`,
    COMPLETED_LESSONS: (slug) => `/courses/slug/${slug}/completed-lessons`,
  },

  SUBMISSIONS: {
    BASE: "/submissions",
    MY: "/submissions/my",
    COURSE: (courseSlug) => `/submissions/course/${courseSlug}`,
  },

  MESSAGE: {

    BASE: "/messages",

    USERS: "/messages/users",

    SEARCH: "/messages/search"

  },
};
