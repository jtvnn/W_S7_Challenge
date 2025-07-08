import React, { useEffect, useState } from "react";
import * as Yup from "yup";

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: "full name must be at least 3 characters",
  fullNameTooLong: "full name must be at most 20 characters",
  sizeIncorrect: "size must be S or M or L",
};

// 👇 Here you will create your schema.
const schema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required("full name is required"),
  size: Yup.string()
    .oneOf(["S", "M", "L"], validationErrors.sizeIncorrect)
    .required("size is required"),
  toppings: Yup.array().of(Yup.string()),
});

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: "1", text: "Pepperoni" },
  { topping_id: "2", text: "Green Peppers" },
  { topping_id: "3", text: "Pineapple" },
  { topping_id: "4", text: "Mushrooms" },
  { topping_id: "5", text: "Ham" },
];

export default function Form() {
  // going to set state for form and errors
  const [values, setValues] = useState({
    fullName: "",
    size: "",
    toppings: [],
  });

  const [submittedName, setSubmittedName] = useState("");
  const [submittedSize, setSubmittedSize] = useState("");
  const [submittedToppings, setSubmittedToppings] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // going to validate on all changes
  useEffect(() => {
    schema
      .validate(values, { abortEarly: false })
      .then(() => {
        setErrors({});
        setIsValid(true);
      })
      .catch((err) => {
        const errObj = {};
        err.inner.forEach((e) => {
          errObj[e.path] = e.message;
        });
        setErrors(errObj);
        setIsValid(false);
      });
  }, [values]);

  // going to handle input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setValues((prev) => {
        let newToppings = prev.toppings.includes(value)
          ? prev.toppings.filter((t) => t !== value)
          : [...prev.toppings, value];
        return { ...prev, toppings: newToppings };
      });
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  // going to handle touched blur
  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  // going to handle submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent reloading
    schema
      .validate(values, { abortEarly: false }) // don't stop early after finding error
      .then(() => {
        setSubmitStatus("success");
        setSubmittedName(values.fullName);
        setSubmittedSize(values.size);
        setSubmittedToppings(values.toppings);
        setValues({ fullName: "", size: "", toppings: [] });
        setTouched({});
      })
      .catch(() => {
        setSubmitStatus("failure");
        setTouched({
          fullName: true,
          size: true,
          toppings: true,
        });
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {submitStatus === "success" && (
        <div className="success">
          Thank you for your order, {submittedName}! Your{" "}
          {submittedSize === "L"
            ? "large"
            : submittedSize === "M"
            ? "medium"
            : "small"}{" "}
          pizza
          {submittedToppings.length === 0
            ? " with no toppings."
            : ` with 
          ${submittedToppings.length} toppings.`}
        </div>
      )}

      {submitStatus === "failure" && (
        <div className="failure">Something went wrong</div>
      )}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input
            name="fullName"
            placeholder="Type full name"
            id="fullName"
            type="text"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        {(touched.fullName) && errors.fullName && (
          <div className="error">{errors.fullName}</div>
        )}

        {/*errors.fullName && <div className="error">{errors.fullName}</div>*/}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label>
          <br />
          <select
            id="size"
            name="size"
            value={values.size}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>

        {(touched.size) && errors.size && (
          <div className="error">{errors.size}</div>
        )}

        {/*errors.size && <div className="error">{errors.size}</div>*/}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {/*<label key="1">
          <input
            name="Pepperoni"
            type="checkbox"
          />
          Pepperoni<br />
        </label> */}
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              type="checkbox"
              name="toppings"
              value={topping.text}
              checked={values.toppings.includes(topping.text)}
              onChange={handleChange}
            />
            {topping.text}
            <br />
          </label>
        ))}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={!isValid} />
    </form>
  );
}
