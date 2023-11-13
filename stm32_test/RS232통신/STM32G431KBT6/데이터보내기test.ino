//                      RX    TX
HardwareSerial Serial1(PA10, PA9);
HardwareSerial Serial2(PA3, PA2);
// HardwareSerial Serial3(PC11, PC10);

void setup() {
  Serial.begin(115200); 
  Serial1.begin(115200);
  Serial2.begin(115200);
  // Serial3.begin(115200);
}

void loop() {
  // UART2 TEST
  // while (Serial.available()) {  // RS232(Serial1)로부터 데이터가 수신되면
  //   char data = Serial.read();  // 읽고
    
  //   if (data == 0xD5) {
  //       Serial.println();  // 줄바꿈
  //       Serial.print(data, HEX);
  //       Serial.print(" ");
        
  //   } else {
  //       Serial.print(data, HEX);
  //       Serial.print(" ");
  //   }
  // }
  // UART1
  while (Serial1.available()) {  // RS232(Serial1)로부터 데이터가 수신되면
    char data = Serial1.read();  // 읽고
    Serial1.print(data);
  }

  // UART2
  while (Serial2.available()) {  // RS232(Serial1)로부터 데이터가 수신되면
    char data = Serial2.read();  // 읽고
    
    if (data == 0xD5) {
        Serial.println();  // 줄바꿈
        Serial.print(data, HEX);
        Serial.print(" ");
        
    } else {
        Serial.print(data, HEX);
        Serial.print(" ");
    }
  }  

  // UART3
  // while (Serial3.available()) {  // RS232(Serial1)로부터 데이터가 수신되면
  //   char data = Serial3.read();  // 읽고
    
  //   if (data == 0xD5) {
  //       Serial.println();  // 줄바꿈
  //       Serial.print(data, HEX);
  //       Serial.print(" ");
        
  //   } else {
  //       Serial.print(data, HEX);
  //       Serial.print(" ");
  //   }
  // }
    
}
