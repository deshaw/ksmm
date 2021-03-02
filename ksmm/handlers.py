"""
A notebook server extension that expose kernel spec
"""

__version__ = '0.0.1'

from notebook.utils import url_path_join
from notebook.base.handlers import IPythonHandler


from tornado import web, gen
from http.client import responses
import tornado


# class KSHandler(web.RequestHandler):
class KSHandler(IPythonHandler):
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

    SUPPORTED_METHODS = ["GET", "POST", "DELETE", "LIST", "PUT", "COPY"]

    def __init__(self, *args, **kwargs):
        self.km = kwargs.pop("manager")
        self._dummy_user = kwargs.pop("dummy_user")
        # km.get_all_specs()
        # km.find_kernel_specs()
        # km.remove_kernel_spec(name)
        # km.install_kernel_spec(self, source_dir)  -- wierd as it take a source dir
        super().__init__(*args, **kwargs)

        
    @web.authenticated
    def get(self, name=None):
        print("GET", name)
        if name is None:
            self.finish({k: v["spec"] for k, v in self.km.get_all_specs().items()})
        else:
            self.finish(self.km.get_kernel_spec(name).to_dict())

    @web.authenticated
    def delete(self, name):
        self.km.remove_kernel_spec(name)
        self.finish()

    @web.authenticated
    def list(self):
        l = self.km.find_kernel_specs().keys()
        self.finish({"names": list(self.km.find_kernel_specs().keys())})

    @web.authenticated
    def post(self, name=None):
        raise NotImplementedError
        data = tornado.escape.json_decode(self.request.body)
        print("POST", name, ":", data)
        if name is None:
            pass
        self.finish(f"POST {name!r}\n")

    @web.authenticated
    def copy(self, name):
        data = tornado.escape.json_decode(self.request.body)
        new_name = data["new_name"]
        target = self.km.find_kernel_specs()[name]
        self.km.install_kernel_spec(target, new_name)

        self.finish(f"POST {name!r}\n")

    @web.authenticated
    def put(self, name=None):
        raise NotImplementedError
        print("PUT", name)
        if name is None:
            pass
        self.finish(f"PUT {name!r}\n")

    @property
    def current_user(self):
        """uncomment for testing, will disable authentication"""

        if self._dummy_user:
            print(
                """
            DUMMY AUTHENTICATION ENABLE: PLEASE COMMENT current_user property
            """
            )
            return "dummy"
        else:
            return super().current_user

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


def setup_handlers(nb_server_app):
    """
    Called when the extension is loaded.

    Args:
        nb_server_app (NotebookWebApplication): handle to the Notebook webserver instance.
    """
    print("LOADING EXTENSION")

    dummy_user = nb_server_app.tornado_settings.get("xsrf_cookies", None) is False
    web_app = nb_server_app.web_app
    host_pattern = ".*$"
    web_app.add_handlers(
        host_pattern,
        [
            (
                url_path_join(
                    web_app.settings["base_url"],
                    "/ks/?",
                ),
                KSHandler,
                {
                    "manager": nb_server_app.kernel_spec_manager,
                    "dummy_user": dummy_user,
                },
            ),
            (
                url_path_join(
                    web_app.settings["base_url"],
                    "/ks/(\w+)",
                ),
                KSHandler,
                {
                    "manager": nb_server_app.kernel_spec_manager,
                    "dummy_user": dummy_user,
                },
            ),
        ],
    )
