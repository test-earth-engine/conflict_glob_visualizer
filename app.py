from flask import Flask, render_template
from flask import request, jsonify
from flask import send_from_directory
from urllib.parse import urlencode

import os
import json 
import socket
import requests

import flask_cors

##############################################################################
##############################################################################
main_folder = os.path.join(os.getcwd(),'Frontend') 

app = Flask(
            __name__, 
            template_folder=main_folder, 
            static_folder=main_folder
            )

flask_cors.CORS(app)

@app.route('/ucdp_i')
def ucdp_i(): return render_template('ucdp_i.html')  

if __name__ == '__main__':

    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    print(f"http://{local_ip}") 

    app.run(debug=True)

## python3 -m http.server 9000
## .\Env2\Scripts\Activate.ps1 
## python app.py 
