import serial
import time

# 시리얼 포트 설정
ser = serial.Serial(
    port='/dev/ttyS0', #d
    baudrate=115200,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS
)

try:
    while True:
        # 문자열 전송
        ser.write(b'Hello Arduino!!')
        print("Sent: Hello Arduino!")
        time.sleep(1)  # 1초 간격으로 메시지 전송

except KeyboardInterrupt:
    ser.close()
