# URL Shortener

Ruby on Rails and React app to shrink URLs, similar to services such as Bitly or TinyURL.

## System Requirements

### Backend

- Ruby >= 2.5.3
- Rails >= 5.2.2
- Redis  >= 5.0.3
- Sidekiq >= 5.2.4
- Any database supported by Rails

### Frontend

- Nodejs >= 10.15.0

## Getting Started

This repo contains two different apps. The first one is a backend Ruby on Rails RESTful API that
shortens URLs and stores them to be referenced in the future. The second is a ReactJS app that
works as a web interface for the API.

To run the API in your local computer you need Ruby and Ruby on Rails. The versions mentioned above 
are the ones with which the API is tested, it may work with other versions but they are untested. By
default the API is configured to use Postgresql with user `ubuntu` and the default password,
but any database supported by Rails should work. To change database install the
respective gem and then update your database.yml file to match your credentials.

Also, to store website titles along with their URLs, Redis and the Sidekiq gem must be installed and
running. If not then titles will appear as "Not Available". Remember to check you have all other
dependencies installed by running `bundle install`.

Once installed and running you can access the API by sending requests to your local host and port,
as defined in the Usage section.

To run the frontend app in your local computer you will also need Nodejs installed and running.
In order to have both apps running together, Node is configured with a proxy to send API calls 
to the port where Rails is running on. Be sure to have the correct configuration, such as the
one described in the Usage section, or you might end up with 404 errors.

A live demo of the app can be found on Heroku [here](https://url-shortener-42280.herokuapp.com/).

## Usage

### Configuration

To setup a development environment both apps must me configured to run un different ports. One port
will have the Rails server and the other one the Node server. The file `Procfile.dev` shows the
commands that must be run in order to set the environment. Here is an extract of `Procfile.dev`:

```
web: cd client && PORT=8080 npm start
api: bundle exec rails s -b '0.0.0.0' -p '8081'
```

The first command starts the Node server. It must be started from the client folder inside the Rails
project files, and you can choose a port for it to run on. It doesn't matter which port you choose as
long as it is not `8081` since that's the one the Rails server will be using.

The second command starts the Rails server. You can choose whatever value you want for your host in
the `-b` option, but `-p '8081'` is mandatory at the moment. The reason is I haven't found a reliable
way to access this `-p` variable from inside the code, and for now this value defaults to `'8081'`.
If for some reason you must change the port, then you must also make some changes in other files.
Specifically you should change the React app's `package.json`, where the proxy is configured, and the Rails app's
`url_controller`, where URLs are parsed, and change the default `8081` for your port. However, it is
adviced to use the defualt port while this issue is solved.

Note that this issue doesn't affect deployment to heroku since the app doesn't work as two different
apps in the production environment, but rather as a single Rails app with the React app configured as
an external library.

### API

This section describes how to use each endpoint as well as a general explanation on its functions
and examples. These examples assume the API is run in a local computer, hence using localhost and
the `8081` port. The host and port may change if it is deployed and run in a server.

### POST localhost:8081/url.json
By sending a POST request to url.json with the parameter `url=your_url`, the API returns the respective
short URL associated to `your_url`. If `your_url` had already been shortened before then returns
whatever short URL was created for `your_url` at the moment it was shortened. Otherwise a new short
URL is created for your_url using the following method.

```ruby
def encode(id)
  short_url = ''
  base = ALPHABET.length
  while id > 0
    short_url.concat(ALPHABET[id.modulo(base)])
    id = id / base
  end
  return short_url.reverse
end
```

The above Ruby method uses standard numerical base conversion to generate a sequence of characters from the `ALPHABET`. For this specific case the `ALPHABET` used is `[a-zA-z0-9]`, thus encoding values in Base62. The value that is encoded is the database identifier for the URL, represented by the parameter `id`. Since Rails uses numerical autoincremental ids by default, there is guarantee that no `id` will be repeated. Also since these ids start with the lowest possible integer value (typically 1) and base convertion is just another way of representing the same numeric value, there is guarantee that this method will yield the shortest possible value.

Note that this method expects database ids to be numeric and start at 1. If your database uses another convention to assign ids (eg. starting at 0), some or all short URLs may not be generated correctly.

Other encoding methods were considered, such as using a hash algorithm like SHA or MD5 or using generated random numbers to encode in Base62 instead of database ids, but were discarted. The former had the issue of generating huge values, hence not satisfying the requirement of having the shortest possible URLs, and if just a part of the hash was used  then uniqueness would be lost. The latter had similar problems: to reduce the possibility of getting duplicate values the random numbers had to be huge, and if smaller numbers were used then as the system grew there would have been a progressively bigger chance of getting duplicates, with the risk of running out of numbers if the system scales too much. Also, both of these methods take longer to execute, which may seem like a small concern but could be key if the API is running on a critical or low resource environment.

### GET localhost:8081/your_short_url
Returns the long URL associated to `your_short_url`. `your_short_url` must be valid, as defined by the
regex `[a-zA-Z0-9]+`, or the call won't be recognized. If `your_short_url` is valid but does not exist
within the system, a 404 Not Found error is returned instead.

### GET localhost:8081/top.json
Looks for the top 100 most visited URLs, in descending order by visit count. Returns a JSON object
that includes the title, short URL, original URL and visit count of each of the top most visited
URLs. If there are less than 100 URLs stored in the system returns all of them, or an empty JSON if
there are none. If the title for a URL has not yet been fetched, or if it doesn't exist (eg. on a
404 error), the title will be shown as "Not Available".

## Known improvements

This section contains a non-exhaustive list of known things that can be implemented to improve the API.

- Better error handling: At the moment the code manually checks if there are any errors when saving records
and validating them and manually generates an error message. I haven't found a better way to handle this yet but
there should be a way to automatically recover from any errors and generate custom error messages.

- Trailing slashes in URLs: Right now the API considers cases like https://google.com and https://google.com/
as different URLs. Since the slash at the end is not relevant both cases could be considered as the same.