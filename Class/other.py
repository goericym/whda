from flask import Blueprint
from flask import render_template
other_bp = Blueprint('other', __name__, url_prefix='/tw/other')


@other_bp.route('/')
def index():
    return render_template('other/index.html')
