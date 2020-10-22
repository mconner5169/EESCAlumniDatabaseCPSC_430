## Requirements
- Heroku CLI
- Node.js
- NPM

## Setup

 Fork repo
 
 clone the forked repo
`git clone https://github.com/<username>/EESCAlumniDatabaseCPSC_430.git`

`cd EESCAlumniDatabaseCPSC_430`

Please go to our Drive to get the username and password for the command below

`echo "ATLAS_URI=mongodb+srv://<username>:<password>@cluster0.na9dw.mongodb.net/alumnidb?retryWrites=true&w=majority" > .env`

`npm install`

`heroku login`

`heroku git:remote -a umw-earth-science`

## Running Local Server

 To run the app use
 `npm run start` or `nodemon app.js`

## After Changes
`git add .`

`git commit -m`

`git push origin master`

`git push heroku master`

## MongoDB Dashboard 
https://account.mongodb.com/account/login?signedOut=true

## Heroku Dashboard
https://id.heroku.com/login

## Keep Fork Updated

`git remote add upstream https://github.com/pratimakandel/EESCAlumniDatabaseCPSC_430.git `

`git fetch upstream `

`git pull upstream master `

`git push origin master `

