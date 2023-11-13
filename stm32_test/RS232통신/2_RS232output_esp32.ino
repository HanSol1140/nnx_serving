#define BAUD_RATE 115200  // 사용하는 Baud rate

void setup() {
  Serial.begin(BAUD_RATE);  // 내장 시리얼 포트를 초기화합니다 (시리얼 모니터에 연결)
}

void loop() {
  Serial.println("Hello Raspberry!!");  // "Hello Raspberry!!" 메시지를 전송합니다.
  delay(1000);  // 1초 대기
}

// STLINK 라이브러리를 사용하면 STM32F103RB에서도 보내짐