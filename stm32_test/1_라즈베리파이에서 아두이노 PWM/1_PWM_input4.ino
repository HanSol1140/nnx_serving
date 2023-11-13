const int pwmPin = PA0; // PWM 신호를 읽을 핀

volatile unsigned long riseTime = 0;     // 상승 에지 타임스탬프
volatile unsigned long fallTime = 0;     // 하강 에지 타임스탬프
volatile unsigned long previousRiseTime = 0; // 이전 상승 에지 타임스탬프

void setup() {
  pinMode(pwmPin, INPUT);
  Serial.begin(115200);

  // 외부 인터럽트 설정
  attachInterrupt(digitalPinToInterrupt(pwmPin), measurePWM, CHANGE);
}

void loop() {
  static unsigned long lastPrintTime = 0;

  if (millis() - lastPrintTime > 1000) { // 1초마다 결과 출력
    lastPrintTime = millis();

    noInterrupts(); // 인터럽트 비활성화
    unsigned long highTime = fallTime - riseTime; // 상승 시간
    unsigned long period = riseTime - previousRiseTime; // 주기
    interrupts(); // 인터럽트 활성화

    float dutyCycle = (float)highTime / period * 100.0; // 듀티 사이클
    float frequency = 1.0 / (period * 0.000001); // 주파수 (Hz)

    Serial.print("Duty Cycle: ");
    Serial.print(dutyCycle);
    Serial.print("%, Frequency: ");
    Serial.print(frequency);
    Serial.println(" Hz");
  }
}

void measurePWM() {
  if (digitalRead(pwmPin) == HIGH) {
    previousRiseTime = riseTime;
    riseTime = micros();
  } else {
    fallTime = micros();
  }
}