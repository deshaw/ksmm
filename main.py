from prompt_toolkit.shortcuts import radiolist_dialog

from ksmm.kernelspec_templating import reformat_tpl, extract_parameters

from glob import glob
import json


mmm = {}
for name in glob("*.json"):
    try:
        with open(name) as f:
            dname = json.loads(f.read())["display_name"]
            mmm[name] = dname
    except Exception:
        pass


spec_file = radiolist_dialog(
    title="Choose kernelspec",
    text="Select Kernel to parametrize",
    values=[(x, y) for x, y in mmm.items()],
).run()


spec = json.loads(open(spec_file).read())

params = extract_parameters(spec)


new_params = {}
for k, v in params.items():
    result = radiolist_dialog(
        title=spec["display_name"],
        text=f"Select new value for {k}",
        values=[(str(u), str(u)) for u in v],
    ).run()
    new_params[k] = result


new_spec = reformat_tpl(spec, **new_params)
with open(spec_file, "w") as f:
    f.write(json.dumps(new_spec, indent=2))

print(new_spec["display_name"])
print(new_spec["argv"])
