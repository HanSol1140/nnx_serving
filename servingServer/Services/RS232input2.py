import serial
import time

# UART2와 UART3 설정
# GPIO00(27,TX) / GPIO07(28,RX)
uart2 = serial.Serial("/dev/ttyAMA2", baudrate=115200, timeout=1)
# GPIO04(7,TX) / GPIO05(29,RX)
uart3 = serial.Serial("/dev/ttyAMA3", baudrate=115200, timeout=1)

try:
    while True:
        # UART2 // 본체
        if uart2.in_waiting > 0:
            data = uart2.readline()  # 데이터 읽기
            hex_data = data.hex()  # 바이트 데이터를 HEX 형식의 문자열로 변환
            formatted_data = ' '.join(hex_data[i:i+2] for i in range(0, len(hex_data), 2))  # 공백을 넣어서 형식 맞추기
            print(f"Received from UART2: {formatted_data}")  # HEX 형식의 문자열로 출력
            uart3.write(data)  # UART3로 데이터 전송

        # UART3 // 모터
        if uart3.in_waiting > 0:
            data = uart3.readline()  # 데이터 읽기
            hex_data = data.hex()  # 바이트 데이터를 HEX 형식의 문자열로 변환
            formatted_data = ' '.join(hex_data[i:i+2] for i in range(0, len(hex_data), 2))  # 공백을 넣어서 형식 맞추기
            print(f"Received from UART3: {formatted_data}")  # HEX 형식의 문자열로 출력
            uart2.write(data)  # UART2로 데이터 전송

        # CPU 사용을 줄이기 위한 작은 지연
        time.sleep(0.01)

except KeyboardInterrupt:
    # 프로그램을 중단하려면 Ctrl+C를 누릅니다.
    print("Program terminated by user")

finally:
    # 프로그램 종료 시 시리얼 포트 닫기
    uart2.close()
    uart3.close()
