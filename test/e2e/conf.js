// conf.js
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['spec.js'],    // it contains all the specifications 
  capabilities: {
    browserName: 'chrome'
  }
}
