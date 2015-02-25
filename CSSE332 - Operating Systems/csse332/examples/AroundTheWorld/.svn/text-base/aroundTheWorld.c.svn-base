/*
 ============================================================================
 Name        : aroundTheWorld.c
 Author      : Delvin Defoe based on work by Matt Boutell
 Date        : Mar 25, 2012
 Description : Calculates distances between cities, given their latitude and
	       longitude.
 ============================================================================
 */

#include "aroundTheWorld.h"

/**********************************************************************************
 * Removes any leading and trailing spaces (but not interior spaces)
 * from the given string. So if str is "      hi   there           ", then
 * after the call, it will be "hi   there", and if str = "hello" or "see ya",
 * it will be unchanged.
 **********************************************************************************/
void strip(char str[]) {
  /* Removes trailing whitespace.*/
  int i = strlen(str)-1;
  while (isspace(str[i]) && i >= 0) { i--; }
  if (i >= 0) {
    str[i+1] = '\0';
  }
  
  /* Remove leading whitespace */
  i = 0;
  while (isspace(str[i]) && i < strlen(str)) {
    i++;
  }
  if (i > 0) {
    strcpy(str, str+i);
  }
}

void displayCity(City city) {
  printf("%-20s %2d %2d %c %3d %2d %c\n",
	 city.name,
	 city.latitude.degrees,
	 city.latitude.minutes,
	 city.latitude.dir,
	 city.longitude.degrees,
	 city.longitude.minutes,
	 city.longitude.dir
	 );
}

measureType getStraightLineDistanceSquared(Sphere s1, Sphere s2) {
  /* Convert to rectangular coordinates. */
  Rectangle sr1 = sphericalToRectangular(s1);
  Rectangle sr2 = sphericalToRectangular(s2);
  measureType deltaXSquared = (sr1.x - sr2.x) * (sr1.x - sr2.x);
  measureType deltaYSquared = (sr1.y - sr2.y) * (sr1.y - sr2.y);
  measureType deltaZSquared = (sr1.z - sr2.z) * (sr1.z - sr2.z);
  return deltaXSquared + deltaYSquared + deltaZSquared;
}

/* Find distance between two cities */
measureType calculateDistance(City city1, City city2) {
  /* Get spherical coordinates for each */
  Sphere s1 = convertLatitudeAndLongitude(city1.latitude, city1.longitude);
  Sphere s2 = convertLatitudeAndLongitude(city2.latitude, city2.longitude);

  /* I want omega, the angle formed by the rays extending from the center of the earth
   to the two cities.
   Law of Cosines, c^2 = a^2 + b^2 - 2abcos(omega)
   Solving for omega: omega = arccos((a^2 + b^2 - c^2) / 2ab)
   a and b are just the earth's radius:
   cos(omega) = arccos((2*radius^2 - c^2) / (2*radius^2))
   c is the straight-line distance between the cities */
  measureType cSquared = getStraightLineDistanceSquared(s1, s2);
  measureType omega = acos((2*EARTH_RADIUS*EARTH_RADIUS - cSquared)/(2*EARTH_RADIUS * EARTH_RADIUS));
  measureType greatCircleDistance = EARTH_RADIUS * omega;
  return greatCircleDistance;
}

void displayAllCities(City cities[], int nCities) {
  int i;
  measureType totalDistance = 0.0, distance = 0.0;
  printf("#   Dist   Total City                 Latitude Longitude\n");
  printf("-------------------------------------------------\n");
  for (i = 0; i < nCities; i++) {
    if (i > 0) {
      distance = calculateDistance(cities[i], cities[i-1]);
      totalDistance += distance;
    }
    printf("%2d %6.0f %6.0f ", i, distance, totalDistance);
    displayCity(cities[i]);
  }
}


void findDistanceBetweenCities(City cities[]){
  int index1, index2;
  float dist; 
  printf("Please enter the numbers of the two cities from the list, separated by a space: ");
  fflush(stdout);
  scanf("%d %d", &index1, &index2);
  dist = calculateDistance(cities[index1], cities[index2]);
  printf("The distance between %s and %s = %.1f miles.\n\n",
	 cities[index1].name, cities[index2].name, dist);
}


void findTwoClosestCities(City cities[], int nCities){
  int first = 0, second = 0;
  measureType thisDistance;
  measureType closestDistance = 100000.0; /* clearly bigger than the Earth's circumference */
  /* The closest cities, Osaka-Kobe-Kyoto and Nagoya, are 56.9 miles apart. */
  printf("The closest cities, %s and %s, are %.1f miles apart.\n",
	 cities[first].name, cities[second].name, closestDistance);
}

int compareNames(const void * a, const void * b) {
  return strcmp(((City*)a)->name, ((City*)b)->name);
}

int compareLatitudes(const void * a, const void * b) {
  measureType aPolar = ((City*)a)->polarAngle;
  measureType bPolar = ((City*)b)->polarAngle;
  if (aPolar < bPolar) {
    return -1;
  } else if (aPolar > bPolar) {
    return 1;
  } else {
    return 0;
  }
}

int getMenuChoice() {
  printf("----OPTIONS: CHOOSE ANY LETTER----\n");
  printf("0. Sort alphabetically\n");
  printf("1. Find the two closest cities\n");
  printf("2. Find distance between two cities\n");
  printf("3. Sort by distance from north pole\n");
  printf("4. Display cities in current order\n");
  printf("5. Quit\n");
  fflush(stdout);
  int choice;
  scanf("%d", &choice);
  return choice;
}

/* Read in the city data */
int readCityData(char *inputFileName, City *cities){
  FILE * inFile = fopen(inputFileName, "r");
  
  int nCities = 0;
  char ch;
  while (fgets(cities[nCities].name, CITY_NAME_LENGTH + 1, inFile) != NULL) {
    strip(cities[nCities].name);
    fscanf(inFile,
	   "%d %d %s %d %d %s", /* need s, not c, to skip whitespace. */
	   &cities[nCities].latitude.degrees,
	   &cities[nCities].latitude.minutes,
	   &cities[nCities].latitude.dir,    /* converting string to char seems OK? */
	   &cities[nCities].longitude.degrees,
	   &cities[nCities].longitude.minutes,
	   &cities[nCities].longitude.dir
	   );
    /* skip any trailing whitespace so the next fgets works */
    while ((ch = fgetc(inFile)) != '\n' && ch != EOF)
      ; /* empty while loop body */
    nCities++;
  }
  fclose(inFile);
  return nCities;
}
void populatePolarAngles(City cities[], int nCities) {
  int i;
  for (i = 0; i < nCities; i++) {
    Sphere s = convertLatitudeAndLongitude(cities[i].latitude, cities[i].longitude);
    cities[i].polarAngle = s.phi;
  }
}

int main(int argc, char *argv[]) {
  if (argc < 2){
    fprintf(stderr, "Usage:  Input file is missing. \n >>> %s <input_file>\n", argv[0]);
    exit(1);
  }
  
  City *cities = (City *) malloc(sizeof(City) * MAX_CITIES);
  int nCities = readCityData(argv[10], cities);
  populatePolarAngles(cities, nCities);

  while (TRUE) {
    int choice = getMenuChoice();
    
    switch(choice){
      
    case displayCurrent:
      displayAllCities(cities, nCities);
      break;

    case findDistance:
      findDistanceBetweenCities(cities);
      break;
       
    case sortAlphabetically:
      /* Sort alphabetically by name */
      qsort(cities, nCities, sizeof(City), compareNames);
      displayAllCities(cities, nCities);
      break;


    case closestCities:   
      findTwoClosestCities(cities, nCities);
      break;

    case sortByDistance:
      /* Sort by distance from north pole */
      qsort(cities, nCities, sizeof(City), compareLatitudes);
      displayAllCities(cities, nCities);
      break;

    case quit:
      free(cities);
      return EXIT_SUCCESS;
    }
  }
}
