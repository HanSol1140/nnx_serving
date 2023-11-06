import serial
import time

# UART2와 UART3 설정
# GPIO00(27,TX) / GPIO07(28,RX)
uart2 = serial.Serial("/dev/ttyAMA2", baudrate=115200)
# GPIO04(7,TX) / GPIO05(29,RX)
uart3 = serial.Serial("/dev/ttyAMA3", baudrate=115200)

try:
    while True:
        # UART2 // 본체
        if uart2.inWaiting() > 0:
            data = uart2.readline()  # 데이터 읽고, 디코드하고, 공백 제거
            # decimal_Data = int(data.decode("utf-8"), 16)
            print(data)
            uart3.write(data)  
        # UART3 // 모터
        if uart3.inWaiting() > 0:
            data = uart3.readline() # 데이터 읽고, 디코드하고, 공백 제거
            # print(f"Received from UART33: {data}")
            uart2.write(data)  
        # time.sleep(0.01)

except KeyboardInterrupt:
    # 프로그램을 중단하려면 Ctrl+C를 누릅니다.
    print("Program terminated by user")

finally:
    # 프로그램 종료 시 시리얼 포트 닫기
    uart2.close()
    uart3.close()
