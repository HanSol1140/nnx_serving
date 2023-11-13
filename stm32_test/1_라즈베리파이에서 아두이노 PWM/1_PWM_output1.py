import RPi.GPIO as GPIO
import time

# GPIO 설정
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# GPIO 핀 설정
PWM_PIN = 18 # 라즈베리파이 12번 핀
GPIO.setup(PWM_PIN, GPIO.OUT)

# 주파수와 듀티 사이클 초기화
FREQUENCY = 1000  # 주파수 설정
DUTY_CYCLE = 0  # 0%로 초기화

# PWM 인스턴스 생성
pwm = GPIO.PWM(PWM_PIN, FREQUENCY) # 핀번호 / 주파수
pwm.start(DUTY_CYCLE)

try:
    while True:
        # pwm.ChangeDutyCycle(50)
        # 듀티 사이클을 0에서 100%까지 변경
        # for duty_cycle in range(0, 101, 5):
        #     pwm.ChangeDutyCycle(duty_cycle)
        #     time.sleep(0.1)
        
        # 듀티 사이클을 100에서 0%까지 변경
        # for duty_cycle in range(100, -1, -5):
        #     pwm.ChangeDutyCycle(duty_cycle)
        #     time.sleep(0.1)

            pwm.ChangeDutyCycle(50)
            time.sleep(0.1)
except KeyboardInterrupt:
    pass

pwm.stop()
GPIO.cleanup()
