//                      RX    TX
HardwareSerial Serial1(PA10, PA9);
// HardwareSerial Serial2(PA3, PA2);
HardwareSerial Serial3(PC11, PC10);

void setup() {
  Serial.begin(115200); 
  Serial1.begin(115200);
  // Serial2.begin(115200);
  Serial3.begin(115200);
}

void loop() {
  // UART1
  while (Serial1.available()) {  // 데이터가 수신되면
    char data = Serial1.read();  
    
    if (data == 0xD5) {
        Serial.println();  
        Serial.print("1번 RX : ");
        Serial.print(data, HEX);
        Serial.print(" ");
        Serial3.write(data);
        
    } else {
        Serial.print(data, HEX);
        Serial.print(" ");
        Serial3.write(data);
        
    }
  }


  // UART3
  while (Serial3.available()) {  // 데이터가 수신되면
    char data = Serial3.read(); 
    
    if (data == 0xD5) {
        Serial.println();
        Serial.print("3번 RX : ");
        Serial.print(data, HEX);
        Serial.print(" ");
        Serial1.write(data);
        
    } else {
        Serial.print(data, HEX);
        Serial.print(" ");
        Serial1.write(data);
    }
  }
    
}
