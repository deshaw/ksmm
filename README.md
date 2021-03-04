# Installing the Server Extension

```python
pip install -e .
jupyter server --ServerApp.jpserver_extensions="{'ksmm': True}" --ServerApp.allow_origin="*"
```

# Devloping the JupyterLab Extension

```python
pip install -e .
jupyter labextension develop . --overwrite
jlpm build 
jupyter lab
```


