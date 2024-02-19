import { ReactNode } from 'react';

import TextFieldMui, { TextFieldProps } from '@mui/material/TextField';

import { useFormikContext } from 'formik';

/**
 * @param {TextFieldProps & {onEnterButtonPressed: Function, enterButton: Boolean, helpOnErrorText: ReactNode, onFormikChange: Function}} props
 */

const TextField = (props) => {
  const fmk = useFormikContext();
  const { errors, touched, values, handleChange, submitForm } = fmk;

  const {
    name,
    helperText,
    type,
    enterButton,
    helpOnErrorText,
    onFormikChange,
    ...rest
  } = props;

  const error = errors[name];
  const value = values[name];

  const hasError = Boolean(touched[name] && error);

  const onlyNumbers = (e) => {
    if (type === 'number' && !e.code?.match(/Digit[0-9]|(Backspace)|(Arrow*)/i))
      e.preventDefault();
  };

  const doHandleChange = (e) => {
    handleChange(e);
    onFormikChange?.call({}, name, e.target.value, values);
  };

  return (
    <TextFieldMui
      error={hasError}
      value={value}
      name={name}
      autoComplete="off"
      onKeyDown={onlyNumbers}
      onChange={doHandleChange}
      placeholder={props.placeholder || props.label}
      helperText={
        error ? (
          <>
            {error} {helpOnErrorText}
          </>
        ) : (
          helperText
        )
      }
      {...(enterButton && {
        onEnterButtonPressed: submitForm,
      })}
      {...rest}
    />
  );
};

export default TextField;
