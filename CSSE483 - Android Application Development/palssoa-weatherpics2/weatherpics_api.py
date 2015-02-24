'''
Created on Feb 2, 2015

@author: palssoa
'''

import protorpc
import endpoints
import main

from models import Weatherpic


@endpoints.api(name="weatherpics", version="v1", description="Weatherpics API")
class WeatherpicsApi(protorpc.remote.Service): 
    

    @Weatherpic.method(path="weatherpics/insert", name="weatherpic.insert", http_method="POST")
    def weatherpic_insert(self, request):
        if request.from_datastore:
            my_quote = request
        else:   
            my_quote = Weatherpic(parent=main.PARENT_KEY, image_url=request.image_url, caption=request.caption)
        my_quote.put()
        return my_quote
    
    @Weatherpic.query_method(path="weatherpics/list", http_method="GET", name="weatherpic.list", query_fields=("limit", "order", "pageToken"))
    def moviequote_list(self, query):
        return query
    
    @Weatherpic.method(request_fields=("entityKey", ), path = "weatherpic/delete/{entityKey}", http_method="DELETE", name="weatherpic.delete")
    def moviequote_delete(self, request):
        if not request.from_datastore:
            raise endpoints.NotFoundException("Pic not found")
        request.key.delete()
        return Weatherpic(caption="deleted")

app = endpoints.api_server([WeatherpicsApi], restricted=False)
