if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://<jmnelson61199>:<Jakethesnake12>@ds043917.mlab.com:43917/vidjot-prod'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'};
}