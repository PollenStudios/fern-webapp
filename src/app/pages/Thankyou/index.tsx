import { Button } from 'app/components/atoms/Buttons';
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from 'utils/config';
import ArtPreview from 'app/pages/Thankyou/Assets/ThumbsUp.svg';

function Thankyou() {
  const navigate = useNavigate();
  return (
    <div className="main-container mt-10 md:mt-auto h-screen w-full flex justify-center items-center">
      <div>
        <div className="w-full flex justify-center">
          <div className="w-60 h-60 bg-gray-20 rounded-full flex justify-center items-center mb-4">
            <img className=" " src={ArtPreview} alt="" />
          </div>
        </div>
        <div className="text-center flex flex-col gap-3">
          <p className="heading-4">
            Thank you for submitting
            <br /> your Artist Profile.
          </p>
          <p className="paragraph-2">We have received you request for joining as an artist.</p>
          <p className="paragraph-2">Our team will review your application and connect with you for onboarding</p>
          <Button name="Discover Art" variant="primary" type="button" onClick={() => navigate(PageRoutes.DISCOVERY)} />
        </div>
      </div>
    </div>
  );
}

export default Thankyou;
