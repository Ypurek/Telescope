from flask import Flask, make_response, request
import uuid
import random as r
import requests

app = Flask(__name__,
            static_url_path='/static',
            static_folder='static')
application = app

GOOGLE_SCRIPT = ''


@app.route('/')
def hello_world():
    with open('static/index.html', 'r', encoding='utf-8') as index:
        html = index.read()
        response = make_response(html)
        if request.cookies.get('uuid') is None:
            uid = str(uuid.uuid4())
            key = r.randint(1, 4)
            if GOOGLE_SCRIPT != '':
                requests.get(GOOGLE_SCRIPT + f'?uuid={uid}&key={key}')
            response.set_cookie('uuid', uid, max_age=60 * 60 * 2)
            response.set_cookie('key', str(key), max_age=60 * 60 * 2)
        return response


if __name__ == '__main__':
    app.run()
