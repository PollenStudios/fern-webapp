import { Helmet, HelmetProvider } from 'react-helmet-async';
import { PRIVACY_POLICY_DATA } from 'utils/constant';

const PrivacyPolicy = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Privacy Policy - F3rn | Fine Art Discovery and Curation</title>
        </Helmet>
      </HelmetProvider>
      <div className="mt-16 flex flex-col gap-4 justify-center items-center">
        <div className="bg-blue-300 w-full">
          <div className="  pt-40 pb-32 ">
            <div className="text-center">
              <h1 className="heading-3">{PRIVACY_POLICY_DATA.main_heading}</h1>
              <h5 className="heading-6 pt-3 md:w-5/12 mx-auto">{PRIVACY_POLICY_DATA.main_paragraph}</h5>
              <h6 className="paragraph-1 mt-3">{PRIVACY_POLICY_DATA.updated_date}</h6>
            </div>
          </div>
        </div>

        <div className="py-10 main-container">
          <div>
            <p className="paragraph-1">{PRIVACY_POLICY_DATA.updated_paragraph}</p>
            <h1 className="heading-3 mt-10">{PRIVACY_POLICY_DATA.personal}</h1>
            <p className="mt-2 paragraph-1">{PRIVACY_POLICY_DATA.personal_paragraph}</p>
          </div>
          {/*  */}
          <div>
            <h1 className="heading-3 mt-10">{PRIVACY_POLICY_DATA.non_personal}</h1>

            <p className="mt-2 paragraph-1">{PRIVACY_POLICY_DATA.non_personal_paragraph}</p>
          </div>
          {/*  */}
          <div>
            <h1 className="heading-3 mt-10">{PRIVACY_POLICY_DATA.web_browser}</h1>
            <p className="mt-2 paragraph-1">{PRIVACY_POLICY_DATA.web_browser_paragraph}</p>
          </div>

          {/*  */}
          <div>
            <h1 className="heading-3 mt-10">{PRIVACY_POLICY_DATA.collected_information}</h1>
            <p className="mt-2 paragraph-1">
              {PRIVACY_POLICY_DATA.collected_information_paragraph}
              <ul className="list-disc list-inside">
                {PRIVACY_POLICY_DATA.collected_information_points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </p>
          </div>

          {/*  */}
          <div>
            <h1 className="heading-3 mt-10">{PRIVACY_POLICY_DATA.protect_information}</h1>
            <p className="mt-2 paragraph-1">{PRIVACY_POLICY_DATA.protect_information_paragraph}</p>
          </div>
          {/*  */}
          <div>
            <h1 className="heading-3 mt-10">{PRIVACY_POLICY_DATA.personal_information}</h1>
            <p className="mt-2 paragraph-1">{PRIVACY_POLICY_DATA.personal_information_paragraph}</p>
          </div>
          {/*  */}
          <div>
            <h1 className="heading-3 mt-10">{PRIVACY_POLICY_DATA.third_websites}</h1>
            <p className="mt-2 paragraph-1">{PRIVACY_POLICY_DATA.third_websites_paragarph}</p>
          </div>
          {/*  */}
          <div>
            <h1 className="heading-3 mt-10">{PRIVACY_POLICY_DATA.change_privacy_policy}</h1>
            <p className="mt-2 paragraph-1">{PRIVACY_POLICY_DATA.change_privacy_policy_paragraph}</p>
          </div>
          {/*  */}
          <div>
            <h1 className="heading-3 mt-10">{PRIVACY_POLICY_DATA.acceptance_terms}</h1>
            <p className="mt-2 paragraph-1">{PRIVACY_POLICY_DATA.acceptance_terms_paragarph}</p>
          </div>
          {/*  */}
          <div>
            <h1 className="heading-3 mt-10">{PRIVACY_POLICY_DATA.contacting_us}</h1>
            <p className="mt-2 paragraph-1">{PRIVACY_POLICY_DATA.contacting_us_paragraph}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
