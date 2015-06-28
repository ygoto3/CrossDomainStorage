var dest = './dist';
var src = './src';

var samples_dest = './samples';
var samples_src = './samples_src';

var bootstrap = './bower_components/bootstrap/dist';

module.exports = {

  js: {
    dest: './dist',
    file_name: 'CrossDomainStorage.js',
    file_name_min: 'CrossDomainStorage.min.js'
  },

  browserify: {
    src: './src/index.js',

    settings: {
      read: false,
      standalone: 'index.js',
      transform: ['babelify']
    }
  },

  samples: {

    templates: {
      html: {
        dest: samples_dest
      },

      jade: {
        src: samples_src + '/*.jade'
      }
    },

    css: {
      bootstrap: bootstrap + '/css/*.css',
      dest: samples_dest + '/css'
    },
    
    host: {
      js: {
        dest: samples_dest + '/js',
        file_name: 'samples.js'
      },

      browserify: {
        src: samples_src + '/js/index.js',

        settings: {
          transform: ['babelify']
        }
      },

      connect: {
        root: 'samples',
        port: 8000
      }
    },

    storage: {
      js: {
        dest: samples_dest + '/js',
        file_name: 'samples_storage.js'
      },

      browserify: {
        src: samples_src + '/js/storage_index.js',

        settings: {
          transform: ['babelify']
        }
      },

      connect: {
        root: 'samples',
        port: 8001
      }
    }
  }

};
