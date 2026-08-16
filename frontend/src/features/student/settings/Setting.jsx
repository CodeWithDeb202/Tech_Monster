import SettingsSection from '../../dashboard/common/Setting/SettingsSection';
import './Setting.css';

export default function Setting() {
  return (
    <div className="settings-page-wrapper">
      <h2 className="settings-main-title">Setting</h2>
      <SettingsSection />
    </div>
  );
}