import React from "react";
import { JSONSchema7 } from "json-schema";
import Form from "@rjsf/bootstrap-4";
import Card from "react-bootstrap/Card";
import { motion } from "framer-motion";

const SelectorComponent = (props: any): JSX.Element => {
  const schema: JSONSchema7 = {
    type: "object",
    properties: {
      ipykernels: {
        type: "string",
        enum: props.values,
      },
      uniqueItems: true,
    },
  };

  const handleCardClick = (kernelname: any) => {
	  console.log(props);
	  props.handleSubmit(kernelname);
  };

  const uiSchema = {
    ipykernels: {
      "ui:widget": (props: any) => {
        return props.options.enumOptions.map((ipyinfo: any) => (
          <motion.div className="container" whileHover={{ scale: 1.2 }}>
	  <a style={{ cursor: "pointer" }} onClick={() => handleCardClick(ipyinfo.value)}>
              <Card style={{ width: "18rem" }} className="mb-2">
                <Card.Body>
                  <Card.Title>Kernel Name: {ipyinfo.value}</Card.Title>
                </Card.Body>
              </Card>
            </a>
          </motion.div>
        ));
      },
    },
  };

  return (
    <div>
      <h3> Please Select a Kernel to Edit </h3>
      <Form schema={schema} uiSchema={uiSchema} children={' '}/>
    </div>
  );
};

export default SelectorComponent;
