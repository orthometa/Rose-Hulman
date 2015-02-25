#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import os

from google.appengine.ext import ndb
import jinja2
import webapp2

from models import Weatherpic

# Jinja environment instance necessary to use Jinja templates.
jinja_env = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)), autoescape=True)

# Generic key used to group MovieQuotes into an entity group.
PARENT_KEY = ndb.Key("Entity", 'weatherpic_root')

class MainHandler(webapp2.RequestHandler):
    def get(self):
        weatherpics = Weatherpic.query(ancestor=PARENT_KEY).order(-Weatherpic.last_touch_date_time).fetch()
        template = jinja_env.get_template("templates/weatherpics.html")
        self.response.out.write(template.render({'weatherpics': weatherpics}))

    def post(self):
        new_weather_pic = Weatherpic(parent=PARENT_KEY,
                               image_url=self.request.get('image_url'),
                               caption=self.request.get('caption'))
        new_weather_pic.put()
        self.redirect(self.request.referer)

app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
