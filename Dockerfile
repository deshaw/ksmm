FROM continuumio/miniconda3

COPY * .

RUN conda env create -f environment.yaml
SHELL ["conda", "run", "-n", "ksmm", "/bin/bash", "-c"]
ENV PATH="$HOME/.local/bin:$PATH"

RUN yarn
RUN pip install -e . 
RUN jupyter labextension develop --overwrite .
RUN jlpm build

EXPOSE 8888
CMD ["jupyter", "lab", "--ServerApp.disable_check_xsrf=True", "--allow-root"]
