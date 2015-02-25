/*
 ============================================================================
 Name        : conversion.c
 Author      : Delvin Defoe based on work byy Matt Boutell
 Date        : Mar 24, 2012
 Description : Does conversion from one type to another
 ============================================================================
 */

#include "Types.h"
#include "conversion.h"

/* Converts degrees to radians. */
measureType degreesToRadians(measureType degrees) {
  return degrees * M_PI / 180.0;
}

/* Converts latitude and longitude to spherical coordinates. */
Sphere convertLatitudeAndLongitude(Direction latitude, Direction longitude) {
  Sphere sphere;
  sphere.radius = EARTH_RADIUS;
  sphere.theta = degreesToRadians(longitude.degrees + longitude.minutes / 60.0);
  if (longitude.dir == 'W') {
    sphere.theta *= -1;
  }
  
  if (latitude.dir == 'N') {
    sphere.phi = degreesToRadians(90 - latitude.degrees - latitude.minutes / 60.0);
  } else {
    sphere.phi = degreesToRadians(90 + latitude.degrees + latitude.minutes / 60.0);
  }
  
  return sphere;
}

/* Converts spherical coordinates to rectangular coordinates. */
Rectangle sphericalToRectangular(Sphere sphere) {
  Rectangle rect;
  rect.z = sphere.radius * cos(sphere.phi);
  measureType p = sphere.radius * sin(sphere.phi);
  rect.x = p * cos(sphere.theta);
  rect.y = p * sin(sphere.theta);
  return rect;
}
