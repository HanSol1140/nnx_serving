import RPi.GPIO as GPIO

# GPIO 핀 번호 모드 설정
GPIO.setmode(GPIO.BCM)

# 사용할 GPIO 핀의 번호
# 16 = robot1
# 19 = robot2
# 20 = robot3
# 26 = robot4

pins = [16, 19, 20, 26,]

# GPIO 핀의 모드를 입력으로 설정하고, 풀다운 저항을 활성화
for pin in pins:
    GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN) 

# 핀 상태를 확인하고 출력하는 함수
def check_pins_and_output():
    for pin in pins:
        if GPIO.input(pin) == GPIO.HIGH:
            print(f"GPIO{pin}")
        

check_pins_and_output()  