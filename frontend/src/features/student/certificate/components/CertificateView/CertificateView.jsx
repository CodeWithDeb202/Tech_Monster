import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CertificateView.css';
import { toast } from 'react-toastify';

export default function CertificateView({ courseType, userName }) {
  const [paymentDone, setPaymentDone] = useState(false);
  const [adminApproved, setAdminApproved] = useState(false);

  const handleSimulatePayment = () => {
    setPaymentDone(true);
    // Simulating notification sent to admin backend
  };

  const handleSimulateAdminApproval = () => {
    setAdminApproved(true);
  };

  return (
    <motion.div 
      className="certificate-view-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="congrats-banner">
        <h3>Congratulation!</h3>
        <p>You have successfully completed your course: <strong>{courseType}</strong></p>
      </div>

      {!paymentDone ? (
        <div className="payment-section">
          <h4>Step 1: Complete Certificate Fee Payment</h4>
          <p>Scan the UPI QR code below to proceed with payment.</p>
          <div className="upi-scanner-box">
            <img src="https://via.placeholder.com/180?text=UPI+QR+Scanner" alt="UPI QR Code" />
          </div>
          <button className="pay-confirm-btn" onClick={handleSimulatePayment}>
            I Have Paid (Verify Payment)
          </button>
        </div>
      ) : !adminApproved ? (
        <div className="approval-section">
          <h4>Step 2: Verification in Progress</h4>
          <p>Payment received! Notification sent to Admin. Waiting for admin approval...</p>
          {/* Developer shortcut button to simulate admin approval */}
          <button className="pay-confirm-btn" style={{ background: '#ff3366', color: '#fff' }} onClick={handleSimulateAdminApproval}>
            [Admin Demo] Simulate Approve
          </button>
        </div>
      ) : (
        <div className="certificate-download-section">
          <div className="certificate-template-preview">
            <p className="cert-title">Certificate of Completion</p>
            <p>This is proudly presented to</p>
            <h2 className="cert-name">{userName}</h2>
            <p>for successfully completing the rigorous curriculum in <strong>{courseType}</strong>.</p>
          </div>
          <button className="download-btn" onClick={() => toast.success('Certificate downloaded successfully as PDF!')}>
            Download Certificate (PDF)
          </button>
        </div>
      )}

      <div className="support-footer">
        Facing any problems? Contact us via 
        <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">WhatsApp</a> or 
        <a href="mailto:support@techmonster.com">Gmail</a>.
      </div>
    </motion.div>
  );
}