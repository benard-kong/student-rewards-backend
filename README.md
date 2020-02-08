# Instructions

## Linux

1. Install PostgreSQL on your computer
   `$ sudo apt update`
   `$ sudo apt install postgresql postgresql-contrib`
2. Create and start your database
   You can skip the following instructions if you already know how to create a database with the terminal. The following instructions will show you how to install and run pgAdmin 4 using Python.

   1. Create a Python virtual environment.
      ```shell
      $ python3 -m venv /path/to/new/virtual/environment
      ```
   2. Go to [pgAdmin website](https://www.pgadmin.org/download/pgadmin-4-python-wheel/) and download the latest Python Wheel.
   3. Activate your Python virtual environment
      ```shell
      $ source /path/to/new/virtual/environment/bin/activate
      ```
   4. Run the pgAdmin program

      ```shell
      $ python3 /path/to/new/virtual/environment/lib/python3.x/site-packages/pgadmin4/pgAdmin4.py
      ```

      - If this is the first time you are running this script, it will ask you for an email and password for logging into pgAdmin. **DO NOT** forget that password or you will have to delete your pgAdmin database.
      - It may say you don't have permissions, in which case just add `sudo` in front of the command.
      - at this point if you are getting an error that says you don't have a module installed, you can fix this by going into `/path/to/new/virtual/environment/lib/python3.x/site-packages/pgadmin4/pgadmin/__init__.py`, then add the following line of code before the `from flask import ...` line:
        `sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))`
        - Your `__init__.py` file should look like the following:

      ```python
      ...
      sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
      from flask import Flask, abort, request, current_app, session, url_for
      ...
      ```

   5. Use your browser and go to `localhost:5050` or whichever port the terminal tells you to go to.

   6. Log in with the email and password you created.

   7. On the left side bar, unfold the tree until you see `Databases`. Right click on that and `Create` a new `Database`.

   8. In the pop up, give the database a name and click on `Save`.

3. Back in the boilerplate code, go to `src/models/index.js` and change the strings inside the `Sequelize` constructor to match your database name, database user, and database password, in that order.

   - Never store these values inside the code in production. Ideally, you should place those values in environment variables.

4. In terminal, run `npm start` and you should be able to start developing!
   - So long as you have the `{ force: true }` option available in `sequelize.sync()`, sequelize should create your database tables for you. It is not a production solution, though. This boilerplate is so you can get development up and running quickly.
