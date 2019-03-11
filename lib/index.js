"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var EventEmitter = require('events'),
    semver = require('semver'),
    os = require('os');

var IS_OSX = /^darwin/.test(process.platform);
var IS_WIN = /^win/.test(process.platform);
var PLATFORM_SHORT = IS_WIN ? 'win' : IS_OSX ? 'mac' : 'linux';
var PLATFORM_FULL = PLATFORM_SHORT + (process.arch === 'ia32' ? '32' : '64');

var YAML = require('yamljs');

var fs = require('fs');

var path = require('path');

var http = require('http');

var https = require('https');

var url = require('url');

var crypto = require('crypto');

var rimraf = require('rimraf');

var axios = require('axios');

axios.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});

function request(url) {
  var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return axios.request({
    url: url,
    method: 'get',
    params: param
  });
}

var rm = function rm(p) {
  return new Promise(function (resolve, reject) {
    rimraf(p, function () {
      resolve();
    });
  });
};

var AutoUpdater =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(AutoUpdater, _EventEmitter);

  function AutoUpdater() {
    var _this;

    _classCallCheck(this, AutoUpdater);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AutoUpdater).call(this));
    _this.autoDownload = false;
    _this.feedURL = '';
    _this.currentVersion = nw.App.manifest.version;
    _this.updateInfo = {};
    _this.release = '';
    _this.updateFile = '';
    return _this;
  }

  _createClass(AutoUpdater, [{
    key: "setFeedURL",
    value: function setFeedURL(url) {
      this.feedURL = url;
    }
  }, {
    key: "checkForUpdates",
    value: function () {
      var _checkForUpdates = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var updateInfo;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.emit('checking-for-update');

                if (this.feedURL) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return", this.emit('error', new Error('请设置feedURL')));

              case 3:
                _context.prev = 3;
                _context.next = 6;
                return request(this.feedURL + '/latest.yml');

              case 6:
                updateInfo = _context.sent;
                this.updateInfo = YAML.parse(updateInfo);
                this.release = this.updateInfo.files.find(function (item) {
                  return item.platform === PLATFORM_FULL;
                });
                console.log(this.updateInfo.version);

                if (semver.gt(this.updateInfo.version, this.currentVersion) && this.release) {
                  this.emit('update-available', this.updateInfo);
                } else {
                  this.emit('update-not-available', this.updateInfo);
                }

                _context.next = 16;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](3);
                this.emit('error', _context.t0);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 13]]);
      }));

      function checkForUpdates() {
        return _checkForUpdates.apply(this, arguments);
      }

      return checkForUpdates;
    }()
  }, {
    key: "downloadUpdate",
    value: function () {
      var _downloadUpdate = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var _this2 = this;

        var downloadURL, filepath, md5, server, total;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.release) {
                  _context2.next = 2;
                  break;
                }

                throw new Error("\u6CA1\u6709\u65B0\u7248\u672C");

              case 2:
                downloadURL = this.feedURL + '/' + encodeURIComponent(this.release.url);
                filepath = path.resolve(os.tmpdir(), this.release.url);

                if (!fs.existsSync(filepath)) {
                  _context2.next = 15;
                  break;
                }

                _context2.next = 7;
                return getMD5(filepath);

              case 7:
                md5 = _context2.sent;

                if (!(md5 === this.release.md5.toLowerCase())) {
                  _context2.next = 13;
                  break;
                }

                this.emit('download-progress', {
                  total: this.release.size,
                  loaded: this.release.size
                });
                this.emit('update-downloaded');
                this.updateFile = filepath;
                return _context2.abrupt("return");

              case 13:
                _context2.next = 15;
                return rm(filepath);

              case 15:
                server = url.parse(downloadURL).protocol === 'https:' ? https : http;
                total = 0;
                server.get(downloadURL, function (res) {
                  res.on('data', function (chunk) {
                    total += chunk.length;

                    _this2.emit('download-progress', {
                      total: _this2.release.size,
                      loaded: total
                    });
                  });
                  res.pipe(fs.createWriteStream(filepath));
                  res.on('end', function () {
                    _this2.emit('update-downloaded');

                    _this2.updateFile = filepath;
                  });
                  res.on('error', function (e) {
                    return _this2.emit('error', e);
                  });
                });

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function downloadUpdate() {
        return _downloadUpdate.apply(this, arguments);
      }

      return downloadUpdate;
    }()
  }, {
    key: "install",
    value: function install() {
      this.quitAndInstall(false);
    }
  }, {
    key: "quitAndInstall",
    value: function () {
      var _quitAndInstall = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var restartNow,
            _args3 = arguments;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                restartNow = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : true;
                _context3.next = 3;
                return StartSetup(this.updateFile);

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function quitAndInstall() {
        return _quitAndInstall.apply(this, arguments);
      }

      return quitAndInstall;
    }()
  }]);

  return AutoUpdater;
}(EventEmitter);

function StartSetup(updateFile) {
  return new Promise(function (resolve, reject) {
    var _require = require('child_process'),
        exec = _require.exec;

    var child = exec("start \"\" \"".concat(updateFile, "\" /verysilent /suppressmsgboxes /norestart"), {
      timeout: 4000,
      detached: true
    });
    child.on('error', function (e) {
      reject(e);
    }); // child.unref()
    // setTimeout(resolve, 1000)
  });
}

function getMD5(filepath) {
  return new Promise(function (resolve, reject) {
    var stream = fs.createReadStream(filepath);
    var fsHash = crypto.createHash('md5');
    stream.on('data', function (d) {
      fsHash.update(d);
    });
    stream.on('end', function () {
      var md5 = fsHash.digest('hex');
      resolve(md5);
    });
  });
}

module.exports = new AutoUpdater();
//# sourceMappingURL=index.js.map