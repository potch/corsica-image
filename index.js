/* Description:
 *   detects image MIME-types and presents the image more attractively.
 *
 * Author:
 *    potch
 */

var Promise = require('es6-promise').Promise;

var request;


module.exports = function (corsica) {
  request = corsica.request;

  corsica.on('content', function(content) {
    if (!('url' in content)) {
      return content;
    }

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
          content.content = '<body style="margin:0;height:100%;background:url(' +
            content.url +
            ') no-repeat center #000;background-size:contain;"></body>';
        }
        resolve(content);
      });
    });
  });
};
