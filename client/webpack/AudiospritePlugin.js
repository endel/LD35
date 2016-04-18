var audiosprite = require('audiosprite');
var fs = require('fs')

function AudiospritePlugin (files, options) {
  this.files = files
  this.options = options
}

AudiospritePlugin.prototype.apply = function (compiler) {
  var plugin = this

  console.log("generating audiosprite...");

  audiosprite(this.files, this.options, function(err, obj) {
    if (err) return console.error(err)

    console.log("audiosprite generated.")

    fs.writeFile( __dirname + '/../src/data/audio.json', JSON.stringify( obj ).replace(/public\//,""), function(err) {
      if ( err ) throw err
      console.log("updated 'src/data/audio.json' file")
    } )
  })

};

module.exports = AudiospritePlugin;
