/*
 * Andreas Palsson, Andrew Davidson
 * 2015-01-28
 */

int check_for_commands(char * command);
void check_for_arguments(char * command, char * argument[512]);

char * commands[2]; 

int main(void) {
	char buffer[512];
	char * argument;
	int i;
	char file[13312];
	commands[0] = "type \0";
	commands[1] = "execute \0";
	while(1) {
		interrupt(0x21, 0, "SHELL> \0", 0, 0);
		interrupt(0x21, 1, buffer, 0, 0);
		i = check_for_commands(buffer);
		if(i >= 0) {
			check_for_arguments(buffer, &argument);
			if(i == 0) {
				interrupt(0x21, 3, argument, file, 0);
				interrupt(0x21, 0, file, 0, 0);
			} else if(i == 1) 
				interrupt(0x21, 4, argument, 0x2000, 0);	
		} else 
			interrupt(0x21, 0, "Bad command! \n\r\0", 0, 0);
	}
}

int check_for_commands(char * command) {
	int number_of_commands = 2;
	int i;
	for(i = 0; i < number_of_commands; i++) {
		if(strcompare(commands[i], command)) {
			return i;
		}
	}
	return -1;
}

void check_for_arguments(char * command, char ** argument) {
	int i;
	int j = 0;
	char arg[6];
	for(i = 0; command[i] != ' '; i++);
	i += 1;

	for(; command[i] != 0xa; i++) {
		arg[j] = command[i];
		j++;
	}
	arg[j] = '\0';
	for(i = 0; i < 6; i++) {
		(*argument)[i] = arg[i];
	}
}

int strcompare(char * str1, char * str2) {
	int i;
	for(i = 0; str1[i] != '\0' && str2[i] != '\0'; i++) {
		if(str1[i] != str2[i])
			return 0;
	}	
	return 1;
}

