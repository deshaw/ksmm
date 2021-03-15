import React from 'react';
import { JSONSchema7 } from "json-schema";
import Form from "@rjsf/bootstrap-4";

const SelectorComponent = (props: any): JSX.Element => {
   const schema: JSONSchema7 = {
      type: "object",
      properties: {
	ipykernels: {
        	type: "string",
        	enum: props.values, 
      	},
      uniqueItems: true
    }};	

    const uiSchema = {
    	ipykernels: {
    		"ui:widget": "radio"
	},
    };


    return (
	    <div>
		<Form schema={schema}
        	      uiSchema={uiSchema}
		      onSubmit={props.handleSubmit}
		/>
	    </div>
    );

};

export default SelectorComponent; 
