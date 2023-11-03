import RPi.GPIO as GPIO
import time

# GPIO 핀 번호 모드 설정
GPIO.setmode(GPIO.BCM)

# 사용할 GPIO 핀의 번호
pins = [16, 19, 20, 26]

# GPIO 핀의 모드를 입력으로 설정하고, 풀 다운 저항을 활성화
for pin in pins:
    GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# 버튼이 눌림 상태를 감지하는 함수
def button_callback(channel):
    print(f"GPIO{channel}")

# GPIO 이벤트 콜백 함수 설정
for pin in pins:
    GPIO.add_event_detect(pin, GPIO.RISING, callback=button_callback, bouncetime=200)

try:
    # 프로그램이 종료될 때까지 루프를 돌며 대기
    message = input("Press enter to quit\n\n")
finally:
    GPIO.cleanup()  # GPIO 설정을 초기화
