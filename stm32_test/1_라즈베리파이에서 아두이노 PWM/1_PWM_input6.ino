#include "HardwareTimer.h"

const int pwmPin = PA0;

HardwareTimer *timer = new HardwareTimer(TIM2);
uint32_t channelRising, channelFalling;
volatile uint32_t lastCapturedValue = 0;
volatile int32_t lastPeriod = 0;
volatile uint32_t FrequencyMeasured;
volatile float DutycycleMeasured;  // DutycycleMeasured를 float으로 변경
uint32_t TIMx_CLK = 64000000;
uint32_t PSC = 63;

void setup() {
  Serial.begin(115200);

  // Automatically retrieve TIM instance and channel associated to pin
  TIM_TypeDef *Instance = (TIM_TypeDef *)pinmap_peripheral(digitalPinToPinName(pwmPin), PinMap_PWM);
  channelRising = STM_PIN_CHANNEL(pinmap_function(digitalPinToPinName(pwmPin), PinMap_PWM));

  // Channels come by pair for TIMER_INPUT_FREQ_DUTY_MEASUREMENT mode
  switch (channelRising) {
    case 1: channelFalling = 2; break;
    case 2: channelFalling = 1; break;
    case 3: channelFalling = 4; break;
    case 4: channelFalling = 3; break;
  }

  timer->setPrescaleFactor(PSC);
  timer->setOverflow(0x10000); // Max Period value
  timer->setMode(channelRising, TIMER_INPUT_FREQ_DUTY_MEASUREMENT, pwmPin);
  timer->attachInterrupt(channelRising, TIMINPUT_Capture_Rising_IT_callback);
  timer->attachInterrupt(channelFalling, TIMINPUT_Capture_Falling_IT_callback);
  timer->resume();
}
unsigned long lastPrintTime = 0;
void loop() {
  unsigned long currentTime = millis();
  if (currentTime - lastPrintTime >= 1000) {  // 마지막 출력 이후 1초가 지났는지 확인
    lastPrintTime = currentTime;  // 마지막 출력 시간 업데이트

    Serial.print("Frequency: ");
    Serial.print(FrequencyMeasured);
    Serial.print(" Hz, Duty Cycle: ");
    Serial.print(DutycycleMeasured, 1);  // 소수점 아래 한 자리까지 출력
    Serial.println(" %");
  }
}

void TIMINPUT_Capture_Rising_IT_callback() {
  uint32_t currentCapture = timer->getCaptureCompare(channelRising);
  if (currentCapture > lastCapturedValue) {
    lastPeriod = currentCapture - lastCapturedValue;
  } else {
    lastPeriod = (0x10000 + currentCapture) - lastCapturedValue;
  }
  FrequencyMeasured = TIMx_CLK / (PSC + 1) / lastPeriod;
  lastCapturedValue = currentCapture;
}

void TIMINPUT_Capture_Falling_IT_callback() {
  uint32_t capturedValue = timer->getCaptureCompare(channelFalling);
  // DutycycleMeasured = ((capturedValue - lastCapturedValue) * 100) / lastPeriod;
  DutycycleMeasured = ((float)(capturedValue - lastCapturedValue) * 100) / lastPeriod;

}
