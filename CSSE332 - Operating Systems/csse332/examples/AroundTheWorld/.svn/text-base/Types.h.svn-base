/*
 ============================================================================
 Name        : Types.h
 Author      : Delvin Defoe based on work by Matt Bouttell
 Description : Define the various types used in the around the world 
 ============================================================================
 */
#ifndef TYPES_H_
#define TYPES_H_

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <ctype.h>

#define CITY_NAME_LENGTH 20
#define MAX_CITIES 100
#define EARTH_RADIUS 3957
#define MAX_WORD_LENGTH 80

typedef double measureType;

typedef struct {
  int degrees;
  int minutes;
  char dir;
} Direction;

typedef struct {
  char name[CITY_NAME_LENGTH + 1];
  Direction latitude;
  Direction longitude;
  measureType polarAngle;
} City;

typedef struct {
  measureType radius;
  measureType theta;
  measureType phi;
} Sphere;

typedef struct {
  measureType x;
  measureType y;
  measureType z;
} Rectangle;

#endif /*  TYPES_H_ */
