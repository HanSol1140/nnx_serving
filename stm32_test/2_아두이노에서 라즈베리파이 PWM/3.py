import RPi.GPIO as GPIO
import time

PWM_PIN = 18
GPIO.setmode(GPIO.BCM)
GPIO.setup(PWM_PIN, GPIO.IN)

def calculate_frequency_and_duty_cycle(pin):
    # 첫번째 상승 에지 감지
    GPIO.wait_for_edge(pin, GPIO.RISING)
    start_rise_time = time.time()

    # 하강 에지 감지
    end_time = start_rise_time + 1.0  # 최대 1초 기다림
    while GPIO.input(pin) == 1 and time.time() < end_time:  # PWM이 HIGH인 동안 기다림
        pass

    if GPIO.input(pin) == 1:  # 아직도 HIGH 상태면 듀티 사이클이 100%로 판단
        return 0, 100  # 주파수 0, 듀티 사이클 100%

    fall_time = time.time()

    # 두번째 상승 에지 감지
    GPIO.wait_for_edge(pin, GPIO.RISING)
    end_rise_time = time.time()

    # 주기 계산
    period_duration = end_rise_time - start_rise_time
    high_duration = fall_time - start_rise_time

    frequency = 1 / period_duration
    duty_cycle = (high_duration / period_duration) * 100

    return frequency, duty_cycle

try:
    while True:
        frequency, duty_cycle = calculate_frequency_and_duty_cycle(PWM_PIN)
        print(f"Frequency: {frequency:.2f} Hz, Duty Cycle: {duty_cycle:.2f} %")
        time.sleep(1)

except KeyboardInterrupt:
    pass

GPIO.cleanup()
