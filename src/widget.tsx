import { ReactWidget } from "@jupyterlab/apputils";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { SuccessAlertBox } from "./components/alerts";
import * as _ from "lodash";
import CardGrid from "./components/ipycardgrid";
import { IPyForm } from "./components/ipyform";
import { iPySchema } from "./ipyschema";

/**
 * React component for listing the possible
 * ipykernel options.
 *
 *
 * @returns The React component
 */
const KernelManagerComponent = (): JSX.Element => {
  const [data, setData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [showFormSelector, setShowFormSelector] = useState(false);
  const [kernelFormData, setKernelFormData] = useState({});
  const [selectedKernelName, setSelectedKernelName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [cardData, setCardData] = useState([]);
  const [alertBox, setAlertBox] = useState(false);

  /**
   * Handles a form submission when
   * kernels are modified in any form.
   *
   * Passed as a prop to Form
   */
  const handleKernelSubmission = (e: any) => {
    const url = "http://localhost:8888/ks";
    console.log("submitted data", JSON.stringify(e.formData));
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        editedKernelPayload: JSON.stringify(e.formData),
        originalKernelName: selectedKernelName,
      }),
    }).then((data) => {
      if (data.status == 200) {
        setAlertBox(true);
      }
    });
  };

  /**
   * Handles the Kernel Selection
   * at the select screen.
   */
  const handleSelectedKernel = (kernelName: string, e: any) => {
    const a = JSON.parse(JSON.stringify(data));
    setSelectedKernelName(kernelName);
    setKernelFormData(a[kernelName]);
    setShowFormSelector(false);
    setShowForm(true);
  };

  /**
   * At each component render,
   * render the proper component given the
   * constraints.
   *
   */
  const renderWidgets = () => {
    if (isLoading == true && showForm == false && data && cardData) {
      setIsLoading(false);
      setShowFormSelector(true);
    }
  };

  /**
   * Return Home on click.
   * TODO: Add Guards to check if editing.
   */
  const handleGoingHome = () => {
    setShowForm(false);
    setAlertBox(false);
    setShowFormSelector(true);
  };

  /**
   * Generate the package of data needed
   * to display at the card selection screen.
   *
   * This method is called on when then data is generated to
   * send into the method generating the card data.
   */
  const generateCardData = (ipydata: any) => {
    var arr: any = [];
    for (const property in ipydata) {
      var cardPayload = {
        kernel_name: `${property}`,
        jupyter_name: `${ipydata[property].display_name}`,
      };
      arr.push(cardPayload);
    }
    const rows = [...Array(Math.ceil(arr.length / 4))];
    const multiarr = rows.map((row, idx) => arr.slice(idx * 4, idx * 4 + 4));
    return multiarr;
  };

  /*
   * Set the maximum container size such that
   * the width and height are at their maximum.
   */

  useEffect(() => {
    const url = "http://localhost:8888/ks";
    const kernelSpec = async () => {
      const response = await fetch(url);
      const jsondata = await response.json();
      if (!_.isEqual(data, jsondata)) {
        setData(jsondata);
        setCardData(generateCardData(jsondata));
      }
    };

    kernelSpec();

    if (cardData.length > 0) {
      renderWidgets();
    }

    const timer = setInterval(() => {
      kernelSpec();
      if (showFormSelector) {
        renderWidgets();
      }
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [data, cardData]);

  return (
    <div className="full-w-div">
      <Container fluid className="jp-ReactForm">
        <a onClick={() => handleGoingHome()}> iPyKernel Manager </a>
        {showFormSelector
          ? cardData.map((cardPayload: any, idx) => (
              <CardGrid
                handleSubmit={handleSelectedKernel}
                cardPayload={cardPayload}
                key={idx}
              />
            ))
          : null}
        {alertBox ? <SuccessAlertBox handleClose={handleGoingHome} /> : null}
        {showForm ? (
          <IPyForm
            schema={iPySchema}
            formData={kernelFormData}
            onSubmit={handleKernelSubmission}
          />
        ) : null}
      </Container>
    </div>
  );
};

/**
 * IPyKernelWidget Main Class
 */
export class iPyKernelWidget extends ReactWidget {
  constructor() {
    super();
    this.addClass("jp-ReactWidget");
    this.addClass("jp-ReactForm");
    this.addClass("full-w-div");
  }

  render(): JSX.Element {
    return <KernelManagerComponent />;
  }
}
