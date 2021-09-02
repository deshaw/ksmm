"""A jupyterlab server extension that expose kernelspecs handling.
"""
import json
import os
import pathlib
import string
from pathlib import Path
from types import SimpleNamespace

from .kernel_schema import kernel_schema

import psutil
import tornado
import ulid as ulid_gen
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join

from ksmm.templating import format_tpl


class KSDeleteHandler(APIHandler):
    """KernelSpec DELETE Handler.

    Utilizes POST functionality in order
    to duplicate an environment.
    """

    @tornado.web.authenticated
    def post(self, name=None):
        data = tornado.escape.json_decode(self.request.body)
        name = data["name"]
        self.kernel_spec_manager.remove_kernel_spec(name)
        self.finish(json.dumps({
            "success": True,
            "name": name
        }))


class KSCopyHandler(APIHandler):
    """KernelSpec Copy Handler.

    Only utilizes POST functionality in order
    to duplicate an environment.
    """

    @tornado.web.authenticated
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        source_dir = self.kernel_spec_manager.find_kernel_specs()[data["name"]]
        new_name = '-'.join([data["name"], str(ulid_gen.new())])
        self.kernel_spec_manager.install_kernel_spec(source_dir, kernel_name=new_name, user=True)
        self.finish(json.dumps({
            "success": True,
            "new_name": new_name
        }))


class KSParamsHandler(APIHandler):

    @tornado.web.authenticated
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        template_name = data["name"]
        template_spec = self.kernel_spec_manager.get_kernel_spec(template_name).to_dict()
        params = data["params"]
#        for item in params.items():
#            params[item[0]] = str(item[1])
#        params = json.dumps(params)
#        params = json.loads(params)
        spec = format_tpl(template_spec, **params)
        printable = set(string.printable)
        kernel_name = ''.join(filter(lambda x: x in printable, spec['display_name']))
        kernel_name = str(kernel_name).lower().replace('/', '_').replace('=', '').replace(':', '').replace(' ', '-')
        source_dir = self.kernel_spec_manager.find_kernel_specs()[data["name"]]
        self.kernel_spec_manager.install_kernel_spec(source_dir, kernel_name=kernel_name, user=True)
        dir = self.kernel_spec_manager.find_kernel_specs()[kernel_name]
        f = open(dir + os.path.sep + 'kernel.json', 'w')
        f.write(json.dumps(spec))
        f.close()
        self.finish(
            json.dumps(
                {
                    "success": True,
                }
            )
        )


class KSSchemaHandler(APIHandler):
    """KernelSpec Schema Handler

    Loads the schema required to render the frontend from the JSON file, calculating any
    information that is needed dynamically.
    """

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
#        schemafp = pathlib.Path('schema', 'kernelSchema.json')
#        schema = dict(self.get_schema(path=schemafp.__str__()))
        schema = json.loads(kernel_schema)
        schema = self.set_parameters(schema, params)
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

    @tornado.web.authenticated
    def get(self, name=None):
        if name is None:
            # TODO This is suboptimal but needed as get_all_specs methods does not return and updated view of the specs.
            kernel_specs = {k: self.kernel_spec_manager.get_kernel_spec(k).to_dict()
              for k in self.kernel_spec_manager.find_kernel_specs()}
            self.finish(kernel_specs)
        else:
            self.finish(self.kernel_spec_manager.get_kernel_spec(name).to_dict())


    @tornado.web.authenticated
    def post(self, name=None):
        data = json.loads(self.request.body.decode('utf-8'))
        # target = self.kernel_spec_manager.find_kernel_specs()[data["name"]]
        # self.kernel_spec_manager.install_kernel_spec(target, new_name)
        originalKernelName = str(data['originalKernelName'])
        if originalKernelName is None:
            self.finish(json.dumps({
                "success": False,
                "message": "You must provide a kernelspec name"
            }))
        else:
            kernelPaths = self.kernel_spec_manager.find_kernel_specs()
            # Write to python object.
            path = kernelPaths[originalKernelName]
            with open(str(Path(path, "kernel.json")), "w") as outfile:
                json.dump(json.loads(data["editedKernelPayload"]), outfile, indent=2)
            self.finish(
                json.dumps({"success": True, "kernel_name": originalKernelName})
            )


    def write_error(self, status_code, **kwargs):
        """Render custom error as json"""
        exc_info = kwargs.get("exc_info")
        message = ""
        exception = "(unknown)"
        if exc_info:
            exception = exc_info[1]
            try:
                message = exception.log_message % exception.args
            except Exception:
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
                pass
        self.set_header("Content-Type", "application/json")
        self.write({"status_code": status_code, "message": message})


def setup_handlers(web_app):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]
    handlers = [
        (url_path_join(base_url, "ksmm", "/"), KSHandler),
        (url_path_join(base_url, "ksmm", "/copy"), KSCopyHandler),
        (url_path_join(base_url, "ksmm", "/delete"), KSDeleteHandler),
        (url_path_join(base_url, "ksmm", "/schema"), KSSchemaHandler,),
        (url_path_join(base_url, "ksmm", "/params"), KSParamsHandler,),
    ]
    web_app.add_handlers(host_pattern, handlers)
