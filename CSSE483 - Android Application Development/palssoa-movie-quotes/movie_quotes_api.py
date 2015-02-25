'''
Created on Feb 2, 2015

@author: palssoa
'''

import protorpc
import endpoints
import main_bootstrap

from models import MovieQuote


@endpoints.api(name="moviequotes", version="v1", description="Movie Quotes API")
class MovieQuotesApi(protorpc.remote.Service): 
    
    
    @MovieQuote.method(path="moviequotes/insert", name="moviequote.insert", http_method="POST")
    def moviequote_insert(self, request):
        if request.from_datastore:
            my_quote = request
        else:   
            my_quote = MovieQuote(parent=main_bootstrap.PARENT_KEY, quote=request.quote, movie=request.movie)
        my_quote.put()
        return my_quote
    
    @MovieQuote.query_method(path="moviequotes/list", http_method="GET", name="moviequote.list", query_fields=("limit", "order", "pageToken"))
    def moviequote_list(self, query):
        return query
    
    @MovieQuote.method(request_fields=("entityKey", ), path = "moviequote/delete/{entityKey}", http_method="DELETE", name="moviequote.delete")
    def moviequote_delete(self, request):
        if not request.from_datastore:
            raise endpoints.NotFoundException("Movie quote not found")
        request.key.delete()
        return MovieQuote(quote="deleted")
    

app = endpoints.api_server([MovieQuotesApi], restricted=False)
