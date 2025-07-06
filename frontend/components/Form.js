import React, { useEffect, useState } from 'react'
import * as Yup from 'yup';

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const schema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required('full name is required'),
  size: Yup.string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
    .required('size is required'),
  toppings: Yup.array().of(Yup.string())
  
})
// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
  // going to set state for form and errors
  const [values, setValues] = useState({
    fullName: '',
    size: '',
    toppings: [],
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // going to validate on all changes
  const validate = async (fieldValues = values) => {
    try {
      await schema.validate(fieldValues, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
    const errObj = {};
    err.inner.forEach(e => {
      errObj[e.path] = e.message
    })
    setErrors(errObj);
    return false;
  }};

  // going to handle input changes
  const handleChange = e => {
    const { name, value, type, check } = e.target
    if (type === 'checkbox') {
      setValues(prev => {
        const toppingsArr = prev.toppings.includes(value)
        ? prev.toppings.filter(t => t !== value)
        : [...prev.toppings, value]
      })
    } else {
      setValues(prev => {
        const newVals = { ...prev, [name]: value };
        validate(newVals);
        return newVals;
      });
    }
  }

  // going to handle touched blur
  const handleBlur = e => {
    setTouched(prev => ({ ...prev, [e.target.name]: true}));
  }

  // going to handle submission
  const handleSubmit = async e => {
    e.preventDefault() // prevent reloading
    const isValid = await validate();
    setTouched({ fullName: true, size: true }); // mark them all as touched
    if (isValid) {
      setSubmitSuccess(true);
      setSubmitError(false);
    }
  }

  const isFormValid = Object.keys(errors).length === 0 && values.fullName && values.size;

  return (
    <form>
      <h2>Order Your Pizza</h2>
      {submitSuccess && <div className='success'>Thank you for your order!</div>}
      {submitError && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" 
                 id="fullName" 
                 type="text"
                 value={values.fullName}
                 onChange={handleChange}
                 onBlur={handleBlur} />
        </div>
        {touched.fullName && errors.fullName && <div className='error'>errors.fullName</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size"
                  name='size'
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
        {touched.size && errors.size  && <div className='error'>{errors.size}</div>}
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
              type='checkbox'
              name='toppings'
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
      <input type="submit" disabled={isFormValid} />
    </form>
  )
}
