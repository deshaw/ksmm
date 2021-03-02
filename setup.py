import os
from setuptools import setup
import jupyter_packaging

VERSION = '0.0.1'

setup_args = dict(
    name='ksmm',
    version=VERSION,
    description='Jupyter Server Extension for IPython KernelSpec Manager',
    python_requires='>=3.8',
    packages=setuptools.find_packages(),
    install_requires=[
        "jupyterlab~=3.0",
    ],
    },
    include_package_data=True,
)

if __name__ == "__main__":
    setup(**setup_args)
