import SimpleHTTPSServer
import sys
import os
import thread
import Queue
import json


class webserver( SimpleHTTPSServer.handler ):
	def __init__( self ):
		super(webserver, self).__init__()
		self.users = {}
		self.actions = [
			( "post", "/send/:user", self.post_send ),
			( "get", "/recv/:user", self.get_recv ),
			( "get", "/:file", self.get_file )
			]

	def post_send( self, request ):
		output = { "image": False }
		try:
			user = request["variables"]["user"]
			image = self.form_data( request["data"] )["image"]
			self.users[ user ] = image
			output["image"] = True
		except Exception, e:
			output["ERROR"] = str( e )
		output = json.dumps( output )
		headers = self.create_header()
		headers["Content-Type"] = "application/json"
		return self.end_response( headers, output )

	def get_recv( self, request ):
		output = { "image": False }
		user = request["variables"]["user"]
		if user in self.users:
			output["image"] = self.users[ user ]
		output = json.dumps( output )
		headers = self.create_header()
		headers["Content-Type"] = "application/json"
		return self.end_response( headers, output )

	def get_file( self, request ):
		return self.serve_page( directory + request["page"] )

directory = os.path.dirname(os.path.realpath(__file__)) + "/"

def main():
	address = "0.0.0.0"

	port = 80
	if len( sys.argv ) > 1:
		port = int ( sys.argv[1] )

	http = SimpleHTTPSServer.server( ( address, port ), webserver(), bind_and_activate = False, threading = True )

	thread.start_new_thread( http.serve_forever, () )
	raw_input("Return Key to exit\n")


if __name__ == "__main__":
	main()
