    //                      RX    TX
    HardwareSerial Serial1(PA10, PA9);
    void setup() {
    Serial.begin(115200);
    Serial1.begin(115200);
    }

    void loop() {
        while (Serial1.available()) {  // RS232(Serial1)로부터 데이터가 수신되면
            char data = Serial1.read();  // 읽고
            
            if (data == 0xD5) {
                Serial.println();  // 줄바꿈
                Serial.print(data, HEX);
                Serial.print(" ");
                
            } else {
                Serial.print(data, HEX);
                Serial.print(" ");
            }
        }
    }