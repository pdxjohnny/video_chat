# video_chat
Video chat with only Python and JavaScript


This is an example of video implemented through sending images through the server and requesting them from the client in rapid succession by way of the requestAnimationFrame JavaScript method.

It works by sending the video to /send/:user and receiving from /recv/:user. Send puts the current local frame on the server for the username. Recv gets the most current frame from the server given the username.

In this way one person can send to another and receive the frames meant for them.
