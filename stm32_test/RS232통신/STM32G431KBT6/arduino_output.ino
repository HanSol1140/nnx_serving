//                      RX    TX
HardwareSerial Serial1(PA10, PA9);  

void setup() {
  Serial.begin(115200); // 아두이노에 출력
  Serial1.begin(115200);  // UART1에 출력보내기
}

void loop() {
  Serial.println("!!!");
  Serial1.println("AA Hello World!");
  delay(1000);
}

// 하드웨어시리얼 객체에서 시리얼1로 USART포트를 정의해주지 않으면 Serial1 사용이 불가능함