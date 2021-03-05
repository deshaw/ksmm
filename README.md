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

# Enable server extension on boot

Make sure
```shell
cat ~/.jupyter/jupyter_notebook_config.json
```
Is reflected as
```json
{
  "NotebookApp": {
    "nbserver_extensions": {
      "ksmm": true
    }
  }
}
```
