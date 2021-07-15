CONDA_ACTIVATE=source $$(conda info --base)/etc/profile.d/conda.sh ; conda activate ; conda activate
CONDA_DEACTIVATE=source $$(conda info --base)/etc/profile.d/conda.sh ; conda deactivate
CONDA_REMOVE=source $$(conda info --base)/etc/profile.d/conda.sh ; conda remove -y --all -n
ENV_NAME=ksmm

.PHONY: clean build dist env cp

.EXPORT_ALL_VARIABLES:

VERSION = 0.0.1

default: all ## Default target is all.

help: ## display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

all: clean install build dist ## Clean, install and build.

build:
	($(CONDA_ACTIVATE) ${ENV_NAME}; \
		yarn build )

clean:
	rm -fr build
	rm -fr dist
	rm -fr *.egg-info
	find . -name '*.egg-info' -exec rm -fr {} +
	find . -name '__pycache__' -exec rm -fr {} +
	rm jupyterhub.sqlite

env-rm:
	-conda remove -y --all -n ${ENV_NAME}

env:
	-conda env create -f environment.yaml
	@echo 
	@echo --------------------------------
	@echo ✨  KSMM environment is created.
	@echo --------------------------------
	@echo

install-dev:
	($(CONDA_ACTIVATE) ${ENV_NAME}; \
		pip install -e . && \
		jupyter labextension develop --overwrite . && \
		jlpm build)

jlab-watch:
	($(CONDA_ACTIVATE) ${ENV_NAME}; \
		jupyter lab --watch --port 8234)

watch:
	($(CONDA_ACTIVATE) ${ENV_NAME}; \
		yarn watch )

publish:
	($(CONDA_ACTIVATE) ${ENV_NAME}; \
		rm -fr dist/* && \
		python setup.py sdist bdist_egg bdist_wheel && \
		twine upload dist/* )
