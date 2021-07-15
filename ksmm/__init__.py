import json
import pathlib

from jupyter_server.serverapp import ServerApp
from jupyter_server.utils import url2path
from jupyter_server.utils import url_path_join as ujoin

from .handlers import setup_handlers
from .version import __version__

HERE = pathlib.Path(__file__).parent.resolve()

with open(HERE / 'labextension' / 'package.json') as fid:
    data = json.load(fid)

def _jupyter_labextension_paths():
    return [{
        'src': 'labextension',
        'dest': data['name']
        }]

def _jupyter_server_extension_paths():
    return [{
        "module": "ksmm.app",
        "app": ksmm
    }]

def _jupyter_server_extension_points():
    return [{"module": "ksmm"}]

def _load_jupyter_server_extension(server_app):
    url_path = "ks"
    setup_handlers(server_app.web_app, server_app.kernel_spec_manager_class(), url_path)
    
