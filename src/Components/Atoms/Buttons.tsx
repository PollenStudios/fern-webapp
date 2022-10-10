import React, { useState } from "react";

export const Button = (props: { variant: string; name: string }) => {
  const { variant, name } = props;

  return (
    <button
      type="button"
      className={`heading-6 inline-flex items-center px-6 py-3 border
       border-${variant === "outline" ? "primary" : "transparent"} text-base font-medium rounded-full shadow-sm ${
        variant === "outline"
          ? "text-primary"
          : `text-white ${
              variant === "primary"
                ? "bg-primary"
                : variant === "danger"
                ? "bg-red-800"
                : variant === "success"
                ? "bg-secondary"
                : "bg-yellow-500"
            } focus:outline-none`
      }`}
    >
      {name}
    </button>
  );
};

export const ButtonWithIcon = (props: { variant: string; icon: string; name: string }) => {
  const { variant, icon, name } = props;
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-x-4 pl-3 pr-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white ${
        variant === "primary"
          ? "bg-primary"
          : variant === "danger"
          ? "bg-red-800"
          : variant === "success"
          ? "bg-secondary"
          : "bg-yellow-500"
      }  focus:outline-none`}
    >
      <img className="w-6 h-6 rounded-full" src={icon} alt={name} />
      <div className="heading-6">{name}</div>
    </button>
  );
};
