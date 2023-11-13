#include "HardwareTimer.h"

const int pwmPin = PA0;  // 입력 PWM 핀
HardwareTimer *timer = new HardwareTimer(TIM2);

volatile uint32_t lastRisingCapture = 0;
volatile uint32_t lastFallingCapture = 0;
volatile uint32_t period = 0;
volatile uint32_t pulseWidth = 0;
volatile bool newDataAvailable = false;

void setup() {
  pinMode(pwmPin, INPUT);
  Serial.begin(115200);

  // 타이머 설정
  timer->setMode(1, TIMER_INPUT_CAPTURE_BOTHEDGE, pwmPin);
  timer->attachInterrupt(1, captureInterrupt);
  timer->resume();
}

void loop() {
  if (newDataAvailable) {
    newDataAvailable = false;
    float frequency = (float)SystemCoreClock / period;
    float dutycyclePercentage = (float)pulseWidth * 100 / period;

    Serial.print("Frequency: ");
    Serial.print(frequency);
    Serial.print(" Hz, Duty Cycle: ");
    Serial.print(dutycyclePercentage);
    Serial.println(" %");
  }
}

void captureInterrupt() {
  uint32_t capturedValue = timer->getCaptureCompare(1);

  if (digitalRead(pwmPin)) {  // 상승 엣지에서의 인터럽트
    period = capturedValue - lastRisingCapture;
    lastRisingCapture = capturedValue;
  } else {  // 하강 엣지에서의 인터럽트
    pulseWidth = capturedValue - lastRisingCapture;
    newDataAvailable = true;
  }
}
