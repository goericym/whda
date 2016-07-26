# -*- coding: utf-8 -*-
from flask import Flask
from flask import render_template

from Class.mod_Lang import lang_bp
from Class.other import other_bp
application = Flask(__name__)

application.register_blueprint(lang_bp)
application.register_blueprint(other_bp)

# @application.route('/tw/<user_id>/', defaults={'username': 'aaa'})
# @application.route('/tw/<user_id>/<username>/')
# def show1(user_id, username):
#     aaa = user_id + username
#     return aaa


@application.route('/')
def index():
    return render_template('tw/index.html')


if __name__ == '__main__':  # pragma: no cover
    application.run(debug=True)
