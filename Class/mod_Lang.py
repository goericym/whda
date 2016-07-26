from flask import Blueprint, g, url_for
from flask import render_template

lang_bp = Blueprint('lang', __name__, url_prefix='/<lang_code>')


@lang_bp.url_value_preprocessor
def get_lang_code_from_url(endpoint, view_args):
    g.lang_code = view_args.pop('lang_code')


@lang_bp.url_defaults
def add_language_code(endpoint, values):
    values.setdefault('lang_code', g.lang_code)


@lang_bp.route('/')
def index():
    index_url = g.lang_code + '/index.html'
    return render_template(index_url)


@lang_bp.route('/<path>')
def path(path):
    path_url = g.lang_code + '/' + path + '.html'
    return render_template(path_url)
