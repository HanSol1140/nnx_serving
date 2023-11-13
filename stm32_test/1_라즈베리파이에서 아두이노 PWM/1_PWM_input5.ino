#include "HardwareTimer.h"

const int pwmPin = PA0;  // 입력 PWM 핀

HardwareTimer *timer = new HardwareTimer(TIM2);
volatile uint32_t lastCapturedValue = 0;
volatile int32_t lastPeriod = 0;  // int32_t로 변경
volatile bool newDataAvailable = false;

void setup() {
  pinMode(pwmPin, INPUT);
  Serial.begin(115200);

  // 타이머 설정
  timer->setMode(1, TIMER_INPUT_CAPTURE_RISING, pwmPin); // 상승 에지에서 캡처
  timer->attachInterrupt(1, captureInterrupt);  // 캡처 인터럽트 핸들러 연결
  timer->resume();
}

void loop() {
  if (newDataAvailable) {
    newDataAvailable = false;
    float frequency = (float)SystemCoreClock / abs(lastPeriod);  // 절대값 사용
    Serial.print("Frequency: ");
    Serial.print(frequency);
    Serial.println(" Hz");
  }
}

void captureInterrupt() {
  uint32_t capturedValue = timer->getCaptureCompare(1);
  
  if(capturedValue < lastCapturedValue) {
    // Overflow 발생시
    lastPeriod = (int32_t)(capturedValue + (timer->getOverflow() - lastCapturedValue));
  } else {
    lastPeriod = (int32_t)(capturedValue - lastCapturedValue);
  }

  lastCapturedValue = capturedValue;
  newDataAvailable = true;
}
