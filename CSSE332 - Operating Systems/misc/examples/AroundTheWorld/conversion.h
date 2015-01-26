/*
 ============================================================================
 Name        : conversion.h
 Author      : Delvin Defoe based on work byy Matt Boutell
 Date        : Mar 24, 2012
 Description : Does conversion from one type to another
 ============================================================================
 */

/* Converts degrees to radians. */
measureType degreesToRadians(measureType degrees);

/* Converts latitude and longitude to spherical coordinates. */
Sphere convertLatitudeAndLongitude(Direction latitude, Direction longitude);

/* Converts spherical coordinates to rectangular coordinates. */
Rectangle sphericalToRectangular(Sphere sphere);
