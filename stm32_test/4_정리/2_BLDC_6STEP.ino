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
uint32_t pwm_frequency = 16000;   
uint32_t ARR = int((TIMx_CLK / (PSC + 1) / pwm_frequency) - 1);
uint32_t dutyCycle = ARR / 2;  // 듀티 사이클 => ARR / 20 = 5% => ARR / 10 => 10%

uint8_t step = 0;  // 현재 스텝

void setupPWM(HardwareTimer *timer, int pwmPin, uint32_t channel) {
  pinMode(pwmPin, OUTPUT);
  timer->setPrescaleFactor(PSC);
  timer->setOverflow(ARR);
  timer->setMode(channel, TIMER_OUTPUT_COMPARE_PWM1, pwmPin);
  timer->setCaptureCompare(channel, 0);  // 초기에는 PWM 출력 없음
  timer->resume();
}

void applyStep() {
  switch(step) {
    case 0:  // AH_BL
      timer1->setCaptureCompare(1, dutyCycle);  // A+ (PA8)
      timer1->setCaptureCompare(2, 0);          // A- (PA9)
      timer1->setCaptureCompare(3, 0);          // B+ (PA10)
      timer2->setCaptureCompare(1, dutyCycle);  // B- (PA0)
      timer2->setCaptureCompare(2, 0);          // C+ (PA1)
      timer2->setCaptureCompare(3, 0);          // C- (PB10)
      break;
      
    case 1:  // AH_CL
      timer1->setCaptureCompare(1, dutyCycle);  // A+ (PA8)
      timer1->setCaptureCompare(2, 0);          // A- (PA9)
      timer1->setCaptureCompare(3, 0);          // B+ (PA10)
      timer2->setCaptureCompare(1, 0);          // B- (PA0)
      timer2->setCaptureCompare(2, 0);          // C+ (PA1)
      timer2->setCaptureCompare(3, dutyCycle);  // C- (PB10)
      break;

    case 2:  // BH_CL
      timer1->setCaptureCompare(1, 0);          // A+ (PA8)
      timer1->setCaptureCompare(2, 0);          // A- (PA9)
      timer1->setCaptureCompare(3, dutyCycle);  // B+ (PA10)
      timer2->setCaptureCompare(1, 0);          // B- (PA0)
      timer2->setCaptureCompare(2, 0);          // C+ (PA1)
      timer2->setCaptureCompare(3, dutyCycle);  // C- (PB10)
      break;

    case 3:  // BH_AL
      timer1->setCaptureCompare(1, 0);          // A+ (PA8)
      timer1->setCaptureCompare(2, dutyCycle);  // A- (PA9)
      timer1->setCaptureCompare(3, dutyCycle);  // B+ (PA10)
      timer2->setCaptureCompare(1, 0);          // B- (PA0)
      timer2->setCaptureCompare(2, 0);          // C+ (PA1)
      timer2->setCaptureCompare(3, 0);          // C- (PB10)
      break;

    case 4:  // CH_AL
      timer1->setCaptureCompare(1, 0);          // A+ (PA8)
      timer1->setCaptureCompare(2, dutyCycle);  // A- (PA9)
      timer1->setCaptureCompare(3, 0);          // B+ (PA10)
      timer2->setCaptureCompare(1, 0);          // B- (PA0)
      timer2->setCaptureCompare(2, dutyCycle);  // C+ (PA1)
      timer2->setCaptureCompare(3, 0);          // C- (PB10)
      break;

    case 5:  // CH_BL
      timer1->setCaptureCompare(1, 0);          // A+ (PA8)
      timer1->setCaptureCompare(2, 0);          // A- (PA9)
      timer1->setCaptureCompare(3, 0);          // B+ (PA10)
      timer2->setCaptureCompare(1, dutyCycle);  // B- (PA0)
      timer2->setCaptureCompare(2, dutyCycle);  // C+ (PA1)
      timer2->setCaptureCompare(3, 0);          // C- (PB10)
      break;
  }
  step = (step + 1) % 6;  // 다음 스텝으로 이동
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
  applyStep();
//   delay(10);  // 스텝 간 간격 조절
  delayMicroseconds(67);
}
