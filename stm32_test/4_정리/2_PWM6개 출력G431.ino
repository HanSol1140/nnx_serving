// STM32Duino로 PWM 설정하기

#include "HardwareTimer.h"
/*
  (PA8)D9 - TIM1_CH1
  (PB6)D6 - TIM4_CH1
  (PA15)D5 - TIM2_CH1 / TIM8_CH1
  (PA1)A1 - TIM2_CH2
  (PB4)D12 - TIM3_CH1
  (PB5)D11 - TIM3_CH2
*/
const int pwmPin1 = PA8;
const int pwmPin2 = PB6;
const int pwmPin3 = PA15;
const int pwmPin4 = PA1;
const int pwmPin5 = PB4;
const int pwmPin6 = PB5;

HardwareTimer *timer1 = new HardwareTimer(TIM1);
HardwareTimer *timer4 = new HardwareTimer(TIM4);
HardwareTimer *timer2 = new HardwareTimer(TIM2);
HardwareTimer *timer3 = new HardwareTimer(TIM3);

uint32_t pwm_frequency = 5000;   // 원하는 PWM 주파수 (예: 1000Hz)
uint32_t TIMx_CLK = 170000000;
uint32_t PSC = 169;
uint32_t ARR = int((TIMx_CLK / (PSC + 1) / pwm_frequency) - 1);

void setupPWM(HardwareTimer *timer, int pwmPin) {
  // 채널 구하기
  TIM_TypeDef *Instance = (TIM_TypeDef *)pinmap_peripheral(digitalPinToPinName(pwmPin), PinMap_PWM);
  int channel = STM_PIN_CHANNEL(pinmap_function(digitalPinToPinName(pwmPin), PinMap_PWM));
  
  // 타이머 번호구하기
  String timerNumber;
  if (Instance == TIM1) timerNumber = "TIM1";
  else if (Instance == TIM2) timerNumber = "TIM2";
  else if (Instance == TIM3) timerNumber = "TIM3";
  else if (Instance == TIM4) timerNumber = "TIM4";

  Serial.print("PWM Pin: ");
  Serial.print(pwmPin);
  Serial.print(" uses ");
  Serial.print(timerNumber);
  Serial.print(" and Channel: ");
  Serial.println(channel);
  
  pinMode(pwmPin, OUTPUT);
  timer->setPrescaleFactor(PSC);
  timer->setOverflow(ARR);
  timer->setMode(channel, TIMER_OUTPUT_COMPARE_PWM1, pwmPin);
  timer->setCaptureCompare(channel, timer->getOverflow() / 3);
  timer->resume();
}

void setup() {
  Serial.begin(115200);

  setupPWM(timer1, pwmPin1);
  setupPWM(timer4, pwmPin2);
  setupPWM(timer2, pwmPin3);
  setupPWM(timer2, pwmPin4);
  setupPWM(timer3, pwmPin5);
  setupPWM(timer3, pwmPin6);


  // => 1초동안 타이머 카운트 회수
  // TIMx_CLK / (PSC + 1) => 64000000  / 64 => 1Mhz => 1초에 100만번
  

}

void loop() {
}
