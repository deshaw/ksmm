import React from "react";

/*
 * This is a nested component in the FieldTemplate, and
 * does all the work for rendering the different options in their
 * respective places.
 *
 * props: data -> The data to render - namely, the data as defined in the schema.
 */
const KsFormGroup = (props: {
  properties: any;
  selectedTab: string;
  mainprops: any;
}) => {
  const formGroupMap: any = generateFormGroupMap(props.properties);
  return (
    <>
      {formGroupMap[props.selectedTab].map((index: number) => (
        <div className="property-wrapper" key={index}>
          {props.properties[index].content}
        </div>
      ))}
    </>
  );
}

/*
 * Grab the location of the element in the array,
 * returning a value of the positions in the array.
 */
function generateFormGroupMap(dataArr: any) {
  const QuickSettings: Array<number> = [];
  const GeneralSettingsArray: Array<number> = [];
  const LaunchArgumentsArray: Array<number> = [];
  const EnvironmentVariableArray: Array<number> = [];
  const ComputeParametersArray: Array<number> = [];
  const MetadataArray: Array<number> = [];

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
    } else if (element.name == "quick") {
      QuickSettings.push(dataArr.indexOf(element));
    } else {
      console.log("Unknown element name", element.name);
    }
  });

  return {
    ["General Settings"]: GeneralSettingsArray,
    ["Launch Arguments"]: LaunchArgumentsArray,
    ["Environment Variables"]: EnvironmentVariableArray,
    ["Compute Parameters"]: ComputeParametersArray,
    ["Quick Params"]: QuickSettings,
    ["Metadata"]: MetadataArray,
  }

}

export default KsFormGroup;
