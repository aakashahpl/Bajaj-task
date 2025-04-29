import { useState, useEffect } from "react";
import "./styles.css";
import { DynamicForm } from "./DynamicForm";

// Define TypeScript interfaces for our data structures
interface User {
  rollNumber: string;
  name: string;
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

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchFormData(user.rollNumber);
      console.log("fetching form data");
    }
    console.log("over here");
  }, [isLoggedIn, user]);

  const registerUser = async (userData: User) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://dynamic-form-generator-9rl7.onrender.com/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();
      console.log(data);
      if (
        data.message == "User already exists. Fetch /get-form to get form json"
      ) {
        setUser(userData);
        setIsLoggedIn(true);
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to register user");
      }

      setUser(userData);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchFormData = async (rollNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${rollNumber}`
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch form data");
      }

      setFormData(data.form);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching form data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="containerStyle">
        {!isLoggedIn ? (
          <LoginForm
            onSubmit={registerUser}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <>
            {isLoading && (
              <div style={{ textAlign: "center", margin: "20px 0" }}>
                Loading form data...
              </div>
            )}
            {error && <div>{error}</div>}
            {formData && <DynamicForm formData={formData} />}
          </>
        )}
      </div>
    </>
  );
}

interface LoginFormProps {
  onSubmit: (user: User) => void;
  isLoading: boolean;
  error: string | null;
}

function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [rollNumber, setRollNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [formErrors, setFormErrors] = useState<{
    rollNumber?: string;
    name?: string;
  }>({});

  const validateForm = () => {
    const errors: { rollNumber?: string; name?: string } = {};

    if (!rollNumber.trim()) {
      errors.rollNumber = "Roll Number is required";
    }

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({ rollNumber, name });
    }
  };

  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${hasError ? "#dc3545" : "#ccc"}`,
    borderRadius: "4px",
    boxSizing: "border-box" as const,
  });

  const buttonStyle = {
    width: "100%",
    backgroundColor: isLoading ? "#7aa6d5" : "#0d6efd",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: isLoading ? "not-allowed" : "pointer",
    fontSize: "16px",
  };

  return (
    <div className="formContainerStyle">
      <h2 className="headingStyle">Student Login</h2>

      {error && <div>{error}</div>}

      <div>
        <div className="formGroupStyle">
          <label htmlFor="rollNumber" className="labelStyle">
            Roll Number
          </label>
          <input
            type="text"
            id="rollNumber"
            style={inputStyle(!!formErrors.rollNumber)}
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            disabled={isLoading}
            data-test-id="rollNumber"
          />
          {formErrors.rollNumber && <p>{formErrors.rollNumber}</p>}
        </div>

        <div className="formGroupStyle">
          <label htmlFor="name" className="labelStyle">
            Name
          </label>
          <input
            type="text"
            id="name"
            style={inputStyle(!!formErrors.name)}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            data-test-id="name"
          />
          {formErrors.name && <p>{formErrors.name}</p>}
        </div>

        <button onClick={handleSubmit} style={buttonStyle} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
