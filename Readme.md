
```
pip install flit
flit install [--symlink]
```

Use the followign to start with the extension and disable XSRF token, and set a faked logging user (so you can test with curl w/o authentification

```
$ jupyter notebook --NotebookApp.nbserver_extensions ksmm=True --no-browser --NotebookApp.tornado_settings="{'xsrf_cookies':False}"
```



