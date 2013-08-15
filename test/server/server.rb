
#
# testing half.js
#
# Wed Aug 14 16:36:12 JST 2013
#

require 'sinatra'
require 'rufus-json/automatic'


$docs = {
  'dublin0' => { message: 'hello world' }
}


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

get '/doc/:id' do

  headers['Content-Type'] = 'application/json'
  headers['Access-Control-Allow-Origin'] = '*'

  if d = $docs[params[:id]]
    Rufus::Json.pretty_encode(d) + "\n"
  else
    status 404
    "{\"message\":\"not found\"}\n"
  end
end

post '/docs' do

  headers['Content-Type'] = 'application/json'
  headers['Access-Control-Allow-Origin'] = '*'

  begin

    doc = Rufus::Json.decode(request.body.read)
    doc['id'] ||= 'doc' + (Time.now.to_f * 10000).to_i.to_s

    $docs[doc['id']] = doc

    headers['Location'] = '/docs/' + doc['id']
    "{\"message\":\"ok\"}\n"

  rescue => e

    status 400
    "{\"message\":\"error\", \"error message\":\"#{e}\"}\n"
  end
end

