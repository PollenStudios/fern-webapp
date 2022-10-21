import { useNavigate } from "react-router-dom";
import { Button } from "../Components/Atoms/Buttons";
import { PageRoutes } from "../Constants/PageRoutes";
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="main-container">
      <div className="h-screen w-full flex flex-col justify-center items-center">
        <h1 className="heading-2 sm:heading-1 mb-5">Coming Soon</h1>
        <Button name="Discover Art" onClick={() => navigate(PageRoutes.DISCOVERY)} />
      </div>
    </div>
  );
};

export default HomePage;
