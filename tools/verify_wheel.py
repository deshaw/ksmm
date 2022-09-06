from glob import glob
from zipfile import ZipFile
import sys


wheel_list = glob('dist/*.whl')

if not wheel_list:
    sys.exist('No wheel found')


for wheel_file in wheel_list:
    z = ZipFile(wheel_file)
    filenames = [f.filename for f  in z.filelist]
    statics = [f for f in filenames if 'labextension/static' in f]
    if len(statics) < 20:
        sys.exit(f"less static file than expected in wheel  {len(statics)}/20")
    labex = [f for f in filenames if 'labextensions/@deshaw/jupyterlab-ksmm' in f]
    if len(labex) < 22:
        sys.exit(f"less labextension files file than expected in wheel  {len(static)}/22")
print('ok')





