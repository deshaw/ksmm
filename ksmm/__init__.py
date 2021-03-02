from .handlers import setup_handlers

def _jupyter_server_extension_paths():
    return [{
        "module": "ksmm.app",
        "app": ksmm
    }]

def _jupyter_server_extension_points():
    return [{"module": "ksmm"}]

def _load_jupyter_server_extension(server_app):
    setup_handlers(server_app)
    server_app.log(
            "Started KernelSpec Manager :)"
            )

