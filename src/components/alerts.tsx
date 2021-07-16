import React from "react";
import Alert from "react-bootstrap/Alert";

export const SuccessAlertBox = (props: any): JSX.Element => {
  return (
    <Alert variant="success">Success <a style={{textDecoration: "underline"}} onClick={() => props.handleClose()}>Close</a></Alert>
  );
}
