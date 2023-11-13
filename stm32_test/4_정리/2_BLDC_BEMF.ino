// 테스트중
#include "HardwareTimer.h"

// PWM 핀 정의
const int pwmPin1 = PA8;
const int pwmPin2 = PA9;
const int pwmPin3 = PA10;
const int pwmPin4 = PA0;
const int pwmPin5 = PA1;
const int pwmPin6 = PB10;

// BEMF 감지 핀 정의
const int bemfPinA = PA4;
const int bemfPinB = PB0;
const int bemfPinC = PC1;

const int BEMF_THRESHOLD = 512;
const int START_DURATION = 1000; // 1초 동안 오픈 루프 전략 사용

// 타이머 인스턴스 생성
HardwareTimer *timer1 = new HardwareTimer(TIM1);
HardwareTimer *timer2 = new HardwareTimer(TIM2);

uint32_t TIMx_CLK = 64000000;
uint32_t PSC = 63;
uint32_t pwm_frequency = 15000;
uint32_t ARR = int((TIMx_CLK / (PSC + 1) / pwm_frequency) - 1);
uint32_t dutyCycle = ARR / 5; // 듀티사이클 %
uint8_t step = 0;

unsigned long startTime;

void setupPWM(HardwareTimer *timer, int pwmPin, uint32_t channel) {
    pinMode(pwmPin, OUTPUT);
    timer->setPrescaleFactor(PSC);
    timer->setOverflow(ARR);
    timer->setMode(channel, TIMER_OUTPUT_COMPARE_PWM1, pwmPin);
    timer->setCaptureCompare(channel, 0);
    timer->resume();
}

void applyStep() {
  switch(step) {
    case 0:
      timer1->setCaptureCompare(1, dutyCycle);  // A+
      timer1->setCaptureCompare(2, 0);          // A-
      timer1->setCaptureCompare(3, 0);          // B+
      timer2->setCaptureCompare(1, dutyCycle);  // B-
      timer2->setCaptureCompare(2, 0);          // C+
      timer2->setCaptureCompare(3, 0);          // C-
      break;
    case 1:
      timer1->setCaptureCompare(1, dutyCycle);  // A+
      timer1->setCaptureCompare(2, 0);          // A-
      timer1->setCaptureCompare(3, 0);          // B+
      timer2->setCaptureCompare(1, 0);          // B-
      timer2->setCaptureCompare(2, 0);          // C+
      timer2->setCaptureCompare(3, dutyCycle);  // C-
      break;
    case 2:
      timer1->setCaptureCompare(1, 0);          // A+
      timer1->setCaptureCompare(2, 0);          // A-
      timer1->setCaptureCompare(3, dutyCycle);  // B+
      timer2->setCaptureCompare(1, 0);          // B-
      timer2->setCaptureCompare(2, 0);          // C+
      timer2->setCaptureCompare(3, dutyCycle);  // C-
      break;
    case 3:
      timer1->setCaptureCompare(1, 0);          // A+
      timer1->setCaptureCompare(2, dutyCycle);  // A-
      timer1->setCaptureCompare(3, dutyCycle);  // B+
      timer2->setCaptureCompare(1, 0);          // B-
      timer2->setCaptureCompare(2, 0);          // C+
      timer2->setCaptureCompare(3, 0);          // C-
      break;
    case 4:
      timer1->setCaptureCompare(1, 0);          // A+
      timer1->setCaptureCompare(2, dutyCycle);  // A-
      timer1->setCaptureCompare(3, 0);          // B+
      timer2->setCaptureCompare(1, 0);          // B-
      timer2->setCaptureCompare(2, dutyCycle);  // C+
      timer2->setCaptureCompare(3, 0);          // C-
      break;
    case 5:
      timer1->setCaptureCompare(1, 0);          // A+
      timer1->setCaptureCompare(2, 0);          // A-
      timer1->setCaptureCompare(3, 0);          // B+
      timer2->setCaptureCompare(1, dutyCycle);  // B-
      timer2->setCaptureCompare(2, dutyCycle);  // C+
      timer2->setCaptureCompare(3, 0);          // C-
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
    pinMode(bemfPinA, INPUT);
    pinMode(bemfPinB, INPUT);
    pinMode(bemfPinC, INPUT);
    startTime = millis();
}

void loop() {
    if (millis() - startTime < START_DURATION) {
        // 시작 전략: BEMF 확인 없이 순서대로 스텝 진행
        applyStep();
        delay(20);
    } else {
        int bemfA = analogRead(bemfPinA);
        int bemfB = analogRead(bemfPinB);
        int bemfC = analogRead(bemfPinC);
        switch(step) {
            case 0:
            case 1:
                if (bemfA > BEMF_THRESHOLD) {
                    applyStep();
                }
                break;
            case 2:
            case 3:
                if (bemfB > BEMF_THRESHOLD) {
                    applyStep();
                }
                break;
            case 4:
            case 5:
                if (bemfC > BEMF_THRESHOLD) {
                    applyStep();
                }
                break;
        }
        delay(50);
    }
}
