import SimpleHTTPSServer
import sys
import os
import thread


class webserver( SimpleHTTPSServer.handler ):
	"""docstring for webserver"""
	def __init__( self ):
		super(webserver, self).__init__()
		self.actions = [
			( 'post', '/:any', self.post_echo ),
			( 'post', '/post_file', self.post_response ),
			( 'get', '/user/:username', self.get_user ),
			( 'get', '/post/:year/:month/:day', self.get_post ),
			( 'get', '/:file', self.get_file ) ]
		
	def post_echo( self, request ):
		try:
			output = self.form_data( request['data'] )
		except:
			print request['data']
			output = {'ERROR': 'parse_error'}
		output = json.dumps( output )
		headers = self.create_header()
		headers = self.add_header( headers, ( "Content-Type", "application/json") )
		return self.end_response( headers, output )
		
	def post_response( self, request ):
		headers = self.create_header()
		headers = self.add_header( headers, ( "Content-Type", "application/octet-stream") )
		return self.end_response( headers, request['post']['file_name'] )
		
	def get_user( self, request ):
		output = self.template( 'user.html', request['variables'] )
		headers = self.create_header()
		return self.end_response( headers, output )
		
	def get_post( self, request ):
		output = json.dumps(request['variables'])
		headers = self.add_header( headers, ( "Content-Type", "application/json") )
		headers = self.create_header()
		return self.end_response( headers, output )

	def get_file( self, request ):
		return self.serve_page( directory + request["page"] )

directory = os.path.dirname(os.path.realpath(__file__)) + '/'

def main():
	address = "0.0.0.0"

	port = 80
	if len( sys.argv ) > 1:
		port = int ( sys.argv[1] )

	http = SimpleHTTPSServer.server( ( address, port ), webserver(), bind_and_activate = False, threading = True )

	thread.start_new_thread( http.serve_forever, () )
	raw_input("Return Key to exit\n")


if __name__ == '__main__':
	main()
