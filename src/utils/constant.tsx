import config from './config';
// /^(?:(ftp|http|https):\/\/)?(?:[\w-]+\.)+[a-z]{2,24}$/;

//Regex
export const URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[\da-z]+([.\-][\da-z]+)*\.[a-z]{2,63}(:\d{1,5})?(\/.*)?$/;

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const HANDLE_REGEX = /^[\da-z]+$/;

export const NAME_REGEX = /^[a-zA-Z0-9 ]*$/;

//privacy policy data

export const PRIVACY_POLICY_DATA = {
  main_heading: 'PRIVACY POLICY',
  main_paragraph: 'Please read these Terms carefully, and contact us if you have any questions.',
  updated_date: 'This document was last updated on November 9, 2022',
  updated_paragraph: `{This Privacy Policy governs the manner in which ${config.appName} collects, uses, maintains, and discloses information collected from users (each, a "User") of the www.F3RN.xyz website ("Site"). This privacy policy applies to the Site and all products and services offered by ${config.appName}.}`,
  personal: 'Personal identification information',
  personal_paragraph:
    'We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, subscribe to the newsletter, and in connection with other activities, services, features, or resources we make available on our Site. Users may visit our Site anonymously. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site related activities.',

  non_personal: 'Non-personal identification information',
  non_personal_paragraph:
    'We may collect non-personal identification information about Users whenever they interact with our Site. Non-personal identification information may include the browser name, the type of computer and technical information about Users means of connection to our Sites, such as the operating system and the Internet service providers utilized and other similar information.',

  web_browser: 'Web browser cookies',
  web_browser_paragraph:
    'Our Site may use "cookies" to enhance User experience. User\'s web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. Users may choose to set their web browser to refuse cookies or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly. ',

  collected_information: 'How we use collected information',
  collected_information_paragraph: `{${config.appName} may collect and use Users personal information for the following purposes: }`,
  collected_information_points: [
    'To run a promotion, contest, survey or other Site feature ',
    'To send Users information they agreed to receive about topics we think will be of interest to them.',
    'To send periodic emails ',
    'If User decides to opt-in to our mailing list, they will receive emails that may include company news, updates, related product or service information, etc. If at any time the User would like to unsubscribe from receiving future emails, we include detailed unsubscribe instructions at the bottom of each email.',
  ],

  protect_information: 'How we protect your information',
  protect_information_paragraph:
    'We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.',

  personal_information: 'Sharing your personal information',
  personal_information_paragraph:
    "We do not sell, trade, or rent User's personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above. We may use third-party service providers to help us operate our business and the Site or administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes provided that you have given us your permission.",

  third_websites: 'Third-party websites',
  third_websites_paragarph:
    "Users may find advertising or other content on our Site that link to the sites and services of our partners, suppliers, advertisers, sponsors, licensors, and other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site. In addition, these sites or services, including their content and links, may be constantly changing. These sites and services may have their own privacy policies and customer service policies. Browsing and interaction on any other website, including websites which have a link to our Site, is subject to that website's own terms and policies.",

  change_privacy_policy: 'Changes to this privacy policy',
  change_privacy_policy_paragraph: `{${config.appName} has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the top of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.}`,

  acceptance_terms: 'Your acceptance of these terms',
  acceptance_terms_paragarph:
    'By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.',

  contacting_us: 'Contacting us',
  contacting_us_paragraph:
    'If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at hello@F3RN.tech.',
};
