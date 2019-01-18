import Button from 'react-bootstrap/lib/Button.js';
import React from 'react';

/* Generic Button component for use anywhere in the App */
const ButtonTemplate = (props) => {
  return (
    <Button variant={props.variant} type={props.type} onClick={props.onClickFunction}>{props.children}</Button>
  );
};

export default ButtonTemplate;