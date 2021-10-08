"""A jupyterlab server extension that expose kernelspecs handling.
"""
import json
import os
import stat
import string
from pathlib import Path

import tornado
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join

from ksmm.templating import format_tpl

from .kernel_schema import kernel_schema


def kernel_path(dir):
    return os.path.join(dir, "kernel.json")


def find_next_name(specs, name):
    i = 0
    new_name = name
    while new_name in specs:
        i += 1
        new_name = f"{name}-{i}"
    return new_name, i


def make_user_writable(dir):
    """
    Make everything in dir writeable by the user
    This mirrors installing a kernel (since you may have copied one that is read only)
    """
    for file_or_dir in os.listdir(dir):
        f = os.path.join(dir, file_or_dir)
        st = os.stat(f)
        os.chmod(f, st.st_mode | stat.S_IWRITE)


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
        self.finish(json.dumps({"success": True, "name": name}))


class KSCopyHandler(APIHandler):
    """KernelSpec Copy Handler.

    Only utilizes POST functionality in order
    to duplicate an environment.
    """

    @tornado.web.authenticated
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        specs = self.kernel_spec_manager.find_kernel_specs()
        source_dir = specs[data["name"]]
        new_name, i = find_next_name(specs, data["name"])
        dest = self.kernel_spec_manager.install_kernel_spec(
            source_dir, kernel_name=new_name, user=True
        )
        make_user_writable(dest)

        # Now update the name in the kernel
        spec = self.kernel_spec_manager.get_kernel_spec(new_name).to_dict()
        if i > 0:
            spec["display_name"] = f'{spec["display_name"]} ({i})'
        with open(kernel_path(dest), "w") as f:
            f.write(json.dumps(spec, indent=3))
        self.finish(json.dumps({"success": True, "new_name": new_name}))


class KSParamsHandler(APIHandler):
    @tornado.web.authenticated
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        template_name = data["name"]
        params = data["params"]

        specs = self.kernel_spec_manager.find_kernel_specs()
        template_spec = self.kernel_spec_manager.get_kernel_spec(
            template_name
        ).to_dict()
        spec = format_tpl(template_spec, **params)

        printable = set(string.printable)
        kernel_name = "".join(filter(lambda x: x in printable, spec["display_name"]))
        kernel_name = (
            str(kernel_name)
            .lower()
            .replace("/", "_")
            .replace("=", "")
            .replace(":", "")
            .replace(" ", "-")
            .replace("(", "_")
            .replace(")", "_")
            .replace(",", "")
        )
        kernel_name, i = find_next_name(specs, kernel_name)
        if i > 0:
            spec["display_name"] = f'{spec["display_name"]} ({i})'
        source_dir = specs[template_name]
        self.kernel_spec_manager.install_kernel_spec(
            source_dir, kernel_name=kernel_name, user=True
        )
        dir = self.kernel_spec_manager.find_kernel_specs()[kernel_name]
        make_user_writable(dir)
        with open(kernel_path(dir), "w") as f:
            f.write(json.dumps(spec, indent=3))
        self.finish(
            json.dumps(
                {
                    "success": True,
                }
            )
        )


class KSSchemaHandler(APIHandler):
    """KernelSpec Schema Handler

    Loads the schema required to render the frontend from the JSON file
    """

    @tornado.web.authenticated
    def get(self):
        self.finish(kernel_schema)


class KSHandler(APIHandler):
    """KernelSpec Handler to mange kernelspec via a REST API.

    currently start with the ks prefix.

    GET ks/  Will get all the kernelspec "kernel.json" data
    POST: Update a kernelspec in place
    """

    @tornado.web.authenticated
    def get(self):
        # TODO This is suboptimal but needed as get_all_specs methods does not return and updated view of the specs.
        kernel_specs = {}
        user_kernel_dir = Path(self.kernel_spec_manager.user_kernel_dir)
        for k in self.kernel_spec_manager.find_kernel_specs():
            spec = self.kernel_spec_manager.get_kernel_spec(k)
            # Can we write to kernel.json?
            try:
                writeable = os.access(kernel_path(spec.resource_dir), os.W_OK)
            except Exception:
                writeable = False
            # Can we delete (this means read + write to parent dir)
            try:
                deletable = os.access(spec.resource_dir, os.W_OK | os.X_OK)
            except Exception:
                deletable = False
            is_user = user_kernel_dir in Path(spec.resource_dir).parents
            kernel_specs[k] = spec.to_dict()
            kernel_specs[k]["_ksmm"] = {
                "name": k,
                "writeable": writeable,
                "deletable": deletable,
                "fs_path": spec.resource_dir,
                "is_user": is_user,
            }
        self.finish(kernel_specs)

    @tornado.web.authenticated
    def post(self, name=None):
        data = json.loads(self.request.body.decode("utf-8"))
        # target = self.kernel_spec_manager.find_kernel_specs()[data["name"]]
        # self.kernel_spec_manager.install_kernel_spec(target, new_name)
        originalKernelName = str(data["originalKernelName"])
        if originalKernelName is None:
            self.finish(
                json.dumps(
                    {"success": False, "message": "You must provide a kernelspec name"}
                )
            )
        else:
            kernelPaths = self.kernel_spec_manager.find_kernel_specs()
            # Write to python object.
            path = kernelPaths[originalKernelName]
            with open(kernel_path(path), "w") as outfile:
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
        (
            url_path_join(base_url, "ksmm", "/schema"),
            KSSchemaHandler,
        ),
        (
            url_path_join(base_url, "ksmm", "/params"),
            KSParamsHandler,
        ),
    ]
    web_app.add_handlers(host_pattern, handlers)
