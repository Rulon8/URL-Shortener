import Alert from 'react-bootstrap/lib/Alert.js';
import React from 'react';
import './styles.css';

/* Shows a status message with the style given by props.status depending
 * on whether URL shortening was a success or not.
 */
const Message = (props) => {
  return (
    <Alert className='message' variant={props.variant}>
      {props.children}
    </Alert>
  );
};

export default Message;