/* Description:
 *   detects image MIME-types and presents the image more attractively.
 *
 * Author:
 *    potch
 */

var Promise = require('es6-promise').Promise;
var http = require('http');
var https = require('https');
var url = require('url');

module.exports = function (corsica) {
  corsica.on('content', function(content) {
    return new Promise(function(resolve, reject) {
      // verify message contains a URL
      if ('url' in content) {
        var parts = url.parse(content.url);

        // determine whether to use http or https
        var requester;
        if (parts.protocol === 'http:') {
          requester = http;
        } else if (parts.protocol === 'https:') {
          requester = https;
        } else {
          return content;
        }

        // fetch the resource and check its mime type
        var options = {
          hostname: parts.hostname,
          port: parts.port || 80,
          path: parts.path
        };
        var req = http.get(options, function(res) {
          var contentType = res.headers['content-type'] || '';
          var mime = contentType.split('/');
          // if the mime type is of the form 'imgage/{foo}' modify message
          if (mime[0] === 'image') {
            content.type = 'html';
            // maybe this shouldn't be inline?
            content.content = '<body style="margin:0;height:100%;background:url(' +
              content.url +
              ') no-repeat center #000;background-size:contain;"></body>';
          }
          resolve(content);
          req.abort();
        });
        req.on('error', function(e) {
          resolve(content);
        });
      } else {
        return content;
      }
    });
  });
};
