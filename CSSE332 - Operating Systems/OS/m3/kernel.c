/*
 * Andreas Palsson, Andrew Davidson
 * 2014-01-20
 */
void printString(char * string);
void readString(char * string);
void readSector(char * buffer, int sector);
void handleInterrupt21(int ax, int bx, int cx, int dx);

int mod(int a, int b);
int div(int a, int b);

int main(void) {
	char line[80];
	char buffer[512];
	
	printString("Hello World\n\r\0");

	makeInterrupt21();
	printString("Enter a line: \0");
	interrupt(0x21, 1, line, 0, 0);
	interrupt(0x21, 0, line, 0, 0);
	
	readSector(buffer, 30);
	printString(buffer);
	while(1);
	return 0;
}

void printString(char * string){
	char al;
	char ah = 0xe;
	int ax;
	int i;

	for(i = 0; string[i] != 0; i++){
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

void handleInterrupt21(int ax, int bx, int cx, int dx) {
	if(ax == 0) 
		printString(bx);
	else if(ax == 1) 
		readString(bx);
	else if(ax == 2) 
		readSector(bx, cx);
	else if(ax >= 3)
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
