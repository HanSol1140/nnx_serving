import serial

# 시리얼 포트 설정
ser = serial.Serial(
    port='/dev/ttyS0',
    baudrate=115200,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS
)

try:
    while True:
        if ser.inWaiting() > 0:  # 데이터가 수신되면
            received_data = ser.readline().decode('utf-8').strip()  # 데이터를 읽습니다.
            print(f"Received: {received_data}")

except KeyboardInterrupt:
    ser.close()
