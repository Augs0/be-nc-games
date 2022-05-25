# Northcoders House of Games API

This app is a fake board games reviews site that uses dummy data from the Northcoders' syllabus. It was built with Node, Express, PostgreSQL, HTML and CSS. You can visit the hosted version at nc-news-august.herokuapp.com/

## Requirements

Node and PostgreSQL are required for this application to run. Node should be version 16.13.0 or above and PostgreSQL should be version 14.1 or above.

## How to use this repo

Clone down the repo and run `npm install` to make sure you have all required packages.

Two env files are required for this API. One should be name `.env.test` and the other `.env.development`. All `.env.` files are ignored in the `.gitignore` file, but do check that these files are not being pushed anywhere where they may be viewed publicly. The files should contain the line `PGDATABASE=name_of_database`.

## Husky

To ensure we are not commiting broken code this project makes use of git hooks. Git hooks are scripts triggered during certain events in the git lifecycle. Husky is a popular package which allows us to set up and maintain these scripts. This project makes use a _pre-commit hook_. When we attempt to commit our work, the script defined in the `pre-commit` file will run. If any of our tests fail than the commit will be aborted.

The [Husky documentation](https://typicode.github.io/husky/#/) explains how to configure Husky for your own project as well as creating your own custom hooks.\_
