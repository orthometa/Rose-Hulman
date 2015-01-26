#include <stdio.h>
#include <stdlib.h>

struct student {
  int age;
  float gpa;
};

typedef struct student Student;

void print_student_info(Student class[], int count);
void print_one_student_1(Student student);
void print_one_student_2(Student  * student);

int main(int argc, char* argv[]){
  Student * many = (Student *)malloc(3 * sizeof(Student));
  
  many[0].age = 23;
  many[0].gpa = 3.4;
  many[1].age = 22;
  many[1].gpa = 3.6;
  many[2].age = 21;
  many[2].gpa = 4.0;
  
  print_student_info(many,3);
  return 0;
}

void print_student_info(Student class[], int count){
  int i = 0;
  
  for (i=0; i<count ; i++) {
    print_one_student_1((class[i]));
  }
  
  for (i=0; i<count ; i++) {
    print_one_student_2((&(class[i])));
  }
}

void print_one_student_1(Student student) {
  printf(" age is %d gpa is %f \n", student.age, student.gpa);
}

void print_one_student_2(Student  * student){
  printf(" age is %d gpa is %f \n", student->age, student->gpa);
}
