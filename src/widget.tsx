import React, { useState, useEffect } from "react";
import { ReactWidget } from "@jupyterlab/apputils";
import Container from "react-bootstrap/Container";
import { requestAPI } from "./handler";
import KsCard from "./components/kscard";
import { SuccessAlertBox } from "./components/alerts";
import { KsForm } from "./components/ksform";
import { Dialog, showDialog, showErrorMessage } from '@jupyterlab/apputils';
import { KernelSpec, ServiceManager } from '@jupyterlab/services';
import Form, { IChangeEvent } from "react-jsonschema-form";

import '../style/extracted_bootstrap_styles.css'

interface KSMMAdditonalFields {
    name: string,
    deletable: boolean,
    writeable: boolean,
    fs_path: string,
    is_user: boolean
}

type EnhancedKernelSpec = KernelSpec.ISpecModel & {
    _ksmm: KSMMAdditonalFields
}

type EnhancedKernelMap = {[key: string]: EnhancedKernelSpec};
/**
 * React component for listing the possible
 * kernelspecs.
 *
 * @returns The React component.
 */
const KernelManagerComponent = (props: { serviceManager: ServiceManager }): JSX.Element => {
  const { serviceManager } = props;
  const [data, setData] = useState<EnhancedKernelMap |undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [kernelFormData, setKernelFormData] = useState<EnhancedKernelSpec | undefined>(undefined);
  const [selectedKernelName, setSelectedKernelName] = useState('');
  const [schema, setSchema] = useState({});
  const [alertBox, setAlertBox] = useState(false);

  /**
   * Handles the Kernel Selection
   * at the select screen.
   */
  const handleSelectKernelspec = (kernelSpec: EnhancedKernelSpec) => {
    setSelectedKernelName(kernelSpec._ksmm.name);
    setKernelFormData(kernelSpec);
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
    }).catch((err) => {
        return showErrorMessage('Could not refresh schemas', err);
    });
  }

  const refreshKernelspecs = () => {
    requestAPI("/", {
      method: "GET",
    }).then((res: any) => {
      setData(res);
      void serviceManager.kernelspecs.refreshSpecs();
    }).catch((err) => {
        return showErrorMessage('Could not refresh kernel specs', err);
    });
  }

  const handleCopyKernelspec = (kernelSpec: EnhancedKernelSpec) => {
    requestAPI("/copy", {
      method: "POST",
      body: JSON.stringify({ name: kernelSpec._ksmm.name }),
    }).catch((err) => {
        return showErrorMessage('Could not copy kernel spec', err);
    }).then((data: any) => {
      refreshKernelspecs();
    });
  };

  const handleDeleteKernelspec = async (kernelSpec: EnhancedKernelSpec) => {
    const action = await showDialog(
      {
          title: `Are you sure you want to delete ${kernelSpec.display_name} (${kernelSpec._ksmm.name})?`,
      }
    )
    if(!action.button.accept) {
        return;
    }
    requestAPI("/delete", {
      method: "POST",
      body: JSON.stringify({ name: kernelSpec._ksmm.name }),
    }).catch((err) => {
        return showErrorMessage('Could not delete kernel spec', err);
    }).then((data: any) => {
      refreshKernelspecs();
    });
  };

  const handleTemplateKernelspec = (kernelSpec: EnhancedKernelSpec) => {
    const buttons = [
      Dialog.cancelButton({ label: 'Cancel'}),
      Dialog.okButton({ label: 'Create Kernelspec' })
    ];
    var params = {};
    const onChange = (e: IChangeEvent) => {
      params = e.formData
    }
    const dialog = new Dialog({
      title: 'Kernelspec from Template',
      body: ReactWidget.create(
        <>
          <Form
            schema={{
              "title": "",
              "description": "",
              "type": "object",
              // @ts-ignore
              "properties": kernelSpec.metadata?.template?.parameters
            }}
            onChange={onChange}
          >
            <i>*We are not validating the form yet, please ensure you enter valid data (<a href="https://github.com/quansight/ksmm/issues/61" target="blank">issue</a>)</i>
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
            name: kernelSpec._ksmm.name,
            params: params
          }),
        }).catch((err) => {
            return showErrorMessage('Could not generate kernel from template', err);
        })
        .then((data: any) => {
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
    // Drop _ksmm before submitting
    const {_ksmm, ...editedKernelPayload } = e.formData;
    requestAPI("/", {
      method: "POST",
      body: JSON.stringify({
        editedKernelPayload: JSON.stringify(editedKernelPayload),
        originalKernelName: selectedKernelName,
      }),
    }).then((data: any) => {
      if (data.success) {
        setAlertBox(true);
        refreshKernelspecs();
        setKernelFormData(e.formData);
      } else {
          throw data;
      }
    }).catch((err) => {
        return showErrorMessage('Could not update kernel spec', err);
    })
  }

  useEffect(() => {
    refreshSchemas();
    refreshKernelspecs();
  }, []);

  /**
   * Generate the package of data needed
   * to display at the card selection screen.
   *
   * This method is called on when then data is generated to
   * send into the method generating the card data.
   */
   const userKernels: EnhancedKernelMap = {};
   const systemKernels: EnhancedKernelMap = {};
   Object.entries(data || {}).forEach(entry => {
    const [name, kernelSpec]  = entry;
    if(kernelSpec?._ksmm.is_user) {
        userKernels[name] = kernelSpec;
    } else {
        systemKernels[name] = kernelSpec;
    }
   });

  const KernelSpecCard = ({kernelSpec}: {kernelSpec: EnhancedKernelSpec}) => <KsCard
        handleSelectKernelspec={handleSelectKernelspec}
        handleCopyKernelspec={handleCopyKernelspec}
        handleDeleteKernelspec={handleDeleteKernelspec}
        handleTemplateKernelspec={handleTemplateKernelspec}
        kernelSpec={kernelSpec}
        key={kernelSpec._ksmm.fs_path}
    />;
    const sortByDisplayName = (k1: EnhancedKernelSpec, k2: EnhancedKernelSpec) => {
        if(k1.display_name < k2.display_name) {
            return -1;
        }
        if(k1.display_name > k2.display_name) {
            return 1;
        }
        return 0;
    }
    const userKernelCards = Object.values(userKernels).sort(sortByDisplayName).map(
        (kernelSpec) => <KernelSpecCard kernelSpec={kernelSpec}/>
    );
    const systemKernelCards = Object.values(systemKernels).sort(sortByDisplayName).map(
        (kernelSpec) => <KernelSpecCard kernelSpec={kernelSpec}/>
    );
  return (
    <Container>
      <br/>
      {!showForm &&
        <>
        {systemKernelCards.length > 0 ?
            <>
              <h3 className='h3'>
                System Kernel Specs
              </h3>
              <div className='ksmm-card-container'>
                {systemKernelCards}
              </div>
            </>
            : null
        }

        <hr className='ksmm-kernel-separator'/>
        {userKernelCards.length > 0 ?
            <>
              <h3 className='h3'>
                User Kernel Specs
              </h3>
              <div className='ksmm-card-container'>
                {userKernelCards}
            </div>
            </>
            : null
        }
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
  private _serviceManager: ServiceManager;
  constructor(serviceManager: ServiceManager) {
    super();
    this._serviceManager = serviceManager;
    this.addClass("jp-Ksmm");
  }
  render(): JSX.Element {
    return <KernelManagerComponent serviceManager={this._serviceManager} />
  }
}
