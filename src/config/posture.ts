// Base URL of the Posture public API (the scan + unlock endpoints). Overridable
// per-environment via VITE_POSTURE_API_BASE; defaults to the live custom domain.
export const POSTURE_API_BASE =
  import.meta.env.VITE_POSTURE_API_BASE ||
  'https://posture.rosebudcloudsolutions.co.uk';
