import Skeleton from '../../common/LoaderPage/Skeleton';

export default function ProfileSkeleton() {
  return (
    <div className="profile-container">
      {/* Header Skeleton */}
      <div className="profile-card-glass skeleton-wrapper">
        <div className="flex-row">
          <Skeleton width="110px" height="110px" borderRadius="50%" />
          <div className="flex-col">
            <Skeleton width="220px" height="28px" />
            <Skeleton width="140px" height="18px" />
            <Skeleton width="180px" height="16px" />
            <div className="stats-row">
              <Skeleton width="80px" height="22px" />
              <Skeleton width="80px" height="22px" />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons Skeleton */}
      <div className="actions-wrapper">
        <Skeleton width="130px" height="42px" borderRadius="10px" />
        <Skeleton width="130px" height="42px" borderRadius="10px" />
      </div>

      {/* Grid Skeleton */}
      <div className="cards-grid">
        {[1, 2, 3].map((item) => (
          <div key={item} className="profile-card-glass">
            <Skeleton width="60%" height="22px" />
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Skeleton width="100%" height="45px" borderRadius="8px" />
              <Skeleton width="100%" height="45px" borderRadius="8px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}