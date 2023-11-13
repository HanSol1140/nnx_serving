    const int pwmPin = PA0;  // PWM 입력 핀

    volatile unsigned long previousRiseTime = 0;
    volatile unsigned long currentRiseTime = 0;
    volatile unsigned long fallTime = 0;
    volatile bool newDataAvailable = false;

    void setup() {
    pinMode(pwmPin, INPUT);
    Serial.begin(115200);
    attachInterrupt(digitalPinToInterrupt(pwmPin), pwmInterrupt, CHANGE);  // CHANGE 인터럽트를 사용하여 핀의 상태 변경 감지
    }

    void loop() {
    if (newDataAvailable) {
        unsigned long period = fallTime - currentRiseTime;
        float dutyCycle = (period / (float)(currentRiseTime - previousRiseTime)) * 100.0;  // 듀티 사이클 계산
        float frequency = 1000000.0 / (currentRiseTime - previousRiseTime);  // 주파수 계산 (Hz)
        
        Serial.print("Duty Cycle: ");
        Serial.print(dutyCycle); 
        Serial.print("%  Frequency: ");
        Serial.print(frequency); 
        Serial.println(" Hz");
        newDataAvailable = false;
    }
    }

    void pwmInterrupt() {
    if (digitalRead(pwmPin) == HIGH) {
        previousRiseTime = currentRiseTime;
        currentRiseTime = micros();  // 상승 에지 시간 저장
    } else {
        fallTime = micros();  // 하강 에지 시간 저장
        newDataAvailable = true;
    }
    }
