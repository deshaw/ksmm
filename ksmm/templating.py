"""Provides templating of the kernelspec.

That is to say write a kernelspec with placeholder for values, as well as describe
which values this placeholder can take (using JSON schema  in the future).

And allow to update the kernelspec by replacing the placeholders by given values.

Utilities (should) be provided to extract only what are the placeholder and which values they can take,
as well as taking an existing kernelspec and modifying those values.
"""

class Default(dict):

    def __init__(self, mapping, **kwargs):
        super().__init__(**kwargs)
        self.mapping = mapping

    def __missing__(self, key):
        if key in self.mapping:
            [(target, values)] = self.mapping[key].items()
            assert target in self, (target, self)
            return values[self[target]]
        return "{" + key + "}"


def recursive_format(item, mapping, **kwargs):
    """Recursively format string/list.

    Format values from **kwargs, if an item is not present in
    **kwargs lookup in mpaaing. This is because we might want some
    dependencies, for example, a user might select "100GB" and convert
    that to Kb, or various values that depends on the software we use.

    Parameters
    ----------

    item: list | str
        item to format
    mapping:
        lookup for element not in kwargs
    **kwargs:
        values to interpolate

    Examples
    --------

    >>> recursive_format(['{mem} {cpu} {left_alone}','--mem={mem_slurm}'],
    ...         {
    ...             'mem_slurm':{
    ...                 'mem':{
    ...                     '1G':'1024kb',
    ...                     'BIG': '1234567kb'
    ...                 }
    ...         }
    ...     },
    ...     cpu=1,
    ...     mem='BIG',
    ... )
    ['BIG 1 {left_alone}', '--mem=1234567kb']

    Notice how this left alone curly-bracked where we don't have the values.

    Notes
    -----

    This is sort of a poor man templating engine, but we can't really use syntax like jinja
    {cpu|to_kb}, as we are not sure those templates will be used in Python context.
    And we are also not sure how to ship those function unless they become part of the spec.
    With this approach kernelspec embed their own things.

    """
    if isinstance(item, str):
        return item.format_map(Default(mapping, **kwargs))
    elif isinstance(item, list):
        return [recursive_format(i, mapping, **kwargs) for i in item]
    else:
        raise ValueError("item is not a list or a string: {}".format(item))


def format_tpl(spec, **kwargs):
    """Given a spec with a template in metadata->template,
    format it with the give kwargs.

    The template in in metadata template as KernelSpecManager does not load unknow keys.

    The template section is split into 3 sections itself:

    tpl: contain a templated kernelsec mirror with the argv and display_name keys.
    Thos will be reformatted.

    parameters: contains a list of parameters and their possible values.
    Note: this should be migrated to useing json schema, right now it just support something
    like json schema enums.

    mapping: when the same parameters needs to be in several place in different fomat,
    this provide mapping from enum variants to values to actually place in the formatted spec.
    This is usefull for example to express Memory in term of 'small', 'medium', 'big', or in term of Gb/Tb
    And get values in the spec in Mb or Kb.

    """
    static_spec = {}
    for k, v in spec.items():
        if k in ("argv", "display_name"):
            it = spec["metadata"]["template"]["tpl"][k]
            static_spec[k] = recursive_format(
                it, spec["metadata"]["template"]["mapping"], **kwargs
            )
        else:
            static_spec[k] = v
    del spec["metadata"]["template"]
    return static_spec


def extract_parameters(spec):
    return spec["metadata"]["template"]["parameters"]
