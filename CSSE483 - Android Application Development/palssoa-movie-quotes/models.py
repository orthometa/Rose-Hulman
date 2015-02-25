from endpoints_proto_datastore.ndb.model import EndpointsModel
from google.appengine.ext import ndb



class MovieQuote(EndpointsModel):
    ''' Class for a quote and the movie it came from '''
    _message_fields_schema = ("entityKey", "quote", "movie", "last_touch_date_time")
    quote = ndb.StringProperty()
    movie = ndb.StringProperty()
    last_touch_date_time = ndb.DateTimeProperty(auto_now=True)