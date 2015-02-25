/*
 ============================================================================
 Name        : aroundTheWorld.h
 Author      : Delvin Defoe based on work by Matt Boutell
 Date        : Mar 25, 2012
 Description : Calculates distances between cities, given their latitude and
	       longitude.
 ============================================================================
 */
#include "Types.h"
#include "conversion.h"

enum MENU_CHOICE {sortAlphabetically, closestCities, findDistance, 
	      sortByDistance, displayCurrent, quit};

typedef enum {FALSE, TRUE} boolean;

/**********************************************************************************
 * Removes any leading and trailing spaces (but not interior spaces)
 * from the given string. So if str is "      hi   there           ", then
 * after the call, it will be "hi   there", and if str = "hello" or "see ya",
 * it will be unchanged.
 **********************************************************************************/
void strip(char str[]);

void displayCity(City city);

measureType getStraightLineDistanceSquared(Sphere s1, Sphere s2);

/* Find distance between two cities */
measureType calculateDistance(City city1, City city2);

void displayAllCities(City cities[], int nCities);

void findDistanceBetweenCities(City cities[]);

void findTwoClosestCities(City cities[], int nCities);

int compareNames(const void * a, const void * b);

int compareLatitudes(const void * a, const void * b);

int getMenuChoice();

/* Read in the city data */
int readCityData(char *inputFileName, City *cities);

void populatePolarAngles(City cities[], int nCities);
