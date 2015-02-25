#include <stdio.h>

struct student {
  int age;
  float gpa;
};

typedef struct student Student;

void print_student_age_1(Student any);
void print_student_age_2(Student * any);
void print_student_age_3(const Student * any);

int main(int argc, char* argv[]){
  Student john;
  john.age = 20;
  john.gpa = 3.5;
  
  print_student_age_1(john);
  
  printf("gpa is %.1f\n", john.gpa);
  
  Student * john_ptr = &john;
  
  print_student_age_2(john_ptr);
  
  printf("gpa is %.1f\n", john.gpa);
  
  return 0;
}


void print_student_age_1(Student any){
  printf("Age is %d\n", any.age);
  any.gpa = 2.0;
}

void print_student_age_2(Student * any){
  printf("Age is %d\n", any->age);
  any->gpa = 2.0;
}

void print_student_age_3(const Student * any){
  printf("Age is %d\n", any->age);
  any->gpa = 2.0;
}
