import Message from 'components/Message'
import Alert from 'react-bootstrap/lib/Alert.js';
import React from 'react';

/* Shows a status message with the style given by props.status depending
 * on whether URL shortening was a success or not.
 */
const ShortenMessage = (props) => {
  let alert_type;
  if (props.status === 'success') {
    alert_type = 'success';
  } else if (props.status === 'failure') {
    alert_type = 'danger';
  }
  return (
    <Message variant={alert_type}>
      {props.message}
      <Alert.Link href={props.url}>{props.url}</Alert.Link>
    </Message>
  );
};

export default ShortenMessage;