import React from "react";
import { JSONSchema7 } from "json-schema";
import Form from "@rjsf/bootstrap-4";
import Card from "react-bootstrap/Card";
import { motion } from "framer-motion";

const iPyArgumentControl = (props: any): JSX.Element => {
  return (
    <div>
      <h1> Hello </h1>
    </div>
  );
};

const iPyEnvironmentControl = (props: any): JSX.Element => {
  return (
    <div>
      <p>{JSON.stringify(props)}</p>
    </div>
  );
};

const iPyForm = (props: any): JSX.Element => {
  return (
    <div>
      <p> {JSON.stringify(props)} </p>
    </div>
  );
};
