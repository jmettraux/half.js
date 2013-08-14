
#
# testing half.js
#
# Wed Aug 14 16:36:12 JST 2013
#

require 'sinatra'
require 'rufus-json/automatic'


get '/doc' do

  headers['Content-Type'] = 'application/json'
  headers['Access-Control-Allow-Origin'] = '*'

  Rufus::Json.pretty_encode(
    {
      name: 'the doc',
      _links: {
        self: {
          href: 'http://localhost:4567/doc'
        }
      }
    }) +
  "\n"
end

