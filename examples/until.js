var MatchStream = require('../');
var streamBuffers = require("stream-buffers");

var theExtra;
var ms = new MatchStream({ pattern: 'World'}, function (buf, matched, extra) {
  if (!matched) {
    return this.push(buf);
  }
  this.push(buf);
  theExtra = extra
  return this.push(null); //signal end of data
});

var sourceStream = new streamBuffers.ReadableStreamBuffer();
sourceStream.put("Hello World");
var writableStream = new streamBuffers.WritableStreamBuffer();

sourceStream
  .pipe(ms)
  .pipe(writableStream)
  .once('close', function () {
    var str = writableStream.getContentsAsString('utf8');
    console.log('Piped data before pattern occurs:', "'" + str + "'");
    console.log('Data after pattern occurs:', "'" + theExtra + "'");
    sourceStream.destroy();
  });

//Output
//Piped data before pattern occurs: 'Hello '