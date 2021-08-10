from prompt_toolkit.shortcuts import radiolist_dialog, input_dialog

from ksmm.kernelspec_templating import reformat_tpl, extract_parameters

from glob import glob
import json

import sys

print(sys.argv)

if len(sys.argv) < 2:
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
else:
    spec_file = sys.argv[1]


spec = json.loads(open(spec_file).read())

params = extract_parameters(spec)


class SchemaForm:


    def __init__(self, item,title):
        self.item = item
        self.title = title #spec["display_name"]


    def render(self):

        type_ = self.item['type']

        return getattr(self, 'render_'+self.item['type'])()

    def render_integer(self):
        min_ = self.item.get('minimum', 0)
        max_ = self.item.get('maximum', 10)
        step_ = self.item.get('multipleOf', 1)
        res = input_dialog(
            title=self.title,
            text=self.item['title'],
        ).run()
        return int(res)
    
    def render_string(self):
        return radiolist_dialog(
            title=self.title, 
            text=self.item['title'],
            values=[(str(u), str(u)) for u in self.item['enum']],
        ).run()

    def render_boolean(self):
        return radiolist_dialog(
            title=self.title, 
            text=self.item['title'],
            values=[(True, 'Yes'),( False, 'No')],
        ).run()








new_params = {}
for k, v in params.items():
    result = SchemaForm(v, spec["display_name"]).render() 
    new_params[k] = result


new_spec = reformat_tpl(spec, **new_params)
with open(spec_file, "w") as f:
    f.write(json.dumps(new_spec, indent=2))

print(new_spec["display_name"])
print(new_spec["argv"])
