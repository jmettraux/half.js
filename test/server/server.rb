
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

U = 'http://localhost:4567'


#
# but before...

before do

  headers['Content-Type'] ='application/json'
  headers['Access-Control-Allow-Origin'] = '*'
  headers['Access-Control-Allow-Headers'] = 'origin, content-type'
end


#
# the routes


get '/' do

  Rufus::Json.pretty_encode(
    {
      name: 'root',
      _links: {
        self: {
          href: "#{U}/" },
        doc: {
          href: "#{U}/doc/{id}" },
        docs:{
          href: "#{U}/docs", method: 'POST' },
        orders: {
          href: "#{U}/orders",
          method: 'POST',
          fields: [
            { name: 'name', required: true },
            { name: 'age', required: true },
            { name: 'code', default: 'batsu' },
            { name: 'country', value: 'japan' }
          ] },
        err0: {
          href: "#{U}/error0" },
        err1: {
          href: "#{U}/error1" }
      }
    }) +
  "\n"
end

get '/doc' do

  Rufus::Json.pretty_encode(
    {
      name: 'the doc',
      _links: {
        self: { href: "#{U}/doc" }
      }
    }) +
  "\n"
end

get '/doc/:id' do

  if d = $docs[params[:id]]
    Rufus::Json.pretty_encode(d) + "\n"
  else
    status 404
    "{\"message\":\"not found\"}\n"
  end
end

options '/docs' do; end

post '/docs' do

  begin

    doc = Rufus::Json.decode(request.body.read)
    doc['id'] ||= 'doc' + (Time.now.to_f * 10000).to_i.to_s

    $docs[doc['id']] = doc

    headers['Location'] = "#{U}/docs/#{doc['id']}"
    Rufus::Json.pretty_encode(message: 'ok', doc: doc) + "\n"

  rescue => e

    status 400

    "{" +
    "\"message\":\"error\", " +
    "\"error message\":\"#{e}\"," +
    "\"trace\":\"#{e.backtrace.first}\"," +
    "}\n"
  end
end

options '/orders' do; end

post '/orders' do

  request.body.read
    # mirror...
end

get '/error0' do

  status 500

  'fail!'
end

get '/error1' do

  status 500

  "{\"error message\":\"fail!\"}\n"
end

