# loginapp

```Custom Login/Sign up app```

# How To Run

## Clone the repo to local machine 
```bash
git pull https://github.com/suraj-singh12/loginapp.git
```
## Install Dependencies
```bash
cd loginapp
```
```npm
npm install
```

## Make .env file with following structure
```npm
PORT = any_port_no
localUrl = 'mongodb://localhost:27017/database_name'
liveUrl = 'your_live_db_url'
```

> Note: `your_live_db_url` you can get from your live database, by clicking connect - connect to app - and copy the url 
  url will look like `mongodb+srv://<username>:<password>@cluster0.ecqfv.mongodb.net/database_name?retryWrites=true&w=majority` fill correct username & password and you are done

> Update the `db.js` `mongoose.connect()` code to use localUrl if you use local database.

> Note: The live url (heroku url) given in comments, would work perfectly, 
  and has nothing to do with your app. So check your localhost urls not live urls. They are the live APIs which are linked to this repository and not to your clone.
## Run the APP
```npm
npm start
```

## For Development
```npm
npm run dev
```