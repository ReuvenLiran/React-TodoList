var webpack = require('webpack'); 
var path = require('path'); 

module.exports = {
	entry: './client/src/app.js',
	output: {
	  path: path.join(__dirname , 'client'),
	  filename: 'bundle.js'
	},
	module: {
	  loaders: [
 	    {
	      test: /\.js$/,
	      exclude: /node_modules/,
	      loader: 'babel',
	      query:  { presets: [ 'es2015', 'react' ] } 
	    }
	 ]
      }
   };
