import React, { useState, useEffect } from "react";
import { ReactWidget } from "@jupyterlab/apputils";
import Container from "react-bootstrap/Container";
import { requestAPI } from "./handler";
import KsCard from "./components/kscard";
import { SuccessAlertBox } from "./components/alerts";
import { KsForm } from "./components/ksform";
import { Dialog } from '@jupyterlab/apputils';
import Form, { IChangeEvent } from "react-jsonschema-form";

import "bootstrap/dist/css/bootstrap.min.css";

/**
 * React component for listing the possible
 * kernelspecs.
 *
 * @returns The React component.
 */
const KernelManagerComponent = (): JSX.Element => {
  const [data, setData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [kernelFormData, setKernelFormData] = useState({});
  const [selectedKernelName, setSelectedKernelName] = useState('');
  const [cardData, setCardData] = useState([]);
  const [schema, setSchema] = useState({});
  const [alertBox, setAlertBox] = useState(false);

  /**
   * Handles the Kernel Selection
   * at the select screen.
   */
  const handleSelectKernelspec = (kernelName: string) => {
    setSelectedKernelName(kernelName);
    setKernelFormData((data as any)[kernelName]);
    setShowForm(true);
  }

  /**
   * Return Home on click.
   */
  const handleGoHome = () => {
    setShowForm(false);
    setAlertBox(false);
  }

  const refreshSchemas = () => {
    requestAPI("/schema", {
      method: "GET",
    }).then((s: any) => {
      setSchema(s);
    });
  }

  const refreshKernelspecs = () => {
    requestAPI("/", {
      method: "GET",
    }).then((res: any) => {
      setData(res);
      setCardData(createCardData(res));
    });
  }

  const handleCopyKernelspec = (kernel_name: string) => {
    requestAPI("/copy", {
      method: "POST",
      body: JSON.stringify({ name: kernel_name }),
    }).then((data: any) => {
      alert("A copy of " + kernel_name + " has been created.");
      refreshKernelspecs();
    });
  };

  const handleDeleteKernelspec = (kernel_name: string) => {
    requestAPI("/delete", {
      method: "POST",
      body: JSON.stringify({ name: kernel_name }),
    }).then((data: any) => {
      alert(kernel_name + " has been deleted.");
      refreshKernelspecs();
    });
  };

  const handleTemplateKernelspec = (cardPayload: any) => {
    const buttons = [
      Dialog.cancelButton({ label: 'Cancel'}),
      Dialog.okButton({ label: 'Create Kernelspec' })
    ];
    var params = {};
    const onChange = (e: IChangeEvent) => {
      params = e.formData
    }
    const dialog = new Dialog({
      title: 'Kernelspec Parameters',
      body: ReactWidget.create(
        <>
          <Form
            schema={{
              "title": "",
              "description": "",
              "type": "object",
              "properties": cardPayload.template.parameters
            }}
            onChange={onChange}
          >
            <div></div>
          </Form>
        </>
      ),
      buttons
    });  
    void dialog.launch().then(result => {
      if (result.button.accept) {
        requestAPI("/params", {
          method: "POST",
          body: JSON.stringify({ 
            name: cardPayload.kernel_name,
            params: params
          }),
        }).then((data: any) => {
          refreshKernelspecs();
        });    
      }
    });
  };

  /**
   * Handles a form submission when
   * kernels are modified in any form.
   *
   * Passed as a prop to Form.
   */
   const handleSubmitKernelspec = (e: any) => {
    requestAPI("/", {
      method: "POST",
      body: JSON.stringify({
        editedKernelPayload: JSON.stringify(e.formData),
        originalKernelName: selectedKernelName,
      }),
    }).then((data: any) => {
      if (data.success) {
        setAlertBox(true);
        refreshKernelspecs();
        setKernelFormData(e.formData);
      }
    });
  }

  /**
   * Generate the package of data needed
   * to display at the card selection screen.
   *
   * This method is called on when then data is generated to
   * send into the method generating the card data.
   */
  const createCardData = (kss: [any]) => {
    var card = new Array();
    for (const ks in kss) {
      card.push({
        kernel_name: ks,
        jupyter_name: kss[ks].display_name,
        template: kss[ks].metadata.template,
      });
    }
    return card;
  }

  useEffect(() => {
    refreshSchemas();
    refreshKernelspecs();
  }, []);

  return (
    <Container>
      <br/>
      <h3>Kernelspecs</h3>
      {!showForm && 
        <>
          <div style={{
            display: "flex",
            flexWrap: "wrap"
          }}>
            {
              cardData.map((cardPayload: any, id) => (
                !cardPayload.template && <KsCard
                  handleSelectKernelspec={handleSelectKernelspec.bind(this)}
                  handleCopyKernelspec={handleCopyKernelspec.bind(this)}
                  handleDeleteKernelspec={handleDeleteKernelspec.bind(this)}
                  cardPayload={cardPayload}
                  key={id}
                />
              ))
            }
          </div>
          <hr/>
          <h4>Templates</h4>
          <div><a href="https://github.com/quansight/ksmm/#about-kernelspec-templates" target="blank">More information</a> about the templates.</div>
          <div><b><a href="https://github.com/quansight/ksmm/issues/61" target="blank">We are not validating the form for now</a> - Please ensure you are correctly filling all the fields.</b></div>
          <div style={{
            display: "flex",
            flexWrap: "wrap"
          }}>
            {
              cardData.map((cardPayload: any, id) => (
                cardPayload.template && <KsCard
                handleTemplateKernelspec={handleTemplateKernelspec.bind(this)}
                cardPayload={cardPayload}
                  key={id}
                />
              ))
            }
          </div>
        </>
      }
      {alertBox && 
        <SuccessAlertBox handleClose={handleGoHome} />
      }
      {showForm && (
        <KsForm
          schema={schema}
          formData={kernelFormData}
          onSubmit={handleSubmitKernelspec.bind(this)}
          onCancel={handleGoHome.bind(this)}
        />
      )}
    </Container>
  );
}

/**
 * KernelspecManagerWidget main class.
 */
export class KernelspecManagerWidget extends ReactWidget {
  constructor() {
    super();
    this.addClass("jp-Ksmm");
  }
  render(): JSX.Element {
    return <KernelManagerComponent />
  }
}
