# Name

`ksmm` is a temporary name, originally standing for `Kernel Spec Manager Manger`

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
pip install -e .
jupyter labextension develop . --overwrite
jlpm build
```

# Devloping the JupyterLab Extension

```python
pip install -e .
jupyter labextension develop . --overwrite
jlpm build 
jupyter lab
```


