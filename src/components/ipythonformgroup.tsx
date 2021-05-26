import React from "react";
//import Form from "@rjfs/bootstrap4";

/*
 * This is a nested comoponenet in the FieldTemplate, and
 * does all the work for rendering the different optins in their
 * respective places.
 *
 * props:
 *
 * 	 data -> The data to render - namely, the data as defined in the schema
 */
export const IPythonFormGroup = (props: {
  data: any;
  selecteditem: string;
}) => {
  const fg: any = generateFormGroupMap(props.data);
  return (
    <div>
      {fg[props.selecteditem].map((index: number) => (
        <div className="property-wrapper" key={index}>
          {props.data[index].content}
        </div>
      ))}
    </div>
  );
};

/*
 * Grab the location of the element in the array,
 * returning a value of the postions in the array.
 */
function generateFormGroupMap(dataArr: any) {
  const GeneralSettingsArray: Array<number> = [];
  const LaunchArgumentsArray: Array<number> = [];
  const EnvironmentVariableArray: Array<number> = [];
  const ComputeParametersArray: Array<number> = [];
  const MetadataArray: Array<number> = [];
  console.log(dataArr);
  dataArr.forEach((element: any) => {
    if (
      element.name == "display_name" ||
      element.name == "interrupt_mode" ||
      element.name == "language"
    ) {
      GeneralSettingsArray.push(dataArr.indexOf(element));
    } else if (element.name == "argv") {
      LaunchArgumentsArray.push(dataArr.indexOf(element));
    } else if (element.name == "env") {
      EnvironmentVariableArray.push(dataArr.indexOf(element));
    } else if (element.name == "parameters") {
      ComputeParametersArray.push(dataArr.indexOf(element));
    } else if (element.name == "metadata") {
      MetadataArray.push(dataArr.indexOf(element));
    } else {
      console.log("oopsies");
    }
  });
  return {
    ["General Settings"]: GeneralSettingsArray,
    ["Launch Arguments"]: LaunchArgumentsArray,
    ["Environment Variables"]: EnvironmentVariableArray,
    ["Compute Parameters"]: ComputeParametersArray,
    ["Metadata"]: MetadataArray,
  };
}
