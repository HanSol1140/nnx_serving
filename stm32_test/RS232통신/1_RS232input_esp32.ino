#define RX_PIN 3  // GPIO3에 연결된 U0RXD
#define TX_PIN 1  // GPIO1에 연결된 U0TXD
#define BAUD_RATE 115200  // 사용하는 Baud rate

void setup() {
  Serial.begin(BAUD_RATE);  // 내장 시리얼 포트를 초기화합니다 (시리얼 모니터에 연결)
}

void loop() {
  while (Serial.available()) {  // RS232 장치로부터 데이터가 수신되면
    char c = Serial.read();  // 한 문자를 읽습니다.
    Serial.print(c);  // 시리얼 모니터에 출력합니다.
  }
}
