# KernelSpecification Manager JupyterLab Extension
# Name

`ksmm` is a temporary name, originally standing for `Kernel Spec Manager Manger`

This Jupyter Extension allows users to edit specific components of their IPython Kernels from within Jupyter. Current Features:

* Kernel Editing (name, attributes)
* Kernel Duplication 
* Kernel Deletion

NOT IMPLEMENTED YET
--------
* "New" Kernel Additions.

# Goal

On large distributed systems, it is common to wish to parametrize kernels and
chose parameters for a remote environment, like number of CPU, Memory limit,
presence of GPU. Or even set other parameters in environment variables.

This currently requires to create a new kernelspec for jupyter using the command
line which can be a tedious and complicated task.

Modifying existing kernelspec also does not always works as they are cached on a
per notebook.

This is an attempt to provide a UI based on json-schema and templates, for end
users to easily create, duplicate and modify kernelspec, without being exposed
to _too much_ of the internal details.

The current goal would be to provide an editor for kernelspec that woudl
given a kernelspec template like the following

```
# kernelspec template
{'cmd':
    ['slurm', 'run', '--mem={mem}', '--cpu={cpu}','python3.8', '-m', 'ipykernel'],
 'title': "Python 3.8 {mem}/{cpu}"
 'params': {
     "mem":{'100G', '500G', '1T'}
     "cpu":{min:1, max:300}
    }
}
```

Generate a kernelspec modification UI with a Dropdown for the memory with
available values, and for example a slider for the CPU.

This would let non-technical user in for example JupyterHub to quickly modify
Kernelspecs



# Installing the Server Extension

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

