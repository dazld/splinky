var buster = require('bustermove')
  , assert = buster.assert
  , refute = buster.refute

  , Splinky           = require('../')
  , hijackSplinkScan  = require('./common').hijackSplinkScan
  , restoreSplinkScan = require('./common').restoreSplinkScan

buster.testCase('Init', {
    'start()': {
        'test listen': function (done) {
          var httpMock = this.mock(require('http'))
            , server = { listen: function () {} }
            , serverMock = this.mock(server)
          httpMock.expects('createServer').once().returns(server)
          serverMock.expects('listen').once().withExactArgs(80)
          Splinky({}).start(done)
        }

      , 'test listen, custom port in options': function (done) {
          var httpMock = this.mock(require('http'))
            , server = { listen: function () {} }
            , serverMock = this.mock(server)
          httpMock.expects('createServer').once().returns(server)
          serverMock.expects('listen').once().withExactArgs(8080)
          Splinky({ port: 8080 }).start(done)
        }

      , 'test listen, custom port in start() argument': function (done) {
          var httpMock = this.mock(require('http'))
            , server = { listen: function () {} }
            , serverMock = this.mock(server)
          httpMock.expects('createServer').once().returns(server)
          serverMock.expects('listen').once().withExactArgs(8888)
          Splinky({ }).start(8888, done)
        }
    }

  , 'scan option': {
        'setUp': function () {
          var scanPaths = this.scanPaths = []
          hijackSplinkScan(function (splink, path) {
            scanPaths.push(path)
          })
        }

      , 'tearDown': restoreSplinkScan

      , 'test scan argument': function () {
          Splinky({}).init()
          assert.equals(this.scanPaths, [])
        }

      , 'test single path string': function () {
          Splinky({ scan: '/foo/bar/' }).init()
          assert.equals(this.scanPaths, [ '/foo/bar/' ])
        }

      , 'test single path scan(string)': function () {
          Splinky().scan('/foo/bar/').init()
          assert.equals(this.scanPaths, [ '/foo/bar/' ])
        }

      , 'test multiple path strings': function () {
          Splinky({ scan: [ '/foo/bar/', '/bang.js', '/ping/pong/pang' ] }).init()
          assert.equals(this.scanPaths, [ '/foo/bar/', '/bang.js', '/ping/pong/pang' ])
        }

      , 'test multiple path scan(strings)': function () {
          Splinky().scan([ '/foo/bar/', '/bang.js' ]).scan('/ping/pong/pang').init()
          assert.equals(this.scanPaths, [ '/foo/bar/', '/bang.js', '/ping/pong/pang' ])
        }
    }
})