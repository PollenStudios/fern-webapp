import React from "react";
import Facebook from "../Assets/Icons/facebook.svg";
import { ButtonWithIcon } from "../Components/Atoms/Buttons";

const Homepage = () => {
  return (
    <div className="main-container heading-2">
      <ButtonWithIcon variant="success" icon={Facebook} name="Facebook" />
    </div>
  );
};

export default Homepage;
