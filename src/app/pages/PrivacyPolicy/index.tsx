import { Button } from 'app/components/atoms/Buttons';

import { useNavigate } from 'react-router-dom';
import { PageRoutes } from 'utils/config';
import { privacy_policy_data } from 'utils/constant';

const PrivacyPolicy = () => {
  return (
    <div className="mt-16 flex flex-col gap-4 justify-center items-center">
      <div className="bg-blue-300 w-full">
        <div className="  pt-40 pb-32 ">
          <div className="text-center">
            <h1 className="heading-3">{privacy_policy_data.main_heading}</h1>
            <h5 className="heading-6 pt-3 md:w-5/12 mx-auto">{privacy_policy_data.main_paragraph}</h5>
            <h6 className="paragraph-1 mt-3">{privacy_policy_data.updated_date}</h6>
          </div>
        </div>
      </div>

      <div className="py-10 main-container">
        <div>
          <p className="paragraph-1">{privacy_policy_data.updated_paragraph}</p>
          <h1 className="heading-3 mt-10">{privacy_policy_data.personal}</h1>
          <p className="mt-2 paragraph-1">{privacy_policy_data.personal_paragraph}</p>
        </div>
        {/*  */}
        <div>
          <h1 className="heading-3 mt-10">{privacy_policy_data.non_personal}</h1>

          <p className="mt-2 paragraph-1">{privacy_policy_data.non_personal_paragraph}</p>
        </div>
        {/*  */}
        <div>
          <h1 className="heading-3 mt-10">{privacy_policy_data.web_browser}</h1>
          <p className="mt-2 paragraph-1">{privacy_policy_data.web_browser_paragraph}</p>
        </div>

        {/*  */}
        <div>
          <h1 className="heading-3 mt-10">{privacy_policy_data.collected_information}</h1>
          <p className="mt-2 paragraph-1">
            {privacy_policy_data.collected_information_paragraph}
            <ul className="list-disc list-inside">
              {privacy_policy_data.collected_information_points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </p>
        </div>

        {/*  */}
        <div>
          <h1 className="heading-3 mt-10">{privacy_policy_data.protect_information}</h1>
          <p className="mt-2 paragraph-1">{privacy_policy_data.protect_information_paragraph}</p>
        </div>
        {/*  */}
        <div>
          <h1 className="heading-3 mt-10">{privacy_policy_data.personal_information}</h1>
          <p className="mt-2 paragraph-1">{privacy_policy_data.personal_information_paragraph}</p>
        </div>
        {/*  */}
        <div>
          <h1 className="heading-3 mt-10">{privacy_policy_data.third_websites}</h1>
          <p className="mt-2 paragraph-1">{privacy_policy_data.third_websites_paragarph}</p>
        </div>
        {/*  */}
        <div>
          <h1 className="heading-3 mt-10">{privacy_policy_data.change_privacy_policy}</h1>
          <p className="mt-2 paragraph-1">{privacy_policy_data.change_privacy_policy_paragraph}</p>
        </div>
        {/*  */}
        <div>
          <h1 className="heading-3 mt-10">{privacy_policy_data.acceptance_terms}</h1>
          <p className="mt-2 paragraph-1">{privacy_policy_data.acceptance_terms_paragarph}</p>
        </div>
        {/*  */}
        <div>
          <h1 className="heading-3 mt-10">{privacy_policy_data.contacting_us}</h1>
          <p className="mt-2 paragraph-1">{privacy_policy_data.contacting_us_paragraph}</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
