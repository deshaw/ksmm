from .app import ksmm


def _jupyter_server_extension_paths():
    return [{
        "module": "ksmm.app",
        "app": ksmm
    }]

