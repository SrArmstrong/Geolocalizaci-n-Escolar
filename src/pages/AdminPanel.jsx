import { useNavigate } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard";

function AdminPanel() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <AdminDashboard onBack={goToHome} />
  );
}

export default AdminPanel;