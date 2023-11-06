import serial
import time

# UART2와 UART3 설정
uart2 = serial.Serial("/dev/ttyAMA2", baudrate=115200)
uart3 = serial.Serial("/dev/ttyAMA3", baudrate=115200)

try:
    while True:
        # UART2에서 데이터 보내기
        uart2.write(b'Hello from UART2\n')
        uart3.write(b'Hello from UART3\n')
        # UART2에서 데이터가 있으면 읽기
        if uart2.inWaiting() > 0:
            data = uart3.readline().decode('utf-8').strip()  # 데이터 읽고, 디코드하고, 공백 제거
            print(f"Received from UART22: {data}")

        # UART3에서 데이터가 있으면 읽기
        if uart3.inWaiting() > 0:
            data = uart3.readline().decode('utf-8').strip()  # 데이터 읽고, 디코드하고, 공백 제거
            print(f"Received from UART33: {data}")

        # CPU 사용을 줄이기 위한 작은 지연
        time.sleep(1)

except KeyboardInterrupt:
    # 프로그램을 중단하려면 Ctrl+C를 누릅니다.
    print("Program terminated by user")

finally:
    # 프로그램 종료 시 시리얼 포트 닫기
    uart2.close()
    uart3.close()
