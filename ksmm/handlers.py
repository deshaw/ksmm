"""A jupyterlab server extension that expose kernel spec
"""
import json
import pathlib
from pathlib import Path
from types import SimpleNamespace

import psutil
import tornado
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join


class KSIPyCreateHandler(APIHandler):
    """
    Handler for creation of a new IPython Kernel Specification.
    """
    def initialize(self, km):
        self.km = km


    @tornado.web.authenticated
    def post(self, name=None):
        # data = tornado.escape.json_decode(self.request.body)
        # source_dir = self.km.find_kernel_specs()[name]
        self.finish(f"POST {name!r}\n")


class KSDeleteHandler(APIHandler):
    """KernelSpec DELETE Handler.

    Utilizes POST functionality in order
    to duplicate an environment.
    """
    def initialize(self, km):
        self.km = km
   

    @tornado.web.authenticated
    def post(self, name=None):
        data = tornado.escape.json_decode(self.request.body)
        self.km.remove_kernel_spec(data["name"])
        self.finish(f"DELETED {name!r}\n")


class KSCopyHandler(APIHandler):
    """KernelSpec Copy Handler.

    Only utilizes POST functionality in order
    to duplicate an environment.
    """
    def initialize(self, km):
        self.km = km
   

    @tornado.web.authenticated
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        source_dir = self.km.find_kernel_specs()[data["name"]]
        new_name = '-'.join([data["name"], "copy"])
        self.km.install_kernel_spec(source_dir, kernel_name=new_name)
        self.finish()


class KSSchemaHandler(APIHandler):
    """KernelSpec Schema Handler

    Loads the schema required to render the frontend from the JSON file, calculating any
    information that is needed dynamically.
    """
    def initialize(self, km):
        self.km = km


    def get_local_params(self) -> dict:
        
        to_str = lambda int_list: [str(item) for item in int_list]
        params = {
            "cores": to_str(list(range(1, psutil.cpu_count() + 1))),
            "memory": to_str(
                list(range(1, int(psutil.virtual_memory().available * (10 ** -9)) + 1))
            ),
        }
        return params


    def set_parameters(self, schema: dict, params: SimpleNamespace) -> dict:
        schema['properties']['parameters']['properties']['cores']['enum'] = params.cores
        schema['properties']['parameters']['properties']['memory']['enum'] = params.memory
        return schema


    def get_schema(self, path: str) -> str:
        with open(path, 'r') as f:
            schema_file = f.read()
        return json.loads(schema_file)


    @tornado.web.authenticated
    def get(self, name=None):
        params = SimpleNamespace(**self.get_local_params())
        schemafp = pathlib.Path('schema', 'kernelSchema.json')
        schema = dict(self.get_schema(path=schemafp.__str__()))
        schema  = self.set_parameters(schema, params)
        json_schema = json.dumps(schema)
        self.finish(json_schema)


class KSHandler(APIHandler):
    """KernelSpec Handler to mange kernelspec via a REST API.

    currently start with the ks prefix.

    GET ks/  Will get all the kernelspec "kernel.json" data
    GET ks/<name>  Will the kernelspec "kernel.json" data for given kernel if exists
    DELETE ks/<name> Will delete the given kernelspec if exists
    LIST /ks
    LIST /ks/ will return {"names": <list of all the know kernel names>}
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
        # l = self.km.find_kernel_specs().keys()
        self.finish({"names": list(self.km.find_kernel_specs().keys())})


    @tornado.web.authenticated
    def post(self, name=None):
        data = json.loads(self.request.body.decode('utf-8'))
        # target = self.km.find_kernel_specs()[data["name"]]
        # self.km.install_kernel_spec(target, new_name)
        originalKernelName = str(data['originalKernelName'])
        if originalKernelName is None:
            self.finish(json.dumps({
                "success": False,
                "message": "You must provide a kernelspec name"
            }))
        else:
            kernelPaths = self.km.find_kernel_specs()
            # Write to python object.
            path = kernelPaths[originalKernelName]
            with open(str(Path(path, 'kernel.json')), 'w') as outfile:
                json.dump(json.loads(data['editedKernelPayload']), outfile)
            self.finish(json.dumps({
                "success": True,
                "kernel_name": originalKernelName
            }))


    @tornado.web.authenticated
    def put(self, name=None):
        raise NotImplementedError


    def write_error(self, status_code, **kwargs):
        """Render custom error as json"""
        exc_info = kwargs.get("exc_info")
        message = ""
        # status_message = responses.get(status_code, "Unknown HTTP Error")
        exception = "(unknown)"
        if exc_info:
            exception = exc_info[1]
            # get the custom message, if defined
            try:
                message = exception.log_message % exception.args
            except Exception:
                pass
        # construct the custom reason, if defined
        #    reason = getattr(exception, "reason", "")
        #    if reason:
        #        status_message = reason
        # build template namespace
        # ns = dict(
        #     status_code=status_code,
        #     status_message=status_message,
        #     message=message,
        #     exception=exception,
        # )
        self.set_header("Content-Type", "application/json")
        self.write({"status_code": status_code, "message": message})


def setup_handlers(web_app, km):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]
    handlers = [
        (url_path_join(base_url, "ksmm", "/"), KSHandler, {'km': km}),
        (url_path_join(base_url, "ksmm", "/copy"), KSCopyHandler, {"km": km}),
        (url_path_join(base_url, "ksmm", "/delete"), KSDeleteHandler, {"km": km}),
        (url_path_join(base_url, "ksmm", "/schema"), KSSchemaHandler, {"km": km}),
        (url_path_join(base_url, "ksmm", "/createipy"), KSIPyCreateHandler, {"km": km}),
    ]
    web_app.add_handlers(host_pattern, handlers)
