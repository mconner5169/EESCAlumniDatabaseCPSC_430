## Requirements
- Heroku CLI
- Node.js
- NPM

## Setup
`git clone https://github.com/pratimakandel/EESCAlumniDatabaseCPSC_430.git`

`cd EESCAlumniDatabaseCPSC_430`

`echo "ATLAS_URI=mongodb+srv://<username>:<password>@cluster0.na9dw.mongodb.net/alumnidb?retryWrites=true&w=majority" > .env`

`npm install`

`heroku login`

`node app.js`

## After Changes
`git add .`

`git commit -m`

`git push origin master`

`git push heroku master`

## MongoDB Dashboard 
https://account.mongodb.com/account/login?signedOut=true

## Heroku Dashboard
https://id.heroku.com/login
