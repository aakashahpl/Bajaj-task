import { useState, useEffect } from "react";
import "./styles.css";

interface DynamicFormProps {
  formData: FormData;
}

interface FormFieldOption {
  value: string;
  label: string;
  dataTestId?: string;
}

interface FormFieldValidation {
  message: string;
}

interface FormField {
  fieldId: string;
  type:
    | "text"
    | "tel"
    | "email"
    | "textarea"
    | "date"
    | "dropdown"
    | "radio"
    | "checkbox";
  label: string;
  placeholder?: string;
  required: boolean;
  dataTestId: string;
  validation?: FormFieldValidation;
  options?: FormFieldOption[];
  maxLength?: number;
  minLength?: number;
}

interface FormSection {
  sectionId: number;
  title: string;
  description: string;
  fields: FormField[];
}

interface FormData {
  formTitle: string;
  formId: string;
  version: string;
  sections: FormSection[];
}

interface FormResponse {
  message: string;
  form: FormData;
}

export function DynamicForm({ formData }: DynamicFormProps) {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Validate the current section
  const validateSection = (sectionIndex: number): boolean => {
    const section = formData.sections[sectionIndex];
    const newErrors: Record<string, string> = {};
    let isValid = true;

    section.fields.forEach((field) => {
      const value = formValues[field.fieldId];

      if (
        (field.required &&
          (!value || (typeof value === "string" && !value.trim()))) ||
        (Array.isArray(value) && value.length === 0)
      ) {
        newErrors[field.fieldId] = `${field.label} is required`;
        isValid = false;
      }

      if (
        field.minLength !== undefined &&
        value &&
        typeof value === "string" &&
        value.length < field.minLength
      ) {
        newErrors[
          field.fieldId
        ] = `${field.label} must be at least ${field.minLength} characters`;
        isValid = false;
      }

      if (
        field.maxLength !== undefined &&
        value &&
        typeof value === "string" &&
        value.length > field.maxLength
      ) {
        newErrors[
          field.fieldId
        ] = `${field.label} must be at most ${field.maxLength} characters`;
        isValid = false;
      }
    });

    setFormErrors({ ...formErrors, ...newErrors });
    return isValid;
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues({
      ...formValues,
      [fieldId]: value,
    });

    if (formErrors[fieldId]) {
      const updatedErrors = { ...formErrors };
      delete updatedErrors[fieldId];
      setFormErrors(updatedErrors);
    }
  };

  const goToNextSection = () => {
    if (validateSection(currentSection)) {
      if (currentSection < formData.sections.length - 1) {
        setCurrentSection(currentSection + 1);
      }
    }
  };

  const goToPrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();

    if (validateSection(currentSection)) {
      console.log("Form Data Submitted:", formValues);
    }
  };

  const formContainerStyle = {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  };

  const formTitleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    marginBottom: "8px",
  };

  const formInfoStyle = {
    color: "#666",
    textAlign: "center" as const,
    marginBottom: "24px",
    fontSize: "14px",
  };

  const sectionNavigationStyle = {
    display: "flex",
    marginBottom: "24px",
    borderBottom: "1px solid #e0e0e0",
  };

  const sectionTabStyle = (isActive: boolean) => ({
    flex: 1,
    textAlign: "center" as const,
    padding: "10px",
    borderBottom: isActive ? "2px solid #0d6efd" : "none",
    fontWeight: isActive ? "bold" : "normal",
    color: isActive ? "#0d6efd" : "#666",
  });

  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${hasError ? "#dc3545" : "#ccc"}`,
    borderRadius: "4px",
    boxSizing: "border-box" as const,
  });

  const textareaStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${hasError ? "#dc3545" : "#ccc"}`,
    borderRadius: "4px",
    minHeight: "100px",
    boxSizing: "border-box" as const,
  });

  const selectStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${hasError ? "#dc3545" : "#ccc"}`,
    borderRadius: "4px",
    backgroundColor: "#fff",
    boxSizing: "border-box" as const,
  });

  const radioContainerStyle = {
    marginTop: "8px",
  };

  const radioItemStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  };

  const checkboxContainerStyle = {
    marginTop: "8px",
  };

  const checkboxItemStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  };

  const errorTextStyle = {
    color: "#dc3545",
    fontSize: "14px",
    marginTop: "4px",
  };

  const buttonsContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "24px",
  };

  const prevButtonStyle = {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  };

  const nextButtonStyle = {
    backgroundColor: "#0d6efd",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "auto",
  };

  const submitButtonStyle = {
    backgroundColor: "#198754",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "auto",
  };

  const renderSection = () => {
    const section = formData.sections[currentSection];

    return (
      <div key={section.sectionId}>
        <h3 className="sectionTitleStyle">{section.title}</h3>
        <p className="sectionDescriptionStyle">{section.description}</p>

        {section.fields.map((field) => renderField(field))}

        <div style={buttonsContainerStyle}>
          {currentSection > 0 && (
            <button
              type="button"
              onClick={goToPrevSection}
              style={prevButtonStyle}
            >
              Previous
            </button>
          )}

          {currentSection < formData.sections.length - 1 ? (
            <button
              type="button"
              onClick={goToNextSection}
              style={nextButtonStyle}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              style={submitButtonStyle}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderField = (field: FormField) => {
    const value = formValues[field.fieldId] || "";
    const error = formErrors[field.fieldId];

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "date":
        return (
          <div key={field.fieldId} className="fieldContainerStyle">
            <label htmlFor={field.fieldId} className=" labelStyle">
              {field.label}{" "}
              {field.required && <span style={{ color: "#dc3545" }}>*</span>}
            </label>
            <input
              type={field.type}
              id={field.fieldId}
              value={value}
              onChange={(e) => handleInputChange(field.fieldId, e.target.value)}
              placeholder={field.placeholder}
              style={inputStyle(!!error)}
              data-test-id={field.dataTestId}
              maxLength={field.maxLength}
              minLength={field.minLength}
              required={field.required}
            />
            {error && <p style={errorTextStyle}>{error}</p>}
          </div>
        );

      case "textarea":
        return (
          <div key={field.fieldId} className="fieldContainerStyle">
            <label htmlFor={field.fieldId} className=" labelStyle">
              {field.label}{" "}
              {field.required && <span style={{ color: "#dc3545" }}>*</span>}
            </label>
            <textarea
              id={field.fieldId}
              value={value}
              onChange={(e) => handleInputChange(field.fieldId, e.target.value)}
              placeholder={field.placeholder}
              style={textareaStyle(!!error)}
              data-test-id={field.dataTestId}
              maxLength={field.maxLength}
              minLength={field.minLength}
              required={field.required}
            />
            {error && <p style={errorTextStyle}>{error}</p>}
          </div>
        );

      case "dropdown":
        return (
          <div key={field.fieldId} className=" fieldContainerStyle">
            <label htmlFor={field.fieldId} className=" labelStyle">
              {field.label}{" "}
              {field.required && <span style={{ color: "#dc3545" }}>*</span>}
            </label>
            <select
              id={field.fieldId}
              value={value}
              onChange={(e) => handleInputChange(field.fieldId, e.target.value)}
              style={selectStyle(!!error)}
              data-test-id={field.dataTestId}
              required={field.required}
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  data-test-id={option.dataTestId}
                >
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p style={errorTextStyle}>{error}</p>}
          </div>
        );

      case "radio":
        return (
          <div key={field.fieldId} className=" fieldContainerStyle">
            <fieldset className=" fieldsetStyle">
              <legend className=" legendStyle">
                {field.label}{" "}
                {field.required && <span style={{ color: "#dc3545" }}>*</span>}
              </legend>
              <div style={radioContainerStyle}>
                {field.options?.map((option) => (
                  <div key={option.value} style={radioItemStyle}>
                    <input
                      type="radio"
                      id={`${field.fieldId}-${option.value}`}
                      name={field.fieldId}
                      value={option.value}
                      checked={value === option.value}
                      onChange={() =>
                        handleInputChange(field.fieldId, option.value)
                      }
                      style={{ marginRight: "8px" }}
                      data-test-id={option.dataTestId}
                    />
                    <label htmlFor={`${field.fieldId}-${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              {error && <p style={errorTextStyle}>{error}</p>}
            </fieldset>
          </div>
        );

      case "checkbox":
        return (
          <div key={field.fieldId} className=" fieldContainerStyle">
            <fieldset className=" fieldsetStyle">
              <legend className=" legendStyle">
                {field.label}{" "}
                {field.required && <span style={{ color: "#dc3545" }}>*</span>}
              </legend>
              <div style={checkboxContainerStyle}>
                {field.options?.map((option) => {
                  const checkboxValues = Array.isArray(value) ? value : [];
                  //   const isChecked = checkboxValues.includes(option.value);

                  return (
                    <div key={option.value} style={checkboxItemStyle}>
                      <input
                        type="checkbox"
                        id={`${field.fieldId}-${option.value}`}
                        value={option.value}
                        // checked={isChecked}
                        onChange={(e) => {
                          const updatedValues = [...checkboxValues];
                          if (e.target.checked) {
                            // if (!updatedValues.includes(option.value)) {
                            //   updatedValues.push(option.value);
                            // }
                          } else {
                            const index = updatedValues.indexOf(option.value);
                            if (index !== -1) {
                              updatedValues.splice(index, 1);
                            }
                          }
                          handleInputChange(field.fieldId, updatedValues);
                        }}
                        style={{ marginRight: "8px" }}
                        data-test-id={option.dataTestId}
                      />
                      <label htmlFor={`${field.fieldId}-${option.value}`}>
                        {option.label}
                      </label>
                    </div>
                  );
                })}
              </div>
              {error && <p style={errorTextStyle}>{error}</p>}
            </fieldset>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2 style={formTitleStyle}>{formData.formTitle}</h2>
      <p style={formInfoStyle}>
        Form ID: {formData.formId} | Version: {formData.version}
      </p>

      <div>
        <div style={sectionNavigationStyle}>
          {formData.sections.map((section, index) => (
            <div
              key={section.sectionId}
              style={sectionTabStyle(index === currentSection)}
            >
              Section {index + 1}
            </div>
          ))}
        </div>
      </div>

      {renderSection()}
    </div>
  );
}
