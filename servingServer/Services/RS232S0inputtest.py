import serial

ser = serial.Serial(
    port='/dev/ttyAMA2',
    baudrate=115200,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS
)

try:
    while True:
        if ser.inWaiting() >  0:
            data = ser.readline().decode('utf-8').strip()
            print(f"Received: {data}")
except KeyboardInterrupt:
    ser.close()