import serial

# 시리얼 포트 설정
ser = serial.Serial(
    port='/dev/ttyAMA0', # 라즈베리파이의 시리얼 포트. 모델에 따라 다를 수 있습니다.
    baudrate=9600,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS
)

try:
    while True:
        if ser.inWaiting() > 0:
            line = ser.readline().decode('utf-8').rstrip()  # 데이터를 읽고, utf-8로 디코딩한 후 줄바꿈 문자를 제거
            print("Received:", line)

except KeyboardInterrupt:
    ser.close()
