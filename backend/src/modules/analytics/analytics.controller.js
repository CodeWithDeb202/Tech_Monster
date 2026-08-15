import User from "../user/models/User.js";

import asyncHandler from "../../core/http/asyncHandler.js";


export const getDashboardAnalytics = asyncHandler(async (req, res) => {

    const [

        totalUsers,
        totalCompanies,
        totalInternships,
        totalApplications,
        totalInterviews,
        totalOffers

    ] = await Promise.all([

        User.countDocuments(),

        Company.countDocuments(),

        Internship.countDocuments(),

        Application.countDocuments(),

        Meeting.countDocuments(),

        Offer.countDocuments()

    ]);

    return res.status(200).json({

        success: true,

        analytics: {

            totalUsers,

            totalCompanies,

            totalInternships,

            totalApplications,

            totalInterviews,

            totalOffers

        }

    });

});


export const getMonthlyAnalytics = asyncHandler(async (req, res) => {

    const [

        users,

        companies,

        internships,

        applications,

        interviews,

        offers

    ] = await Promise.all([

        User.aggregate([

            {

                $group: {

                    _id: {

                        $month: "$createdAt"

                    },

                    total: {

                        $sum: 1

                    }

                }

            },

            {

                $sort: {

                    _id: 1

                }

            }

        ]),

        Company.aggregate([

            {

                $group: {

                    _id: {

                        $month: "$createdAt"

                    },

                    total: {

                        $sum: 1

                    }

                }

            },

            {

                $sort: {

                    _id: 1

                }

            }

        ]),

        Internship.aggregate([

            {

                $group: {

                    _id: {

                        $month: "$createdAt"

                    },

                    total: {

                        $sum: 1

                    }

                }

            },

            {

                $sort: {

                    _id: 1

                }

            }

        ]),

        Application.aggregate([

            {

                $group: {

                    _id: {

                        $month: "$createdAt"

                    },

                    total: {

                        $sum: 1

                    }

                }

            },

            {

                $sort: {

                    _id: 1

                }

            }

        ]),

        Meeting.aggregate([

            {

                $group: {

                    _id: {

                        $month: "$createdAt"

                    },

                    total: {

                        $sum: 1

                    }

                }

            },

            {

                $sort: {

                    _id: 1

                }

            }

        ]),

        Offer.aggregate([

            {

                $group: {

                    _id: {

                        $month: "$createdAt"

                    },

                    total: {

                        $sum: 1

                    }

                }

            },

            {

                $sort: {

                    _id: 1

                }

            }

        ])

    ]);

    return res.status(200).json({

        success: true,

        analytics: {

            users,

            companies,

            internships,

            applications,

            interviews,

            offers

        }

    });

});