// STM32Duino로 PWM 설정하기
#include "HardwareTimer.h"

/*
    (PB6)D6 - TIM1_CH1
    (PA11)D10 - TIM1_CH4
    (PA15)D5 - TIM2_CH1 / TIM8_CH1
    (PA1)A1 - TIM2_CH2
    (PB4)D12 - TIM3_CH1
    (PB5)D11 - TIM3_CH2
*/
const int pwmPin = PB5;
HardwareTimer *timer = new HardwareTimer(TIM3);

void setup() {
  // Serial.begin(115200);
  pinMode(pwmPin, OUTPUT);

  uint32_t pwm_frequency = 5000;   // 원하는 PWM 주파수 (예: 1000Hz)
  uint32_t TIMx_CLK = 170000000;
  uint32_t PSC = 169;
  uint32_t ARR = int((TIMx_CLK / (PSC + 1) / pwm_frequency) - 1);
  // => 1초동안 타이머 카운트 회수
  // TIMx_CLK / (PSC + 1) => 64000000  / 64 => 1Mhz => 1초에 100만번
  
  timer->setPrescaleFactor(PSC);
  timer->setOverflow(ARR);
  timer->setMode(2, TIMER_OUTPUT_COMPARE_PWM1, pwmPin);
  timer->setCaptureCompare(2, timer->getOverflow() / 3);  // 듀티 사이클을 25%로 설정
  timer->resume();
}

void loop() {
}
