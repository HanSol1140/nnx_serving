#include <HardwareSerial.h>

void setup() {
  // Serial2는 기본적으로 ESP32의 16번 (TX) 및 17번 (RX) 핀에 연결됩니다.
  // 여기서는 TX만 사용합니다.
  Serial.begin(9600);  // baud rate를 9600으로 설정합니다.
}

void loop() {
  Serial.println("Hello Raspberry Pi!");  // 라즈베리파이에 메시지를 전송합니다.
}
