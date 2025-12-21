import { useEffect } from "react";

export default function Toast({
  show,
  onClose,
  nature = "info", // success | error | warning | info
  content,
  duration = 3000,
}) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  const styles = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
  };

  return (
    <div className="toast toast-bottom toast-center z-50">
      <div className={`alert ${styles[nature]} shadow-lg`}>
        <span>{content}</span>
      </div>
    </div>
  );
}
