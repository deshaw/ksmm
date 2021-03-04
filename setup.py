import pathLib
import json
import setuptools
import jupyter_packaging

VERSION = '0.0.1'
HERE =  Path(__file__).parent.resolve()
# Name of the project
name = "ksmm"
lab_path = HERE / name / "labextension"

jstargets = [
        str(lab_path / "package.json"),
        ]

package_data_spec = {name: ["*"]}

labext_name = "@jupyterlab-ipython/KernelSpec-Manager"

cmdclass = jupyter_packaging.create_cmdclass(
        "jsdeps", package_data_spec=package_data_spec, data_files_spec=data_files_spec 
        )

js_command = jupyter_packaging.combine_commands(
        jupyter_packaging.install_npm(HERE, build_cmd="build:prod", npm=["jlpm"]),
        jupyter_packaging.ensure_targets(jstargets),
        )

pkg_json = json.loads(HERE / "package.json").read_bytes())


setup_args = dict(
    name='ksmm',
    version=VERSION,
    description='Jupyter Server Extension for IPython KernelSpec Manager',
    cmdclass=cmdclass,
    python_requires='>=3.8',
    packages=setuptools.find_packages(),
    install_requires=[
        "jupyterlab~=3.0",
    ],
    include_package_data=True,
)

if __name__ == "__main__":
    setuptools.setup(**setup_args)
