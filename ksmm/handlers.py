"""
A notebook server extension that expose kernel spec
"""

__version__ = '0.0.1'

from notebook.utils import url_path_join
from notebook.base.handlers import IPythonHandler

from jupyter_client import KernelManager
from jupyter_server.base.handlers import APIHandler 
from jupyter_server.utils import url_path_join

from tornado import web, gen
from http.client import responses
import tornado

from pathlib import Path

import json


# class KSHandler(web.RequestHandler):
class KSHandler(APIHandler):
    """
    KernelSpec Handler to mange kernelspec via a REST API.

    currently start with the ks prefix.

    GET ks
    GET ks/  Will get all the kernelspec "kernel.json" data

    GET ks/<name>  Will the kernelspec "kernel.json" data for given kernel if exists

    DELETE ks/<name> Will delete the given kernelspec if exists

    LIST /ks
    LIST /ks/ will return {"names": <list of all the know kernel names>}

    COPY /ks/<name> with POST content "{"new_name":<new_name>}" will copy give kernelspec (including logo, kernel.js...)
    under the new name.

    POST: NotImplemented; currently jupyter_client only support installing kernelspec from a folder. Will Fix.
          Suggestion "POST ks/<name> replace the existing kernel.json with the content of the post.
    PUT: Alternate to copy; put directly a kernelspec. Not implemented for above reason.

    """

    def initialize(self, km):
        self.km = km
        # km.get_all_specs()
        # km.find_kernel_specs()
        # km.remove_kernel_spec(name)
        # km.install_kernel_spec(self, source_dir)  -- wierd as it take a source dir

        
    @tornado.web.authenticated
    def get(self, name=None):
        print("GET", name)
        if name is None:
            #  TODO: Write filepath to hash
            self.finish({k: v["spec"] for k, v in self.km.get_all_specs().items()})
        else:
            self.finish(self.km.get_kernel_spec(name).to_dict())

    @tornado.web.authenticated
    def delete(self, name):
        self.km.remove_kernel_spec(name)
        self.finish()

    @tornado.web.authenticated
    def list(self):
        l = self.km.find_kernel_specs().keys()
        self.finish({"names": list(self.km.find_kernel_specs().keys())})

    @tornado.web.authenticated
    def post(self, name=None):
        data = json.loads(self.request.body.decode('utf-8'))
        kernelPaths = self.km.find_kernel_specs()
        # Write to python object
        print(data['editedKernelPayload'], data['originalKernelName'])
        path = kernelPaths[str(data['originalKernelName'])]
        if name is None:
            pass
        with open(str(Path(path, 'kernel.json')), 'w') as outfile:
            json.dump(json.loads(data['editedKernelPayload']), outfile)
        self.finish(f"POST {name!r}\n")

    @tornado.web.authenticated
    def copy(self, name):
        data = tornado.escape.json_decode(self.request.body)
        new_name = data["new_name"]
        target = self.km.find_kernel_specs()[name]
        self.km.install_kernel_spec(target, new_name)

        self.finish(f"POST {name!r}\n")

    @tornado.web.authenticated
    def put(self, name=None):
        raise NotImplementedError
        print("PUT", name)
        if name is None:
            pass
        self.finish(f"PUT {name!r}\n")

    #@property
    #def current_user(self):
        """uncomment for testing, will disable authentication"""

    def write_error(self, status_code, **kwargs):
        """render custom error as json"""
        exc_info = kwargs.get("exc_info")
        message = ""
        status_message = responses.get(status_code, "Unknown HTTP Error")
        exception = "(unknown)"
        if exc_info:
            exception = exc_info[1]
            # get the custom message, if defined
            try:
                message = exception.log_message % exception.args
            except Exception:
                pass

            # construct the custom reason, if defined
            reason = getattr(exception, "reason", "")
            if reason:
                status_message = reason

        # build template namespace
        ns = dict(
            status_code=status_code,
            status_message=status_message,
            message=message,
            exception=exception,
        )

        self.set_header("Content-Type", "application/json")

        self.write({"status_code": status_code, "message": message})

def setup_handlers(web_app, km, url_path):
    base_url = web_app.settings["base_url"]
    full_url = url_path_join(base_url,  url_path, "/(\w+)")
    print(full_url)
    handlers = [
             (url_path_join(base_url, url_path), KSHandler, {'km': km}),
             (url_path_join(base_url, url_path, "/(\w+)"), KSHandler, {'km': km})
                ]

    web_app.add_handlers(".*", handlers)


