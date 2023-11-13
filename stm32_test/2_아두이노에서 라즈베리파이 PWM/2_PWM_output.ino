const int pwmPin = PA0;  // PWM 핀 설정

void setup() {
  pinMode(pwmPin, OUTPUT);
}

void loop() {
  for (int dutyCycle = 0; dutyCycle <= 255; dutyCycle++) {
    // analogWrite(pwmPin, dutyCycle);  // 듀티 사이클 변경
    analogWrite(pwmPin, 127.5);  // 50%
    delay(100);  // 일정 시간 대기
  }

}
