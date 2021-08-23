import json

from ksmm.templating import format_tpl

"""Here is an example of a kernelspec with a template present in metadata.
this template takes 2 parameters:
`cpu` and `mem`,
you will also see the `mem_slurm` parameters which depends on the `mem` parameters.
While `mem` is used in UI and has human readale values, `mem_slurm` is in Kb.
the templates parameters can be present in multiple locations, and parameters with
curly brackets that have unknown values are left alone.
"""
spec_example = """{
   "argv":[],
   "display_name":"",
   "language":"python",
   "metadata":{
      "template":{
         "tpl":{
            "argv":[
               "slurm",
               "run",
               "--mem={mem_slurm}",
               "--cpu={cpu}",
               "python3.8",
               "-m",
               "ipykernel",
               "-f",
               "{connection_file}"
            ],
            "display_name":"Python 3.8 {mem}/{cpu}"
         },
         "parameters":{
            "cpu":[
               10,
               15,
               20
            ],
            "mem":[
               "100G",
               "500G",
               "1T"
            ]
         },
         "mapping":{
            "mem_slurm":{
               "mem":{
                  "100G":"102400",
                  "500G":"512000",
                  "1T":"1048576"
               }
            }
         }
      }
   }
}
"""


params_example = """{
   "cpu": "10",
   "mem": "100G"
}
"""


def main():
    spec = json.loads(spec_example)
    params = json.loads(params_example)
    static_spec = format_tpl(spec, **params)
    print(static_spec)


if __name__ == "__main__":
    main()
