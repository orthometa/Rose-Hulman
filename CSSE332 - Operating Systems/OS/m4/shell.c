/*
 * Andreas Palsson, Andrew Davidson
 * 2015-02-04
 */

int check_for_commands(char * command);
int check_for_first_argument(char * command, char * argument[512]);
int check_for_second_argument(char * command, char * argument[512]);
int getFileSectorCount(char * fileName);

char * commands[9]; 

int main(void) {
	
	char buffer[512];
	char * argument;
	char * argument2;
	char argumentArr[7];
	char argument2Arr[7];
	int i;
	char file[13312];
	int sectors = 0;
	int status;
	char line[80];
	int j;

	argument = argumentArr;
	argument2 = argument2Arr;

	commands[0] = "\n\r\0";
	commands[1] = "dir\0";
	commands[2] = "ls\0";
	commands[3] = "execute \0";
	commands[4] = "delete \0";
	commands[5] = "copy \0";
	commands[6] = "cp \0";
	commands[7] = "type \0";
	commands[8] = "create \0";

	while(1) {
		interrupt(0x21, 0, "SHELL> \0", 0, 0);
		interrupt(0x21, 1, buffer, 0, 0);
		i = check_for_commands(buffer);
		if(i > 2) {
			status = check_for_first_argument(buffer, &argument);
			if(status == 1){
				interrupt(0x21, 0, "you did not enter an argument\n\r\0", 0, 0);
			} else if(status == 2){
				interrupt(0x21, 0, "you entered an invalid character in your first argument\n\r\0", 0, 0);
			} else if(i == 7) {
				interrupt(0x21, 3, argument, file, 0);
				for(j = 0; file[j]!=0;j++);
				file[j-1]=0x0;
				interrupt(0x21, 0, file, 0, 0);
			} else if(i == 3) {
				interrupt(0x21, 4, argument, 0x2000, 0);
			} else if(i == 4) {
				interrupt(0x21, 7, argument, 0, 0);
			} else if(i == 6|| i == 5) {
				status = check_for_second_argument(buffer, &argument2);
				if(status == 1){
					interrupt(0x21, 0, "you did not enter a second argument\n\r\0", 0, 0);
				}else if(status == 2){
					interrupt(0x21, 0, "you entered an invalid character in your second argument\n\r\0", 0, 0);
				}else{
					interrupt(0x21, 3, argument, file, 0);
					sectors = getFileSectorCount(argument);
					interrupt(0x21, 8, argument2, file, sectors);
				}
			} else if(i == 8) {
				int bufferIndex = 0;
				int sectors = 1;
				line[0] = 0x0;
				while(line[0] != 0xa) {
					interrupt(0x21, 0, "FILE > \0", 0, 0);
					interrupt(0x21, 1, line, 0, 0);
					for(i = 0; line[i] != 0xa; i++) {
						file[bufferIndex+i] = line[i];
					}
					file[bufferIndex+i] = 0xa;
					file[bufferIndex+i+1] = '\r';
					bufferIndex += i+2;
				}
				file[bufferIndex] = 0x0;
				while(bufferIndex >= 512) {
					bufferIndex -= 512;
					sectors++;
				} 
				interrupt(0x21, 8, argument, file, sectors);
			}				
		} else if(i == 1||i==2){
			interrupt(0x21, 9, 0, 0, 0);
		} else if (i ==0){
			/*do nothing this cycle*/
		} else {
			interrupt(0x21, 0, "Bad command! \n\r\0", 0, 0);
		}
	}
}

int check_for_commands(char * command) {
	int number_of_commands = 9;
	int i;
	for(i = 0; i < number_of_commands; i++) {
		if(strcompare(commands[i], command)) {
			return i;
		}
	}
	return -1;
}

int check_for_first_argument(char * command, char ** argument) {
	int i=0;
	int j = 0;

	for( i = 0; i < 7; i++){
		(*argument)[i] = 0x0;
	}

	for(j = 0; command[j]!= 0x0;j++);

	for(i = 0; command[i]!= ' ';i++){
		if(i==j){
			return 1;
		}
	}
	i++;

	for(j = 0; j < 6; j++){
		if(command[i+j]=='\n' || command[i+j]==' '||command[i+j]=='\0'||command[i+j]=='\r'||command[i+j]=='.'){
			if(j ==0){
				return 1;
			} else{
				return 0;
			}
		}
		
		(*argument)[j]=command[i+j];
	}
	return 0;
}


int check_for_second_argument(char * command, char ** argument) {
	int i=0;
	int j = 0;

	for( i = 0; i < 7; i++){
		(*argument)[i] = 0x0;
	}

	for(j = 0; command[j]!= 0x0;j++);

	for(i = 0; command[i]!= ' ';i++){
		if(i==j){
			return 1;
		}
	}
	i++;

	for(; command[i]!= ' ';i++){
		if(i==j){
			return 1;
		}
	}
	i++;

	for(j = 0; j < 6; j++){

		if(command[i+j]=='\n' || command[i+j]==' '||command[i+j]=='\0'||command[i+j]=='\r'||command[i+j]=='.'){
			if(j ==0){
				return 1;
			} else{
				return 0;
			}
		}
		/*if(command[i+j]=='\n' || command[i+j]==' '||command[i+j]=='\0'||command[i+j]=='\r'||command[i+j]=='.'){
			return 1;
		}*/

		/*if(command[i+j]=='.'){
			return 2;
		}
		if(command[i+j]=='\n'){
			return 0;
		}
		if( command[i+j]==' '){
			return 1;
		}
		if(command[i+j]=='\0'){
			return 1;
		}
		if(command[i+j]=='\r'){
			return 1;
		}*/
		(*argument)[j]=command[i+j];
	}

	return 0;
}

int strcompare(char * str1, char * str2) {
	int i;
	for(i = 0; str1[i] != '\0' && str2[i] != '\0'; i++) {
		if(str1[i] != str2[i])
			return 0;
	}	
	return 1;
}

int getFileSectorCount(char * fileName){
	int i;
	int j;
	int k;
	int sectorCount = 0;
	char directory[512];
	interrupt(0x21, 2, directory, 2, 0);
	for(i = 0; i < 512; i += 32) {
		for(j = 0; j<6; j++) {
			if(fileName[j] != directory[i + j]) 
				break;				
			
			if(j == 5) {
				for(k = 0; directory[i+6+k] != 0x0 && k< 26; k++) {
					sectorCount++;
				}		
				return sectorCount;
			}
		}
	}

return sectorCount;
}
