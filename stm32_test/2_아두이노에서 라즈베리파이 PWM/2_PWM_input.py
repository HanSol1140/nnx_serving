import RPi.GPIO as GPIO
import time

PWM_PIN = 12
GPIO.setmode(GPIO.BCM)
GPIO.setup(PWM_PIN, GPIO.IN)

def calculate_frequency_and_duty_cycle(pin):
    # 첫번째 상승 에지 감지
    GPIO.wait_for_edge(pin, GPIO.RISING)
    start_rise_time = time.time()

    # 첫번째 하강 에지 감지
    GPIO.wait_for_edge(pin, GPIO.FALLING)
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
