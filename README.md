# Kernel Specification Manager JupyterLab Extension

> This JupyterLab Extension allows users to manage Kernelspecs from within JupyterLab.

![](screenshots/home_screen_ss.png)

`ksmm` is a temporary name, originally standing for `Kernelspec Manager` and currently ships:

- Kernelspec creation based on parametrized templates.
- Kernelspec Editing: name, attributes.
- Kernel Duplication. 
- Kernel Deletion.

## Context

On large distributed systems, it is common to wish to parametrize kernels and choose parameters for a remote environment, like number of CPU, Memory limit, presence of GPU. Or even set other parameters in environment variables.

This currently requires to create a new Kernelspec for jupyter using the command line which can be a tedious and complicated task.

Modifying existing Kernelspec also does not always works as they are cached on a per notebook.

This is an attempt to provide a UI based on json-schema and templates, for end users to easily create, duplicate and modify kernelspec, without being exposed to _too much_ of the internal details.

## Install Kernelspecs Templates

You will need to install some [Kernelspec templates](#about-kernelspec-templates).

```bash
make install-kernelspecs
```

This will install the `python-template-1` Kernelspec example located in the examples folder into your system environment.

## Install from a Release

Ensure you have JupyterLab 3.1+, and then run this command the ksmm extension inside your current JupyterLab environment.

```bash
pip install --upgrade ksmm
```

## Develop

Use the provided `environment.yaml` to install the conda environment.

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

When making changes to the extension you will need to issue a `jupyter labextension build`, or, start `jlpm run watch` in the root of the repository to rebuild on every changes. You do not need to restart or rebuild JupyterLab for changes on the frontend extensions, but do need to restart the server for changes to the Python code.

## About Kernelspec Templates

You system adminstrator can create Kernelspect templates for you. As a user, if you click on the picker icon of a template card, you will be prompted for the Kernelspec parameters.

<img src="screenshots/parameters_ss.png" width="400" />

When you will click on the `Create Kernelspec` button, a new Kernespec will be created.

This is an example of such a Kernelspec template. The `metadata/template/tpl` stanza should contain a [Json Schema](https://json-schema.org) compliant structure. You can browser the [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form) for examples.

You can use the `metadata/template/mapping` stanza to create visual mappings (e.g. `Small` will be mapped to `102400`). The `example/python-template-1` contains an example. To install that example template in your environment, you need to run `jupyter kernelspec install ./examples/python-template-1` (add `--user` to install in your user space).

<details>
  <summary>Click to view the kernelspec example.</summary>

```json
{
  "argv": [
    "python",
    "-m",
    "ipykernel_launcher",
    "-f",
    "{connection_file}",
    "--cache-size={cache_size}",
    "--matplotlib={matplotlib}"
  ],
  "display_name": "Python 3.8 Template 1",
  "language": "python",
  "metadata": {
    "template": {
      "tpl": {
        "argv": [
          "python",
          "-m",
          "ipykernel_launcher",
          "-f",
          "{connection_file}",
          "--cache-size={cache_size_map}",
          "--matplotlib={matplotlib}",
          "--logfile={logfile}",
          "--Kernel._poll_interval={poll_interval}"
        ],
        "display_name": "Python cache_size {cache_size_map} matplotlib {matplotlib}"
      },
      "parameters": {
        "poll_interval": {
          "type": "number",
          "minimum": 0.01,
          "maximum": 1,
          "multipleOf": 0.01,
          "title": "Kernel pool interval in seconds",
          "default": 0.01
        },
        "cache_size": {
          "type": "integer",
          "title": "Set the size of the cache",
          "default": "Medium",
          "enum": [
            "Small",
            "Medium",
            "Big"
          ]
        },
        "matplotlib": {
          "type": "string",
          "title": "Configure matplotlib for interactive use with the default matplotlib backend",
          "default": "widget",
          "enum": [
            "auto", "agg", "gtk", "gtk3", "inline", "ipympl", "nbagg", "notebook", 
            "osx", "pdf", "ps", "qt", "qt4", "qt5", "svg", "tk", "widget", "wx"
          ]
        },
        "logfile": {
          "type": "string",
          "title": "Set the path for the logfile",
          "default": "/tmp/kernel.out"
        }
      },
      "mapping": {
        "cache_size_map": {
          "cache_size": {
            "Small": "102400",
            "Medium": "512000",
            "Big": "1048576000"
          }
        }
      }
    }
  }
}
```

</details>

## General Settings

![](screenshots/general_settings_ss.png)

## Launch Arguments

![](screenshots/launch_args_ss.png)

## Release

To publish a release, you need to manually bump the version number of the [package.json](https://github.com/deshaw/ksmm/blob/main/package.json) file, this this diff for example.

```diff
 {
   "name": "@deshaw/jupyterlab-ksmm",
-  "version": "0.1.4",
+  "version": "0.1.5",
   "description": "An extension to manage Kernelspecs from JupyterLab",
   "keywords": [
     "jupyter",
```

Pleas follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html) rules when bumping the version number.

Commmit and push your changes, then run the following comamand which clean, build and push the needed artifact into the [PyPi Ksmm project](https://pypi.org/project/ksmm) (ensure you have been given the needed authorization for that).

```bash
make publish
```

At some point, it would be interesting to use the [https://github.com/jupyter-server/jupyter_releaser](juypyter-releaser) tool (tracked in [#81](https://github.com/deshaw/ksmm/issues/81)).

## History
This was created by the [D. E. Shaw group](https://www.deshaw.com/) in conjunction with [Quansight](https://www.quansight.com/).

<p align="center">
    <a href="https://www.deshaw.com">
       <img src="https://www.deshaw.com/assets/logos/blue_logo_417x125.png" alt="D. E. Shaw Logo" height="75" >
    </a>
</p>
