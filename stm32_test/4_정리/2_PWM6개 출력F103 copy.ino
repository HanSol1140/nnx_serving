#include "HardwareTimer.h"
/*
    PA8(D7) - 1/1
    PA9(D8) - 1/2
    PA10(D2) - 1/3
    PA0(A0) - 2/1
    PA1(A1) - 2/2
    PB10(D6) - 2/3
*/


// 핀 정의
const int pwmPin1 = PA8;
const int pwmPin2 = PA9;
const int pwmPin3 = PA10;
const int pwmPin4 = PA0;
const int pwmPin5 = PA1;
const int pwmPin6 = PB10;

// 타이머 인스턴스 생성
HardwareTimer *timer1 = new HardwareTimer(TIM1);
HardwareTimer *timer2 = new HardwareTimer(TIM2);

uint32_t TIMx_CLK = 64000000;
uint32_t PSC = 63;
uint32_t pwm_frequency = 15000;   // 원하는 PWM 주파수 (예: 15000Hz)
uint32_t ARR = int((TIMx_CLK / (PSC + 1) / pwm_frequency) - 1);

void setupPWM(HardwareTimer *timer, int pwmPin, uint32_t channel) {
  pinMode(pwmPin, OUTPUT);
  timer->setPrescaleFactor(PSC);
  timer->setOverflow(ARR);
  timer->setMode(channel, TIMER_OUTPUT_COMPARE_PWM1, pwmPin);
  timer->setCaptureCompare(channel, timer->getOverflow() / 10);  // 듀티 사이클을 10%로 설정
  timer->resume();
}

void setup() {
  setupPWM(timer1, pwmPin1, 1);
  setupPWM(timer1, pwmPin2, 2);
  setupPWM(timer1, pwmPin3, 3);
  setupPWM(timer2, pwmPin4, 1);
  setupPWM(timer2, pwmPin5, 2);
  setupPWM(timer2, pwmPin6, 3);
}

void loop() {
  // 기타 코드 (필요하다면)
}
