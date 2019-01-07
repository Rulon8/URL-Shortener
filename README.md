# URL Shortener

Ruby on Rails RESTful API to shrink URLs, similar to services such as Bitly or TinyURL.

## Getting Started

To use this API in your local computer you need Ruby and Ruby on Rails. The current API version uses
ruby version 2.5.3 and rails 5.2.2, it is untested with other versions. You also need to set up a
database and connect it to rails. By default the API uses Postgres with the default user and password,
but any database compatible with Rails should work. To change the database used just install the
respective gem and then update your database.yml file to match your credentials.

A live demo of the API can be found at the following URL: 

## Usage

This section describes how to use each endpoint as well as a general explanation on its functions
and examples. This examples assume the API is run in a local computer, hence using localhost. The
host may change if it is deployed and run in a server.

### POST localhost/url.json
By sending a POST request to url.json with a parameter url=your_url, the API returns the respective
short URL associated to your_url. If your_url had already been shortened before then returns
whatever short URL was created for your_url at the moment it was shortened. Otherwise a new short
URL is created for your_url using the following method.

### GET localhost/url.json?url=your_url
Same as POST localhost/url.json. Due to this being an API that still lacks a web interface, the
GET method is enabled to make testing with a browser easier.

### GET localhost/your_short_url
Returns the long URL associated to your_short_url. your_short_url must be valid, as defined by the
regex [a-zA-Z0-9]+, or the call won't be recognized. If your_short_url is valid but does not exist
within the system, a 404 Not Found error is returned instead.
