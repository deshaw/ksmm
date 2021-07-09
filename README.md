# KernelSpecification Manager JupyterLab Extension

This Jupyter Extension allows users to edit specific components of their IPython Kernels from within Jupyter. Current Features:

* Kernel Editing (name, attributes)
* Kernel Duplication 
* Kernel Deletion

NOT IMPLEMENTED YET
--------
* "New" Kernel Additions.

## Install

To install ksmm, you can currently use `pip`. 

```python
pip install ksmm
```

This will install the extension inside the current JupyterLab Environment. This is typically the
latest release from the main branch. 

## Building from Source

Use the provided environment.yaml to install the conda environment:

```python
conda env update -f environment.yaml
```

If that doesn't work, feel free to roll your own: 

```python
conda create <env_name> jupyterlab nodejs jupyter-packaging -c conda-forge -y
conda activate <env_name>
```

To install the server side extension, install in pip editable mode: 

```python
pip install -e .
```

If asked for the react-bootstrap version, choose 2.0.0 (this should be pinned).
Then, compile the typescript (frontend) of the environment by compiling the frontend: 

```python
jupyter labextension develop --overwrite . 
jlpm build
```
Finally, start the jupyterlab extension without xsrf:

```python
jupyter lab --ServerApp.disable_check_xsrf=True --port=8888
```

**NOTE** Currently, the extension only works on port 8888

### Screenshots

Below are screenshots from the usage of the application

##### Home Screen
![](screenshots/home_screen_ss.png)
##### General Settings
![](screenshots/general_settings_ss.png)
##### Launch Arguments
![](screenshots/launch_args_ss.png)

