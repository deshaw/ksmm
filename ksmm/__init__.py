import pathlib
import json


from jupyter_server.serverapp import ServerApp
from jupyter_server.utils import url_path_join as ujoin, url2path


from .handlers import KSHandler


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

def _load_jupyter_server_extension(server_app: ServerApp(
            default_url = 'ks',
            base_url = 'ks',
            disable_check_xsrf = True, 
            )):
    print(dir(server_app))
    handlers = [
            ("/(\w+)", KSHandler)
            ]
    k_handlers = [(ujoin(server_app.base_url, x[0]), x[1]) for x in handlers]
    print(k_handlers)

    server_app.web_app.add_handlers(".*", k_handlers)


    server_app.launch_instance
    
