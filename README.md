# Equivtracker
Python / Flask / React project to track the usd equivalent of cryptocoins.

## Installation

create a virtual environment first:

    $ python3.6 -m venv venv
    $ source venv/bin/activate

Install required deps from `req.pip`:

    $ pip install -r req.pip


## Run
For development:

    $ export FLASK_APP=equivtracker.py FLASK_DEBUG=1 && flask run

For `production` envrionment, don't forget to change `FLASK_DEBUG` to `0`:

    $ export FLASK_APP=equivtracker.py FLASK_DEBUG=0 && flask run

