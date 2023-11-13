#include "HardwareTimer.h"

const int pwmOutPin = PA0;  // PWM 출력 핀
const int pwmInPin = PA1;   // PWM 입력 핀
HardwareTimer *timer = new HardwareTimer(TIM2);

volatile unsigned long previousRiseTime = 0;
volatile unsigned long currentRiseTime = 0;
volatile unsigned long fallTime = 0;
volatile bool newDataAvailable = false;

// STM32의 GPIO 레지스터에 직접 액세스하여 핀의 상태를 빠르게 읽는 함수
inline bool fastDigitalRead(int pin) {
    GPIO_TypeDef* port = digitalPinToPort(pin);
    uint16_t bit = digitalPinToBitMask(pin);
    return (port->IDR & bit) != 0;
}

void setup() {
  pinMode(pwmOutPin, OUTPUT);
  pinMode(pwmInPin, INPUT);
  
  // PWM 설정
  uint32_t pwm_frequency = 50000;   // 원하는 PWM 주파수 (예: 1000Hz)
  uint32_t TIMx_CLK = 64000000;
  uint32_t PSC = 63;
  uint32_t ARR = int((TIMx_CLK / (PSC + 1) / pwm_frequency) - 1);
  
  timer->setPrescaleFactor(PSC);
  timer->setOverflow(ARR);
  timer->setMode(1, TIMER_OUTPUT_COMPARE_PWM1, pwmOutPin);
  timer->setCaptureCompare(1, timer->getOverflow() / 4);  // 듀티 사이클을 25%로 설정
  timer->resume();

  Serial.begin(115200);
  attachInterrupt(digitalPinToInterrupt(pwmInPin), pwmInterrupt, CHANGE);  
}

void loop() {
  if (newDataAvailable) {
    unsigned long period = fallTime - currentRiseTime;
    float dutyCycle = (period / (float)(currentRiseTime - previousRiseTime)) * 100.0;
    float frequency = 1000000.0 / (currentRiseTime - previousRiseTime);
    
    Serial.print("Duty Cycle: ");
    Serial.print(dutyCycle, 2); 
    Serial.print("%  Frequency: ");
    Serial.print(frequency, 2); 
    Serial.println(" Hz");
    newDataAvailable = false;
  }
}

void pwmInterrupt() {
  if (fastDigitalRead(pwmInPin)) {
    previousRiseTime = currentRiseTime;
    currentRiseTime = micros();
  } else {
    fallTime = micros();
    newDataAvailable = true;  
  }
}
