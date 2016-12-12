const Application = require('spectron').Application;
const assert = require('assert');

describe('launch app', function() {
  it('check app', function(done) {
      this.timeout(5000);
      const app = new Application({
        path: './node_modules/.bin/electron',
        args:['.']
      });
      app.start().then(function() {
        return app.browserWindow.isVisible();
      }).then(function(isVisible) {
        assert.equal(isVisible, true);
      }).then(function() {
        return app.stop();
      }).then(function() {
        done();
      }).catch(function(error) {
        console.log('failed', error.message);
        done(error);
      });
  });
});
