/* Description:
 *   detects image MIME-types and presents the image more attractively.
 *
 * Author:
 *    potch, mythmon
 */

var nodeUtils = require('util');
var Promise = require('es6-promise').Promise;


var request;
var template = '<body style="margin: 0; height: 100%; background: url(%s) no-repeat center %s; background-size: contain;"></body>';

var template = '<body style="margin: 0; height: 100%; background: url(%s) no-repeat center %s; background-size: contain;"></body>';


module.exports = function (corsica) {
  request = corsica.request;

  corsica.on('content', function(content) {
    if (!('url' in content)) {
      return content;
    }

    var bgColor = content.bg || '#000';

    return new Promise(function(resolve, reject) {
      request.head(content.url, function (error, response, body) {
        if (error) {
          resolve(content);
          return;
        }
        var contentType = response.headers['content-type'] || '';
        var mime = contentType.split('/');
        if (mime[0] === 'image') {
          content.type = 'html';
          content.content = nodeUtils.format(template, content.url, bgColor);
          console.log(content.content);
        }
        resolve(content);
      });
    });
  });
};
