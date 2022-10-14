import { useNavigate } from "react-router-dom";
import { Button } from "../Components/Atoms/Buttons";
import { PageRoutes } from "../Constants/PageRoutes";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="heading-1">Coming Soon</h1>
      <Button name="Discover Art" additionalClasses="mt-5" onClick={() => navigate(PageRoutes.DISCOVERY)} />
    </div>
  );
};

export default HomePage;
