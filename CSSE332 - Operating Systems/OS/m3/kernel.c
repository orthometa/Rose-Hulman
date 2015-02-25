/*
 * Andreas Palsson, Andrew Davidson
 * 2014-01-28
 */
void printString(char * string);
void readString(char * string);
void readSector(char * buffer, int sector);
void handleInterrupt21(int ax, int bx, int cx, int dx);
void readFile(char * filename);
void executeProgram(char * name, int segment);
void terminate();

int mod(int a, int b);
int div(int a, int b);

int main(void) {
	makeInterrupt21();
	interrupt(0x21, 4, "shell\0", 0x2000, 0);
	return 0;
}

void executeProgram(char * name, int segment) {
	int i;
	char buffer[13312];
	
	readFile(name, buffer);
	if(buffer[0] == '\0')
		return;
	for(i = 0x0; i < 13312; i++) 
		putInMemory(segment, i, buffer[i]);
	launchProgram(segment);
}

void readFile(char * filename, char * file_buffer) {
	int i;
	int j;
	int k;
	char buffer[512];
	char error_msg[23];
	readSector(buffer, 2);

	for(i = 0; i < 512; i += 32) {
		for(j = 0; j<6; j++) {
			if(filename[j] != buffer[i + j]) 
				break;				
			
			if(j == 5) {
				for(k = 0; buffer[i+6+k] != 0x0; k++) {
					readSector(file_buffer+512*k, buffer[i + 6 + k]);
				}
				return;
			}
		}
	}


	error_msg[0] = 'F';
	error_msg[1] = 'i';
	error_msg[2] = 'l';
	error_msg[3] = 'e';
	error_msg[4] = ' ';
	error_msg[5] = 'n';
	error_msg[6] = 'o';
	error_msg[7] = 't';
	error_msg[8] = ' ';
	error_msg[9] = 'f';
	error_msg[10] = 'o';
	error_msg[11] = 'u';
	error_msg[12] = 'n';
	error_msg[13] = 'd';
	error_msg[14] = '\n';
	error_msg[15] = '\r';
	error_msg[16] = '\0';
	printString(error_msg);

	for(i = 0; i < 13312; i++)
		file_buffer[i] = '\0';
}

void printString(char * string){
	char al;
	char ah = 0xe;
	int ax;
	int i;

	for(i = 0; string[i] != '\0'; i++){
 		al = string[i];
	 	ax = ah * 256 + al;
		interrupt(0x10, ax, 0, 0, 0);
	}
}

void readString(char * string){
	char c;
	int i = 0;
	char ah = 0xe;
	while(i < 77){
 		c = interrupt(0x16, 0, 0, 0, 0);
		/* if enter */
		if(c == 0xd) {
			break;
		} 
		/* if backspace */
		else if(c == 0x8) {
			if(i > 0) {
				/* print the backspace, print a whitespace and print the backspace again to remove the character */
				interrupt(0x10, ah * 256 + c, 0, 0, 0);
				interrupt(0x10, ah * 256 + ' ', 0, 0, 0);
				interrupt(0x10, ah * 256 + c, 0, 0, 0);
				i--;
			}
		} 
		/* if normal character */
		else {
			string[i] = c;
			interrupt(0x10, ah * 256 + c, 0, 0, 0);
			i++;
		}
	}

	interrupt(0x10, ah * 256 + 0xa, 0, 0, 0);
	interrupt(0x10, ah * 256 + '\r', 0, 0, 0);
	string[i] = 0xa;
	string[i+1] = '\r';
	string[i+2] = 0x0;
}

void readSector(char * buffer, int sector) {
	int ah = 2;
	int al = 1;
	int ch = div(sector, 36);
	int cl = mod(sector, 18) + 1;
	int dh = mod(div(sector, 18), 2);
	int dl = 0;
	
	int ax = ah * 256 + al;
	int cx = ch * 256 + cl;
	int dx = dh * 256 + dl;
	interrupt(0x13, ax, buffer, cx, dx);
}

void terminate() {
	char prg[6];
	prg[0] = 's';
	prg[1] = 'h';
	prg[2] = 'e';
	prg[3] = 'l';
	prg[4] = 'l';
	prg[5] = '\0';
	interrupt(0x21, 4, prg, 0x2000, 0);
}

void handleInterrupt21(int ax, int bx, int cx, int dx) {
	if(ax == 0) 
		printString(bx);
	else if(ax == 1) 
		readString(bx);
	else if(ax == 2) 
		readSector(bx, cx);
	else if(ax == 3)
		readFile(bx, cx);
	else if(ax == 4) 
		executeProgram(bx, cx);
	else if(ax == 5) 
		terminate();
	else if(ax > 5)
		printString("Error in handleInterrupt21. ax is too big\0");
}

int mod(int a, int b) {
	while(a >= b)  
		a -= b;
	return a;
}

int div(int a, int b) {
	int quotient = 0;
	while((quotient + 1) * b <= a)
		quotient += 1;
	return quotient;
}
