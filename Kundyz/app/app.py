import os
import pandas as pd
import numpy as np
import sqlalchemy

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/tx_data.sqlite"
db = SQLAlchemy(app)

Base = automap_base()
Base.prepare(db.engine, reflect=True)

# engine = create_engine("sqlite:///db/tx_data.sqlite")
# inspector = inspect(engine)

school_ratings = Base.classes.combine_schools_zip_geo

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/ratings")
def ratings():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(school_ratings).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
    my_dict = dict(zip(list(df.SchoolType), list(df.CampusName), list(df.DistrictName), list(df.TotalScore), list(df.OverallGrade)))
    return jsonify(my_dict)

if __name__ == "__main__":
    app.run()
