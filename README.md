# Kernel Specification Manager JupyterLab Extension

# Name

`ksmm` is a temporary name, originally standing for `Kernel Spec Manager Manger`

This Jupyter Extension allows users to edit specific components of their IPython Kernels from within Jupyter.

Current Features:

- Kernel Editing: name, attributes.
- Kernel Duplication. 
- Kernel Deletion.

Not implemented yet:

- "New" Kernel Additions.

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

The current goal would be to provide an editor for kernelspec that would
given a kernelspec template like the following.

```json
{
  "argv": [
    "slurm", "run", "--mem={mem}", "--cpu={cpu}", "python3.8", "-m", "ipykernel"
  ],
  "display_name": "Python 3.8 {mem}/{cpu}",
  "params": {
    "mem": ["100G", "500G", "1T"],
    "cpu": { "min": 1, "max": 300}
  }
}
```

Generate a kernelspec modification UI with a Dropdown for the memory with
available values, and for example a slider for the CPU.

This would let non-technical user in for example JupyterHub to quickly modify
Kernelspecs.

## Running from Source

Use the provided environment.yaml to install the conda environment.

```base
conda deactivate && \
  make env-rm && \
  make env
conda activate ksmm
```

```python
# Install the server and frontend in dev mode.
make install-dev
```

```python
# In terminal 1, Start the jupyterlab.
# open http://localhost:8234?token=...
make jlab
```

```python
# In terminal 2, start the extension building in watch mode.
make watch
```

# Installing the Server Extension

```bash
pip install ksmm
```

This will install the extension inside the current JupyterLab Environment. This is typically the
latest release from the main branch. 

When making changes to the extension you will need to issue a `jupyter labextension build`, or, start `jlpm run watch`
in the root of the repository to rebuild on every changes. You do not need to restart or rebuild JupyterLab for changes
on the frontend extensions, but do need to restart the server for changes to the Python code.

### Screenshots

Below are screenshots from the usage of the application.

##### Home Screen

![](screenshots/home_screen_ss.png)

##### General Settings

![](screenshots/general_settings_ss.png)

##### Launch Arguments

![](screenshots/launch_args_ss.png)

