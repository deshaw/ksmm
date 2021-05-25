import React from "react";
import Alert from "react-bootstrap/Alert";

export const SuccessAlertBox = (props: any): JSX.Element => {
  return (
    <div>
      <Alert variant="success" onClose={() => props.handleClose()} dismissible>
        <Alert.Heading> The deployment of env_name was success. </Alert.Heading>
      </Alert>
    </div>
  );
};
