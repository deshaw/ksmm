FROM continuumio/miniconda3
SHELL ["/bin/bash", "-c"]
COPY * .
RUN conda env create -f environment.yaml
SHELL ["conda", "run", "-n", "ksmm", "/bin/bash", "-c"]
CMD ["pip install -e .", "&&", "jupyter labextension develop --overwrite .", "&&", "jlpm build"]
EXPOSE 8888
ENTRYPOINT ["jupyter", "lab", "--ServerApp.disable_check_xsrf=True", "--allow-root"]

