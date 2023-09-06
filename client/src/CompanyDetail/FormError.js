import React from "react";

export const FormErrors = ({ formErrors, fieldName }) => (
  <div className="formErrors">
    {formErrors && (
      <p>
        {fieldName?.toLowerCase()} {formErrors?.toLowerCase()}
      </p>
    )}
  </div>
);
