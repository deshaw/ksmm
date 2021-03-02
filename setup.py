import os
from setuptools import setup
import jupyter_packaging

VERSION = '0.0.1'

setup_args = dict(
    name='ksmm',
    version=VERSION,
    description='Jupyter Server Extension for glootalk',
    python_requires='>=3.8',
    install_requires=[
    ],
    entry_points={
        'console_scripts': [
            'ksmm=ksmm.app:main'
        ]
    },
    include_package_data=True,
)

if __name__ == "__main__":
    setup(**setup_args)
