// STM32Duino로 PWM 설정하기

#include "HardwareTimer.h"

const int pwmPin = PA0;
HardwareTimer *timer = new HardwareTimer(TIM2);

void setup() {
  // Serial.begin(115200);
  pinMode(pwmPin, OUTPUT);

  uint32_t pwm_frequency = 4000;   // 원하는 PWM 주파수 (예: 1000Hz)
  uint32_t TIMx_CLK = 64000000;
  uint32_t PSC = 63;
  uint32_t ARR = int((TIMx_CLK / (PSC + 1) / pwm_frequency) - 1);
  // => 1초동안 타이머 카운트 회수
  // TIMx_CLK / (PSC + 1) => 64000000  / 64 => 1Mhz => 1초에 100만번
  
  timer->setPrescaleFactor(PSC);
  timer->setOverflow(ARR);
  timer->setMode(1, TIMER_OUTPUT_COMPARE_PWM1, pwmPin);
  timer->setCaptureCompare(1, timer->getOverflow() / 4);  // 듀티 사이클을 25%로 설정
  timer->resume();
}

void loop() {
}
