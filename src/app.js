const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();
const port = process.env.PORT || 3000;

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

//Define paths for express configs
const publicDirectoryPath = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

  //Setup statid directory path
  app.use(express.static(publicDirectoryPath));

  // Setup handlebars view and location
  app.set('view engine', 'hbs');
  app.set('views', viewsPath);
  hbs.registerPartials(partialsPath);

  app.get('', (req, res) => {
    res.render('index', {
      'title':'Weather',
      'name':'Diw Cop'
    });
  });

  app.get('/about', (req, res) => {
    res.render('about', {
      'title':'About',
      'name':'Diw Cop'
    });
  });

  app.get('/help', (req, res) => {
    res.render('help', {
      'message':'This is my message!',
      'title':'Help',
      'name':'Diw Cop'
    });
  });

  app.get('/weather', (req, res) => {
    if (!req.query.address) {
     return res.send({'error':'Please provide a location'});     
    }
    geocode(req.query.address,(error, {latitude,longitude,location} = {}) => {
      if (error) {
        return res.send({'error':error});
      }    
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({'error':error});
        }
        res.send({
          "forecast": forecastData,
          "location": location,
          "address": req.query.address
        });
      });
    }); 
  });

  app.get('/help/*', (req, res) => {
    res.render('error', {
      'title':'Error',
      'errorMessage':'Help article not found',
      'name':'Diw Cop'
    });
  });

  app.get('*', (req, res) => {
    res.render('error', {
      'title':'Error',
      'errorMessage':'Page not found',
      'name':'Diw Cop'
    });
  });

app.listen(port, () => {
    console.log('Server is up on port '+port);
});