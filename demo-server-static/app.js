var http = require('http')
var path = require('path')
var fs = require('fs')
var url = require('url')

function staticRoot(staticPath, req, res){
	var pathObj = url.parse(req.url, true)

	if(pathObj.pathname === '/'){
		pathObj.pathname += 'index.html'
	}
	var filePath = path.join(staticPath, pathObj.pathname)

	// var fileContent = fs.readFileSync(filePath, 'binary')
	// res.write(fileContent, 'binary')
	// res.end()

	fs.readFile(filePath, 'binary', function(err, fileContent){
		if(err){
			console.log(404)
			res.writeHead(404, 'Not Found')
			res.end('404 Not Found!')
		}else{
			console.log(200)
			res.writeHead(200, 'OK')
			res.write(fileContent, 'binary')
			res.end()
		}
	})
}

var server = http.createServer(function(req, res){
	staticRoot(path.join(__dirname, 'static'), req, res)
})

server.listen(3000)
console.log('server is listening on port 3000...')

