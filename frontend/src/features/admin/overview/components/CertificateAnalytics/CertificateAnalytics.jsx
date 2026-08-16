import "./CertificateAnalytics.css";

import {

    HiBadgeCheck,

    HiSparkles

} from "react-icons/hi";

export default function CertificateAnalytics({

    analytics

}) {

    return (

        <div className="certificateAnalytics">

            <h2>

                Certificate Analytics

            </h2>

            <div className="certificateCards">

                <div className="certificateCard">

                    <HiBadgeCheck />

                    <h3>

                        {analytics.total}

                    </h3>

                    <p>

                        Total Issued

                    </p>

                </div>

                <div className="certificateCard">

                    <HiSparkles />

                    <h3>

                        {analytics.thisMonth}

                    </h3>

                    <p>

                        This Month

                    </p>

                </div>

            </div>

        </div>

    )

}