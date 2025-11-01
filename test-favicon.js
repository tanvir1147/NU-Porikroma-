const http = require('http');

http.get('http://localhost:3000/favicon.ico', (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Content-Type: ${res.headers['content-type']}`);
  console.log(`Content-Length: ${res.headers['content-length']}`);
  
  if (res.statusCode === 200) {
    console.log('Favicon is accessible!');
  } else {
    console.log('Favicon is not accessible');
  }
  
  process.exit(0);
}).on('error', (err) => {
  console.log('Error: ' + err.message);
  process.exit(1);
});