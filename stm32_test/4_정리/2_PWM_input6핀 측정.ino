#include "HardwareTimer.h"

// 핀 정의
const int pwmPin1 = PA8;
const int pwmPin2 = PA10;
const int pwmPin3 = PA0;
const int pwmPin4 = PB10;
const int pwmPin5 = PB4;
const int pwmPin6 = PC8;

// 타이머 인스턴스 생성
HardwareTimer *timer1 = new HardwareTimer(TIM1);
HardwareTimer *timer2 = new HardwareTimer(TIM2);
HardwareTimer *timer3 = new HardwareTimer(TIM3);

uint32_t channelRising1, channelFalling1;
uint32_t channelRising2, channelFalling2;
uint32_t channelRising3, channelFalling3;
uint32_t channelRising4, channelFalling4;
uint32_t channelRising5, channelFalling5;
uint32_t channelRising6, channelFalling6;

volatile uint32_t lastCapturedValue1 = 0, lastCapturedValue2 = 0, lastCapturedValue3 = 0, lastCapturedValue4 = 0, lastCapturedValue5 = 0, lastCapturedValue6 = 0;
volatile int32_t lastPeriod1 = 0, lastPeriod2 = 0, lastPeriod3 = 0, lastPeriod4 = 0, lastPeriod5 = 0, lastPeriod6 = 0;
volatile uint32_t FrequencyMeasured1, FrequencyMeasured2, FrequencyMeasured3, FrequencyMeasured4, FrequencyMeasured5, FrequencyMeasured6;
volatile float DutycycleMeasured1, DutycycleMeasured2, DutycycleMeasured3, DutycycleMeasured4, DutycycleMeasured5, DutycycleMeasured6;

uint32_t TIMx_CLK = 64000000;
uint32_t PSC = 63;

void setupTimer(HardwareTimer *timer, int pwmPin, uint32_t &channelRising, uint32_t &channelFalling) {
  TIM_TypeDef *Instance = (TIM_TypeDef *)pinmap_peripheral(digitalPinToPinName(pwmPin), PinMap_PWM);
  channelRising = STM_PIN_CHANNEL(pinmap_function(digitalPinToPinName(pwmPin), PinMap_PWM));

  switch (channelRising) {
    case 1: channelFalling = 2; break;
    case 2: channelFalling = 1; break;
    case 3: channelFalling = 4; break;
    case 4: channelFalling = 3; break;
  }

  timer->setPrescaleFactor(PSC);
  timer->setOverflow(0x10000);
  timer->setMode(channelRising, TIMER_INPUT_FREQ_DUTY_MEASUREMENT, pwmPin);
  timer->resume();
  Serial.println("==================================");
  Serial.println("==================================");
  Serial.println(pwmPin);
  Serial.println(channelRising);
  Serial.println(channelFalling);
}

void setup() {
  Serial.begin(115200);

  setupTimer(timer1, pwmPin1, channelRising1, channelFalling1);
  setupTimer(timer1, pwmPin2, channelRising2, channelFalling2);
  setupTimer(timer2, pwmPin3, channelRising3, channelFalling3);
  setupTimer(timer2, pwmPin4, channelRising4, channelFalling4);
  setupTimer(timer3, pwmPin5, channelRising5, channelFalling5);
  setupTimer(timer3, pwmPin6, channelRising6, channelFalling6);

  // 인터럽트 콜백 함수 설정
  timer1->attachInterrupt(channelRising1, TIMINPUT_Capture_Rising_IT_callback1);
  timer1->attachInterrupt(channelFalling1, TIMINPUT_Capture_Falling_IT_callback1);
  timer1->attachInterrupt(channelRising2, TIMINPUT_Capture_Rising_IT_callback2);
  timer1->attachInterrupt(channelFalling2, TIMINPUT_Capture_Falling_IT_callback2);

  timer2->attachInterrupt(channelRising3, TIMINPUT_Capture_Rising_IT_callback3);
  timer2->attachInterrupt(channelFalling3, TIMINPUT_Capture_Falling_IT_callback3);
  timer2->attachInterrupt(channelRising4, TIMINPUT_Capture_Rising_IT_callback4);
  timer2->attachInterrupt(channelFalling4, TIMINPUT_Capture_Falling_IT_callback4);

  timer3->attachInterrupt(channelRising5, TIMINPUT_Capture_Rising_IT_callback5);
  timer3->attachInterrupt(channelFalling5, TIMINPUT_Capture_Falling_IT_callback5);
  timer3->attachInterrupt(channelRising6, TIMINPUT_Capture_Rising_IT_callback6);
  timer3->attachInterrupt(channelFalling6, TIMINPUT_Capture_Falling_IT_callback6);
}
uint32_t lastPrintTime = 0;
void loop() {
    uint32_t currentTime = millis();
    if (currentTime - lastPrintTime > 1000) {
        Serial.println("===========================================");
        Serial.print("PA8(D7) - Frequency: ");
        Serial.print(FrequencyMeasured1);
        Serial.print(" Hz, Duty Cycle: ");
        Serial.print(DutycycleMeasured1, 1);
        Serial.println(" %");

        Serial.print("PA10(D2) - Frequency: ");
        Serial.print(FrequencyMeasured2);
        Serial.print(" Hz, Duty Cycle: ");
        Serial.print(DutycycleMeasured2, 1);
        Serial.println(" %");

        Serial.print("PA0(A0) - Frequency: ");
        Serial.print(FrequencyMeasured3);
        Serial.print(" Hz, Duty Cycle: ");
        Serial.print(DutycycleMeasured3, 1);
        Serial.println(" %");

        Serial.print("PB10(D6) - Frequency: ");
        Serial.print(FrequencyMeasured4);
        Serial.print(" Hz, Duty Cycle: ");
        Serial.print(DutycycleMeasured4, 1);
        Serial.println(" %");

        Serial.print("PB4(D4) - Frequency: ");
        Serial.print(FrequencyMeasured5);
        Serial.print(" Hz, Duty Cycle: ");
        Serial.print(DutycycleMeasured5, 1);
        Serial.println(" %");

        Serial.print("PC8 - Frequency: ");
        Serial.print(FrequencyMeasured6);
        Serial.print(" Hz, Duty Cycle: ");
        Serial.print(DutycycleMeasured6, 1);
        Serial.println(" %");
        lastPrintTime = currentTime;
    }
}

// PA8에 대한 인터럽트 처리 함수
void TIMINPUT_Capture_Rising_IT_callback1() {
  captureRisingHandler(timer1, channelRising1, lastCapturedValue1, lastPeriod1, FrequencyMeasured1);
}

void TIMINPUT_Capture_Falling_IT_callback1() {
  captureFallingHandler(timer1, channelFalling1, lastCapturedValue1, lastPeriod1, DutycycleMeasured1);
}

// PA10에 대한 인터럽트 처리 함수
void TIMINPUT_Capture_Rising_IT_callback2() {
  captureRisingHandler(timer1, channelRising2, lastCapturedValue2, lastPeriod2, FrequencyMeasured2);
}

void TIMINPUT_Capture_Falling_IT_callback2() {
  captureFallingHandler(timer1, channelFalling2, lastCapturedValue2, lastPeriod2, DutycycleMeasured2);
}

// PA0에 대한 인터럽트 처리 함수
void TIMINPUT_Capture_Rising_IT_callback3() {
  captureRisingHandler(timer2, channelRising3, lastCapturedValue3, lastPeriod3, FrequencyMeasured3);
}

void TIMINPUT_Capture_Falling_IT_callback3() {
  captureFallingHandler(timer2, channelFalling3, lastCapturedValue3, lastPeriod3, DutycycleMeasured3);
}

// PB10에 대한 인터럽트 처리 함수
void TIMINPUT_Capture_Rising_IT_callback4() {
  captureRisingHandler(timer2, channelRising4, lastCapturedValue4, lastPeriod4, FrequencyMeasured4);
}

void TIMINPUT_Capture_Falling_IT_callback4() {
  captureFallingHandler(timer2, channelFalling4, lastCapturedValue4, lastPeriod4, DutycycleMeasured4);
}

// PB4에 대한 인터럽트 처리 함수
void TIMINPUT_Capture_Rising_IT_callback5() {
  captureRisingHandler(timer3, channelRising5, lastCapturedValue5, lastPeriod5, FrequencyMeasured5);
}

void TIMINPUT_Capture_Falling_IT_callback5() {
  captureFallingHandler(timer3, channelFalling5, lastCapturedValue5, lastPeriod5, DutycycleMeasured5);
}

// PC8에 대한 인터럽트 처리 함수
void TIMINPUT_Capture_Rising_IT_callback6() {
  captureRisingHandler(timer3, channelRising6, lastCapturedValue6, lastPeriod6, FrequencyMeasured6);
}

void TIMINPUT_Capture_Falling_IT_callback6() {
  captureFallingHandler(timer3, channelFalling6, lastCapturedValue6, lastPeriod6, DutycycleMeasured6);
}

void captureRisingHandler(HardwareTimer *timer, uint32_t channel, volatile uint32_t &lastCapturedValue, volatile int32_t &lastPeriod, volatile uint32_t &FrequencyMeasured) {
  uint32_t currentCapture = timer->getCaptureCompare(channel);
  if (currentCapture > lastCapturedValue) {
    lastPeriod = currentCapture - lastCapturedValue;
  } else {
    lastPeriod = (0x10000 + currentCapture) - lastCapturedValue;
  }
  FrequencyMeasured = TIMx_CLK / (PSC + 1) / lastPeriod;
  lastCapturedValue = currentCapture;
}

void captureFallingHandler(HardwareTimer *timer, uint32_t channel, volatile uint32_t &lastCapturedValue, volatile int32_t &lastPeriod, volatile float &DutycycleMeasured) {
  uint32_t capturedValue = timer->getCaptureCompare(channel);
  DutycycleMeasured = ((float)(capturedValue - lastCapturedValue) * 100) / lastPeriod;
}
